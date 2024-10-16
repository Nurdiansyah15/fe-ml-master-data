import { createSlice } from "@reduxjs/toolkit";
import {
  createPlayerInTeam,
  getAllPlayersInMatchTeam,
  getAllPlayersInTeam,
  updatePlayerInTeam,
} from "../thunks/teamThunk";

const playerSlice = createSlice({
  name: "player",
  initialState: {
    players: [],
    player: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPlayer: (state) => {
      state.player = null;
      state.loading = false;
      state.error = null;
      state.players = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPlayersInTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPlayersInTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.players = action.payload;
      })
      .addCase(getAllPlayersInTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPlayerInTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlayerInTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createPlayerInTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePlayerInTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlayerInTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updatePlayerInTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearPlayer } = playerSlice.actions;
export default playerSlice.reducer;
