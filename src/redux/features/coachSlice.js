import { createSlice } from "@reduxjs/toolkit";
import {
  createCoachInTeam,
  getAllCoachesInTeam,
  updateCoachInTeam,
} from "../thunks/teamThunk";

const coachSlice = createSlice({
  name: "coach",
  initialState: {
    coaches: [],
    coach: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCoach: (state) => {
      state.coach = null;
      state.loading = false;
      state.error = null;
      state.coaches = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoachesInTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoachesInTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.coaches = action.payload;
      })
      .addCase(getAllCoachesInTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCoachInTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoachInTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createCoachInTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCoachInTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoachInTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCoachInTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearCoach } = coachSlice.actions;
export default coachSlice.reducer;
