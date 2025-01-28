'use client';

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import backtestService from "@/bot-trading/backtesting/services/backtestService";
import { strategyRegistry } from "@/bot-trading/strategies";
import SymbolModal from "@/components/SymbolModal";
import { useSelector } from "react-redux";

const BacktestResults = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [params, setParams] = useState({
    strategyName: "simple",
    symbol: symbol,
    interval: "15",
    initialBalance: "10000",
    startDate: "",
    endDate: "",
    strategyConfig: {
      tpPercentage: "2.0",
      tpPercentageMax: "",
      slPercentage: "1.0",
      slPercentageMax: "",
      isRangeTP: false,
      isRangeSL: false,
    },
  });

  const symbolData = useSelector((state) => state.market.symbolData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      strategyConfig: {
        ...prev.strategyConfig,
        [name]: value || "",
      },
    }));
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
        strategyConfig: {
          tpPercentage: getNumericValue(params.strategyConfig.tpPercentage),
          slPercentage: getNumericValue(params.strategyConfig.slPercentage),
        },
      };

      const results = await backtestService.runBacktest(parsedParams);
      setResults(results);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium mb-1">
              Take Profit %
            </label>
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
            <label className="block text-sm font-medium mb-1">
              Stop Loss %
            </label>
            <input
              type="number"
              name="slPercentage"
              value={params.strategyConfig.slPercentage}
              onChange={handleConfigChange}
              step="0.1"
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
            />
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

          <div>
            <label className="block text-sm font-medium mb-1">Interval</label>
            <select
              name="interval"
              value={params.interval}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
            >
              <option value="5">5m</option>
              <option value="15">15m</option>
              <option value="60">1h</option>
              <option value="240">4h</option>
              <option value="D">1d</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="datetime-local"
              name="startDate"
              value={params.startDate || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="datetime-local"
              name="endDate"
              value={params.endDate || ""}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
            />
          </div>
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

      {/* Results Panel */}
      {results && (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                title="Total Return"
                value={
                  results.performance?.netProfit
                    ? `${(
                        (results.performance.netProfit /
                          params.initialBalance) *
                        100
                      ).toFixed(2)}%`
                    : "N/A"
                }
              />
              <MetricCard
                title="Win Rate"
                value={
                  results.performance?.winRate
                    ? `${results.performance.winRate.toFixed(2)}%`
                    : "N/A"
                }
              />
              <MetricCard
                title="Profit Factor"
                value={
                  results.performance?.profitFactor
                    ? results.performance.profitFactor.toFixed(2)
                    : "N/A"
                }
              />
              <MetricCard
                title="Max Drawdown"
                value={
                  results.performance?.maxDrawdown
                    ? `${results.performance.maxDrawdown.toFixed(2)}%`
                    : "N/A"
                }
              />
              <MetricCard
                title="Total Trades"
                value={results.performance?.totalTrades ?? "N/A"}
              />
              <MetricCard
                title="Average Trade"
                value={
                  results.performance?.averageTrade
                    ? `${results.performance.averageTrade.toFixed(2)}`
                    : "N/A"
                }
              />
              <MetricCard
                title="Sharpe Ratio"
                value={
                  results.performance?.sharpeRatio
                    ? results.performance.sharpeRatio.toFixed(2)
                    : "N/A"
                }
              />
              <MetricCard
                title="Net Profit"
                value={
                  results.performance?.netProfit
                    ? `${results.performance.netProfit.toFixed(2)}`
                    : "N/A"
                }
              />
            </div>
          </div>

          {/* Equity Curve */}
          {results.performance?.equityCurve?.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Equity Curve</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.performance.equityCurve}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(timestamp) =>
                        new Date(timestamp).toLocaleDateString()
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(timestamp) =>
                        new Date(timestamp).toLocaleString()
                      }
                      formatter={(value) => [`${value.toFixed(2)}`, "Equity"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="equity"
                      stroke="#4CAF50"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Trade History */}
          {results.trades?.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">Trade History</h3>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Entry Time</th>
                    <th className="text-left p-2">Exit Time</th>
                    <th className="text-left p-2">Side</th>
                    <th className="text-right p-2">Entry Price</th>
                    <th className="text-right p-2">Exit Price</th>
                    <th className="text-right p-2">Net P/L</th>
                    <th className="text-left p-2">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {results.trades?.map((trade, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="p-2">
                        {new Date(trade.entryTime).toLocaleString()}
                      </td>
                      <td className="p-2">
                        {new Date(trade.exitTime).toLocaleString()}
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded ${
                            trade.side === "BUY"
                              ? "bg-green-900/50"
                              : "bg-red-900/50"
                          }`}
                        >
                          {trade.side}
                        </span>
                      </td>
                      <td className="text-right p-2">
                        ${trade.entryPrice.toFixed(2)}
                      </td>
                      <td className="text-right p-2">
                        ${trade.exitPrice.toFixed(2)}
                      </td>
                      <td
                        className={`text-right p-2 ${
                          trade.netPnl >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        ${trade.netPnl.toFixed(2)}
                      </td>
                      <td className="p-2">{trade.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* Modal for Symbol Selection */}
      <SymbolModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        symbolData={symbolData}
        currentSymbol={symbol}
        onChange={handleSymbolChange}
      />
    </div>
  );
};

const MetricCard = ({ title, value }) => (
  <div className="p-4 bg-gray-700 rounded-lg">
    <h4 className="text-sm text-gray-400 mb-1">{title}</h4>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

export default BacktestResults;
