import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

export const getAllTournaments = createAsyncThunk(
  "tournaments/getAllTournaments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/tournaments");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTournamentByID = createAsyncThunk(
  "tournaments/getTournamentByID",
  async (tournamentID, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/tournaments/${tournamentID}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTournament = createAsyncThunk(
  "tournaments/createTournament",
  async ({ name }, { rejectWithValue, dispatch }) => {
    try {
      const data = {
        name: name,
      };

      const response = await axiosInstance.post("/api/tournaments", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      CustomToast("Tournament created successfully", "success");
      dispatch(getAllTournaments());
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateTournament = createAsyncThunk(
  "tournaments/updateTournament",
  async ({ tournamentID, name }, { rejectWithValue, dispatch }) => {
    try {
      const data = {
        name: name,
      };

      const response = await axiosInstance.put(
        `/api/tournaments/${tournamentID}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      CustomToast("Tournament updated successfully", "success");
      dispatch(getAllTournaments());
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);
