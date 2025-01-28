import marketService from "./market";
import algorithms from "../algorithms";
import tradeService from "./trade";
import accountService from "./account";
import testStrategy from "../testStrategy";

class BotService {
  constructor() {
    this.intervalId = null;
    this.currentPosition = "NONE";
    this.lastPrice = 0;
    this.currentBalance = 0;
  }

  async start(category, symbol, interval, amount) {
    if (this.intervalId) {
      console.log("Bot is already running");
      return;
    }

    const balance = await accountService.getAccountBalance(category);
    this.currentBalance = parseFloat(balance.availableBalance);
    const numericAmount = parseFloat(amount);
    
    if (!isNaN(this.currentBalance) && !isNaN(numericAmount)) {
      if (this.currentBalance < numericAmount) {
        console.log("❌ Insufficient balance to start trading");
        return;
      }
    }

    console.log(`🤖 Bot started monitoring ${symbol}`);
    
    this.intervalId = setInterval(async () => {
      try {
        await this.executeStrategy(category, symbol, interval, amount);
      } catch (error) {
        console.log('❌ Bot error:', error.message);
        this.stop();
      }
    }, 10000);
  }

  async executeStrategy(category, symbol, interval, amount) {
    const normalizedInterval = String(interval).replace('m', '');
    const balance = await accountService.getAccountBalance(category);
    this.currentBalance = parseFloat(balance.availableBalance);

    const klineData = await marketService.getAllKline({
      category,
      symbol,
      interval
    });

    if (!klineData?.length) {
      throw new Error('No market data available');
    }

    const prices = klineData.map(candle => parseFloat(candle[4]));
    this.lastPrice = prices[prices.length - 1];

    const signal = algorithms.simpleStrategy(
      prices,
      normalizedInterval,
      this.currentPosition,
      category === 'spot' ? 'SPOT' : 'FUTURE',
      this.currentBalance
    );

    if (signal.action !== 'HOLD') {
      await this.executeTrade(symbol, signal, amount, category);
    }
  }

  async executeTrade(symbol, signal, amount, category) {
    try {
      const orderAmount = this.calculateOrderAmount(amount, this.lastPrice);
      const takeProfit = signal.takeProfit ? parseFloat(signal.takeProfit) : null;
      const stopLoss = signal.stopLoss ? parseFloat(signal.stopLoss) : null;
      
      console.log('\n🔄 Executing trade:');
      
      switch (signal.action) {
        case 'BUY':
        case 'LONG':
          console.log(`📈 Opening LONG position for ${symbol}`);
          console.log(`   Amount: ${orderAmount}`);
          if (takeProfit) console.log(`   Take Profit: ${takeProfit}`);
          if (stopLoss) console.log(`   Stop Loss: ${stopLoss}`);
          
          await tradeService.placeOrder(
            category,
            symbol,
            'Buy',
            orderAmount,
            takeProfit,
            stopLoss
          );
          this.currentPosition = 'LONG';
          console.log('✅ Long position opened');
          break;
  
        case 'SHORT':
          console.log(`📉 Opening SHORT position for ${symbol}`);
          console.log(`   Amount: ${orderAmount}`);
          if (takeProfit) console.log(`   Take Profit: ${takeProfit}`);
          if (stopLoss) console.log(`   Stop Loss: ${stopLoss}`);
          
          await tradeService.placeOrder(
            category,
            symbol,
            'Sell',
            orderAmount,
            takeProfit,
            stopLoss
          );
          this.currentPosition = 'SHORT';
          console.log('✅ Short position opened');
          break;
  
        case 'SELL':
        case 'CLOSE_LONG':
        case 'CLOSE_SHORT':
          const closeAction = signal.action === 'CLOSE_SHORT' ? 'Buy' : 'Sell';
          console.log(`🔒 Closing ${this.currentPosition} position for ${symbol}`);
          console.log(`   Amount: ${orderAmount}`);
          
          await tradeService.placeOrder(
            category,
            symbol,
            closeAction,
            orderAmount,
            null,
            null
          );
          this.currentPosition = 'NONE';
          console.log('✅ Position closed');
          break;
      }
    } catch (error) {
      console.log('❌ Trade execution failed:', error.message);
      throw error;
    }
  }

  calculateOrderAmount(quoteCurrencyAmount, currentPrice) {
    return (quoteCurrencyAmount / currentPrice).toFixed(8);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.currentPosition = "NONE";
      console.log("🛑 Bot stopped");
    }
  }

  isRunning() {
    return !!this.intervalId;
  }
}

export default new BotService();