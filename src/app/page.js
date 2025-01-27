"use client";

import React, { useEffect, useState } from "react";
import accountService from "@/bot-trading/services/account";
import tradeService from "@/bot-trading/services/trade";
const Page = () => {
  const [symbols, setSymbols] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("linear");
  const [selectedSymbol, setSelectedSymbol] = useState("XRPUSD");
  const [klineData, setKlineData] = useState([]);
  const [botStatus, setBotStatus] = useState("Idle");
  const [lastRSI, setLastRSI] = useState(null);
  const [lastSignal, setLastSignal] = useState(null);
  const [balance, setBalance] = useState(null);
  const [orderAmount, setOrderAmount] = useState("0.1");
  const [autotradingEnabled, setAutotradingEnabled] = useState(false);

  const fetchBalance = async () => {
    const balanceData = await accountService.getAccountBalance();
    setBalance(balanceData);
  };

  const handleManualTrade = async (side) => {
    setBotStatus("Manual Trading");
    const result = await tradeService.placeOrder(
      selectedSymbol,
      side,
      orderAmount
    );
    if (result?.retCode === 0) {
      setBotStatus(`Manual ${side} Order Placed`);
      fetchBalance();
    } else {
      setBotStatus("Trade Failed");
    }
    setTimeout(
      () => setBotStatus(autotradingEnabled ? "Auto Trading" : "Idle"),
      3000
    );
  };

  const requestDemoFunds = async () => {
    setBotStatus("Requesting Demo Funds");
    const result = await tradingBot.requestDemoFunds();
    if (result?.retCode === 0) {
      setBotStatus("Demo Funds Added");
      fetchBalance();
    } else {
      setBotStatus("Fund Request Failed");
    }
    setTimeout(
      () => setBotStatus(autotradingEnabled ? "Auto Trading" : "Idle"),
      3000
    );
  };

  useEffect(() => {
    fetchSymbols();
    fetchBalance();
    const intervalId = setInterval(fetchKlineData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchKlineData();
  }, [selectedSymbol, selectedCategory]);

  useEffect(() => {
    if (klineData.length > 0) {
      setBotStatus("Analyzing");
      tradingBot.analyze(klineData).then((signal) => {
        setLastSignal(signal);
        setLastRSI(signal.rsi.toFixed(2));

        if (autotradingEnabled && signal.action !== "HOLD") {
          tradingBot
            .placeOrder(
              selectedSymbol,
              signal.action === "BUY" ? "Buy" : "Sell",
              orderAmount
            )
            .then(() => {
              fetchBalance();
              setBotStatus("Auto Trading");
            });
        } else {
          setBotStatus(autotradingEnabled ? "Auto Trading" : "Idle");
        }
      });
    }
  }, [klineData, autotradingEnabled]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Trading Bot Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Trading Controls</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Order Amount:</label>
              <input
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                className="w-32 p-2 border rounded"
                step="0.01"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto Trading:</label>
              <input
                type="checkbox"
                checked={autotradingEnabled}
                onChange={(e) => setAutotradingEnabled(e.target.checked)}
                className="form-checkbox h-5 w-5"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleManualTrade("Buy")}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Manual Buy
              </button>
              <button
                onClick={() => handleManualTrade("Sell")}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Manual Sell
              </button>
            </div>
            <button
              onClick={requestDemoFunds}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Request Demo Funds
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="font-bold">Bot Status: </span>
            <span
              className={`px-2 py-1 rounded ${
                botStatus.includes("Trading")
                  ? "bg-green-100 text-green-800"
                  : botStatus === "Analyzing"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {botStatus}
            </span>
          </div>
          <div>
            <span className="font-bold">RSI: </span>
            <span
              className={
                lastRSI > 70
                  ? "text-red-600"
                  : lastRSI < 30
                  ? "text-green-600"
                  : "text-gray-600"
              }
            >
              {lastRSI || "Calculating..."}
            </span>
          </div>
          <div>
            <span className="font-bold">Signal: </span>
            <span
              className={
                lastSignal?.action === "BUY"
                  ? "text-green-600"
                  : lastSignal?.action === "SELL"
                  ? "text-red-600"
                  : "text-gray-600"
              }
            >
              {lastSignal?.action || "None"}
            </span>
          </div>
          <div>
            <div>
              <span className="font-bold">Wallet Balance: </span>
              <span>
                {Number(balance?.walletBalance).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                USDT
              </span>
            </div>
            <div>
              <span className="font-bold">Margin Balance: </span>
              <span>
                {Number(balance?.marginBalance).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                USDT
              </span>
            </div>
            <div>
              <span className="font-bold">Available Balance: </span>
              <span>
                {Number(balance?.availableBalance).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                USDT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
