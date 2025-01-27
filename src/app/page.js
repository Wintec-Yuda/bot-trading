"use client";

import Account from "@/components/Account";
import Filter from "@/components/Filter";
import MarketData from "@/components/MarketData";
import Position from "@/components/Position";
import ProviderWrapper from "@/components/ProviderWrapper";
import React from "react";

const page = () => {
  return (
    <ProviderWrapper>
      <div className="space-y-4">
        <Account />
        <Filter />
        <Position />
        <MarketData />
      </div>
    </ProviderWrapper>
  );
};

export default page;