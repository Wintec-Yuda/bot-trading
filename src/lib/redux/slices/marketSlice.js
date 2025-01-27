import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  klineData: [],
  symbolData: [],
}

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setKlineData: (state, action) => {
      state.klineData = action.payload;
    },
    setSymbolData: (state, action) => {
      state.symbolData = action.payload;
    },
  },
});

// Export actions
export const { setKlineData, setSymbolData } = marketSlice.actions;

// Export the reducer
export default marketSlice.reducer;