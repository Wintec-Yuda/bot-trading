import {
  calculateBollingerBands,
  calculateMACD,
  calculateRSI,
} from "./indicators";

const algoritms = {
  simpleStrategy: (prices, currentPosition = "NONE", marketType = "SPOT") => {
    const rsi = calculateRSI(prices);
    const macd = calculateMACD(prices);
    const [upperBand, middleBand, lowerBand] = calculateBollingerBands(prices);

    let action = "HOLD"; // Default action is HOLD
    let stopLoss = null;
    let takeProfit = null;

    if (marketType === "SPOT") {
      // Spot market strategy (buy and sell the actual asset)
      // If RSI is under 30, consider buying (oversold)
      if (rsi < 30 && currentPosition === "NONE") {
        action = "BUY";
        stopLoss = prices[prices.length - 1] * 0.95; // 5% stop loss
        takeProfit = prices[prices.length - 1] * 1.1; // 10% take profit
      }
      // If RSI is over 70, consider selling (overbought)
      else if (rsi > 70 && currentPosition === "LONG") {
        action = "SELL";
      }
      // If MACD is crossing above signal line (bullish crossover)
      else if (macd > 0 && currentPosition === "NONE") {
        action = "BUY";
        stopLoss = prices[prices.length - 1] * 0.95;
        takeProfit = prices[prices.length - 1] * 1.1;
      }
      // If MACD is crossing below signal line (bearish crossover)
      else if (macd < 0 && currentPosition === "LONG") {
        action = "SELL";
      }
      // If price hits upper Bollinger Band, consider taking profit
      else if (
        prices[prices.length - 1] > upperBand &&
        currentPosition === "LONG"
      ) {
        action = "TAKE PROFIT";
      }
      // If price hits lower Bollinger Band, consider stop loss (if in position)
      else if (
        prices[prices.length - 1] < lowerBand &&
        currentPosition === "LONG"
      ) {
        action = "STOP LOSS";
      }
    } else if (marketType === "FUTURE") {
      // Future market strategy (buy/sell contracts for future settlement)
      // If RSI is under 30, consider buying (oversold)
      if (rsi < 30 && currentPosition === "NONE") {
        action = "BUY";
        stopLoss = prices[prices.length - 1] * 0.90; // Future market might have larger stop loss tolerance
        takeProfit = prices[prices.length - 1] * 1.15; // Larger potential take profit due to higher volatility
      }
      // If RSI is over 70, consider selling (overbought)
      else if (rsi > 70 && currentPosition === "LONG") {
        action = "SELL";
      }
      // If MACD is crossing above signal line (bullish crossover)
      else if (macd > 0 && currentPosition === "NONE") {
        action = "BUY";
        stopLoss = prices[prices.length - 1] * 0.90;
        takeProfit = prices[prices.length - 1] * 1.15;
      }
      // If MACD is crossing below signal line (bearish crossover)
      else if (macd < 0 && currentPosition === "LONG") {
        action = "SELL";
      }
      // If price hits upper Bollinger Band, consider taking profit
      else if (
        prices[prices.length - 1] > upperBand &&
        currentPosition === "LONG"
      ) {
        action = "TAKE PROFIT";
      }
      // If price hits lower Bollinger Band, consider stop loss (if in position)
      else if (
        prices[prices.length - 1] < lowerBand &&
        currentPosition === "LONG"
      ) {
        action = "STOP LOSS";
      }
    }

    return {
      action, // BUY, SELL, HOLD, TAKE PROFIT, STOP LOSS
      stopLoss, // Level stop loss
      takeProfit, // Level take profit
      currentPosition, // Posisi saat ini (NONE, LONG, SHORT)
      marketType, // SPOT or FUTURE
    };
  },
};

export default algoritms;
