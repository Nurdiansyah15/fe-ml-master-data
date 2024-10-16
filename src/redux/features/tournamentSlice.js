import { createSlice } from "@reduxjs/toolkit";
import {
  createTournament,
  getAllTournaments,
  getTournamentByID,
  updateTournament,
} from "../thunks/tournamentThunk";

const tournamentsSlice = createSlice({
  name: "tournament",
  initialState: {
    tournaments: [],
    tournament: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearTournament: (state) => {
      state.tournament = null;
      state.loading = false;
      state.error = null;
      state.tournaments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTournaments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = action.payload;
      })
      .addCase(getAllTournaments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTournament.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTournament.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTournament.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTournament.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTournamentByID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTournamentByID.fulfilled, (state, action) => {
        state.loading = false;
        state.tournament = action.payload;
      })
      .addCase(getTournamentByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearTournament } = tournamentsSlice.actions;
export default tournamentsSlice.reducer;
