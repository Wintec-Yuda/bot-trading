// lib/redux/slices/accountSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  walletBalance: '0',
  availableBalance: '0',
  marginBalance: '0',
  botRunning: false,
  currentStrategy: 'simple',
  strategyConfig: {
    tpPercentage: 2.0,
    slPercentage: 1.0
  }
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setWalletBalance: (state, action) => {
      state.walletBalance = action.payload;
    },
    setAvailableBalance: (state, action) => {
      state.availableBalance = action.payload;
    },
    setMarginBalance: (state, action) => {
      state.marginBalance = action.payload;
    },
    setBotRunning: (state, action) => {
      state.botRunning = action.payload;
    },
    setStrategy: (state, action) => {
      state.currentStrategy = action.payload;
    },
    setStrategyConfig: (state, action) => {
      state.strategyConfig = { ...state.strategyConfig, ...action.payload };
    }
  }
});

export const { 
  setWalletBalance, 
  setAvailableBalance, 
  setMarginBalance, 
  setBotRunning,
  setStrategy,
  setStrategyConfig 
} = accountSlice.actions;

export default accountSlice.reducer;