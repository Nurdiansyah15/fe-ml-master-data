import { createSlice } from "@reduxjs/toolkit";
import { addTurtleResult, getAllTurtleResults, updateTurtleResult } from "../thunks/turtleThunk";

const turtleSlice = createSlice({
  name: "turtle",
  initialState: {
    turtles: [],
    loading: false,
    turtle: null,
    error: null,
  },
  reducers: {
    clearTurtle: (state) => {
      state.turtle = null;
      state.loading = false;
      state.error = null;
      state.turtles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTurtleResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTurtleResults.fulfilled, (state, action) => {
        state.loading = false;
        state.turtles = action.payload;
      })
      .addCase(getAllTurtleResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTurtleResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTurtleResult.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addTurtleResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTurtleResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTurtleResult.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateTurtleResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearTurtle } = turtleSlice.actions;
export default turtleSlice.reducer;
