import { createSlice } from "@reduxjs/toolkit";
import { addFlexPick, getAllFlexPicks, updateFlexPick } from "../thunks/flexPickThunk";

const flexPickSlice = createSlice({
  name: "flexPick",
  initialState: {
    flexPicks: [],
    loading: false,
    flexPick: null,
    error: null,
  },
  reducers: {
    clearFlexPick: (state) => {
      state.flexPick = null;
      state.loading = false;
      state.error = null;
      state.flexPicks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllFlexPicks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFlexPicks.fulfilled, (state, action) => {
        state.loading = false;
        state.flexPicks = action.payload;
      })
      .addCase(getAllFlexPicks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFlexPick.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFlexPick.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addFlexPick.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateFlexPick.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlexPick.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateFlexPick.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearFlexPick } = flexPickSlice.actions;
export default flexPickSlice.reducer;
