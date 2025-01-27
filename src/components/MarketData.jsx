'use client'

import marketService from "@/bot-trading/services/market";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MarketData = () => {
  const [klineData, setKlineData] = useState([]);

  const {category, symbol, interval} = useSelector(state => state.filter);

  const fetchKlineData = async () => {
    try {
      const data = await marketService.getAllKline(category, symbol, interval);
      setKlineData(data || []);
    } catch (error) {
      console.error("Error fetching kline data:", error);
    }
  };

  useEffect(() => {
    fetchKlineData();
  }, [category, symbol, interval]);

  return (
    <div className="p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Market Data</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="">
            <tr>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Open</th>
              <th className="px-4 py-2 text-left">High</th>
              <th className="px-4 py-2 text-left">Low</th>
              <th className="px-4 py-2 text-left">Close</th>
              <th className="px-4 py-2 text-left">Volume</th>
            </tr>
          </thead>
          <tbody>
            {klineData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">
                  {new Date(Number(item[0])).toLocaleString()}
                </td>
                <td className="px-4 py-2">{item[1]}</td>
                <td className="px-4 py-2">{item[2]}</td>
                <td className="px-4 py-2">{item[3]}</td>
                <td className="px-4 py-2">{item[4]}</td>
                <td className="px-4 py-2">{item[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketData;
