import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

// Thunks
export const getAllTeams = createAsyncThunk(
  "teams/getAllTeams",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/teams");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTeamByID = createAsyncThunk(
  "teams/getTeamByID",
  async (teamID, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/teams/${teamID}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTeam = createAsyncThunk(
  "teams/createTeam",
  async ({ name, logo }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (logo) {
        formData.append("logo", logo);
      }

      const response = await axiosInstance.post("/api/teams", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      CustomToast("Team created successfully", "success");
      dispatch(getAllTeams());
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateTeam = createAsyncThunk(
  "teams/updateTeam",
  async ({ teamID, name, logo }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (logo) {
        formData.append("logo", logo); // logo diharapkan adalah File
      }

      const response = await axiosInstance.put(
        `/api/teams/${teamID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Jangan lupa set header ini
          },
        }
      );

      CustomToast("Team updated successfully", "success");
      dispatch(getAllTeams());
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

const teamsSlice = createSlice({
  name: "teams",
  initialState: {
    teams: [],
    team: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(getAllTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTeamByID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeamByID.fulfilled, (state, action) => {
        state.loading = false;
        state.team = action.payload;
      })
      .addCase(getTeamByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const {} = teamsSlice.actions;
export default teamsSlice.reducer;
