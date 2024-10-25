import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import CustomToast from "../../components/global/CustomToast";

export const getAllPriorityBans = createAsyncThunk(
    "matches/getAllPriorityBans",
    async ({ matchID, teamID }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/api/matches/${matchID}/teams/${teamID}/priority-bans`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addPriorityBan = createAsyncThunk(
    "matches/addPriorityBan",
    async (
        { matchID, teamID, heroID, banRate, role, total },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const data = {
                hero_id: heroID,
                ban_rate: banRate,
                role: role,
                total: total
            };
            const response = await axiosInstance.post(
                `/api/matches/${matchID}/teams/${teamID}/priority-bans`,
                data
            );
            CustomToast("Hero added successfully", "success");
            dispatch(getAllPriorityBans({ matchID, teamID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);

export const updatePriorityBan = createAsyncThunk(
    "matches/updatePriorityBan",
    async (
        {
            matchID,
            teamID,
            priorityBanID,
            heroID,
            banRate,
            role,
            total
        },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const data = {
                hero_id: heroID,
                ban_rate: banRate,
                role: role,
                total: total
            };
            const response = await axiosInstance.put(
                `/api/matches/${matchID}/teams/${teamID}/priority-bans/${priorityBanID}`,
                data
            );
            CustomToast("Hero updated successfully", "success");
            dispatch(getAllPriorityBans({ matchID, teamID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);

export const deletePriorityBan = createAsyncThunk(
    "matches/deletePriorityBan",
    async ({ matchID, teamID, priorityBanID }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.delete(
                `/api/matches/${matchID}/teams/${teamID}/priority-bans/${priorityBanID}`
            );
            CustomToast("Hero deleted successfully", "success");
            dispatch(getAllPriorityBans({ matchID, teamID }));
            return;
        } catch (error) {
            CustomToast(error.response.data.error, "error");
            return rejectWithValue(error.response.data.error);
        }
    }
);