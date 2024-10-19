import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

export const getAllPriorityPicks = createAsyncThunk(
    "matches/getAllPriorityPicks",
    async ({ matchID, teamID }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/api/matches/${matchID}/teams/${teamID}/priority-picks`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addPriorityPick = createAsyncThunk(
    "matches/addPriorityPick",
    async (
        { matchID, teamID, heroID, pickRate, role, total },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const data = {
                hero_id: heroID,
                pick_rate: pickRate,
                role: role,
                total: total
            };
            const response = await axiosInstance.post(
                `/api/matches/${matchID}/teams/${teamID}/priority-picks`,
                data
            );
            CustomToast("Hero added successfully", "success");
            dispatch(getAllPriorityPicks({ matchID, teamID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);

export const updatePriorityPick = createAsyncThunk(
    "matches/updatePriorityPick",
    async (
        {
            matchID,
            teamID,
            priorityPickID,
            heroID,
            pickRate,
            role,
            total
        },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const data = {
                hero_id: heroID,
                pick_rate: pickRate,
                role: role,
                total: total
            };
            const response = await axiosInstance.put(
                `/api/matches/${matchID}/teams/${teamID}/priority-picks/${priorityPickID}`,
                data
            );
            CustomToast("Hero updated successfully", "success");
            dispatch(getAllPriorityPicks({ matchID, teamID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);

export const deletePriorityPick = createAsyncThunk(
    "matches/deletePriorityPick",
    async ({ matchID, teamID, priorityPickID }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.delete(
                `/api/matches/${matchID}/teams/${teamID}/priority-picks/${priorityPickID}`
            );
            CustomToast("Hero deleted successfully", "success");
            dispatch(getAllPriorityPicks({ matchID, teamID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);