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

// Sample team data
const team = {
  name: "Team Alpha",
  logo: "https://via.placeholder.com/150",
};

// Sample match data
const match = {
  week: "Week 1",
  day: "Day 1",
  date: "2024-10-01",
  teamA: {
    name: "Team A",
    logo: "https://via.placeholder.com/50",
    score: "2",
  },
  teamB: {
    name: "Team B",
    logo: "https://via.placeholder.com/50",
    score: "3",
  },
  summary: [
    {
      game: "Game 1",
      firstPick: "Team A",
      secondPick: "Team B",
      winner: "Team B",
    },
    {
      game: "Game 2",
      firstPick: "Team B",
      secondPick: "Team A",
      winner: "Team B",
    },
  ],
  stats: {
    firstPick: "Team A",
    firstPickWins: 10,
    firstPickLoses: 5,
    firstPickWinRate: "66%",
    secondPick: "Team B",
    secondPickWins: 8,
    secondPickLoses: 7,
    secondPickWinRate: "53%",
  },
};

export default function Match() {
  const { updatePage } = useContext(PageContext);
  const { tournamentID, matchID } = useParams();
  const { match } = useSelector((state) => state.match);
  const { tournament } = useSelector((state) => state.tournament);
  const { team } = useSelector((state) => state.team);
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [teamID, setTeamID] = useState("");

  useEffect(() => {
    dispatch(getMatchByID(matchID));
    dispatch(getTournamentByID(tournamentID));
    return () => {
      dispatch(clearMatch());
    };
  }, [dispatch]);

  // get team by id
  useEffect(() => {
    if (teamID) {
      dispatch(getTeamByID(teamID));
    }

    return () => {
      dispatch(clearTeam());
    };
  }, [dispatch, teamID]);
  // console.log("team", team);

  useEffect(() => {
    updatePage(
      `${tournament?.name}`,
      <>
        <Button color="secondary">Export</Button>
      </>
    );
  }, [updatePage, tournament?.name]);

  //   console.log(matchID);
  //   console.log("match", match);

  const handleFormSubmit = (data) => {
    console.log("New Match Created:", data);
    setModalOpen(false);
  };

  const handleChooseTeam = (team) => {
    console.log("Team Selected:", team);
    setTeamID(team?.team_id);
  };

  // console.log(teamID, "teamID");

  return (
    <div className="text-white flex flex-col justify-start items-start w-full p-4">
      <MatchSection handleChooseTeam={handleChooseTeam} match={match} />
      {team && <MemberSection team={team} match={match} />}
      {/* <HeroSection /> */}
      {/* <PrioritySection /> */}
      {/* <GameSection /> */}
    </div>
  );
}
