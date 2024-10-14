import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

// Thunks
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
  async ({ name, hero_image }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (hero_image) {
        formData.append("hero_image", hero_image);
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
  async ({ heroID, name, hero_image }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (hero_image) {
        formData.append("hero_image", hero_image); // logo diharapkan adalah File
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

const heroesSlice = createSlice({
  name: "heroes",
  initialState: {
    heroes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllHeroes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHeroes.fulfilled, (state, action) => {
        state.loading = false;
        state.heroes = action.payload;
      })
      .addCase(getAllHeroes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createHero.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHero.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createHero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateHero.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHero.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateHero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const {} = heroesSlice.actions;
export default heroesSlice.reducer;
