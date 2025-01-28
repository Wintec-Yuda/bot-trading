// strategies/implementations/SimpleStrategy.js
import { IStrategy } from '../types';

class SimpleStrategy extends IStrategy {
  getName() {
    return 'Simple Momentum Strategy';
  }

  analyze(prices, config = {}) {
    const {
      tpPercentage = 2.0,
      slPercentage = 1.0,
      minVolatility = 1.5,
      lookbackPeriod = 20
    } = config;

    const currentPrice = prices[prices.length - 1];
    const volatility = this._calculateVolatility(prices.slice(-lookbackPeriod));
    const momentum = this._calculateMomentum(prices.slice(-5));

    // Detailed analysis logging
    console.log('\n📊 Strategy Analysis:', {
      currentPrice: currentPrice.toFixed(2),
      volatility: volatility.toFixed(2) + '%',
      momentum: momentum.toFixed(2) + '%',
      minRequiredVolatility: minVolatility.toFixed(2) + '%'
    });

    if (volatility < minVolatility) {
      return {
        action: 'HOLD',
        entryPrice: currentPrice,
        takeProfit: null,
        stopLoss: null,
        reason: `Insufficient volatility (${volatility.toFixed(2)}% < ${minVolatility}%)`
      };
    }

    if (momentum > 0) {
      return {
        action: 'BUY',
        entryPrice: currentPrice,
        takeProfit: currentPrice * (1 + tpPercentage / 100),
        stopLoss: currentPrice * (1 - slPercentage / 100),
        reason: `Bullish momentum detected (${momentum.toFixed(2)}%)`
      };
    }

    if (momentum < 0) {
      return {
        action: 'SELL',
        entryPrice: currentPrice,
        takeProfit: currentPrice * (1 - tpPercentage / 100),
        stopLoss: currentPrice * (1 + slPercentage / 100),
        reason: `Bearish momentum detected (${momentum.toFixed(2)}%)`
      };
    }

    return {
      action: 'HOLD',
      entryPrice: currentPrice,
      takeProfit: null,
      stopLoss: null,
      reason: `No clear momentum (${momentum.toFixed(2)}%)`
    };
  }

  monitorPosition(currentPrice, position) {
    if (!position) return null;

    const { entryPrice, takeProfit, stopLoss, side } = position;
    const pnl = side === 'BUY' 
      ? ((currentPrice - entryPrice) / entryPrice * 100)
      : ((entryPrice - currentPrice) / entryPrice * 100);

    console.log('\n📈 Position Monitor:', {
      side,
      entryPrice: entryPrice.toFixed(2),
      currentPrice: currentPrice.toFixed(2),
      pnlPercentage: pnl.toFixed(2) + '%',
      takeProfit: takeProfit?.toFixed(2) || 'None',
      stopLoss: stopLoss?.toFixed(2) || 'None'
    });

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

  _calculateVolatility(prices) {
    const returns = prices.map((price, i) => 
      i > 0 ? ((price - prices[i-1]) / prices[i-1]) * 100 : 0
    );
    return this._calculateStdDev(returns);
  }

  _calculateMomentum(prices) {
    return (prices[prices.length - 1] - prices[0]) / prices[0] * 100;
  }

  _calculateStdDev(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    return Math.sqrt(squareDiffs.reduce((sum, val) => sum + val, 0) / values.length);
  }
}

export default SimpleStrategy;