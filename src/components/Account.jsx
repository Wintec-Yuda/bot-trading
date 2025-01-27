'use client'

import accountService from "@/bot-trading/services/account";
import botService from "@/bot-trading/services/botService";
import { setAvailableBalance, setBotRunning, setWalletBalance, setMarginBalance } from "@/lib/redux/slices/accountSlice";
import { setAmount, setCategory } from "@/lib/redux/slices/filterSlice";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const categories = ["spot", "linear"];

const Account = () => {
  const { botRunning, walletBalance, availableBalance, marginBalance } = useSelector((state) => state.account);
  const { symbol, interval, amount, category } = useSelector((state) => state.filter);
  const dispatch = useDispatch();

  const handleBotRun = useCallback(() => {
    if (!botRunning) {
      botService.start(category, symbol, interval, amount);
    } else {
      botService.stop();
    }
    dispatch(setBotRunning(!botRunning));
  }, [botRunning, category, symbol, interval, amount, dispatch]);

  const handleRequestDemoFunds = useCallback(async () => {
    try {
      const response = await accountService.requestDemoFunds();
      console.log(response);
    } catch (error) {
      console.error('Error requesting demo funds:', error);
    }
  }, []);

  const getBalance = useCallback(async () => {
    try {
      const response = await accountService.getAccountBalance(category);
      dispatch(setWalletBalance(response.walletBalance));
      dispatch(setAvailableBalance(response.availableBalance));
      dispatch(setMarginBalance(response.marginBalance));
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  }, [category, dispatch]);

  const handleCategoryChange = (selectedCategory) => {
    dispatch(setCategory(selectedCategory)); 
  };

  const handleAmountChange = (e) => {
    dispatch(setAmount(e.target.value)); 
  };

  // Fetch account balance when category or botRunning state changes
 useEffect(() => {
    getBalance();
  }, [category, getBalance]);

  // Cleanup bot on component unmount if bot is running
  useEffect(() => {
    return () => {
      if (botRunning) {
        botService.stop();
      }
    };
  }, [botRunning]);

  return (
    <div className="p-4 sm:p-6 rounded-lg shadow bg-white dark:bg-gray-800 space-y-4">
      {/* Category Buttons */}
      <div className="flex space-x-3 mb-4">
        {categories.map((c) => (
          <button
            key={c}
            className={`px-2 py-2 text-sm sm:text-base transition-all duration-300 ${
              category == c ? 'text-white border-b border-white' : 'text-white'
            }`}
            onClick={() => handleCategoryChange(c)}
            aria-pressed={category == c}
          >
            {c == 'spot' ? 'Spot' : 'Futures'}
          </button>
        ))}
      </div>

      {/* Account Info */}
      <div className="space-y-3 text-black dark:text-gray-300">
        <div className="flex justify-between text-xs mt-10">
          <h3 className="font-semibold">Bot Status</h3>
          <p className={`font-medium ${botRunning ? 'text-green-500' : 'text-red-500'}`}>
            {botRunning ? "Running" : "Stopped"}
          </p>
        </div>

        <div className="flex justify-between text-xs">
          <h3 className="font-semibold">Wallet Balance</h3>
          <p>{walletBalance} USDT</p>
        </div>

        {category !== 'spot' && (
          <>
            <div className="flex justify-between text-xs">
              <h3 className="font-semibold">Available Balance</h3>
              <p>{availableBalance} USDT</p>
            </div>
            <div className="flex justify-between text-xs">
              <h3 className="font-semibold">Margin Balance</h3>
              <p>{marginBalance} USDT</p>
            </div>
          </>
        )}

        {/* Amount Input */}
        <div className="text-sm sm:text-base">
          <h3 className="font-semibold text-xs mb-1">Set Amount (USDT)</h3>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="w-full h-10 p-2 text-sm sm:text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="Enter amount"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleBotRun}
            className="w-full bg-green-600 text-white px-5 py-2 rounded-full text-sm sm:text-base hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={botRunning ? 'Stop Bot' : 'Start Bot'}
          >
            {botRunning ? 'Stop Bot' : 'Start Bot'}
          </button>

          <button
            onClick={handleRequestDemoFunds}
            className="w-full bg-gray-700 text-white px-5 py-2 rounded-full text-sm sm:text-base hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Request Demo Funds"
          >
            Request Demo Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
