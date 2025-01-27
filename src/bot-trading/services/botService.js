import marketService from "./market";
import algoritms from "../algorithms";
import tradeService from "./trade";

class BotService {
  constructor() {
    this.intervalId = null;
    this.currentPosition = "NONE";
  }

  async start(category, symbol, interval, amount) {
    if (this.intervalId) return; // Prevent multiple instances

    this.intervalId = setInterval(async () => {
      try {
        // Get latest kline data
        const klineData = await marketService.getAllKline({
          category,
          symbol,
          interval
        });

        if (!klineData) return;

        // Extract closing prices for analysis
        const prices = klineData.map(candle => parseFloat(candle[4])); // Close prices

        // Get trading signals from algorithm
        const signal = algorithms.simpleStrategy(
          prices,
          this.currentPosition,
          category === 'spot' ? 'SPOT' : 'FUTURE'
        );

        // Execute trades based on signals
        if (signal.action !== 'HOLD') {
          await this.executeTrade(symbol, signal, amount, category);
        }

      } catch (error) {
        console.error('Bot execution error:', error);
      }
    }, 10000); // Check every 10 seconds
  }

  async executeTrade(symbol, signal, amount, category) {
    try {
      switch (signal.action) {
        case 'BUY':
          await tradeService.placeOrder(
            category,
            symbol,
            'Buy',
            amount,
            signal.takeProfit,
            signal.stopLoss
          );
          this.currentPosition = 'LONG';
          break;

        case 'SELL':
        case 'TAKE PROFIT':
        case 'STOP LOSS':
          await tradeService.placeOrder(
            category,
            symbol,
            'Sell',
            amount,
            null,
            null
          );
          this.currentPosition = 'NONE';
          break;
      }
    } catch (error) {
      console.error('Trade execution error:', error);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Export a singleton instance
export default new BotService();