import React from "react";
import Card from "../../../../components/Card";
import { X } from "lucide-react";
import { useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useContext } from "react";
import MatchEditContext from "../../../../contexts/MatchEditContext";

export default function MemberMatchTeam({ cardClassName, cardTextClassName, match, member, onDelete, type }) {
  const { isEditingMatch, toggleEditing, removeEditing } =
    useContext(MatchEditContext);
  const [memberStats, setMemberStats] = useState(null);
  const { games } = useSelector((state) => state.game);

  const getMemberStats = async () => {
    try {
      const result = await axiosInstance.get(
        `/api/tournaments/${match?.tournament_id}/${type}s/${
          member[type][`${type}_id`]
        }/${type}-statistics`
      );
      setMemberStats(result.data);
    } catch (error) {
      console.error("Error fetching team stats:", error);
    }
  };

  useEffect(() => {
    if (member && match) {
      getMemberStats();
    }
  }, [member, match, games]);

  const calculateWinRate = (wins, total) =>
    total > 0 ? Math.round((wins / total) * 100) : 0;

  const getWinrateColor = (winRate) => {
    // Gradasi warna dari merah (0%) ke hijau (100%)
    const red = Math.round(255 - (winRate / 100) * 255);
    const green = Math.round((winRate / 100) * 255);
    return `rgb(${red}, ${green}, 0)`; // Warna RGB
  };

  const matchWinRate = memberStats
    ? calculateWinRate(memberStats.total_match_win, memberStats.total_match)
    : 0;

  const gameWinRate = memberStats
    ? calculateWinRate(memberStats.total_game_win, memberStats.total_game)
    : 0;

  const matchWinRateColor = getWinrateColor(matchWinRate);
  const gameWinRateColor = getWinrateColor(gameWinRate);

  return (
    <div className="relative flex flex-col">
      <p className="text-lg font-semibold text-center">
        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
      </p>
      <div className="w-40">
        <img
          src={member[type].image}
          alt={member[type].name}
          className="w-full h-56 object-cover rounded-lg"
        />
      </div>
      <Card className={`w-40 text-white px-3 py-1 mt-4 ${cardClassName}`}>
        <h3 className={`font-semibold text-lg ${cardTextClassName}`}>{member[type].name}</h3>
        <div className="flex gap-2">
          <div>
            <p className={`text-[10px] ${cardTextClassName}`}>Match Rate:</p>
            <p className={`text-lg`} style={{ color: matchWinRateColor }}>
              {matchWinRate}%
            </p>
          </div>
          <div>
            <p className={`text-[10px] ${cardTextClassName}`}>Game Rate:</p>
            <p className="text-lg" style={{ color: gameWinRateColor }}>
              {gameWinRate}%
            </p>
          </div>
        </div>
      </Card>

      {/* Tombol Delete */}
      {isEditingMatch && (
        <button
          className="absolute top-0 right-0 bg-red-500 p-1 rounded-full"
          onClick={() => onDelete(member[type][`${type}_id`])}
        >
          <X className="text-white w-5 h-5" />
        </button>
      )}
    </div>
  );
}
