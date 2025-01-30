import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "@/lib/redux/slices/filterSlice";

const SymbolDropdown = ({ symbolData, currentSymbol, onChange }) => {
  const search = useSelector((state) => state.filter.search);
  const dispatch = useDispatch();

  // Filter symbols based on the search query
  const filteredSymbols = symbolData.filter((symbol) =>
    symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handleButtonClick = (symbol) => {
    onChange(symbol); // Update the selected symbol
  };

  return (
    <div className="p-4">
      <input
        type="text"
        className="w-full p-2 mb-2 border rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
        placeholder="Search symbol..."
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
      />

      {/* Display all symbols initially, and filtered symbols when search is typed */}
      <div
        className="bg-white border rounded mt-2 shadow-lg dark:bg-gray-700 dark:border-gray-600"
        style={{ maxHeight: "200px", overflowY: "auto" }} // Set max-height and enable scroll
      >
        {(search ? filteredSymbols : symbolData).map((symbol) => (
          <button
            key={symbol}
            onClick={() => handleButtonClick(symbol)}
            className="w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {symbol}
          </button>
        ))}

        {/* If no results found in the filtered list */}
        {search && filteredSymbols.length === 0 && (
          <p className="p-2 text-gray-500 dark:text-gray-300">No symbols found</p>
        )}
      </div>
    </div>
  );
};

export default SymbolDropdown;
