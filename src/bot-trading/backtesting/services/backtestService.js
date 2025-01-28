// backtesting/services/backtestService.js
import Backtester from '../core/Backtester';
import marketService from '../../services/market';
import { strategyRegistry } from '../../strategies';

class BacktestService {
  constructor() {
    this.backtester = null;
  }

  async runBacktest(params) {
    const {
      strategyName,
      strategyConfig,
      symbol,
      interval,
      startDate,
      endDate,
      initialBalance = 10000
    } = params;

    try {
      // Get historical data
      const historicalData = await this.fetchHistoricalData(symbol, interval, startDate, endDate);
      if (!historicalData || historicalData.length === 0) {
        throw new Error('No historical data available for backtesting');
      }

      // Process range values for TP/SL
      const processedConfig = this.processRangeConfig(strategyConfig);

      // Get strategy instance
      const strategy = strategyRegistry.get(strategyName);
      
      // Initialize backtester
      this.backtester = new Backtester(strategy, {
        initialBalance,
        strategyConfig: processedConfig
      });

      // Run backtest
      const results = await this.backtester.runBacktest(historicalData);

      // Format and return results
      return this.formatResults(results, params);
    } catch (error) {
      console.error('Backtest error:', error);
      throw error;
    }
  }

  processRangeConfig(config) {
    const processedConfig = { ...config };
    
    // Process Take Profit range
    if (config.isRangeTP && config.tpPercentageMax) {
      const minTP = parseFloat(config.tpPercentage);
      const maxTP = parseFloat(config.tpPercentageMax);
      // Generate random TP within range for each trade
      processedConfig.tpPercentage = () => 
        minTP + Math.random() * (maxTP - minTP);
    } else {
      processedConfig.tpPercentage = parseFloat(config.tpPercentage);
    }

    // Process Stop Loss range
    if (config.isRangeSL && config.slPercentageMax) {
      const minSL = parseFloat(config.slPercentage);
      const maxSL = parseFloat(config.slPercentageMax);
      // Generate random SL within range for each trade
      processedConfig.slPercentage = () => 
        minSL + Math.random() * (maxSL - minSL);
    } else {
      processedConfig.slPercentage = parseFloat(config.slPercentage);
    }

    return processedConfig;
  }

  async fetchHistoricalData(symbol, interval, startDate, endDate) {
    try {
      // Convert dates to timestamps if provided
      const params = {
        symbol,
        interval,
        limit: 1000
      };

      if (startDate) {
        params.start = new Date(startDate).getTime();
      }

      if (endDate) {
        params.end = new Date(endDate).getTime();
      }

      console.log('Fetching historical data with params:', params);

      const data = await marketService.getAllKline(params);

      if (!data || data.length === 0) {
        throw new Error('No historical data available for the specified parameters');
      }

      if (data.length < 50) {
        throw new Error('Insufficient historical data for reliable backtesting. Need at least 50 candles.');
      }

      console.log(`Fetched ${data.length} candles for backtesting`);

      return data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw new Error(`Failed to fetch historical data: ${error.message}`);
    }
  }

  formatResults(results, params) {
    const {
      trades,
      metrics,
      equity
    } = results;

    return {
      summary: {
        strategy: params.strategyName,
        symbol: params.symbol,
        interval: params.interval,
        startDate: params.startDate,
        endDate: params.endDate,
        initialBalance: params.initialBalance
      },
      performance: {
        ...metrics,
        equityCurve: equity.map(e => ({
          timestamp: new Date(e.timestamp).toISOString(),
          equity: e.value
        }))
      },
      trades: trades.map(t => ({
        ...t,
        entryTime: new Date(t.entryTime).toISOString(),
        exitTime: new Date(t.exitTime).toISOString()
      }))
    };
  }

  getBacktestResults() {
    if (!this.backtester) {
      throw new Error('No backtest has been run yet');
    }
    return this.backtester.getResults();
  }
}

// Create and export a singleton instance
const backtestService = new BacktestService();
export default backtestService;