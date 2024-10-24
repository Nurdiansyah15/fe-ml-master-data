import { createSlice } from "@reduxjs/toolkit";
import { getAllHeroBans } from "../thunks/matchThunk";

const heroBanSlice = createSlice({
  name: "heroBan",
  initialState: {
    heroBans: [],
    heroBan: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearHeroBans: (state) => {
      state.heroBan = null;
      state.loading = false;
      state.error = null;
      state.heroBans = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllHeroBans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHeroBans.fulfilled, (state, action) => {
        state.loading = false;
        state.heroBans = action.payload
          .sort((a, b) => {
            return a.hero_ban_game.game_number - b.hero_ban_game.game_number;
          })
          .sort((a, b) => {
            return b.first_phase - a.first_phase;
          });
      })
      .addCase(getAllHeroBans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearHeroBans } = heroBanSlice.actions;
export default heroBanSlice.reducer;
