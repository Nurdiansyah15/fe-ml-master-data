import { createSlice } from "@reduxjs/toolkit";
import { getAllTrioMids, getTrioMidResult } from "../thunks/gameThunk";

const trioMidSlice = createSlice({
  name: "trioMid",
  initialState: {
    trioMids: [],
    trioMid: null,
    trioMidResult: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearTrioMid: (state) => {
      state.trioMid = null;
      state.loading = false;
      state.error = null;
      state.trioMids = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTrioMids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTrioMids.fulfilled, (state, action) => {
        state.loading = false;
        state.trioMids = action.payload;
      })
      .addCase(getAllTrioMids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTrioMidResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrioMidResult.fulfilled, (state, action) => {
        state.loading = false;
        state.trioMidResult = action.payload;
      })
      .addCase(getTrioMidResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducer
export const { clearTrioMid } = trioMidSlice.actions;
export default trioMidSlice.reducer;
