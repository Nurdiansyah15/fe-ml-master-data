import { createSlice } from "@reduxjs/toolkit";
import { createTrioMid, getAllTrioMids, updateTrioMid } from "../thunks/trioMidThunk";

const trioMidSlice = createSlice({
    name: "trioMid",
    initialState: {
      trioMids: [],
      trioMid: null,
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
        .addCase(createTrioMid.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createTrioMid.fulfilled, (state, action) => {
          state.loading = false;
          state.trioMid = action.payload;
        })
        .addCase(createTrioMid.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(updateTrioMid.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateTrioMid.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(updateTrioMid.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  // Export reducer
  export const { clearTrioMid } = trioMidSlice.actions;
  export default trioMidSlice.reducer;