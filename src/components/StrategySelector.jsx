// components/StrategySelector.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStrategy, setStrategyConfig } from '@/lib/redux/slices/accountSlice';
import { strategyRegistry } from '@/bot-trading/strategies';

const StrategySelector = () => {
  const dispatch = useDispatch();
  const { currentStrategy, strategyConfig, botRunning } = useSelector(state => state.account);

  const availableStrategies = strategyRegistry.getAvailableStrategies();

  const handleStrategyChange = (e) => {
    dispatch(setStrategy(e.target.value));
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    dispatch(setStrategyConfig({
      ...strategyConfig,
      [name]: parseFloat(value)
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-xs mb-1">Trading Strategy</h3>
        <select
          value={currentStrategy}
          onChange={handleStrategyChange}
          disabled={botRunning}
          className="w-full h-10 p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          {availableStrategies.map(strategy => (
            <option key={strategy} value={strategy}>
              {strategyRegistry.get(strategy).getName()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold text-xs mb-1">Take Profit (%)</h3>
        <input
          type="number"
          name="tpPercentage"
          value={strategyConfig.tpPercentage}
          onChange={handleConfigChange}
          disabled={botRunning}
          min="0.1"
          step="0.1"
          className="w-full h-10 p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      <div>
        <h3 className="font-semibold text-xs mb-1">Stop Loss (%)</h3>
        <input
          type="number"
          name="slPercentage"
          value={strategyConfig.slPercentage}
          onChange={handleConfigChange}
          disabled={botRunning}
          min="0.1"
          step="0.1"
          className="w-full h-10 p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>
    </div>
  );
};

export default StrategySelector;