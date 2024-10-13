import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

// Thunks
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
  async ({ name, season }, { rejectWithValue, dispatch }) => {
    try {
      const data = {
        name: name, 
        season: season,
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
  async ({ tournamentID, name, season }, { rejectWithValue, dispatch }) => {
    try {
      const data = {
        name: name, 
        season: season,
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

const tournamentsSlice = createSlice({
  name: "tournaments",
  initialState: {
    tournaments: [],
    tournament: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTournaments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = action.payload;
      })
      .addCase(getAllTournaments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTournament.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTournament.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTournament.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTournament.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTournamentByID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTournamentByID.fulfilled, (state, action) => {
        state.loading = false;
        state.tournament = action.payload;
      })
      .addCase(getTournamentByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const {} = tournamentsSlice.actions;
export default tournamentsSlice.reducer;
