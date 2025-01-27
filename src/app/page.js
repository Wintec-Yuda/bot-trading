"use client";

import Account from "@/components/Account";
import Filter from "@/components/Filter";
import MarketData from "@/components/MarketData";
import ProviderWrapper from "@/components/ProviderWrapper";
import React from "react";

const page = () => {
  return (
    <ProviderWrapper>
      <div>
        <Account />
        <Filter />
        <MarketData />
      </div>
    </ProviderWrapper>
  );
};

export default page;
