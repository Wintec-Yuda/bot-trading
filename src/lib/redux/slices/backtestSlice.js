import { createSlice } from "@reduxjs/toolkit";

const today = new Date();
const todayFormatter = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 16);

const threeMonthsAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
const threeMonthsAgoFormatter = new Date(threeMonthsAgo.getTime() - threeMonthsAgo.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 16);

const initialState = {
  results: null,
  symbol: "BTCUSDT",
  params: {
    strategyName: "simple",
    symbol: "BTCUSDT",
    interval: "720",
    initialBalance: "10",
    leverage: "10",
    startDate: threeMonthsAgoFormatter,
    endDate: todayFormatter,
    strategyConfig: {
      tpPercentage: "100",
      slPercentage: "30",
      isRangeTP: false,
      isRangeSL: false,
    },
  },
};

const backtestSlice = createSlice({
  name: "backtest",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setSymbol: (state, action) => {
      state.symbol = action.payload;
      state.params.symbol = action.payload;
    },
    setParams: (state, action) => {
      state.params = { ...state.params, ...action.payload };
    },
    setStrategyConfig: (state, action) => {
      state.params.strategyConfig = {
        ...state.params.strategyConfig,
        ...action.payload,
      };
    },
  },
});

export const {
  setLoading,
  setResults,
  setError,
  setIsModalOpen,
  setSymbol,
  setParams,
  setStrategyConfig,
} = backtestSlice.actions;

export default backtestSlice.reducer;
