import { createSlice } from "@reduxjs/toolkit";
import { addPriorityPick, getAllPriorityPicks, updatePriorityPick } from "../thunks/priorityPickThunk";

const priorityPickSlice = createSlice({
  name: "priorityPick",
  initialState: {
    priorityPicks: [],
    loading: false,
    priorityPick: null,
    error: null,
  },
  reducers: {
    clearPriorityPick: (state) => {
      state.priorityPick = null;
      state.loading = false;
      state.error = null;
      state.priorityPicks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPriorityPicks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPriorityPicks.fulfilled, (state, action) => {
        state.loading = false;
        state.priorityPicks = action.payload;
      })
      .addCase(getAllPriorityPicks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPriorityPick.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPriorityPick.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addPriorityPick.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePriorityPick.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePriorityPick.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updatePriorityPick.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearPriorityPick } = priorityPickSlice.actions;
export default priorityPickSlice.reducer;
