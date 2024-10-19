import { createSlice } from "@reduxjs/toolkit";
import { addLordResult, getAllLordResults, updateLordResult } from "../thunks/lordThunk";

const lordSlice = createSlice({
  name: "lord",
  initialState: {
    lords: [],
    loading: false,
    lord: null,
    error: null,
  },
  reducers: {
    clearLord: (state) => {
      state.lord = null;
      state.loading = false;
      state.error = null;
      state.lords = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllLordResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLordResults.fulfilled, (state, action) => {
        state.loading = false;
        state.lords = action.payload;
      })
      .addCase(getAllLordResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addLordResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLordResult.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addLordResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLordResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLordResult.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateLordResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearLord } = lordSlice.actions;
export default lordSlice.reducer;
