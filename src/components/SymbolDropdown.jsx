import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "@/lib/redux/slices/filterSlice";

const SymbolDropdown = ({ symbolData, currentSymbol, onChange }) => {
  const search = useSelector((state) => state.filter.search);
  const dispatch = useDispatch();

  const filteredSymbols = symbolData.filter((symbol) =>
    symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        className="w-full p-2 mb-2 border rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
        placeholder="Search symbol..."
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
      />
      <select
        className="w-full p-2 border rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
        value={currentSymbol}
        onChange={onChange}
      >
        {filteredSymbols.map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SymbolDropdown;
