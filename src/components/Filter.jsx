'use client'

import marketService from "@/bot-trading/services/market";
import { setAmount, setCategory, setInterval, setSymbol } from "@/lib/redux/slices/filterSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const categories = ["spot", "linear"];
const intervals = [1, 3, 5, 15, 30, 60, 120, 240, 360, 720, "D", "M", "W"];

const Filter = () => {
  const [symbols, setSymbols] = useState([]);

  const dispatch = useDispatch();

  const { category, symbol, interval, amount} = useSelector((state) => state.filter.category);

  const fetchSymbols = async () => {
    try {
      const data = await marketService.getAllSymbol(category);
      setSymbols(data || []);
    } catch (error) {
      console.error("Error fetching kline data:", error);
    }
  }

  useEffect(() => {
    fetchSymbols(category);
  }, [category]);

  const handleCategoryChange = (e) => {
    dispatch(setCategory(e.target.value));
  };

  const handleSymbolChange = (e) => {
    dispatch(setSymbol(e.target.value));
  };

  const handleIntervalChange = (e) => {
    dispatch(setInterval(e.target.value));
  };

  const handleAmountChange = (e) => {
    dispatch(setAmount(e.target.value));
  };

  return (
    <div className="p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Market Selection</h2>
      <div className="space-y-4 text-black">
        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full p-2 border rounded"
            value={category}
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Symbol Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Symbol</label>
          <select
            className="w-full p-2 border rounded"
            value={symbol}
            onChange={handleSymbolChange}
          >
            {symbols.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </div>

        {/* Interval Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Interval</label>
          <select
            className="w-full p-2 border rounded"
            value={interval}
            onChange={handleIntervalChange}
          >
            {intervals.map((interval) => (
              <option key={interval} value={interval}>
                {interval}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input type="number" className="w-full p-2 border rounded" value={amount} onChange={handleAmountChange} defaultValue={0.1} />
        </div>
      </div>
    </div>
  );
};

export default Filter;
