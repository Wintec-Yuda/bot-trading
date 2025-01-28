// strategies/strategyRegistry.js

/**
 * Registry for managing trading strategies
 */
class StrategyRegistry {
    constructor() {
      this.strategies = new Map();
    }
  
    /**
     * Register a new strategy
     * @param {string} name - Strategy name
     * @param {IStrategy} strategy - Strategy implementation
     */
    register(name, strategy) {
      this.strategies.set(name, strategy);
    }
  
    /**
     * Get a strategy by name
     * @param {string} name - Strategy name
     * @returns {IStrategy} Strategy implementation
     */
    get(name) {
      const strategy = this.strategies.get(name);
      if (!strategy) {
        throw new Error(`Strategy '${name}' not found`);
      }
      return strategy;
    }
  
    /**
     * Get list of available strategies
     * @returns {string[]} Array of strategy names
     */
    getAvailableStrategies() {
      return Array.from(this.strategies.keys());
    }
  }
  
  // Create singleton instance
  const strategyRegistry = new StrategyRegistry();
  
  export default strategyRegistry;