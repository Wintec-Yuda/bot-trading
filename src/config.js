const config = {
  baseUrl: 'https://api-demo.bybit.com',
  apiKey: process.env.BYBIT_API_KEY,
  secretKey: process.env.BYBIT_SECRET_KEY,
  rsiPeriod: 14,
  rsiOverbought: 70,
  rsiOversold: 30,
};

export default config;