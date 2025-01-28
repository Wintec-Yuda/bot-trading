// backtesting/core/Backtester.js
class Backtester {
    constructor(strategy, config = {}) {
      this.strategy = strategy;
      this.config = {
        initialBalance: 10000,
        feeRate: 0.001,  // 0.1% trading fee
        slippage: 0.001, // 0.1% slippage
        ...config
      };
      this.reset();
    }
  
    reset() {
      this.balance = this.config.initialBalance;
      this.positions = [];
      this.trades = [];
      this.equity = [{ timestamp: 0, value: this.balance }];
    }
  
    calculateTradingFees(amount) {
      return amount * this.config.feeRate;
    }
  
    calculateSlippage(price, side) {
      const slippageMultiplier = side === 'BUY' ? (1 + this.config.slippage) : (1 - this.config.slippage);
      return price * slippageMultiplier;
    }
  
    async runBacktest(data) {
      this.reset();
      const results = {
        trades: [],
        metrics: {},
        equity: []
      };
  
      let position = null;
  
      for (let i = 50; i < data.length; i++) {
        const currentPrice = parseFloat(data[i][4]); // Close price
        const timestamp = parseInt(data[i][0]);
        const historicalPrices = data.slice(0, i + 1).map(candle => parseFloat(candle[4]));
  
        // If we have a position, check for exit signals
        if (position) {
          const exitSignal = this.strategy.monitorPosition(currentPrice, position);
          if (exitSignal) {
            const tradeResult = this.closePosition(position, currentPrice, timestamp, exitSignal.reason);
            results.trades.push(tradeResult);
            position = null;
          }
        }
  
        // If we don't have a position, check for entry signals
        if (!position) {
          const signal = this.strategy.analyze(historicalPrices, this.config.strategyConfig);
          
          if (signal.action !== 'HOLD') {
            position = this.openPosition(signal, currentPrice, timestamp);
          }
        }
  
        // Track equity at each point
        const currentEquity = this.calculateCurrentEquity(currentPrice, position);
        this.equity.push({ timestamp, value: currentEquity });
      }
  
      // Calculate final metrics
      results.metrics = this.calculateMetrics(results.trades);
      results.equity = this.equity;
  
      return results;
    }
  
    openPosition(signal, currentPrice, timestamp) {
      const executionPrice = this.calculateSlippage(currentPrice, signal.action);
      const positionSize = this.calculatePositionSize(executionPrice);
      const fees = this.calculateTradingFees(positionSize * executionPrice);
  
      const position = {
        entryPrice: executionPrice,
        size: positionSize,
        side: signal.action,
        takeProfit: signal.takeProfit,
        stopLoss: signal.stopLoss,
        entryTime: timestamp,
        fees
      };
  
      this.balance -= fees;
      return position;
    }
  
    closePosition(position, currentPrice, timestamp, reason) {
      const executionPrice = this.calculateSlippage(currentPrice, position.side === 'BUY' ? 'SELL' : 'BUY');
      const fees = this.calculateTradingFees(position.size * executionPrice);
      
      // Calculate PnL
      const grossPnl = position.side === 'BUY' 
        ? (executionPrice - position.entryPrice) * position.size
        : (position.entryPrice - executionPrice) * position.size;
      
      const netPnl = grossPnl - position.fees - fees;
      this.balance += netPnl;
  
      return {
        entryPrice: position.entryPrice,
        exitPrice: executionPrice,
        entryTime: position.entryTime,
        exitTime: timestamp,
        side: position.side,
        size: position.size,
        grossPnl,
        netPnl,
        fees: position.fees + fees,
        reason
      };
    }
  
    calculatePositionSize(currentPrice) {
      // Simple position sizing: use 10% of current balance
      const riskAmount = this.balance * 0.1;
      return riskAmount / currentPrice;
    }
  
    calculateCurrentEquity(currentPrice, position) {
      if (!position) return this.balance;
  
      const unrealizedPnl = position.side === 'BUY'
        ? (currentPrice - position.entryPrice) * position.size
        : (position.entryPrice - currentPrice) * position.size;
  
      return this.balance + unrealizedPnl;
    }
  
    calculateMetrics(trades) {
      if (trades.length === 0) return {};
  
      const profits = trades.filter(t => t.netPnl > 0);
      const losses = trades.filter(t => t.netPnl <= 0);
      const totalProfit = trades.reduce((sum, t) => sum + (t.netPnl > 0 ? t.netPnl : 0), 0);
      const totalLoss = Math.abs(trades.reduce((sum, t) => sum + (t.netPnl < 0 ? t.netPnl : 0), 0));
  
      const metrics = {
        totalTrades: trades.length,
        profitableTrades: profits.length,
        winRate: (profits.length / trades.length) * 100,
        totalProfit,
        totalLoss,
        netProfit: totalProfit - totalLoss,
        profitFactor: totalLoss === 0 ? Infinity : totalProfit / totalLoss,
        averageTrade: trades.reduce((sum, t) => sum + t.netPnl, 0) / trades.length,
        averageProfit: profits.length > 0 ? totalProfit / profits.length : 0,
        averageLoss: losses.length > 0 ? totalLoss / losses.length : 0,
        maxDrawdown: this.calculateMaxDrawdown(),
        sharpeRatio: this.calculateSharpeRatio()
      };
  
      return metrics;
    }
  
    calculateMaxDrawdown() {
      let peak = -Infinity;
      let maxDrawdown = 0;
  
      for (const { value } of this.equity) {
        if (value > peak) peak = value;
        const drawdown = (peak - value) / peak * 100;
        if (drawdown > maxDrawdown) maxDrawdown = drawdown;
      }
  
      return maxDrawdown;
    }
  
    calculateSharpeRatio() {
      const returns = [];
      for (let i = 1; i < this.equity.length; i++) {
        const return_ = (this.equity[i].value - this.equity[i-1].value) / this.equity[i-1].value;
        returns.push(return_);
      }
  
      const averageReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      const stdDev = Math.sqrt(
        returns.reduce((a, b) => a + Math.pow(b - averageReturn, 2), 0) / returns.length
      );
  
      return stdDev === 0 ? 0 : (averageReturn / stdDev) * Math.sqrt(252); // Annualized
    }
  }
  
  export default Backtester;