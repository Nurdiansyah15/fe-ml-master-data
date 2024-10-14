import { Card } from "@nextui-org/react";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditableTable from "../../../archive/EditableTable";
import { fromUnixTime } from "../../../utils/timeFormator";
import { getAllTeamsInMatch } from "../../../redux/features/selectionTeamSlice";
import {
  createGameForMatch,
  getAllGamesForMatch,
  updateGame,
} from "../../../redux/features/gameSlice";

export default function MatchSection({ match }) {
  const { teams } = useSelector((state) => state.selectionTeam);
  const { games } = useSelector((state) => state.game);
  const [loading, setLoading] = React.useState(true); // Default loading true
  const dispatch = useDispatch();

  useEffect(() => {
    if (match?.MatchID) {
      setLoading(true); // Set loading true saat mulai fetch
      Promise.all([
        dispatch(getAllTeamsInMatch(match?.MatchID)),
        dispatch(getAllGamesForMatch(match?.MatchID)),
      ])
        .then(() => setLoading(false)) // Selesai fetch
        .catch((error) => {
          console.error("Error loading data:", error);
          setLoading(false);
        });
    }
  }, [dispatch, match?.MatchID, games?.length]);

  const columns = [
    { label: "Game", field: "game", type: "text" },
    { label: "First Pick", field: "first", type: "select" },
    { label: "Second Pick", field: "second", type: "select" },
    { label: "Win", field: "win", type: "select" },
  ];

  const initialData = games.map((game) => ({
    id: game.GameID,
    game: game.GameNumber.toString(),
    first: game.FirstPickTeamID.toString(),
    second: game.SecondPickTeamID.toString(),
    win: game.WinnerTeamID?.toString() || "",
  }));

  let selectOptions = [];
  if (teams) {
    selectOptions = {
      first: teams.map((team) => ({
        value: team.TeamID,
        label: team.Name,
        logo: team.Logo,
      })),
      second: teams.map((team) => ({
        value: team.TeamID,
        label: team.Name,
        logo: team.Logo,
      })),
      win: teams.map((team) => ({
        value: team.TeamID,
        label: team.Name,
        logo: team.Logo,
      })),
    };
  }

  const handleSaveRow = (rowData) => {
    console.log(`Action:`, rowData);
    setLoading(true);
    const data = {
      matchID: match?.MatchID,
      gameNumber: parseInt(rowData.game),
      firstPickTeamID: parseInt(rowData.first),
      secondPickTeamID: parseInt(rowData.second),
      winnerTeamID: parseInt(rowData.win),
    };
    if (rowData.isNew) {
      dispatch(createGameForMatch(data))
        .unwrap()
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      data.gameID = rowData.id;
      dispatch(updateGame(data))
        .unwrap()
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="w-full mb-2">
      <p className="text-xl font-bold mb-4">Match</p>
      <Card className="bg-gray-800 w-full mb-6 p-5 text-white">
        <p className="text-xl font-semibold">
          Week {match?.Week} Day {match?.Day}
        </p>
        <p className="text-sm text-gray-400">
          {moment(fromUnixTime(match?.Date)).format("MMMM DD, YYYY")}
        </p>
        <p className="text-sm text-gray-400">
          {moment(fromUnixTime(match?.Date)).format("HH:mm a")}
        </p>

        <div className="flex justify-around mt-4">
          <div className="flex flex-col w-[50%] p-4 gap-5 border-r border-gray-700">
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center gap-2">
                <img
                  src={match?.TournamentTeam?.Team?.Logo}
                  alt={match?.TournamentTeam?.Team?.Name}
                  className="w-36 h-36 rounded-lg object-cover"
                />
                <p className="text-lg">{match?.TournamentTeam?.Team.Name}</p>
                <div className="bg-success px-4 rounded-full font-bold text-lg">
                  0
                </div>
              </div>
              <div className="text-2xl font-bold">VS</div>
              <div className="flex flex-col items-center gap-2">
                <img
                  src={match?.OpponentTeam?.Logo}
                  alt={match?.OpponentTeam?.Name}
                  className="w-36 h-36 rounded-lg object-cover"
                />
                <p className="text-lg">{match?.OpponentTeam?.Name}</p>
                <div className="bg-success px-4 rounded-full font-bold text-lg">
                  0
                </div>
              </div>
            </div>

            <div className="flex w-full">
              {loading ? (
                <p className="text-center w-full text-lg">Loading...</p>
              ) : (
                <EditableTable
                  columns={columns}
                  initialData={initialData}
                  selectOptions={selectOptions}
                  onSaveRow={handleSaveRow}
                />
              )}
            </div>
          </div>

          <div className="w-[50%] p-10">
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
        </div>
      </Card>
    </div>
  );
}
