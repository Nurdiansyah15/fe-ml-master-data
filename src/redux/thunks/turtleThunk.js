import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

export const getAllTurtleResults = createAsyncThunk(
    "matches/getAllTurtleResults",
    async ({ teamID, gameID }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/api/games/${gameID}/teams/${teamID}/turtle-results`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addTurtleResult = createAsyncThunk(
    "matches/addTurtleResult",
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
                `/api/matches/${matchID}/games/${gameID}/turtle-results`,
                data
            );
            CustomToast("Turtle Result added successfully", "success");
            dispatch(getAllTurtleResults({ matchID, gameID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);

export const updateTurtleResult = createAsyncThunk(
    "matches/updateTurtleResult",
    async (
        {
            matchID, gameID, turtleResultID, teamID, initiate, phase, result, setup
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
                `/api/matches/${matchID}/games/${gameID}/turtle-results/${turtleResultID}`,
                data
            );
            CustomToast("Turtle Result updated successfully", "success");
            dispatch(getAllTurtleResults({ matchID, gameID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);

export const deleteTurtleResult = createAsyncThunk(
    "matches/deleteTurtleResult",
    async ({ matchID, gameID, turtleResultID }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.delete(
                `/api/matches/${matchID}/games/${gameID}/turtle-results/${turtleResultID}`
            );
            CustomToast("Turtle Result deleted successfully", "success");
            dispatch(getAllTurtleResults({ matchID, gameID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);