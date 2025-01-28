"use client";

import Account from "@/components/Account";
import MarketData from "@/components/Chart";
import Position from "@/components/Position";
import React from "react";
import { ToastContainer } from "react-toastify";

const Page = () => {
  return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-6">
          <aside className="lg:col-span-1 bg-gray-800 rounded-lg shadow p-4 space-y-4">
            <Account />
          </aside>
          <main className="lg:col-span-3 space-y-6">
            <div className="bg-gray-800 rounded-lg shadow p-4">
              <MarketData />
            </div>
            <div className="bg-gray-800 rounded-lg shadow p-4">
              <Position />
            </div>
          </main>
        </div>
        <ToastContainer />
      </div>
  );
};

export default Page;