import axiosInstance from "../../api/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/login", {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserInfo = createAsyncThunk(
  "auth/getUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
