// services/botService.js
import marketService from "./market";
import tradeService from "./trade";
import accountService from "./account";
import { strategyRegistry } from '../strategies';

class BotService {
    constructor() {
        this.intervalId = null;
        this.currentPosition = "NONE";
        this.lastPrice = 0;
        this.currentBalance = 0;
        this.currentStrategy = 'simple';
        this.strategyConfig = {
          tpPercentage: 2.0,
          slPercentage: 1.0
        };
      }

  // Convert time interval to milliseconds
  getIntervalInMs(interval) {
    const cleanInterval = String(interval).replace('m', '');
    
    switch(cleanInterval) {
      case 'D':
        return 24 * 60 * 60 * 1000; // 1 day
      case 'W':
        return 7 * 24 * 60 * 60 * 1000; // 1 week
      case 'M':
        return 30 * 24 * 60 * 60 * 1000; // 1 month (approximate)
      default:
        return parseInt(cleanInterval) * 60 * 1000; // Convert minutes to milliseconds
    }
  }

  // Format interval for display
  formatInterval(interval) {
    const cleanInterval = String(interval).replace('m', '');
    
    switch(cleanInterval) {
      case 'D':
        return '1 Day';
      case 'W':
        return '1 Week';
      case 'M':
        return '1 Month';
      default:
        const mins = parseInt(cleanInterval);
        if (mins >= 60) {
          return `${mins/60} Hour${mins/60 > 1 ? 's' : ''}`;
        }
        return `${mins} Minute${mins > 1 ? 's' : ''}`;
    }
  }

  setStrategy(strategyName, config = {}) {
    console.log('🔄 Setting strategy:', {
      strategyName,
      config
    });
    this.currentStrategy = strategyName;
    this.strategyConfig = { ...this.strategyConfig, ...config };
  }

  async start(category, symbol, interval, amount) {
    if (this.intervalId) {
      console.log("❌ Bot is already running");
      return;
    }

    const balance = await accountService.getAccountBalance(category);
    this.currentBalance = parseFloat(balance.availableBalance);
    
    if (this.currentBalance < parseFloat(amount)) {
      console.log("❌ Insufficient balance to start trading");
      return;
    }

    const intervalMs = this.getIntervalInMs(interval);
    const formattedInterval = this.formatInterval(interval);

    console.log(`🤖 Bot started monitoring ${symbol}`, {
      strategy: this.currentStrategy,
      config: this.strategyConfig,
      interval: formattedInterval,
      amount: amount
    });

    // Execute immediately once
    await this.executeStrategy(category, symbol, interval, amount);
    
    // Then set up the interval
    this.intervalId = setInterval(async () => {
      try {
        await this.executeStrategy(category, symbol, interval, amount);
      } catch (error) {
        console.log('❌ Bot error:', error.message);
        this.stop();
      }
    }, intervalMs);

    console.log(`📡 Monitor interval set to: ${formattedInterval}`);
  }

  async executeStrategy(category, symbol, interval, amount) {
    const timestamp = new Date().toLocaleString();
    console.log(`\n========== Strategy Execution @ ${timestamp} ==========`);
    console.log(`⏱️ Interval: ${this.formatInterval(interval)}`);
    console.log('Current Position:', this.currentPosition);

    // Get latest balance
    const balance = await accountService.getAccountBalance(category);
    this.currentBalance = parseFloat(balance.availableBalance);
    console.log('💰 Available Balance:', this.currentBalance, 'USDT');

    // Get market data
    console.log('📈 Fetching market data...');
    const klineData = await marketService.getAllKline({
      category,
      symbol,
      interval
    });

    if (!klineData?.length) {
      console.log('❌ No market data available');
      return;
    }

    const prices = klineData.map(candle => parseFloat(candle[4]));
    this.lastPrice = prices[prices.length - 1];

    // Get strategy instance and analyze
    const strategy = strategyRegistry.get(this.currentStrategy);
    console.log(`\n🔍 Running ${strategy.getName()} analysis:`);
    
    const signal = strategy.analyze(prices, this.strategyConfig);

    // Check existing position
    if (this.currentPosition !== "NONE") {
      const exitSignal = strategy.monitorPosition(this.lastPrice, {
        entryPrice: this.lastEntryPrice,
        takeProfit: this.takeProfitLevel,
        stopLoss: this.stopLossLevel,
        side: this.currentPosition
      });

      if (exitSignal) {
        console.log('🚫 Exit signal received:', exitSignal);
        await this.executeTrade(symbol, exitSignal, amount, category);
        return;
      }
    }

    if (signal.action !== 'HOLD') {
      await this.executeTrade(symbol, signal, amount, category);
    }

    console.log('================================================\n');
  }


  async executeTrade(symbol, signal, amount, category) {
    try {
      console.log('\n🔄 Trade Execution Started:', {
        symbol,
        action: signal.action,
        amount: amount
      });

      const orderAmount = this.calculateOrderAmount(amount, this.lastPrice);
      const takeProfit = signal.takeProfit ? parseFloat(signal.takeProfit) : null;
      const stopLoss = signal.stopLoss ? parseFloat(signal.stopLoss) : null;

      console.log('Trade Details:', {
        orderAmount,
        takeProfit,
        stopLoss,
        currentPrice: this.lastPrice
      });

      await tradeService.placeOrder(
        category,
        symbol,
        signal.action === 'BUY' ? 'Buy' : 'Sell',
        orderAmount,
        takeProfit,
        stopLoss
      );

      // Update position tracking
      if (signal.action === 'BUY') {
        this.currentPosition = 'LONG';
        console.log('🟢 Long position opened');
      } else if (signal.action === 'SELL' && this.currentPosition === 'LONG') {
        this.currentPosition = 'NONE';
        console.log('🔴 Position closed');
      } else {
        this.currentPosition = 'SHORT';
        console.log('🔴 Short position opened');
      }

      this.lastEntryPrice = this.lastPrice;
      this.takeProfitLevel = takeProfit;
      this.stopLossLevel = stopLoss;

      console.log('✅ Trade executed successfully\n');

    } catch (error) {
      console.error('❌ Trade execution failed:', error.message);
      throw error;
    }
  }

 // In botService.js

 calculateOrderAmount(quoteCurrencyAmount, currentPrice, category) {
    if (!currentPrice || currentPrice <= 0) {
      throw new Error('Invalid current price');
    }
    
    if (!quoteCurrencyAmount || quoteCurrencyAmount <= 0) {
      throw new Error('Invalid quote currency amount');
    }

    let amount;
    if (category === 'spot') {
      // For spot orders, calculate base currency amount
      amount = quoteCurrencyAmount / currentPrice;
    } else {
      // For futures, use contracts quantity
      amount = quoteCurrencyAmount;
    }

    // Round to 8 decimal places and ensure it's a string
    return Number(amount).toFixed(8);
  }


  updatePositionTracking(action) {
    // Update position tracking based on action
    if (action === 'BUY' || action === 'LONG') {
      this.currentPosition = 'LONG';
      console.log('🟢 Long position opened');
    } else if (action === 'SELL' || action === 'SHORT') {
      this.currentPosition = 'SHORT';
      console.log('🔴 Short position opened');
    } else if (
      (action === 'CLOSE_LONG' && this.currentPosition === 'LONG') ||
      (action === 'CLOSE_SHORT' && this.currentPosition === 'SHORT')
    ) {
      this.currentPosition = 'NONE';
      console.log('⚪ Position closed');
    }
  }

  
  async executeTrade(symbol, signal, amount, category) {
    try {
      console.log('\n🔄 Trade Execution Started:', {
        symbol,
        action: signal.action,
        amount: amount
      });

      // Calculate order amount with category consideration
      const orderAmount = this.calculateOrderAmount(amount, this.lastPrice, category);

      const takeProfit = signal.takeProfit ? parseFloat(signal.takeProfit) : null;
      const stopLoss = signal.stopLoss ? parseFloat(signal.stopLoss) : null;

      console.log('Trade Details:', {
        orderAmount,
        takeProfit,
        stopLoss,
        currentPrice: this.lastPrice,
        category
      });

      // Map strategy actions to exchange actions
      const sideMap = {
        'BUY': 'Buy',
        'SELL': 'Sell',
        'LONG': 'Buy',
        'SHORT': 'Sell',
        'CLOSE_LONG': 'Sell',
        'CLOSE_SHORT': 'Buy'
      };

      const side = sideMap[signal.action];
      if (!side) {
        throw new Error(`Invalid action: ${signal.action}`);
      }

      await tradeService.placeOrder(
        category,
        symbol,
        side,
        orderAmount,
        takeProfit,
        stopLoss
      );

      // Update position tracking
      this.updatePositionTracking(signal.action);
      
      // Store trade details
      this.lastEntryPrice = this.lastPrice;
      this.takeProfitLevel = takeProfit;
      this.stopLossLevel = stopLoss;

      console.log('✅ Trade executed successfully\n');

    } catch (error) {
      console.error('❌ Trade execution failed:', error.message);
      throw error;
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.currentPosition = "NONE";
      console.log("🛑 Bot stopped");
    }
  }
}

// Create and export a singleton instance
const botService = new BotService();
export default botService;