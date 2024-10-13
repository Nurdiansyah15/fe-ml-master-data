import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

// Thunks
export const getAllTeamMatches = createAsyncThunk(
  "matches/getAllTeamMatches",
  async ({ tournamentID, teamID }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/tournaments/${tournamentID}/teams/${teamID}/matches`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMatchByID = createAsyncThunk(
  "matches/getMatchByID",
  async (matchID, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/matches/${matchID}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createMatch = createAsyncThunk(
  "matches/createMatch",
  async (
    { tournamentID, teamID, week, day, date },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = { week, day, date };

      await axiosInstance.post(
        `/api/tournaments/${tournamentID}/teams/${teamID}/matches`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      CustomToast("Match created successfully", "success");
      dispatch(getAllTeamMatches({ tournamentID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateMatch = createAsyncThunk(
  "matches/updateMatch",
  async (
    { matchID, opponentTeamID, week, day, date },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = { opponent_team_id: opponentTeamID, week, day, date };

      await axiosInstance.put(`/api/matches/${matchID}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      CustomToast("Match updated successfully", "success");
      dispatch(getMatchByID(matchID));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

const matchesSlice = createSlice({
  name: "matches",
  initialState: {
    matches: [],
    match: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTeamMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTeamMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(getAllTeamMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMatchByID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMatchByID.fulfilled, (state, action) => {
        state.loading = false;
        state.match = action.payload;
      })
      .addCase(getMatchByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMatch.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMatch.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducer
export default matchesSlice.reducer;
