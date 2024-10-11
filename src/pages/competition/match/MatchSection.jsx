import { Card } from "@nextui-org/react";
import React from "react";
import MatchSummary from "./components/MatchSummary";

export default function MatchSection({ match }) {
  const matchData = {
    summary: [
      {
        game: "Game 1",
        firstPick: "Team A",
        secondPick: "Team B",
        winner: "Team A",
      },
      {
        game: "Game 2",
        firstPick: "Team C",
        secondPick: "Team D",
        winner: "Team D",
      },
      {
        game: "Game 3",
        firstPick: "Team E",
        secondPick: "Team F",
        winner: "Team E",
      },
    ],
  };
  return (
    <div className="w-full mb-2">
      {/* Match Section */}
      <p className="text-xl font-bold">Match</p>

      <Card className="bg-gray-800 w-full mb-6 p-5 text-white">
        <p className="text-xl font-semibold">{match.week}</p>
        <p className="text-gray-400">
          {match.day}, {match.date}
        </p>

        <div className="flex justify-around mt-4">
          {/* Left Column (VS Teams and Summary) */}
          <div className="flex flex-col w-[50%] p-10 gap-5 border-r border-gray-700">
            {/* VS Teams Section */}
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center gap-2">
                <img
                  src={match.teamA.logo}
                  alt={match.teamA.name}
                  className="w-20 h-20"
                />
                <p className="text-lg">{match.teamA.name}</p>
                <div className="bg-success px-4 rounded-full font-bold text-md">
                  {match.teamA.score}
                </div>
              </div>
              <div className="text-2xl font-bold">VS</div>
              <div className="flex flex-col items-center gap-2">
                <img
                  src={match.teamB.logo}
                  alt={match.teamB.name}
                  className="w-20 h-20"
                />
                <p className="text-lg">{match.teamB.name}</p>
                <div className="bg-success px-4 rounded-full font-bold text-md">
                  {match.teamB.score}
                </div>
              </div>
            </div>

            {/* Match Summary Section */}
            <div className="flex w-full">
              <MatchSummary summary={matchData.summary} />
            </div>
          </div>

          {/* Right Column (Statistics) */}
          <div className="w-[50%] p-10">
            <div className="mt-4">
              {/* Statistics Grid */}
              <div className="grid grid-cols-4 text-center mt-2 gap-4">
                {/* Column Titles */}
                <div className="font-bold text-md">#</div>
                <div className="font-bold text-md">Wins</div>
                <div className="font-bold text-md">Loses</div>
                <div className="font-bold text-md">Win Rate</div>

                {/* First Pick */}
                <div className="text-lg">First Pick</div>
                <div className="border border-gray-700 rounded-md py-1 text-md">
                  2
                </div>
                <div className="border border-gray-700 rounded-md py-1 text-md">
                  0
                </div>
                <div className="border border-gray-700 rounded-md py-1 text-md">
                  100%
                </div>

                {/* Second Pick */}
                <div className="text-lg">Second Pick</div>
                <div className="border border-gray-700 rounded-md py-1 text-md">
                  0
                </div>
                <div className="border border-gray-700 rounded-md py-1 text-md">
                  0
                </div>
                <div className="border border-gray-700 rounded-md py-1 text-md">
                  0%
                </div>

                {/* Total Game */}
                <div className="text-lg">Total Game</div>
                <div className="border border-gray-700 rounded-md py-1 text-md">
                  2
                </div>
                <div className="border border-gray-700 rounded-md py-1 text-md">
                  0
                </div>
                <div className="border border-gray-700 rounded-md py-1 text-md">
                  100%
                </div>

                {/* Total Match */}
                <div className="text-lg">Total Match</div>
                <div className="border border-gray-700 rounded-md py-1 text-md">
                  0
                </div>
                <div className="border border-gray-700 rounded-md py-1 text-md">
                  0
                </div>
                <div className="border border-gray-700 rounded-md py-1 text-md">
                  0%
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
