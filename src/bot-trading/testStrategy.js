const testStrategy = {
    simpleStrategy: (prices, interval, currentPosition = "NONE", marketType = "SPOT", balance = 0) => {
      // Get the current price from the last element of prices array
      const currentPrice = prices[prices.length - 1];
      
      // Simple test logic:
      // - If no position and price ends in 00-33: BUY/LONG
      // - If no position and price ends in 66-99: SHORT
      // - If in position and price ends in 50: CLOSE position
      
      let action = "HOLD";
      let stopLoss = null;
      let takeProfit = null;
  
      // Extract last 2 digits of price
      const lastTwoDigits = Math.floor(currentPrice * 100) % 100;
      
      if (currentPosition === "NONE") {
        if (lastTwoDigits >= 0 && lastTwoDigits <= 33) {
          action = marketType === "SPOT" ? "BUY" : "LONG";
          stopLoss = currentPrice * 0.99;  // 1% below current price
          takeProfit = currentPrice * 1.02; // 2% above current price
        } else if (lastTwoDigits >= 66 && lastTwoDigits <= 99 && marketType === "FUTURE") {
          action = "SHORT";
          stopLoss = currentPrice * 1.01;   // 1% above current price
          takeProfit = currentPrice * 0.98;  // 2% below current price
        }
      } else if (lastTwoDigits >= 45 && lastTwoDigits <= 55) {
        // Close any existing position
        action = currentPosition === "LONG" ? "CLOSE_LONG" : "CLOSE_SHORT";
      }
  
      return {
        action,
        stopLoss,
        takeProfit,
        currentPosition,
        marketType,
        timeframe: interval,
        indicators: {
          // Dummy indicators for compatibility
          rsi: 50,
          macd: { macd: 0, signal: 0, histogram: 0 },
          bands: { upper: currentPrice * 1.02, middle: currentPrice, lower: currentPrice * 0.98 }
        }
      };
    }
  };
  
  export default testStrategy;