import { setCategory, setSymbol } from "@/lib/redux/slices/filterSlice";
import React from "react";
import { useDispatch } from "react-redux";

const categories = ["linear", "spot"];
const intervals = [1, 3, 5, 15, 30, 60, 120, 240, 360, 720, "D", "M", "W"];

const Filter = () => {
  const dispatch = useDispatch();

  const category = useSelector((state) => state.filter.category);
  const symbol = useSelector((state) => state.filter.symbol);
  const interval = useSelector((state) => state.filter.interval);

  const handleCategoryChange = (e) => {
    dispatch(setCategory(e.target.value));
  };

  const handleSymbolChange = (e) => {
    dispatch(setSymbol(e.target.value));
  };

  const handleIntervalChange = (e) => {
    dispatch(setInterval(e.target.value));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Market Selection</h2>
      <div className="space-y-4">
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
            value={selectedInterval}
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
          <select
            className="w-full p-2 border rounded"
            value={selectedAmount}
            onChange={handleAmountChange}
          >
            {amounts.map((amount) => (
              <option key={amount} value={amount}>
                {amount}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filter;
