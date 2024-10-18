import React, { useEffect, useState } from "react";
import Card from "../../../components/Card";
import axiosInstance from "../../../api/axiosInstance"; // Sesuaikan path axiosInstance

export default function TeamStatsSection({ team, match }) {
  const [teamStats, setTeamStats] = useState(null);

  const getTeamStats = async () => {
    try {
      const result = await axiosInstance.get(
        `/api/tournaments/${match?.tournament_id}/teams/${team?.team_id}/team-statistics`
      );
      setTeamStats(result.data);
    } catch (error) {
      console.error("Error fetching team stats:", error);
    }
  };

  useEffect(() => {
    if (team && match) {
      getTeamStats();
    }
  }, [team, match]);

  const calculateWinRate = (wins, total) =>
    total > 0 ? Math.round((wins / total) * 100) : 0;

  const getWinrateColor = (winRate) => {
    // Gradasi warna dari merah (0%) ke hijau (100%)
    const red = Math.round(255 - (winRate / 100) * 255);
    const green = Math.round((winRate / 100) * 255);
    return `rgb(${red}, ${green}, 0)`; // Warna RGB
  };

  return (
    <Card className="bg-[#1f1f21] p-5 text-white w-full rounded-xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center">Team Statistics</h2>
      <div className="flex w-full gap-6">
        {teamStats && (
          <>
            <StatCard
              title="First Pick"
              win={teamStats.totalFirstPickAndWin}
              loss={teamStats.totalFirstPickAndLose}
              total={teamStats.totalFirstPick}
              winRate={calculateWinRate(
                teamStats.totalFirstPickAndWin,
                teamStats.totalFirstPick
              )}
            />
            <StatCard
              title="Second Pick"
              win={teamStats.totalSecondPickAndWin}
              loss={teamStats.totalSecondPickAndLose}
              total={teamStats.totalSecondPick}
              winRate={calculateWinRate(
                teamStats.totalSecondPickAndWin,
                teamStats.totalSecondPick
              )}
            />
            <StatCard
              title="Game"
              win={teamStats.totalGameAndWin}
              loss={teamStats.totalGameAndLose}
              total={teamStats.totalGame}
              winRate={calculateWinRate(
                teamStats.totalGameAndWin,
                teamStats.totalGame
              )}
            />
            <StatCard
              title="Match"
              win={teamStats.totalMatchAndWin}
              loss={teamStats.totalMatchAndLose}
              total={teamStats.totalMatch}
              winRate={calculateWinRate(
                teamStats.totalMatchAndWin,
                teamStats.totalMatch
              )}
            />
          </>
        )}
      </div>
    </Card>
  );
}

function StatCard({ title, win, loss, total, winRate }) {
  const winrateColor = getWinrateColor(winRate); // Warna lingkaran dinamis

  return (
    <div className="border border-gray-700 p-4 flex flex-col justify-center items-center w-full rounded-xl">
      <h3 className="text-md font-semibold mb-2 text-white">{title}</h3>
      <div
        className={`flex items-center justify-center border-2 border-white rounded-full w-24 h-24 mb-4`}
        style={{ backgroundColor: winrateColor }}
      >
        <span className="text-2xl font-bold">{winRate}%</span>
      </div>
      <div className="flex items-center justify-center space-x-5">
        <p className="text-sm text-green-400">
          <span className="font-semibold">Win:</span> {win}
        </p>
        <p className="text-sm text-red-400">
          <span className="font-semibold">Loss:</span> {loss}
        </p>
        <p className="text-sm text-white">
          <span className="font-semibold">Total:</span> {total}
        </p>
      </div>
    </div>
  );
}

function getWinrateColor(winRate) {
  const red = Math.round(255 - (winRate / 100) * 255);
  const green = Math.round((winRate / 100) * 255);
  return `rgb(${red}, ${green}, 0)`; // Warna RGB dinamis berdasarkan winrate
}
