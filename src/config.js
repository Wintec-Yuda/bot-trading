const config = {
  apiKey: process.env.BYBIT_API_KEY || 'aB6CFUOzwBh2J7Fu10',
  secretKey: process.env.BYBIT_SECRET_KEY || '9lKBsiTdB3Qz6HRWKkXhXX6HGBYmA1tb67ng',
  rsiPeriod: 14,
  rsiOverbought: 70,
  rsiOversold: 30,
};

export default config;