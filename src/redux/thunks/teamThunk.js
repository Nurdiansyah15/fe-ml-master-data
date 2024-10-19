import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

// team
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
  async ({ name, image }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) {
        formData.append("image", image);
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
  async ({ teamID, name, image }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) {
        formData.append("image", image); // logo diharapkan adalah File
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

export const getAllTeamsInMatch = createAsyncThunk(
  "teams/getAllTeamsInMatch",
  async (matchID, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/matches/${matchID}/teams`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// coach
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
        formData.append("image", image);
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
        formData.append("image", image);
      }

      const response = await axiosInstance.put(`/api/coaches/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      CustomToast("Coach updated successfully", "success");
      dispatch(getAllCoachesInTeam(response.data.team_id));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

// player
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
  async ({ teamID, name, image }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) {
        formData.append("image", image);
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
  async ({ id, name,  image }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) {
        formData.append("image", image);
      }

      const response = await axiosInstance.put(`/api/players/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      CustomToast("Player updated successfully", "success");
      dispatch(getAllPlayersInTeam(response.data.team_id));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getAllPlayersInMatchTeam = createAsyncThunk(
  "playerTeam/getAllPlayersInMatchTeam",
  async ({ teamID, matchID }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/matches/${matchID}/teams/${teamID}/players`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const createPlayerInMatchTeam = createAsyncThunk(
  "playerTeam/createPlayerInMatchTeam",
  async ({ teamID, matchID, player_id, role }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(
        `/api/matches/${matchID}/teams/${teamID}/players`,
        { player_id, role }
      );
      CustomToast("Player added to team successfully", "success");
      dispatch(getAllPlayersInMatchTeam({ teamID, matchID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const deletePlayerInMatchTeam = createAsyncThunk(
  "playerTeam/deletePlayerInMatchTeam",
  async ({ teamID, matchID, playerID }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.delete(
        `/api/matches/${matchID}/teams/${teamID}/players/${playerID}`
      );
      CustomToast("Player removed from team successfully", "success");
      dispatch(getAllPlayersInMatchTeam({ teamID, matchID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getAllCoachsInMatchTeam = createAsyncThunk(
  "playerTeam/getAllCoachsInMatchTeam",
  async ({ teamID, matchID }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/matches/${matchID}/teams/${teamID}/coaches`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

// create and delete coach
export const createCoachInMatchTeam = createAsyncThunk(
  "playerTeam/createCoachInMatchTeam",
  async ({ teamID, matchID, coach_id ,role}, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(
        `/api/matches/${matchID}/teams/${teamID}/coaches`,
        { coach_id, role }
      );
      CustomToast("Coach added to team successfully", "success");
      dispatch(getAllCoachsInMatchTeam({ teamID, matchID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteCoachInMatchTeam = createAsyncThunk(
  "playerTeam/deleteCoachInMatchTeam",
  async ({ teamID, matchID, coachID }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.delete(
        `/api/matches/${matchID}/teams/${teamID}/coaches/${coachID}`
      );
      CustomToast("Coach removed from team successfully", "success");
      dispatch(getAllCoachsInMatchTeam({ teamID, matchID }));
      return;
    } catch (error) {
      CustomToast(error.response.data.error, "error");
      return rejectWithValue(error.response.data.error);
    }
  }
);
