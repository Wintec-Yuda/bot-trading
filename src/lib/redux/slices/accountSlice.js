import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  walletBalance: '0',
  availableBalance: '0',
  marginBalance: '0',
  botRunning: false
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
    }
  }
});

export const { setWalletBalance, setAvailableBalance, setMarginBalance, setBotRunning } = accountSlice.actions;

export default accountSlice.reducer;