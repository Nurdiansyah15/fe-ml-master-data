import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

export const getAllHeroes = createAsyncThunk(
  "heroes/getAllHeroes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/heroes");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createHero = createAsyncThunk(
  "heroes/createHero",
  async ({ name, image }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) {
        formData.append("image", image);
      }

      const response = await axiosInstance.post("/api/heroes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      CustomToast("Hero created successfully", "success");
      dispatch(getAllHeroes());
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateHero = createAsyncThunk(
  "heroes/updateHero",
  async ({ heroID, name, image }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) {
        formData.append("image", image); // logo diharapkan adalah File
      }

      const response = await axiosInstance.put(
        `/api/heroes/${heroID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Jangan lupa set header ini
          },
        }
      );

      CustomToast("Hero updated successfully", "success");
      dispatch(getAllHeroes());
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);
