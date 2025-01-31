import React from "react";
import { useSelector } from "react-redux";
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
import MetricCard from "./MetricCard";

const ResultBacktesting = () => {
  const results = useSelector((state) => state.backtest.results);
  const params = useSelector((state) => state.backtest.params);

  return (
    results && (
      <div className="space-y-6">
        {/* Performance Metrics */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Return"
              value={
                results.performance?.netProfit
                  ? `${((results.performance.netProfit / params.initialBalance) *100).toFixed(2)}%`
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
                  ? `${results.performance.netProfit.toFixed(2)}$`
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
                    formatter={(value) => [`${value}`, "Equity"]}
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
                      `$
                      {Number(
                        trade.netPnl.toFixed(2)
                      ).toLocaleString("en-US")}
                      `
                    </td>
                    <td className="p-2">{trade.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  );
};

export default ResultBacktesting;
