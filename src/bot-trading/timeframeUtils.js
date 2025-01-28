const adjustPeriodsForTimeframe = (interval) => {
    // Convert string intervals to minutes
    const toMinutes = (interval) => {
      if (interval === 'D') return 1440;    // Daily
      if (interval === 'W') return 10080;   // Weekly
      if (interval === 'M') return 43200;   // Monthly (30 days approximation)
      return parseInt(interval);             // Already in minutes
    };
  
    const minutes = toMinutes(interval);
  
    // Adjust periods based on timeframe
    // For higher timeframes, reduce the period to avoid using too old data
    // For lower timeframes, increase the period to reduce noise
    return {
      rsi: minutes <= 5 ? 21 :           // 5m or less: longer period to reduce noise
           minutes <= 60 ? 14 :          // 1h or less: standard period
           minutes <= 240 ? 10 :         // 4h or less: slightly shorter
           7,                            // Daily and above: shorter period
  
      macdFast: minutes <= 5 ? 16 :      // Short-term EMA period
                minutes <= 60 ? 12 :
                minutes <= 240 ? 10 :
                8,
  
      macdSlow: minutes <= 5 ? 32 :      // Long-term EMA period
                minutes <= 60 ? 26 :
                minutes <= 240 ? 22 :
                17,
  
      macdSignal: minutes <= 5 ? 11 :    // Signal line period
                  minutes <= 60 ? 9 :
                  minutes <= 240 ? 7 :
                  5,
  
      bbPeriod: minutes <= 5 ? 30 :      // Bollinger Bands period
                minutes <= 60 ? 20 :
                minutes <= 240 ? 15 :
                10,
  
      bbStdDev: minutes <= 5 ? 2.5 :     // Bollinger Bands standard deviation
                minutes <= 60 ? 2.0 :
                minutes <= 240 ? 2.0 :
                1.8
    };
  };
  
  export default adjustPeriodsForTimeframe;