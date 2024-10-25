import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

// match
export const getAllMatches = createAsyncThunk(
  "matches/getAllMatches",
  async (tournamentID, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/tournaments/${tournamentID}/matches`
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
    {
      tournamentID,
      day,
      date,
      stage,
      team_a_id,
      team_a_score,
      team_b_id,
      team_b_score,
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        day,
        date,
        stage,
        team_a_id,
        team_a_score,
        team_b_id,
        team_b_score,
      };
      

      await axiosInstance.post(
        `/api/tournaments/${tournamentID}/matches`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      CustomToast("Match created successfully", "success");
      dispatch(getAllMatches(tournamentID));
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
    {
      tournamentID,
      matchID,
      day,
      date,
      stage,
      team_a_id,
      team_a_score,
      team_b_id,
      team_b_score,
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        day,
        date,
        stage,
        team_a_id,
        team_a_score,
        team_b_id,
        team_b_score,
      };

      await axiosInstance.put(`/api/matches/${matchID}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      CustomToast("Match updated successfully", "success");
      if (tournamentID) {
        dispatch(getAllMatches(tournamentID));
      }
      if (!tournamentID) {
        dispatch(getMatchByID(matchID));
      }
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteMatch = createAsyncThunk(
  "matches/deleteMatch",
  async (matchID, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/matches/${matchID}`);
      CustomToast("Match deleted successfully", "success");
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getAllHeroPicks = createAsyncThunk(
  "matches/getAllHeroPicks",
  async ({ matchID, teamID }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/matches/${matchID}/teams/${teamID}/hero-picks`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addHeroPick = createAsyncThunk(
  "matches/addHeroPick",
  async (
    { matchID, teamID, heroID, firstPhase, secondPhase, total, heroPickGame },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        hero_id: heroID,
        first_phase: firstPhase,
        second_phase: secondPhase,
        total: total,
        hero_pick_game: heroPickGame,
      };
      const response = await axiosInstance.post(
        `/api/matches/${matchID}/teams/${teamID}/hero-picks`,
        data
      );
      CustomToast("Hero picked successfully", "success");
      dispatch(getAllHeroPicks({ matchID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateHeroPick = createAsyncThunk(
  "matches/updateHeroPick",
  async (
    {
      matchID,
      teamID,
      heroPickID,
      heroID,
      firstPhase,
      total,
      secondPhase,
      heroPickGame,
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        hero_pick_id: heroPickID,
        hero_id: heroID,
        first_phase: firstPhase,
        total: total,
        second_phase: secondPhase,
        hero_pick_game: heroPickGame,
      };
      const response = await axiosInstance.put(
        `/api/matches/${matchID}/teams/${teamID}/hero-picks/${heroPickID}`,
        data
      );
      CustomToast("Hero picked updated successfully", "success");
      dispatch(getAllHeroPicks({ matchID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteHeroPick = createAsyncThunk(
  "matches/deleteHeroPick",
  async ({ matchID, teamID, heroPickID }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.delete(
        `/api/matches/${matchID}/teams/${teamID}/hero-picks/${heroPickID}`
      );
      CustomToast("Hero picked deleted successfully", "success");
      dispatch(getAllHeroPicks({ matchID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

// hero ban
export const getAllHeroBans = createAsyncThunk(
  "matches/getAllHeroBans",
  async ({ matchID, teamID }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/matches/${matchID}/teams/${teamID}/hero-bans`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addHeroBan = createAsyncThunk(
  "matches/addHeroBan",
  async (
    { matchID, teamID, heroID, firstPhase, secondPhase, total, heroBanGame },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        hero_id: heroID,
        first_phase: firstPhase,
        second_phase: secondPhase,
        total: total,
        hero_ban_game: heroBanGame,
      };
      const response = await axiosInstance.post(
        `/api/matches/${matchID}/teams/${teamID}/hero-bans`,
        data
      );
      CustomToast("Hero banned successfully", "success");
      dispatch(getAllHeroBans({ matchID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateHeroBan = createAsyncThunk(
  "matches/updateHeroBan",
  async (
    {
      matchID,
      teamID,
      heroBanID,
      heroID,
      firstPhase,
      total,
      secondPhase,
      heroBanGame,
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = {
        hero_ban_id: heroBanID,
        hero_id: heroID,
        first_phase: firstPhase,
        total: total,
        second_phase: secondPhase,
        hero_ban_game: heroBanGame,
      };
      const response = await axiosInstance.put(
        `/api/matches/${matchID}/teams/${teamID}/hero-bans/${heroBanID}`,
        data
      );
      CustomToast("Hero banned updated successfully", "success");
      dispatch(getAllHeroBans({ matchID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteHeroBan = createAsyncThunk(
  "matches/deleteHeroBan",
  async ({ matchID, teamID, heroBanID }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.delete(
        `/api/matches/${matchID}/teams/${teamID}/hero-bans/${heroBanID}`
      );
      CustomToast("Hero banned deleted successfully", "success");
      dispatch(getAllHeroBans({ matchID, teamID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);
