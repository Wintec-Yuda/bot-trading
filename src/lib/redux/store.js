import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import accountReducer from './slices/accountSlice';
import marketReducer from './slices/marketSlice';
import tradeReducer from './slices/tradeSlice';

const store = configureStore({
  reducer: {
    filter: filterReducer,
    account: accountReducer,
    market: marketReducer,
    trade: tradeReducer
  },
});

export default store;
