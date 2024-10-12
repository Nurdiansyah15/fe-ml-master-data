import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

// Thunks
export const getAllPlayersInTeam = createAsyncThunk(
  "playerTeam/getAllPlayersInTeam",
  async (teamID, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/teams/${teamID}/players`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const createPlayerInTeam = createAsyncThunk(
  "playerTeam/createPlayerInTeam",
  async ({ teamID, name, role, image }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role);
      if (image) {
        formData.append("image", image); // Image is expected to be a File
      }

      const response = await axiosInstance.post(
        `/api/teams/${teamID}/players`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      CustomToast("Player added to team successfully", "success");
      dispatch(getAllPlayersInTeam(teamID));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updatePlayerInTeam = createAsyncThunk(
  "playerTeam/updatePlayerInTeam",
  async ({ id, name, role, image }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role);
      if (image) {
        formData.append("image", image); // Image is expected to be a File
      }

      const response = await axiosInstance.put(
        `/api/players/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      CustomToast("Player updated successfully", "success");
      dispatch(getAllPlayersInTeam(response.data.TeamID));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

const playerTeamSlice = createSlice({
  name: "playerTeam",
  initialState: {
    players: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPlayersInTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPlayersInTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.players = action.payload;
      })
      .addCase(getAllPlayersInTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPlayerInTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlayerInTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createPlayerInTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePlayerInTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlayerInTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updatePlayerInTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const {} = playerTeamSlice.actions;
export default playerTeamSlice.reducer;
