const config = {
  apiKey: process.env.BYBIT_API_KEY || 'WD53nBPIwh4MAxRPr5',
  secretKey: process.env.BYBIT_SECRET_KEY || 'DeOPwPPRM43iZccKAYdKlvnEb8Y7MmRDOTyr',
  rsiPeriod: 14,
  rsiOverbought: 70,
  rsiOversold: 30,
};

export default config;