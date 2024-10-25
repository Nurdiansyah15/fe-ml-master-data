import { createSlice } from "@reduxjs/toolkit";
import { getAllGoldlaners } from "../thunks/gameThunk";

const goldlanerSlice = createSlice({
  name: "goldlaner",
  initialState: {
    goldlaners: [],
    goldlaner: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearGoldlaner: (state) => {
      state.goldlaner = null;
      state.loading = false;
      state.error = null;
      state.goldlaners = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllGoldlaners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllGoldlaners.fulfilled, (state, action) => {
        state.loading = false;
        state.goldlaners = action.payload;
      })
      .addCase(getAllGoldlaners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducer
export const { clearGoldlaner } = goldlanerSlice.actions;
export default goldlanerSlice.reducer;
