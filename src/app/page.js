"use client";

import Account from "@/components/Account";
import MarketData from "@/components/Chart";
import Position from "@/components/Position";
import BacktestResults from "@/components/BacktestResult";
import ProviderWrapper from "@/components/ProviderWrapper";
import React from "react";

const Page = () => {
  return (
    <ProviderWrapper>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        {/* Header */}
        <header className="bg-gray-800 shadow p-4">
          <h1 className="text-2xl font-bold text-gray-100">Market Dashboard</h1>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 bg-gray-800 rounded-lg shadow p-4 space-y-4">
            <Account />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            <div className="bg-gray-800 rounded-lg shadow p-4">
              <MarketData />
            </div>
            <div className="bg-gray-800 rounded-lg shadow p-4">
              <Position />
            </div>
            {/* New Backtesting Section */}
            <div className="bg-gray-800 rounded-lg shadow p-4">
              <BacktestResults />
            </div>
          </main>
        </div>
      </div>
    </ProviderWrapper>
  );
};

export default Page;