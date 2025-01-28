// strategies/index.js
import strategyRegistry from './strategyRegistry';
import SimpleStrategy from './implementation/SimpleStrategy';
import RSIStrategy from './implementation/RSIStrategy';

// Register available strategies
strategyRegistry.register('simple', new SimpleStrategy());
strategyRegistry.register('rsi', new RSIStrategy());

export { strategyRegistry };