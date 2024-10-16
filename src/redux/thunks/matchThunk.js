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
      week,
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
        week,
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
      week,
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
        week,
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
