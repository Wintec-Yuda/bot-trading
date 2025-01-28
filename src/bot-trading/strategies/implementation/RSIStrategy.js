// strategies/implementations/RSIStrategy.js
import { IStrategy } from '../types';
import { calculateRSI } from '../../indicators';

class RSIStrategy extends IStrategy {
  getName() {
    return 'RSI Strategy';
  }

  analyze(prices, config = {}) {
    const {
      tpPercentage = 2.0,
      slPercentage = 1.0,
      rsiPeriod = 14,
      rsiOverbought = 70,
      rsiOversold = 30
    } = config;

    const currentPrice = prices[prices.length - 1];
    const rsi = calculateRSI(prices, rsiPeriod);

    if (rsi <= rsiOversold) {
      const takeProfit = currentPrice * (1 + tpPercentage / 100);
      const stopLoss = currentPrice * (1 - slPercentage / 100);

      return {
        action: 'BUY',
        entryPrice: currentPrice,
        takeProfit,
        stopLoss,
        reason: `RSI oversold (${rsi.toFixed(2)})`
      };
    }

    if (rsi >= rsiOverbought) {
      const takeProfit = currentPrice * (1 - tpPercentage / 100);
      const stopLoss = currentPrice * (1 + slPercentage / 100);

      return {
        action: 'SELL',
        entryPrice: currentPrice,
        takeProfit,
        stopLoss,
        reason: `RSI overbought (${rsi.toFixed(2)})`
      };
    }

    return {
      action: 'HOLD',
      entryPrice: currentPrice,
      takeProfit: null,
      stopLoss: null,
      reason: `RSI neutral (${rsi.toFixed(2)})`
    };
  }

  monitorPosition(currentPrice, position) {
    if (!position) return null;

    const { entryPrice, takeProfit, stopLoss, side } = position;
    const pnl = side === 'BUY' 
      ? ((currentPrice - entryPrice) / entryPrice * 100)
      : ((entryPrice - currentPrice) / entryPrice * 100);

    if (side === 'BUY') {
      if (takeProfit && currentPrice >= takeProfit) {
        return { action: 'SELL', reason: `Take profit reached (${pnl.toFixed(2)}% gain)` };
      }
      if (stopLoss && currentPrice <= stopLoss) {
        return { action: 'SELL', reason: `Stop loss triggered (${pnl.toFixed(2)}% loss)` };
      }
    } else if (side === 'SELL') {
      if (takeProfit && currentPrice <= takeProfit) {
        return { action: 'BUY', reason: `Take profit reached (${pnl.toFixed(2)}% gain)` };
      }
      if (stopLoss && currentPrice >= stopLoss) {
        return { action: 'BUY', reason: `Stop loss triggered (${pnl.toFixed(2)}% loss)` };
      }
    }

    return null;
  }
}

export default RSIStrategy;