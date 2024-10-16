import { createSlice } from "@reduxjs/toolkit";
import { getAllCoachsInMatchTeam } from "../thunks/teamThunk";

const matchCoachSlice = createSlice({
  name: "matchCoach",
  initialState: {
    matchCoaches: [],
    matchCoach: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCoach: (state) => {
      state.matchCoach = null;
      state.loading = false;
      state.error = null;
      state.matchCoaches = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoachsInMatchTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoachsInMatchTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.matchCoaches = action.payload;
      })
      .addCase(getAllCoachsInMatchTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearPlayer } = matchCoachSlice.actions;
export default matchCoachSlice.reducer;
