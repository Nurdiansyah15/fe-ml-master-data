import { createSlice } from "@reduxjs/toolkit";
import { getAllTeamsInMatch } from "../thunks/teamThunk";

const teamMatchSlice = createSlice({
  name: "teamMatch",
  initialState: {
    teams: [],
    team: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearTeam: (state) => {
      state.team = null;
      state.loading = false;
      state.error = null;
      state.teams = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTeamsInMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTeamsInMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(getAllTeamsInMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearTeam } = teamMatchSlice.actions;
export default teamMatchSlice.reducer;
