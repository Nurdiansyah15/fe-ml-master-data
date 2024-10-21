import { createSlice } from "@reduxjs/toolkit";
import { getAllHeroPicks } from "../thunks/matchThunk";

const heroPickSlice = createSlice({
  name: "heroPick",
  initialState: {
    heroPicks: [],
    loading: false,
    heroPick: null,
    error: null,
  },
  reducers: {
    clearHeroPick: (state) => {
      state.heroPick = null;
      state.loading = false;
      state.error = null;
      state.heroPicks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllHeroPicks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHeroPicks.fulfilled, (state, action) => {
        state.loading = false;
        state.heroPicks = action.payload
          .sort((a, b) => {
            return a.hero_pick_game.game_number - b.hero_pick_game.game_number;
          })
          .sort((a, b) => {
            return b.first_phase - a.first_phase;
          });
      })
      .addCase(getAllHeroPicks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearHeroPick } = heroPickSlice.actions;
export default heroPickSlice.reducer;
