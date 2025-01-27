import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import accountReducer from './slices/accountSlice';

const store = configureStore({
  reducer: {
    filter: filterReducer,
    account: accountReducer
  },
});

export default store;
