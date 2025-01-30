import React from "react";
import SymbolDropdown from "./SymbolDropdown";

const SymbolModal = ({ isModalOpen, closeModal, onChange, future }) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 px-6 pb-4 pt-2 rounded-lg w-full md:w-1/3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Select Symbol</h2>
          <button
            onClick={closeModal}
            className="text-xl font-bold cursor-pointer text-gray-100 dark:text-white"
          >
            &times;
          </button>
        </div>
        <SymbolDropdown
          onChange={onChange}
          future={future}
        />
      </div>
    </div>
  );
};

export default SymbolModal;
