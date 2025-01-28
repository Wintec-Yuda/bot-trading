import {
    calculateBollingerBands,
    calculateMACD,
    calculateRSI,
  } from "./indicators";
  
  const getMaxCutLoss = (balance) => {
    return balance * 0.15; // 15% maximum cut loss from current balance
  };
  
  const calculateDynamicTakeProfit = (price, rsi, upperBand, interval) => {
    // Adjust take profit levels based on timeframe
    const isLowerTimeframe = ['1', '3', '5', '15', '30'].includes(interval);
    const isMediumTimeframe = ['60', '120', '240'].includes(interval);
    const isHigherTimeframe = ['D', 'W', 'M'].includes(interval);
  
    // More conservative targets for lower timeframes
    if (isLowerTimeframe) {
      if (rsi > 70) return price * 1.02;    // 2% take profit
      if (rsi > 60) return price * 1.03;    // 3% take profit
      return Math.min(upperBand, price * 1.05); // 5% or upper band, whichever is lower
    }
    
    // Moderate targets for medium timeframes
    if (isMediumTimeframe) {
      if (rsi > 70) return price * 1.05;    // 5% take profit
      if (rsi > 60) return price * 1.08;    // 8% take profit
      return Math.min(upperBand, price * 1.1); // 10% or upper band
    }
    
    // More ambitious targets for higher timeframes
    if (isHigherTimeframe) {
      if (rsi > 70) return price * 1.08;    // 8% take profit
      if (rsi > 60) return price * 1.12;    // 12% take profit
      return Math.min(upperBand, price * 1.15); // 15% or upper band
    }
  
    return upperBand; // Default to upper band if interval not recognized
  };
  
  const algorithms = {
    simpleStrategy: (prices, interval, currentPosition = "NONE", marketType = "SPOT", balance = 0) => {
      // Calculate indicators with timeframe adaptation
      const rsi = calculateRSI(prices, interval);
      const macdData = calculateMACD(prices, interval);
      const bollingerBands = calculateBollingerBands(prices, interval);
      const currentPrice = prices[prices.length - 1];
  
      let action = "HOLD";
      let stopLoss = null;
      let takeProfit = null;
      
      // Maximum allowed loss based on current balance
      const maxLoss = getMaxCutLoss(balance);
      
      if (marketType === "SPOT") {
        // Spot market - only buy when conditions are good
        if (currentPosition === "NONE") {
          if ((rsi < 30 || macdData.histogram > 0) && currentPrice < bollingerBands.lower) {
            action = "BUY";
            stopLoss = Math.max(currentPrice * 0.85, currentPrice - (maxLoss / balance) * currentPrice);
            takeProfit = calculateDynamicTakeProfit(currentPrice, rsi, bollingerBands.upper, interval);
          }
        } else if (currentPosition === "LONG") {
          if (rsi > 70 || macdData.histogram < 0 || currentPrice >= bollingerBands.upper) {
            action = "SELL";
          }
        }
      } else if (marketType === "FUTURE") {
        // Futures market - can both long and short
        switch (currentPosition) {
          case "NONE":
            // Strong oversold condition - go long
            if (rsi < 30 && macdData.histogram > 0 && currentPrice < bollingerBands.lower) {
              action = "LONG";
              stopLoss = Math.max(currentPrice * 0.85, currentPrice - (maxLoss / balance) * currentPrice);
              takeProfit = calculateDynamicTakeProfit(currentPrice, rsi, bollingerBands.upper, interval);
            }
            // Strong overbought condition - go short
            else if (rsi > 70 && macdData.histogram < 0 && currentPrice > bollingerBands.upper) {
              action = "SHORT";
              stopLoss = Math.min(currentPrice * 1.15, currentPrice + (maxLoss / balance) * currentPrice);
              takeProfit = bollingerBands.lower; // Target lower band for short positions
            }
            break;
  
          case "LONG":
            if (rsi > 70 || macdData.histogram < 0 || currentPrice >= bollingerBands.upper) {
              action = "CLOSE_LONG";
            }
            break;
  
          case "SHORT":
            if (rsi < 30 || macdData.histogram > 0 || currentPrice <= bollingerBands.lower) {
              action = "CLOSE_SHORT";
            }
            break;
        }
      }
  
      // Format timeframe for display
      const formatTimeframe = (interval) => {
        // Clean the interval string
        const cleanInterval = String(interval).replace('m', '');
        
        if (cleanInterval === 'D') return '1 Day';
        if (cleanInterval === 'W') return '1 Week';
        if (cleanInterval === 'M') return '1 Month';
        const mins = parseInt(cleanInterval);
        if (mins >= 60) return `${mins/60}h`;
        return `${mins}m`;
      };
  
      return {
        action,
        stopLoss,
        takeProfit,
        currentPosition,
        marketType,
        timeframe: formatTimeframe(interval),
        indicators: {
          rsi,
          macd: macdData,
          bands: bollingerBands
        }
      };
    },
  };
  
  export default algorithms;