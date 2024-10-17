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

export const getAllGoldlaners = createAsyncThunk(
  "games/getAllGoldlaners",
  async ({ gameID, teamID }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/games/${gameID}/teams/${teamID}/goldlaners`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addGoldlaner = createAsyncThunk(
  "games/addGoldlaner",
  async (
    { gameID, teamID, hero_id, early_result },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        hero_id,
        early_result,
      };

      await axiosInstance.post(
        `/api/games/${gameID}/teams/${teamID}/goldlaners`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      CustomToast("Game created successfully", "success");
      dispatch(getAllGoldlaners({ gameID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      dispatch(getAllGoldlaners({ gameID, teamID }));
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateGoldlaner = createAsyncThunk(
  "games/updateGoldlaner",
  async (
    { gameID, teamID, goldLanerID, hero_id, early_result },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        hero_id,
        early_result,
      };

      await axiosInstance.put(
        `/api/games/${gameID}/teams/${teamID}/goldlaners/${goldLanerID}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      CustomToast("Game updated successfully", "success");
      dispatch(getAllGoldlaners({ gameID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      dispatch(getAllGoldlaners({ gameID, teamID }));
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteGoldLaner = createAsyncThunk(
  "games/deleteGoldLaner",
  async ({ gameID, teamID, goldLanerID }, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.delete(
        `/api/games/${gameID}/teams/${teamID}/goldlaners/${goldLanerID}`
      );

      CustomToast("Gold laner deleted successfully", "success");
      dispatch(getAllGoldlaners({ gameID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      dispatch(getAllGoldlaners({ gameID, teamID }));
      return rejectWithValue(error.response.data.error);
    }
  }
);
