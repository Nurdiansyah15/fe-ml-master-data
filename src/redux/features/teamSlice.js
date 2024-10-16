import { createSlice } from "@reduxjs/toolkit";
import {
  createTeam,
  getAllTeams,
  getTeamByID,
  updateTeam,
} from "../thunks/teamThunk";

const teamSlice = createSlice({
  name: "team",
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
      .addCase(getAllTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(getAllTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTeamByID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeamByID.fulfilled, (state, action) => {
        state.loading = false;
        state.team = action.payload;
      })
      .addCase(getTeamByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearTeam } = teamSlice.actions;
export default teamSlice.reducer;
