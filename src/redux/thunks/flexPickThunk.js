import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

export const getAllFlexPicks = createAsyncThunk(
    "matches/getAllFlexPicks",
    async ({ matchID, teamID }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/api/matches/${matchID}/teams/${teamID}/flex-picks`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addFlexPick = createAsyncThunk(
    "matches/addFlexPick",
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
            console.log(data);
            
            const response = await axiosInstance.post(
                `/api/matches/${matchID}/teams/${teamID}/flex-picks`,
                data
            );
            CustomToast("Hero added successfully", "success");
            dispatch(getAllFlexPicks({ matchID, teamID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);

export const updateFlexPick = createAsyncThunk(
    "matches/updateFlexPick",
    async (
        {
            matchID,
            teamID,
            flexPickID,
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
                `/api/matches/${matchID}/teams/${teamID}/flex-picks/${flexPickID}`,
                data
            );
            CustomToast("Hero updated successfully", "success");
            dispatch(getAllFlexPicks({ matchID, teamID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);

export const deleteFlexPick = createAsyncThunk(
    "matches/deleteFlexPick",
    async ({ matchID, teamID, flexPickID }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.delete(
                `/api/matches/${matchID}/teams/${teamID}/flex-picks/${flexPickID}`
            );
            CustomToast("Hero deleted successfully", "success");
            dispatch(getAllFlexPicks({ matchID, teamID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);