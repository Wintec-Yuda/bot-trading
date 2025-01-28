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

export const { setKlineData, setSymbolData } = marketSlice.actions;

export default marketSlice.reducer;