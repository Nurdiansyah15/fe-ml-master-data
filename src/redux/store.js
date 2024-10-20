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
import heroPickReducer from "./features/heroPickSlice";
import heroBanReducer from "./features/heroBanSlice";
import goldlanerReducer from "./features/goldlanerSlice";
import explanerReducer from "./features/explanerSlice";
import trioMidReducer from "./features/trioMidSlice";
import priorityPickReducer from "./features/priorityPickSlice";
import priorityBanReducer from "./features/priorityBanSlice";
import flexPickReducer from "./features/flexPickSlice";
import turtleReducer from "./features/turtleSlice";
import lordReducer from "./features/lordSlice";

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
    heroPick: heroPickReducer,
    heroBan: heroBanReducer,
    goldlaner: goldlanerReducer,
    explaner: explanerReducer,
    trioMid: trioMidReducer,
    priorityPick: priorityPickReducer,
    priorityBan: priorityBanReducer,
    flexPick: flexPickReducer,
    turtle: turtleReducer,
    lord: lordReducer
  },
});
