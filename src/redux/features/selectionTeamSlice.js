import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

// Thunks
export const getAllTeamsInMatch = createAsyncThunk(
  "teams/getAllTeamsInMatch",
  async (matchID, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/matches/${matchID}/teams`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const teamsSlice = createSlice({
  name: "selectionTeams",
  initialState: {
    teams: [],
    team: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTeamsInMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTeamsInMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(getAllTeamsInMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const {} = teamsSlice.actions;
export default teamsSlice.reducer;
