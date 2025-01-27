import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  category: 'spot',
  symbol: 'BTCUSDT',
  amount: '0.1',
  interval: '1',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSymbol: (state, action) => {
      state.symbol = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setInterval: (state, action) => {
      state.interval = action.payload;
    },
  },
});

// Export actions
export const { setCategory, setSymbol, setAmount, setInterval } = filterSlice.actions;

// Export the reducer
export default filterSlice.reducer;
