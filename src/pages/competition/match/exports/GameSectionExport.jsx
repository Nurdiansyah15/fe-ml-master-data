import { Tab, Tabs } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../../api/axiosInstance";
import { getAllMatchGames, updateGame } from "../../../../redux/thunks/gameThunk";
import Card from "../../../../components/Card";
import DraftLinkForm from "../components/DraftLinkForm";
import TrioMid from "../components/TrioMid";
import Goldlaner from "../components/Goldlaner";
import Explaner from "../components/Explaner";
import GameResult from "../components/GameResult";
import Turtle from "../components/Turtle";
import Lord from "../components/Lord";
import GameDataExport from "./GameDataExport";
import { useParams } from "react-router-dom";

export default function GameSectionExport({ team }) {
  const dispatch = useDispatch();
  const { games } = useSelector((state) => state.game);
  const { match } = useSelector((state) => state.match);
  const { matchID } = useParams();
  


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (match) {
      setLoading(true);
      Promise.all([dispatch(getAllMatchGames(matchID))]).finally(() =>
        setLoading(false)
      );
    }
  }, [dispatch, match]);

  return (
    <div className="flex w-full flex-col">
      {match && games.map((game) => {
        function handleSaveDraft(rowData) {
          setLoading(true);
          const data = {
            matchID: matchID,
            gameID: game.game_id,
            gameNumber: game.game_number,
            firstPickTeamID: game.first_pick_team_id,
            secondPickTeamID: game.second_pick_team_id,
            winnerTeamID: game.winner_team_id,
            videoLink: rowData.videoLink,
            fullDraftImage: rowData.imageFile,
          };

          dispatch(updateGame(data)).finally(() => setLoading(false));
        }

        return (
          <div key={game.game_id}>
            <hr className="my-20" />
            <GameDataExport
              match={match}
              game={game}
              team={team}
              handleSaveDraft={handleSaveDraft}
            />
          </div>
        )
      })}
    </div>
  );
}
