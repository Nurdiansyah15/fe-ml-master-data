import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

export const getAllTeamsinTournament = createAsyncThunk(
  "teams/getAllTeamsinTournament",
  async (tournamentID, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/tournaments/${tournamentID}/teams`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const createTeamforTournament = createAsyncThunk(
  "teams/createTeamforTournament",
  async ({ tournamentID, teamID }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(
        `/api/tournaments/${tournamentID}/teams`,
        { teamID }
      );

      CustomToast("Team created successfully", "success");
      dispatch(getAllTeamsinTournament(tournamentID));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

const teamTournamentSlice = createSlice({
  name: "teams",
  initialState: {
    teams: [],
    team: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTeamsinTournament.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTeamsinTournament.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(getAllTeamsinTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const {} = teamTournamentSlice.actions;
export default teamTournamentSlice.reducer;
