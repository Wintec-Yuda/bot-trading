import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  positionData: [],
};

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setPositionData: (state, action) => {
      state.positionData = action.payload;
    },
  },
});

export const { setPositionData } = tradeSlice.actions;

export default tradeSlice.reducer;