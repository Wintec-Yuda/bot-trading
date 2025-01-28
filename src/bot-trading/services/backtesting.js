import { calculateRSI } from "../indicators";

const backtestingService = {
  // Simple strategy using RSI for testing purposes
  testStrategy: (prices, balance) => {
    const rsi = calculateRSI(prices);
    const currentPrice = prices[prices.length - 1];
    
    // Define take profit and stop loss percentages
    const takeProfitPercent = 0.15; // 15% profit target
    const stopLossPercent = 0.10;   // 10% loss limit
    
    // Calculate take profit and stop loss levels
    const takeProfitPrice = currentPrice * (1 + takeProfitPercent);
    const stopLossPrice = currentPrice * (1 - stopLossPercent);
    
    let signal = {
      action: 'HOLD',
      entryPrice: currentPrice,
      takeProfit: takeProfitPrice,
      stopLoss: stopLossPrice,
      reason: 'No signal'
    };

    // Simple RSI-based rules
    if (rsi < 30) {
      signal = {
        action: 'BUY',
        entryPrice: currentPrice,
        takeProfit: takeProfitPrice,
        stopLoss: stopLossPrice,
        reason: 'RSI oversold'
      };
    } else if (rsi > 70) {
      signal = {
        action: 'SELL',
        entryPrice: currentPrice,
        takeProfit: null,  // No take profit for sell signals
        stopLoss: null,    // No stop loss for sell signals
        reason: 'RSI overbought'
      };
    }

    // Add position monitoring
    const monitorPosition = (currentPrice, position) => {
      if (!position) return null;
      
      if (currentPrice >= position.takeProfit) {
        return {
          action: 'TAKE_PROFIT',
          reason: 'Take profit target reached'
        };
      }
      
      if (currentPrice <= position.stopLoss) {
        return {
          action: 'STOP_LOSS',
          reason: 'Stop loss triggered'
        };
      }
      
      return null;
    };

    return {
      signal,
      monitorPosition
    };
  }
};

export default backtestingService;