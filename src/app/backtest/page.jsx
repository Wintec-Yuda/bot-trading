'use client';

import React, { useState } from "react";
import backtestService from "@/bot-trading/backtesting/services/backtestService";
import { strategyRegistry } from "@/bot-trading/strategies";
import SymbolModal from "@/components/SymbolModal";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ResultBacktesting from "@/components/backtesting/ResultBacktesting";
import { setParams, setResults, setSymbol } from "@/lib/redux/slices/backtestSlice";
import DateFormBacktesting from "@/components/backtesting/DateFormBacktesting";
import PercentageFormBacktesting from "@/components/backtesting/PercentageFormBacktesting";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  
  const params = useSelector((state) => state.backtest.params);
  const symbol = useSelector((state) => state.backtest.symbol);

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setParams({ [name]: value }));
  };

  const getNumericValue = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const runBacktest = async () => {
    setLoading(true);
    setError(null);
    try {
      const parsedParams = {
        ...params,
        initialBalance: getNumericValue(params.initialBalance),
        leverage: getNumericValue(params.leverage),
        strategyConfig: {
          tpPercentage: getNumericValue(params.strategyConfig.tpPercentage),
          slPercentage: getNumericValue(params.strategyConfig.slPercentage),
        },
      };

      const results = await backtestService.runBacktest(parsedParams);
      dispatch(setResults(results));
    } catch {
      toast.error('Failed to run backtest');
    } finally {
      setLoading(false);
    }
  };

  const handleSymbolChange = (data) => {
    dispatch(setSymbol(data));
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen space-y-6 bg-gray-900 text-gray-100 p-6">
      {/* Configuration Panel */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Backtest Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           <div>
            <label className="block text-sm font-medium mb-1">
              Symbol
            </label>
            <button
              className="w-full py-1 ps-2 rounded text-gray-100 bg-gray-700 flex items-center gap-2"
              onClick={openModal}
            >
              <div className="text-xl mb-1">&#9776;</div>
              <div className="font-semibold">{symbol}</div>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Strategy</label>
            <select
              name="strategyName"
              value={params.strategyName}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
            >
              {strategyRegistry.getAvailableStrategies().map((strategy) => (
                <option key={strategy} value={strategy}>
                  {strategyRegistry.get(strategy).getName()}
                </option>
              ))}
            </select>
          </div>

           <div>
            <label className="block text-sm font-medium mb-1">
              Initial Balance
            </label>
            <input
              type="number"
              name="initialBalance"
              value={params.initialBalance}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
            />
          </div>

          <PercentageFormBacktesting />

          <div>
            <label className="block text-sm font-medium mb-2">Leverage {params.leverage}x</label>
            <div className="relative">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={params.leverage}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #FACC15 ${
                      ((params.leverage - 1) / 49) * 100
                    }%, #374151 ${((params.leverage - 1) / 49) * 100}%)`,
                  }}
                />
              </div>

              <div className="relative w-full flex justify-between mt-2 mb-5">
                {[1, 10, 20, 30, 40, 50].map((value) => (
                  <div
                    key={value}
                    className="flex flex-col items-center"
                    style={{
                      position: "absolute",
                      left: `${((value - 1) / 49) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: params.leverage >= value ? "#FACC15" : "#6B7280",
                      }}
                    ></div>
                    <span className="mt-1 text-sm text-gray-400">{value}x</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Interval</label>
            <select
              name="interval"
              value={params.interval}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
            >
              <option value="15">15m</option>
              <option value="60">1h</option>
              <option value="120">2h</option>
              <option value="240">4h</option>
              <option value="360">6h</option>
              <option value="720">12h</option>
              <option value="D">1d</option>
              <option value="W">1w</option>
              <option value="M">1m</option>
            </select>
          </div>

          <DateFormBacktesting />

        </div>

        <button
          onClick={runBacktest}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md disabled:opacity-50"
        >
          {loading ? "Running..." : "Run Backtest"}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 text-red-200 rounded-md">
            {error}
          </div>
        )}
      </div>

      <ResultBacktesting />

      {/* Modal for Symbol Selection */}
      <SymbolModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        onChange={handleSymbolChange}
        future="linear"
      />
    </div>
  );
};

export default page;
