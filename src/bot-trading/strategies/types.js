// strategies/types.js

/**
 * @typedef {Object} StrategyConfig
 * @property {number} tpPercentage - Take profit percentage
 * @property {number} slPercentage - Stop loss percentage
 * @property {Object} [additionalParams] - Strategy-specific parameters
 */

/**
 * @typedef {Object} Signal
 * @property {string} action - Trading action (BUY, SELL, HOLD)
 * @property {number} entryPrice - Entry price for the trade
 * @property {number|null} takeProfit - Take profit level
 * @property {number|null} stopLoss - Stop loss level
 * @property {string} reason - Reason for the signal
 */

/**
 * @typedef {Object} Position
 * @property {number} entryPrice - Position entry price
 * @property {number|null} takeProfit - Take profit level
 * @property {number|null} stopLoss - Stop loss level
 * @property {string} side - Position side (BUY/SELL)
 */

/**
 * Base Strategy Interface
 * All trading strategies should implement these methods
 */
class IStrategy {
    /**
     * Analyze market data and generate trading signals
     * @param {number[]} prices - Array of closing prices
     * @param {StrategyConfig} config - Strategy configuration
     * @returns {Signal} Trading signal
     */
    analyze(prices, config) {
      throw new Error('analyze method must be implemented');
    }
  
    /**
     * Monitor active positions for exit signals
     * @param {number} currentPrice - Current market price
     * @param {Position} position - Active position details
     * @returns {Signal|null} Exit signal if conditions are met
     */
    monitorPosition(currentPrice, position) {
      throw new Error('monitorPosition method must be implemented');
    }
  
    /**
     * Get strategy name
     * @returns {string} Strategy name
     */
    getName() {
      throw new Error('getName method must be implemented');
    }
  }
  
  export { IStrategy };