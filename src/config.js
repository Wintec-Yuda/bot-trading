const config = {
  apiKey: process.env.NEXT_PUBLIC_BYBIT_API_KEY,
  secretKey: process.env.NEXT_PUBLIC_BYBIT_SECRET_KEY,
  rsiPeriod: 14,
  rsiOverbought: 70,
  rsiOversold: 30,
};

export default config;