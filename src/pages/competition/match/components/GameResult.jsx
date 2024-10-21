import React from "react";
import Card from "../../../../components/Card";
import { useEffect } from "react";
import { useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import { useSelector } from "react-redux";

export default function GameResult({ game, team }) {
  const [gameResult, setGameResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { goldlaners } = useSelector((state) => state.goldlaner);
  const { explaners } = useSelector((state) => state.explaner);
  const { trioMidResult, trioMids } = useSelector((state) => state.trioMid);
  const [resultColor, setResultColor] = useState(0);

  const getGameResult = async ({ teamID, gameID }) => {
    const result = await axiosInstance.get(
      `/api/games/${gameID}/teams/${teamID}/game-results`
    );
    return result;
  };

  useEffect(() => {
    if (team && game) {
      setLoading(true);
      getGameResult({ teamID: team?.team_id, gameID: game?.game_id })
        .then((result) => {
          setGameResult(result.data);
          setResultColorFunc(result.data.result);
          setLoading(false);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [team, game, goldlaners, explaners, trioMidResult, trioMids]);

  const setResultColorFunc = (result) => {
    if (result === "Good Early") {
      setResultColor(100);
    } else if (result === "Ok Early") {
      setResultColor(50);
    } else if (result === "Bad Early") {
      setResultColor(10);
    } else if (result === "No Result") {
      setResultColor(0);
    }
  };

  const getWinrateColor = (winRate) => {
    // Gradasi warna dari merah (0%) ke hijau (100%)
    const red = Math.round(255 - (winRate / 100) * 255);
    const green = Math.round((winRate / 100) * 255);
    return `rgb(${red}, ${green}, 0)`; // Warna RGB
  };

  console.log("gameResult", gameResult);
  console.log("resultColor", resultColor);

  return (
    <div>
      <Card className="bg-[#161618] text-white">
        <h2 className="text-2xl font-bold my-2 text-center">
          Hero Game Result
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row space-x-5 items-center">
            <Card className={`text-center w-full`}>
              <h3 className="text-lg font-semibold mb-2">Win</h3>
              <p className="text-2xl font-bold">{gameResult?.win}</p>
            </Card>
            <Card className={`text-center w-full`}>
              <h3 className="text-lg font-semibold mb-2">Draw</h3>
              <p className="text-2xl font-bold">{gameResult?.draw}</p>
            </Card>
            <Card className={`text-center w-full`}>
              <h3 className="text-lg font-semibold mb-2">Lose</h3>
              <p className="text-2xl font-bold">{gameResult?.lose}</p>
            </Card>
          </div>

          <div
            className={`flex flex-col space-y-3 bg-[#1F1F21] border border-[#454545] px-5 py-3 rounded-xl text-center`}
            style={{
              backgroundColor:
                resultColor === 0
                  ? "@apply bg-transparent"
                  : getWinrateColor(resultColor),
            }}
          >
            <h3 className="text-lg font-semibold mb-2">Result</h3>
            <p className="text-2xl font-bold">{gameResult?.result}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
