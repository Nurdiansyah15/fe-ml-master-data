import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

// Thunks
export const getAllCoachesInTeam = createAsyncThunk(
  "coachTeam/getAllCoachesInTeam",
  async (teamID, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/teams/${teamID}/coaches`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const createCoachInTeam = createAsyncThunk(
  "coachTeam/createCoachInTeam",
  async ({ teamID, name, role, image }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role);
      if (image) {
        formData.append("image", image); // Image is expected to be a File
      }

      const response = await axiosInstance.post(
        `/api/teams/${teamID}/coaches`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      CustomToast("Coach added to team successfully", "success");
      dispatch(getAllCoachesInTeam(teamID));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateCoachInTeam = createAsyncThunk(
  "coachTeam/updateCoachInTeam",
  async ({ id, name, role, image }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role);
      if (image) {
        formData.append("image", image); // Image is expected to be a File
      }

      const response = await axiosInstance.put(`/api/coaches/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      CustomToast("Coach updated successfully", "success");
      dispatch(getAllCoachesInTeam(response.data.TeamID));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

const coachTeamSlice = createSlice({
  name: "coachTeam",
  initialState: {
    coaches: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoachesInTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoachesInTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.coaches = action.payload;
      })
      .addCase(getAllCoachesInTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCoachInTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoachInTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createCoachInTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCoachInTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoachInTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCoachInTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const {} = coachTeamSlice.actions;
export default coachTeamSlice.reducer;
