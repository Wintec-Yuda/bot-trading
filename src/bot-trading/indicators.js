
export const calculateRSI = (prices, period = 14) => {
  const changes = prices.slice(1).map((price, i) => price - prices[i]);
  const gains = changes.map(change => (change > 0 ? change : 0));
  const losses = changes.map(change => (change < 0 ? -change : 0));

  const avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

export const calculateEMA = (prices, period = 14) => {
  const alpha = 2 / (period + 1);
  const ema = prices[0];
  for (let i = 1; i < prices.length; i++) {
    ema = alpha * prices[i] + (1 - alpha) * ema;
  }
  return ema;
};

export const calculateMACD = (prices, shortPeriod = 12, longPeriod = 26) => {
  const shortEMA = calculateEMA(prices, shortPeriod);
  const longEMA = calculateEMA(prices, longPeriod);
  const macd = shortEMA - longEMA;
  return macd;
};

export const calculateBollingerBands = (prices, period = 20) => {
  const middleBand = calculateEMA(prices, period);
  const standardDeviation = Math.sqrt(
    prices
      .slice(0, period)
      .map(price => Math.pow(price - middleBand, 2))
      .reduce((a, b) => a + b, 0) / period
  );
  const upperBand = middleBand + standardDeviation * 2;
  const lowerBand = middleBand - standardDeviation * 2;
  return [upperBand, middleBand, lowerBand];
};

