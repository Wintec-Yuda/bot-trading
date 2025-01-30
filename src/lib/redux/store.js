import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import accountReducer from './slices/accountSlice';
import marketReducer from './slices/marketSlice';
import tradeReducer from './slices/tradeSlice';
import backtestReducer from './slices/backtestSlice';

const store = configureStore({
  reducer: {
    filter: filterReducer,
    account: accountReducer,
    market: marketReducer,
    trade: tradeReducer,
    backtest: backtestReducer,
  },
});

export default store;
