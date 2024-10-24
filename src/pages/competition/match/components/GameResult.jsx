import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../../../api/axiosInstance";
import Card from "../../../../components/Card";

export default function GameResult({ className, textClassName, game, team }) {
  const [gameResult, setGameResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { goldlaners } = useSelector((state) => state.goldlaner);
  const { explaners } = useSelector((state) => state.explaner);
  const { trioMidResult, trioMids } = useSelector((state) => state.trioMid);
  const [resultColor, setResultColor] = useState(0);
  const [bgColor, setBgColor] = useState("bg-transparent");

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
      setBgColor("bg-[#61AB76]");
    } else if (result === "Ok Early") {
      setResultColor(50);
      setBgColor("bg-[#E1BC57FF]");
    } else if (result === "Bad Early") {
      setResultColor(10);
      setBgColor("bg-[#C24B4BFF]");
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

  return (
    <div>
      <Card className={`bg-[#161618] text-white ${className}`}>
        <h2 className={`text-2xl font-bold my-2 text-center ${textClassName}`}>
          Hero Game Result
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row space-x-5 items-center">
            <Card className={`text-center w-full ${className}`}>
              <h3 className="text-lg font-semibold ">Win</h3>
              <p className="text-4xl font-bold">{gameResult?.win}</p>
            </Card>
            <Card className={`text-center w-full ${className}`}>
              <h3 className="text-lg font-semibold ">Draw</h3>
              <p className="text-4xl font-bold">{gameResult?.draw}</p>
            </Card>
            <Card className={`text-center w-full ${className}`}>
              <h3 className="text-lg font-semibold ">Lose</h3>
              <p className="text-4xl font-bold">{gameResult?.lose}</p>
            </Card>
          </div>

          <div
            className={`flex flex-col space-y-3 bg-[#1F1F21] border-2 border-[#00000027] px-5 py-8 rounded-xl text-center ${bgColor}`}
            // style={{
            //   backgroundColor:
            //     resultColor === 0
            //       ? "@apply bg-transparent"
            //       : getWinrateColor(resultColor),
            // }}
          >
            <p className={`text-4xl font-bold ${textClassName}`}>{gameResult?.result}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
