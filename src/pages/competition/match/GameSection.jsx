import { CardBody, Tab, Tabs } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Explaner from "./components/Explaner";
import Goldlaner from "./components/Goldlaner";
import Lord from "./components/Lord";
import TrioMid from "./components/TrioMid";
import Turtle from "./components/Turtle";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../../components/Card";
import { getAllMatchGames } from "../../../redux/thunks/gameThunk";
import { g } from "framer-motion/client";

export default function GameSection({ team, match }) {

  const dispatch = useDispatch();

  const { heroes } = useSelector((state) => state.hero);

  const { games } = useSelector((state) => state.game);

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);

  useEffect(() => {
    if (match) {
      setLoading(true);
      Promise.all([
        dispatch(getAllMatchGames(match?.match_id)),
      ]).finally(() => setLoading(false));
    }
  }, [dispatch, match]);


  return (
    <div className="flex w-full flex-col mt-10">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="light"
        className="w-fit rounded-xl border border-gray-700"
      >
        {games && games.map((game) => (
          <Tab key={game.game_id} title={`Game ${game.game_number}`}>
            <Card className="bg-transparent text-white p-2">
              <div className="flex flex-row space-x-5 items-center">
                <p className="text-lg font-semibold">Result</p>
                <p className={`px-4 py-2 ${game.winner_team_id === team?.team_id ? "bg-[#324B39] text-[#61AB76]" : "bg-[#4b3232] text-[#ab6161]"} text-sm rounded-full font-bold`}>{game.winner_team_id === team?.team_id ? "Win" : "Lose"}</p>
              </div>
              <div className="flex flex-row mt-5">
                <div className="flex w-full flex-col">
                  <Tabs
                    aria-label="Options"
                    color="primary"
                    variant="light"
                    className="w-fit rounded-xl border border-gray-700"
                  >
                    <Tab key="trio-mid" title="Trio Mid">
                      <Card className="bg-[#161618] text-white">
                        <TrioMid />
                      </Card>
                    </Tab>
                    <Tab key="goldlaner" title="Goldlaner">
                      <Card className="bg-[#161618] text-white">
                        <Goldlaner />
                      </Card>
                    </Tab>
                    <Tab key="explaner" title="Explaner">
                      <Card className="bg-[#161618] text-white">
                        <Explaner />
                      </Card>
                    </Tab>
                  </Tabs>
                </div>
                <Card className="bg-[#161618] text-white"></Card>
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
                      <Turtle />
                    </Card>
                  </Tab>
                  <Tab key="lord" title="Lord Result">
                    <Card className="bg-[#161618] text-white">
                      <Lord />
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
