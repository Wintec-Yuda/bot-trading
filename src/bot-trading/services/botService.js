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
    this.currentStrategy = strategyName;
    this.strategyConfig = { ...this.strategyConfig, ...config };
  }

  async start(category, symbol, interval, amount) {
    if (this.intervalId) {
      return;
    }

    const balance = await accountService.getAccountBalance(category);
    // Use walletBalance for spot, availableBalance for futures
    this.currentBalance = parseFloat(category === 'spot' ? balance.walletBalance : balance.availableBalance);
    
    if (this.currentBalance < parseFloat(amount)) {
      return;
    }

    const intervalMs = this.getIntervalInMs(interval);
    const formattedInterval = this.formatInterval(interval);

    // Execute immediately once
    await this.executeStrategy(category, symbol, interval, amount);
    
    // Then set up the interval
    this.intervalId = setInterval(async () => {
      try {
        await this.executeStrategy(category, symbol, interval, amount);
      } catch (error) {
        this.stop();
      }
    }, intervalMs);

  }

  async executeStrategy(category, symbol, interval, amount) {
    const timestamp = new Date().toLocaleString();

    // Get latest balance
    const balance = await accountService.getAccountBalance(category);
    this.currentBalance = parseFloat(balance.availableBalance);

    // Get market data
    const klineData = await marketService.getAllKline({
      category,
      symbol,
      interval
    });

    if (!klineData?.length) {
      return;
    }

    const prices = klineData.map(candle => parseFloat(candle[4]));
    this.lastPrice = prices[prices.length - 1];

    // Get strategy instance and analyze
    const strategy = strategyRegistry.get(this.currentStrategy);
    
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
        await this.executeTrade(symbol, exitSignal, amount, category);
        return;
      }
    }

    if (signal.action !== 'HOLD') {
      await this.executeTrade(symbol, signal, amount, category);
    }

  }


  async executeTrade(symbol, signal, amount, category) {
    try {
      const orderAmount = this.calculateOrderAmount(amount, this.lastPrice);
      const takeProfit = signal.takeProfit ? parseFloat(signal.takeProfit) : null;
      const stopLoss = signal.stopLoss ? parseFloat(signal.stopLoss) : null;

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
      } else if (signal.action === 'SELL' && this.currentPosition === 'LONG') {
        this.currentPosition = 'NONE';
      } else {
        this.currentPosition = 'SHORT';
      }

      this.lastEntryPrice = this.lastPrice;
      this.takeProfitLevel = takeProfit;
      this.stopLossLevel = stopLoss;

    } catch (error) {
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
    } else if (action === 'SELL' || action === 'SHORT') {
      this.currentPosition = 'SHORT';
    } else if (
      (action === 'CLOSE_LONG' && this.currentPosition === 'LONG') ||
      (action === 'CLOSE_SHORT' && this.currentPosition === 'SHORT')
    ) {
      this.currentPosition = 'NONE';
    }
  }

  
  async executeTrade(symbol, signal, amount, category) {
    try {

      // Calculate order amount with category consideration
      const orderAmount = this.calculateOrderAmount(amount, this.lastPrice, category);

      const takeProfit = signal.takeProfit ? parseFloat(signal.takeProfit) : null;
      const stopLoss = signal.stopLoss ? parseFloat(signal.stopLoss) : null;

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
    } catch (error) {
      throw error;
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.currentPosition = "NONE";
    }
  }
}

// Create and export a singleton instance
const botService = new BotService();
export default botService;