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
      const formData = new FormData();
      formData.append("first_pick_team_id", firstPickTeamID);
      formData.append("second_pick_team_id", secondPickTeamID);
      formData.append("winner_team_id", winnerTeamID);
      formData.append("game_number", gameNumber);
      formData.append("video_link", videoLink);
      if (fullDraftImage) {
        formData.append("full_draft_image", fullDraftImage);
      }

      await axiosInstance.post(`/api/matches/${matchID}/games`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      const formData = new FormData();
      formData.append("first_pick_team_id", firstPickTeamID);
      formData.append("second_pick_team_id", secondPickTeamID);
      formData.append("winner_team_id", winnerTeamID);
      formData.append("game_number", gameNumber);
      formData.append("video_link", videoLink);
      if (fullDraftImage) {
        formData.append("full_draft_image", fullDraftImage);
      }

      console.log("formData: ", formData);

      await axiosInstance.put(
        `/api/matches/${matchID}/games/${gameID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Jangan lupa set header ini
          },
        }
      );

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

export const getAllExplaners = createAsyncThunk(
  "games/getAllExplaners",
  async ({ gameID, teamID }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/games/${gameID}/teams/${teamID}/explaners`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addExplaner = createAsyncThunk(
  "games/addExplaner",
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
        `/api/games/${gameID}/teams/${teamID}/explaners`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      CustomToast("Game created successfully", "success");
      dispatch(getAllExplaners({ gameID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      dispatch(getAllExplaners({ gameID, teamID }));
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateExplaner = createAsyncThunk(
  "games/updateExplaner",
  async (
    { gameID, teamID, explanerID, hero_id, early_result },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        hero_id,
        early_result,
      };

      await axiosInstance.put(
        `/api/games/${gameID}/teams/${teamID}/explaners/${explanerID}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      CustomToast("Game updated successfully", "success");
      dispatch(getAllExplaners({ gameID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      dispatch(getAllExplaners({ gameID, teamID }));
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteExplaner = createAsyncThunk(
  "games/deleteExplaner",
  async ({ gameID, teamID, explanerID }, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.delete(
        `/api/games/${gameID}/teams/${teamID}/explaners/${explanerID}`
      );

      CustomToast("Gold laner deleted successfully", "success");
      dispatch(getAllExplaners({ gameID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      dispatch(getAllExplaners({ gameID, teamID }));
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getTrioMidResult = createAsyncThunk(
  "games/getTrioMidResult",
  async ({ gameID, teamID, trioMidID }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/games/${gameID}/teams/${teamID}/trio-mid-results/${trioMidID}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTrioMidResult = createAsyncThunk(
  "games/updateTrioMidResult",
  async (
    { gameID, teamID, trioMidID, team_id, early_result },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        team_id,
        early_result,
      };

      await axiosInstance.put(
        `/api/games/${gameID}/teams/${teamID}/trio-mid-results/${trioMidID}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      CustomToast("Game updated successfully", "success");
      dispatch(getTrioMidResult({ gameID, teamID, trioMidID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      dispatch(getTrioMidResult({ gameID, teamID, trioMidID }));
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getAllTrioMids = createAsyncThunk(
  "games/getAllTrioMids",
  async ({ gameID, teamID }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.get(
        `/api/games/${gameID}/teams/${teamID}/trio-mids`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTrioMid = createAsyncThunk(
  "games/addTrioMid",
  async (
    { gameID, teamID, hero_id, role, early_result },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        hero_id,
        early_result,
        role,
      };

      await axiosInstance.post(
        `/api/games/${gameID}/teams/${teamID}/trio-mids`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      CustomToast("Game created successfully", "success");
      dispatch(getAllTrioMids({ gameID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      dispatch(getAllTrioMids({ gameID, teamID }));
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateTrioMid = createAsyncThunk(
  "games/updateTrioMid",
  async (
    { gameID, teamID, trioMidHeroID, role, hero_id, early_result },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        hero_id,
        role,
        early_result,
      };

      await axiosInstance.put(
        `/api/games/${gameID}/teams/${teamID}/trio-mids/${trioMidHeroID}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      CustomToast("Game updated successfully", "success");
      dispatch(getAllTrioMids({ gameID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      dispatch(getAllTrioMids({ gameID, teamID }));
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteTrioMid = createAsyncThunk(
  "games/deleteTrioMid",
  async ({ gameID, teamID, trioMidHeroID }, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.delete(
        `/api/games/${gameID}/teams/${teamID}/trio-mids/${trioMidHeroID}`
      );

      CustomToast("Trio Mid deleted successfully", "success");
      dispatch(getAllTrioMids({ gameID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      dispatch(getAllTrioMids({ gameID, teamID }));
      return rejectWithValue(error.response.data.error);
    }
  }
);
