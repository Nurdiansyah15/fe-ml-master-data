import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import coachReducer from "./features/coachSlice";
import gameReducer from "./features/gameSlice";
import heroReducer from "./features/heroSlice";
import matchReducer from "./features/matchSlice";
import playerReducer from "./features/playerSlice";
import teamMatchReducer from "./features/teamMatchSlice";
import teamReducer from "./features/teamSlice";
import tournamentReducer from "./features/tournamentSlice";
import matchPlayerReducer from "./features/matchPlayerSlice";
import matchCoachReducer from "./features/matchCoachSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    team: teamReducer,
    player: playerReducer,
    coach: coachReducer,
    hero: heroReducer,
    tournament: tournamentReducer,
    match: matchReducer,
    game: gameReducer,
    teamMatch: teamMatchReducer,
    matchPlayer: matchPlayerReducer,
    matchCoach: matchCoachReducer,
  },
});
