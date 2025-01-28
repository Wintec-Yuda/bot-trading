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

    // Detailed RSI analysis logging
    console.log('\n📊 RSI Analysis:', {
      currentPrice: currentPrice.toFixed(2),
      rsiValue: rsi.toFixed(2),
      rsiPeriod,
      overboughtLevel: rsiOverbought,
      oversoldLevel: rsiOversold
    });

    if (rsi <= rsiOversold) {
      const takeProfit = currentPrice * (1 + tpPercentage / 100);
      const stopLoss = currentPrice * (1 - slPercentage / 100);

      console.log('💰 Buy Signal Levels:', {
        entry: currentPrice.toFixed(2),
        takeProfit: takeProfit.toFixed(2),
        stopLoss: stopLoss.toFixed(2),
        potentialGain: tpPercentage.toFixed(2) + '%',
        maxLoss: slPercentage.toFixed(2) + '%'
      });

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

      console.log('💰 Sell Signal Levels:', {
        entry: currentPrice.toFixed(2),
        takeProfit: takeProfit.toFixed(2),
        stopLoss: stopLoss.toFixed(2),
        potentialGain: tpPercentage.toFixed(2) + '%',
        maxLoss: slPercentage.toFixed(2) + '%'
      });

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

    console.log('\n📈 Position Monitor:', {
      side,
      entryPrice: entryPrice.toFixed(2),
      currentPrice: currentPrice.toFixed(2),
      pnlPercentage: pnl.toFixed(2) + '%',
      takeProfit: takeProfit?.toFixed(2) || 'None',
      stopLoss: stopLoss?.toFixed(2) || 'None',
      distanceToTP: takeProfit ? Math.abs(((currentPrice - takeProfit) / currentPrice * 100)).toFixed(2) + '%' : 'N/A',
      distanceToSL: stopLoss ? Math.abs(((currentPrice - stopLoss) / currentPrice * 100)).toFixed(2) + '%' : 'N/A'
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
}

export default RSIStrategy;