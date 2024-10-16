import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

export const getAllMatchGames = createAsyncThunk(
  "games/getAllMatchGames",
  async (matchID, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/matches/${matchID}/games`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createMatchGame = createAsyncThunk(
  "games/createMatchGame",
  async (
    {
      matchID,
      firstPickTeamID,
      secondPickTeamID,
      winnerTeamID,
      gameNumber,
      videoLink,
      fullDraftImage,
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        first_pick_team_id: firstPickTeamID,
        second_pick_team_id: secondPickTeamID,
        winner_team_id: winnerTeamID,
        game_number: gameNumber,
        video_link: videoLink,
        full_draft_image: fullDraftImage,
      };

      await axiosInstance.post(`/api/matches/${matchID}/games`, data, {
        headers: { "Content-Type": "application/json" },
      });

      CustomToast("Game created successfully", "success");
      dispatch(getAllMatchGames(matchID));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      dispatch(getAllMatchGames(matchID));
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateGame = createAsyncThunk(
  "games/updateGame",
  async (
    {
      matchID,
      gameID,
      firstPickTeamID,
      secondPickTeamID,
      winnerTeamID,
      gameNumber,
      videoLink,
      fullDraftImage,
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        first_pick_team_id: firstPickTeamID,
        second_pick_team_id: secondPickTeamID,
        winner_team_id: winnerTeamID,
        game_number: gameNumber,
        video_link: videoLink,
        full_draft_image: fullDraftImage,
      };

      await axiosInstance.put(`/api/matches/${matchID}/games/${gameID}`, data, {
        headers: { "Content-Type": "application/json" },
      });

      CustomToast("Game updated successfully", "success");
      dispatch(getAllMatchGames(matchID));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);
