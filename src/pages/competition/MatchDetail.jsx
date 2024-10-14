import { Button } from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { PageContext } from "../../contexts/PageContext";
import { getTeamByID } from "../../redux/features/teamSlice";
import GameSection from "./match/GameSection";
import HeroSection from "./match/HeroSection";
import MatchSection from "./match/MatchSection";
import MemberSection from "./match/MemberSection";
import PrioritySection from "./match/PrioritySection";
import { getMatchByID } from "../../redux/features/matchSlice";

// Sample team data
const team = {
  name: "Team Alpha",
  logo: "https://via.placeholder.com/150",
};

// Sample player and coach data
const players = [
  {
    name: "Player One",
    image: "https://via.placeholder.com/100",
    matchRate: "80%",
    gameRate: "90%",
    role: "Defender",
  },
  {
    name: "Player Two",
    image: "https://via.placeholder.com/100",
    matchRate: "75%",
    gameRate: "85%",
    role: "Midfielder",
  },
  {
    name: "Player Three",
    image: "https://via.placeholder.com/100",
    matchRate: "70%",
    gameRate: "88%",
    role: "Attacker",
  },
  {
    name: "Player Four",
    image: "https://via.placeholder.com/100",
    matchRate: "85%",
    gameRate: "80%",
    role: "Goalkeeper",
  },
  {
    name: "Player Five",
    image: "https://via.placeholder.com/100",
    matchRate: "90%",
    gameRate: "95%",
    role: "Jungler",
  },
];

const coaches = [
  {
    name: "Coach Four",
    image: "https://via.placeholder.com/100",
    matchRate: "85%",
    gameRate: "80%",
    role: "Head Coach",
  },
  {
    name: "Coach Five",
    image: "https://via.placeholder.com/100",
    matchRate: "90%",
    gameRate: "95%",
    role: "Assistant Coach",
  },
];

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

export default function MatchDetail() {
  const { updatePage } = useContext(PageContext);
  const { tournamentID, teamID, matchID } = useParams();
  const { team } = useSelector((state) => state.team);
  const { match } = useSelector((state) => state.match);
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getTeamByID(teamID));
    dispatch(getMatchByID(matchID));
  }, [dispatch]);

  useEffect(() => {
    updatePage(
      "Tournament",
      <>
        <Button color="secondary">Export</Button>
      </>
    );
  }, [updatePage]);

  console.log(matchID);
  console.log("match", match);

  const handleFormSubmit = (data) => {
    console.log("New Match Created:", data);
    setModalOpen(false);
  };

  return (
    <div className="text-white flex flex-col justify-start items-start w-full p-4">
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <img
          src={team?.Logo}
          alt={team?.Name}
          className="w-16 h-16 object-cover rounded-lg mr-4"
        />
        <h1 className="text-xl font-bold">{team?.Name}</h1>
      </div>

      <MatchSection match={match} />
      <MemberSection players={players} coaches={coaches} />
      <HeroSection />
      <PrioritySection />
      <GameSection />
    </div>
  );
}
