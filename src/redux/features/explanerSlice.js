import { createSlice } from "@reduxjs/toolkit";
import { getAllExplaners } from "../thunks/gameThunk";

const explanerSlice = createSlice({
  name: "explaner",
  initialState: {
    explaners: [],
    explaner: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearExplaner: (state) => {
      state.explaner = null;
      state.loading = false;
      state.error = null;
      state.explaners = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllExplaners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllExplaners.fulfilled, (state, action) => {
        state.loading = false;
        state.explaners = action.payload;
      })
      .addCase(getAllExplaners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducer
export const { clearExplaner } = explanerSlice.actions;
export default explanerSlice.reducer;
