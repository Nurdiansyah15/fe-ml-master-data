import { Button } from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { PageContext } from "../../contexts/PageContext";
import { getTeamByID } from "../../redux/thunks/teamThunk";
import GameSection from "./match/GameSection";
import HeroSection from "./match/HeroSection";
import MatchSection from "./match/MatchSection";
import MemberSection from "./match/MemberSection";
import PrioritySection from "./match/PrioritySection";
import { getMatchByID } from "../../redux/thunks/matchThunk";
import { getTournamentByID } from "../../redux/thunks/tournamentThunk";
import { clearMatch } from "../../redux/features/matchSlice";
import { clearTeam } from "../../redux/features/teamSlice";
import TeamStatsSection from "./match/TeamStatsSection";
import TeamTitle from "./match/TeamTitle";

export default function Match() {
  const { updatePage } = useContext(PageContext);
  const { tournamentID, matchID } = useParams();
  const { match } = useSelector((state) => state.match);
  const { tournament } = useSelector((state) => state.tournament);
  const { team } = useSelector((state) => state.team);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [teamID, setTeamID] = useState("");

  useEffect(() => {
    dispatch(getMatchByID(matchID));
    dispatch(getTournamentByID(tournamentID));
    return () => {
      dispatch(clearMatch());
    };
  }, [dispatch]);

  useEffect(() => {
    if (teamID) {
      dispatch(getTeamByID(teamID));
    }

    return () => {
      dispatch(clearTeam());
    };
  }, [dispatch, teamID]);

  useEffect(() => {
    updatePage(
      `${tournament?.name}`,
      <>
        <Button color="secondary">Export</Button>
      </>
    );
  }, [updatePage, tournament?.name]);

  const handleChooseTeam = (team) => {
    console.log("Team Selected:", team);
    setTeamID(team?.team_id);
  };

  return (
    <div className="text-white flex flex-col justify-start items-start w-full p-4 gap-10">
      <MatchSection handleChooseTeam={handleChooseTeam} match={match} />
      {team && <TeamTitle team={team} />}
      {team && <TeamStatsSection team={team} match={match} />}
      {team && <MemberSection team={team} match={match} />}
      {team && <HeroSection team={team} match={match} />}
      {team && <PrioritySection team={team} match={match} />}
      {team && <GameSection team={team} match={match} />}
    </div>
  );
}
