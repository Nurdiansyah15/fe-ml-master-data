import { createSlice } from "@reduxjs/toolkit";
import { createHero, getAllHeroes, updateHero } from "../thunks/heroThunk";

const heroSlice = createSlice({
  name: "hero",
  initialState: {
    heroes: [],
    loading: false,
    hero: null,
    error: null,
  },
  reducers: {
    clearHero: (state) => {
      state.hero = null;
      state.loading = false;
      state.error = null;
      state.heroes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllHeroes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHeroes.fulfilled, (state, action) => {
        state.loading = false;
        state.heroes = action.payload;
      })
      .addCase(getAllHeroes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createHero.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHero.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createHero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateHero.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHero.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateHero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearHero } = heroSlice.actions;
export default heroSlice.reducer;
