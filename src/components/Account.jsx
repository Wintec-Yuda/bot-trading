'use client'

import accountService from "@/bot-trading/services/account";
import botService from "@/bot-trading/services/botService";
import { setAvailableBalance, setBotRunning, setWalletBalance, setMarginBalance } from "@/lib/redux/slices/accountSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Account = () => {
  const { botRunning, walletBalance, availableBalance, marginBalance } = useSelector((state) => state.account);
  const { category, symbol, interval, amount } = useSelector((state) => state.filter);
  const dispatch = useDispatch();

  const handleBotRun = () => {
    if (!botRunning) {
      // Start the bot
      botService.start(category, symbol, interval, amount);
    } else {
      // Stop the bot
      botService.stop();
    }
    dispatch(setBotRunning(!botRunning));
  };

  const handleRequestDemoFunds = async () => {
    try {
      const response = await accountService.requestDemoFunds();
      console.log(response);
    } catch (error) {
      console.error('Error requesting demo funds:', error);
    }
  };

  const getBalance = async () => {
    try {
      const response = await accountService.getAccountBalance(category);
      dispatch(setWalletBalance(response.walletBalance));
      dispatch(setAvailableBalance(response.availableBalance));
      dispatch(setMarginBalance(response.marginBalance));
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  useEffect(() => {
    getBalance();
  }, [category]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (botRunning) {
        botService.stop();
      }
    };
  }, []);

  return (
    <div className="p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Trading Controls</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Bot Status</h3>
          <p>{botRunning ? "Running" : "Stopped"}</p>
        </div>

        <div>
          <h3 className="font-medium">Wallet Balance</h3>
          <p>{walletBalance} USDT</p>
        </div>

        {category !== 'spot' && (
          <>
            <div>
              <h3 className="font-medium">Available Balance</h3>
              <p>{availableBalance} USDT</p>
            </div>
            <div>
              <h3 className="font-medium">Margin Balance</h3>
              <p>{marginBalance} USDT</p>
            </div>
          </>
        )}

        <div className="space-y-2">
          <button
            onClick={handleBotRun}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {botRunning ? 'Stop Bot' : 'Start Bot'}
          </button>
          
          <button
            onClick={handleRequestDemoFunds}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Request Demo Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;