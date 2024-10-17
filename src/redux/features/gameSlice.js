  import { createSlice } from "@reduxjs/toolkit";
  import {
    createMatchGame,
    getAllMatchGames,
    updateGame,
  } from "../thunks/gameThunk";

  const gameSlice = createSlice({
    name: "game",
    initialState: {
      games: [],
      game: null,
      loading: false,
      error: null,
    },
    reducers: {
      clearGame: (state) => {
        state.games = [];
        state.game = null;
        state.loading = false;
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getAllMatchGames.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getAllMatchGames.fulfilled, (state, action) => {
          state.loading = false;
          state.games = action.payload;
        })
        .addCase(getAllMatchGames.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(createMatchGame.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createMatchGame.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(createMatchGame.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(updateGame.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateGame.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(updateGame.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });

  // Export reducer
  export const { clearGame } = gameSlice.actions;
  export default gameSlice.reducer;
