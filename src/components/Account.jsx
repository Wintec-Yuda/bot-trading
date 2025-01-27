'use client'

import accountService from "@/bot-trading/services/account";
import { setAvailableBalance, setBotRunning, setWalletBalance } from "@/lib/redux/slices/accountSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Account = () => {
  const { botRunning, walletBalance, availableBalance } = useSelector((state) => state.account);
  const dispatch = useDispatch();

  const handleBotRun = () => {
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
      const response = await accountService.getAccountBalance();
      dispatch(setWalletBalance(response.walletBalance));
      dispatch(setAvailableBalance(response.availableBalance));
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <div className="p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Trading Controls</h2>
      <h3>Bot Running: {botRunning ? "Yes" : "No"}</h3>
      <h4>Wallet Balance</h4>
      <p>{walletBalance}</p>
      <h4>Available Balance</h4>
      <p>{availableBalance}</p>
      <button
        onClick={handleBotRun}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Run Bot
      </button>
      <button
        onClick={handleRequestDemoFunds}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Request Demo Funds
      </button>
    </div>
  );
};

export default Account;
