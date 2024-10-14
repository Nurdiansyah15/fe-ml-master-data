import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

// Thunks
export const getAllGamesForMatch = createAsyncThunk(
  "games/getAllGamesForMatch",
  async (matchID, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/matches/${matchID}/games`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createGameForMatch = createAsyncThunk(
  "games/createGameForMatch",
  async (
    { matchID, gameNumber, firstPickTeamID, secondPickTeamID, winnerTeamID },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        game_number: gameNumber,
        first_pick_team_id: firstPickTeamID,
        second_pick_team_id: secondPickTeamID,
        winner_team_id: winnerTeamID,
      };

      await axiosInstance.post(`/api/matches/${matchID}/games`, data, {
        headers: { "Content-Type": "application/json" },
      });

      CustomToast("Game created successfully", "success");
      dispatch(getAllGamesForMatch(matchID));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateGame = createAsyncThunk(
  "games/updateGame",
  async (
    { gameID, gameNumber, firstPickTeamID, secondPickTeamID, winnerTeamID },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        game_number: gameNumber,
        first_pick_team_id: firstPickTeamID,
        second_pick_team_id: secondPickTeamID,
        winner_team_id: winnerTeamID,
      };

      await axiosInstance.put(`/api/games/${gameID}`, data, {
        headers: { "Content-Type": "application/json" },
      });

      CustomToast("Game updated successfully", "success");
      dispatch(getAllGamesForMatch(data.matchID)); // Reload games
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

const gamesSlice = createSlice({
  name: "games",
  initialState: {
    games: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllGamesForMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllGamesForMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
      })
      .addCase(getAllGamesForMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGameForMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGameForMatch.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createGameForMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGame.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducer
export default gamesSlice.reducer;
