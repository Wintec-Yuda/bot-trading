import adjustPeriodsForTimeframe from './timeframeUtils';

export const calculateRSI = (prices, interval) => {
  const { rsi: period } = adjustPeriodsForTimeframe(interval);
  
  if (prices.length < period + 1) {
    throw new Error(`Not enough data for RSI calculation. Need at least ${period + 1} data points`);
  }

  const changes = prices.slice(1).map((price, i) => price - prices[i]);
  const gains = changes.map(change => (change > 0 ? change : 0));
  const losses = changes.map(change => (change < 0 ? -change : 0));

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  // Use Wilder's smoothing for subsequent values
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

export const calculateEMA = (prices, period) => {
  if (prices.length < period) {
    throw new Error(`Not enough data for EMA calculation. Need at least ${period} data points`);
  }

  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;

  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }
  return ema;
};

export const calculateMACD = (prices, interval) => {
  const { macdFast, macdSlow, macdSignal } = adjustPeriodsForTimeframe(interval);

  if (prices.length < macdSlow) {
    throw new Error(`Not enough data for MACD calculation. Need at least ${macdSlow} data points`);
  }

  // Calculate EMAs for all price points
  const fastEMAs = [];
  const slowEMAs = [];
  let fastEMA = prices.slice(0, macdFast).reduce((a, b) => a + b) / macdFast;
  let slowEMA = prices.slice(0, macdSlow).reduce((a, b) => a + b) / macdSlow;
  
  const fastMultiplier = 2 / (macdFast + 1);
  const slowMultiplier = 2 / (macdSlow + 1);

  // Calculate EMAs for each price point
  for (let i = 0; i < prices.length; i++) {
    if (i < macdFast) {
      fastEMAs.push(fastEMA);
    } else {
      fastEMA = (prices[i] - fastEMA) * fastMultiplier + fastEMA;
      fastEMAs.push(fastEMA);
    }

    if (i < macdSlow) {
      slowEMAs.push(slowEMA);
    } else {
      slowEMA = (prices[i] - slowEMA) * slowMultiplier + slowEMA;
      slowEMAs.push(slowEMA);
    }
  }

  // Calculate MACD line for all points
  const macdLine = fastEMAs.map((fast, i) => fast - slowEMAs[i]);
  
  // Calculate signal line using EMA of MACD line
  let signalLine = macdLine.slice(0, macdSignal).reduce((a, b) => a + b) / macdSignal;
  const signalMultiplier = 2 / (macdSignal + 1);
  const signalLines = [signalLine];

  for (let i = macdSignal; i < macdLine.length; i++) {
    signalLine = (macdLine[i] - signalLine) * signalMultiplier + signalLine;
    signalLines.push(signalLine);
  }

  // Get the latest values
  const latestMACD = macdLine[macdLine.length - 1];
  const latestSignal = signalLines[signalLines.length - 1];
  const latestHistogram = latestMACD - latestSignal;

  return {
    macd: latestMACD,
    signal: latestSignal,
    histogram: latestHistogram,
    periods: {
      fast: macdFast,
      slow: macdSlow,
      signal: macdSignal
    }
  };
};

export const calculateBollingerBands = (prices, interval) => {
  const { bbPeriod, bbStdDev } = adjustPeriodsForTimeframe(interval);

  if (prices.length < bbPeriod) {
    throw new Error(`Not enough data for Bollinger Bands calculation. Need at least ${bbPeriod} data points`);
  }

  // Calculate SMA for middle band
  const sma = prices.slice(-bbPeriod).reduce((sum, price) => sum + price, 0) / bbPeriod;

  // Calculate standard deviation
  const squaredDiffs = prices.slice(-bbPeriod).map(price => Math.pow(price - sma, 2));
  const standardDeviation = Math.sqrt(squaredDiffs.reduce((sum, diff) => sum + diff, 0) / bbPeriod);

  // Calculate bands
  const upperBand = sma + (standardDeviation * bbStdDev);
  const lowerBand = sma - (standardDeviation * bbStdDev);

  return {
    upper: upperBand,
    middle: sma,
    lower: lowerBand,
    standardDeviation,
    period: bbPeriod
  };
};