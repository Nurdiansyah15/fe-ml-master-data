import { createSlice } from "@reduxjs/toolkit";
import { addPriorityBan, getAllPriorityBans, updatePriorityBan } from "../thunks/priorityBanThunk";

const priorityBanSlice = createSlice({
  name: "priorityBan",
  initialState: {
    priorityBans: [],
    loading: false,
    priorityBan: null,
    error: null,
  },
  reducers: {
    clearPriorityBan: (state) => {
      state.priorityBan = null;
      state.loading = false;
      state.error = null;
      state.priorityBans = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPriorityBans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPriorityBans.fulfilled, (state, action) => {
        state.loading = false;
        state.priorityBans = action.payload;
      })
      .addCase(getAllPriorityBans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPriorityBan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPriorityBan.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addPriorityBan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePriorityBan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePriorityBan.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updatePriorityBan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearPriorityBan } = priorityBanSlice.actions;
export default priorityBanSlice.reducer;
