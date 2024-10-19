import { createSlice } from "@reduxjs/toolkit";
import {
  createMatch,
  getAllMatches,
  getMatchByID,
  updateMatch,
} from "../thunks/matchThunk";

const matchSlice = createSlice({
  name: "match",
  initialState: {
    matches: [],
    match: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearMatch: (state) => {
      state.match = null;
      state.loading = false;
      state.error = null;
      state.matches = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload.sort((a, b) => {
          if (a.week === b.week) {
            return a.day - b.day; // Jika week sama, urutkan berdasarkan day
          }
          return a.week - b.week; // Urutkan berdasarkan week
        });
      })
      .addCase(getAllMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMatchByID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMatchByID.fulfilled, (state, action) => {
        state.loading = false;
        state.match = action.payload;
      })
      .addCase(getMatchByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMatch.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMatch.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducer
export const { clearMatch } = matchSlice.actions;
export default matchSlice.reducer;
