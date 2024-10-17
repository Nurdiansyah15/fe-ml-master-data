import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

export const getAllTrioMids = createAsyncThunk(
    "games/getAllTrioMids",
    async (matchID, gameID, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/matches/${matchID}/games/${gameID}/trio-mids`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createTrioMid = createAsyncThunk(
    "games/createTrioMid",
    async (
      {
        matchID,
        gameID,
        earlyResult,
        heroID,
        role,
        teamID
      },
      { rejectWithValue, dispatch }
    ) => {
      try {
        const data = {
          early_result: earlyResult,
          hero_id: heroID,
          role: role,
          team_id: teamID
        };
  
        await axiosInstance.post(`/api/matches/${matchID}/games/${gameID}/trio-mids`, data, {
          headers: { "Content-Type": "application/json" },
        });
  
        CustomToast("Data created successfully", "success");
        dispatch(getAllTrioMids(matchID, gameID));
        return;
      } catch (error) {
        CustomToast(error.response.data.error, "error");
        dispatch(getAllTrioMids(matchID, gameID));
        return rejectWithValue(error.response.data.error);
      }
    }
  );

  export const updateTrioMid = createAsyncThunk(
    "games/updateTrioMid",
    async (
      {
        matchID,
        gameID,
        trioMidID,
        earlyResult,
        heroID,
        role,
        teamID
      },
      { rejectWithValue, dispatch }
    ) => {
      try {
        const data = {
          early_result: earlyResult,
          hero_id: heroID,
          role: role,
          team_id: teamID
        };
  
        await axiosInstance.put(`/api/matches/${matchID}/games/${gameID}/trio-mids/${trioMidID}`, data, {
          headers: { "Content-Type": "application/json" },
        });
  
        CustomToast("Data updated successfully", "success");
        dispatch(getAllTrioMids(matchID, gameID));
        return;
      } catch (error) {
        CustomToast(error.response.data.error, "error");
        dispatch(getAllTrioMids(matchID, gameID));
        return rejectWithValue(error.response.data.error);
      }
    }
  );