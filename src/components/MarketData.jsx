'use client'

import marketService from "@/bot-trading/services/market";
import { setKlineData } from "@/lib/redux/slices/marketSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const MarketData = () => {
  const [loading, setLoading] = useState(false);
  const {category, symbol, interval} = useSelector(state => state.filter);

  const klineData = useSelector(state => state.market.klineData);

  const dispatch = useDispatch();

  const fetchKlineData = async () => {
    setLoading(true);
    try {
      const data = await marketService.getAllKline({category, symbol, interval});
      dispatch(setKlineData(data));
    } catch (error) {
      console.error("Error fetching kline data:", error);
      setKlineData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKlineData();
    // Set up interval for real-time updates
    const intervalId = setInterval(fetchKlineData, 60000); // Update every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [category, symbol, interval]);

  if (loading && klineData.length === 0) {
    return (
      <div className="p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Market Data</h2>
        <div className="text-center py-4">Loading market data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Market Data</h2>
        <span className="text-sm text-gray-500">
          {symbol} - {interval}min
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-right">Open</th>
              <th className="px-4 py-2 text-right">High</th>
              <th className="px-4 py-2 text-right">Low</th>
              <th className="px-4 py-2 text-right">Close</th>
              <th className="px-4 py-2 text-right">Volume</th>
            </tr>
          </thead>
          <tbody>
            {klineData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  {new Date(Number(item[0])).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right font-mono">{Number(item[1]).toFixed(2)}</td>
                <td className="px-4 py-2 text-right font-mono">{Number(item[2]).toFixed(2)}</td>
                <td className="px-4 py-2 text-right font-mono">{Number(item[3]).toFixed(2)}</td>
                <td className="px-4 py-2 text-right font-mono">{Number(item[4]).toFixed(2)}</td>
                <td className="px-4 py-2 text-right font-mono">{Number(item[5]).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketData;