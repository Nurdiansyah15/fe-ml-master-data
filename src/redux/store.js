import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import teamReducer from "./features/teamSlice";
import playerTeamReducer from "./features/playerTeamSlice";
import coachTeamReducer from "./features/coachTeamSlice";
import heroReducer from "./features/heroSlice";
import tournamentReducer from "./features/tournamentSlice";
import teamTournamentReducer from "./features/teamTournamentSlice";
import matchReducer from "./features/matchSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    team: teamReducer,
    playerTeam: playerTeamReducer,
    coachTeam: coachTeamReducer,
    hero: heroReducer,
    tournament: tournamentReducer,
    teamTournament: teamTournamentReducer,
    match: matchReducer,
  },
});
