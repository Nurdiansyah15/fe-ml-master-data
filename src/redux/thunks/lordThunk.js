import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

export const getAllLordResults = createAsyncThunk(
    "matches/getAllLordResults",
    async ({ teamID, gameID }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/api/games/${gameID}/teams/${teamID}/lord-results`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addLordResult = createAsyncThunk(
    "matches/addLordResult",
    async (
        { matchID, gameID, teamID, initiate, phase, result, setup },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const data = {
                initiate: initiate,
                phase: phase,
                result: result,
                setup: setup,
                team_id: teamID
            };
            const response = await axiosInstance.post(
                `/api/matches/${matchID}/games/${gameID}/lord-results`,
                data
            );
            CustomToast("Lord Result added successfully", "success");
            dispatch(getAllLordResults({ matchID, gameID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);

export const updateLordResult = createAsyncThunk(
    "matches/updateLordResult",
    async (
        {
            matchID, gameID, lordResultID, teamID, initiate, phase, result, setup
        },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const data = {
                initiate: initiate,
                phase: phase,
                result: result,
                setup: setup,
                team_id: teamID
            };
            const response = await axiosInstance.put(
                `/api/matches/${matchID}/games/${gameID}/lord-results/${lordResultID}`,
                data
            );
            CustomToast("Lord Result updated successfully", "success");
            dispatch(getAllLordResults({ matchID, gameID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);

export const deleteLordResult = createAsyncThunk(
    "matches/deleteLordResult",
    async ({ matchID, gameID, lordResultID }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.delete(
                `/api/matches/${matchID}/games/${gameID}/lord-results/${lordResultID}`
            );
            CustomToast("Lord Result deleted successfully", "success");
            dispatch(getAllLordResults({ matchID, gameID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);