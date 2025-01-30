import { setStrategyConfig } from "@/lib/redux/slices/backtestSlice";
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

const PercentageFormBacktesting = () => {
  const dispatch = useDispatch();
  const params = useSelector((state) => state.backtest.params);

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    dispatch(setStrategyConfig({ [name]: value }));
  };

  return (
    <Fragment>
      <div>
        <label className="block text-sm font-medium mb-1">Take Profit %</label>
        <input
          type="number"
          name="tpPercentage"
          value={params.strategyConfig.tpPercentage}
          onChange={handleConfigChange}
          step="0.1"
          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Stop Loss %</label>
        <input
          type="number"
          name="slPercentage"
          value={params.strategyConfig.slPercentage}
          onChange={handleConfigChange}
          step="0.1"
          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
        />
      </div>
    </Fragment>
  );
};

export default PercentageFormBacktesting;
