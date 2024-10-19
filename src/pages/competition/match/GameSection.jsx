import { Tab, Tabs } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../../components/Card";
import { getAllMatchGames } from "../../../redux/thunks/gameThunk";
import Explaner from "./components/Explaner";
import Goldlaner from "./components/Goldlaner";
import Lord from "./components/Lord";
import TrioMid from "./components/TrioMid";
import Turtle from "./components/Turtle";
import axiosInstance from "../../../api/axiosInstance";
import GameResult from "./components/GameResult";

export default function GameSection({ team, match }) {
  const dispatch = useDispatch();
  const { games } = useSelector((state) => state.game);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (match) {
      setLoading(true);
      Promise.all([dispatch(getAllMatchGames(match?.match_id))]).finally(() =>
        setLoading(false)
      );
    }
  }, [dispatch, match]);

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="light"
        className="w-fit rounded-xl border border-gray-700"
      >
        {games &&
          games.map((game) => (
            <Tab key={game.game_id} title={`Game ${game.game_number}`}>
              <Card className="bg-transparent text-white p-2">
                <div className="flex flex-row space-x-5 items-center">
                  <p className="text-lg font-semibold">Result</p>
                  <p
                    className={`px-4 py-2 ${
                      game.winner_team_id === team?.team_id
                        ? "bg-[#324B39] text-[#61AB76]"
                        : "bg-[#4b3232] text-[#ab6161]"
                    } text-sm rounded-full font-bold`}
                  >
                    {game.winner_team_id === team?.team_id ? "Win" : "Lose"}
                  </p>
                </div>
                <div className="flex flex-col mt-5">
                  <div className="flex w-full flex-col">
                    <Tabs
                      aria-label="Options"
                      color="primary"
                      variant="light"
                      className="w-fit rounded-xl border border-gray-700"
                    >
                      <Tab key="goldlaner" title="Goldlaner">
                        <Card className="bg-[#161618] text-white">
                          <Goldlaner game={game} team={team} />
                        </Card>
                      </Tab>
                      <Tab key="explaner" title="Explaner">
                        <Card className="bg-[#161618] text-white">
                          <Explaner game={game} team={team} />
                        </Card>
                      </Tab>
                      <Tab key="trio-mid" title="Trio Mid">
                        <Card className="bg-[#161618] text-white">
                          <TrioMid game={game} team={team} />
                        </Card>
                      </Tab>
                    </Tabs>
                  </div>
                  <div className="flex w-full flex-col p-1">
                    <GameResult game={game} team={team} />
                  </div>
                </div>
                <div className="flex w-full flex-col mt-5">
                  <Tabs
                    aria-label="Options"
                    color="primary"
                    variant="light"
                    className="w-fit rounded-xl border border-gray-700"
                  >
                    <Tab key="turtle" title="Turtle Result">
                      <Card className="bg-[#161618] text-white">
                        <Turtle game={game} team={team} match={match} />
                      </Card>
                    </Tab>
                    <Tab key="lord" title="Lord Result">
                      <Card className="bg-[#161618] text-white">
                        <Lord game={game} team={team} match={match} />
                      </Card>
                    </Tab>
                  </Tabs>
                </div>
              </Card>
            </Tab>
          ))}
      </Tabs>
    </div>
  );
}
