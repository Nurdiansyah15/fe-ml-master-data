import { createSlice } from "@reduxjs/toolkit";
import {
  createPlayerInMatchTeam,
  getAllPlayersInMatchTeam,
} from "../thunks/teamThunk";

const matchPlayerSlice = createSlice({
  name: "matchPlayer",
  initialState: {
    matchPlayers: [],
    matchPlayer: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPlayer: (state) => {
      state.matchPlayer = null;
      state.loading = false;
      state.error = null;
      state.matchPlayers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPlayersInMatchTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPlayersInMatchTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.matchPlayers = action.payload;
      })
      .addCase(getAllPlayersInMatchTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPlayerInMatchTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlayerInMatchTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createPlayerInMatchTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearPlayer } = matchPlayerSlice.actions;
export default matchPlayerSlice.reducer;
