class StrategyRegistry {
    constructor() {
      this.strategies = new Map();
    }
  
    register(name, strategy) {
      this.strategies.set(name, strategy);
    }
  
    get(name) {
      const strategy = this.strategies.get(name);
      if (!strategy) {
        throw new Error(`Strategy '${name}' not found`);
      }
      return strategy;
    }
  
    getAvailableStrategies() {
      return Array.from(this.strategies.keys());
    }
  }
  
  // Create singleton instance
  const strategyRegistry = new StrategyRegistry();
  
  export default strategyRegistry;