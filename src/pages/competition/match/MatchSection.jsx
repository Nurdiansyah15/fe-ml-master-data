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
import Card from "../../../components/Card";

export default function MatchSection({ match }) {
  // const { teams } = useSelector((state) => state.selectionTeam);
  // const { games } = useSelector((state) => state.game);
  const [loading, setLoading] = React.useState(true); // Default loading true
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (match?.MatchID) {
  //     setLoading(true); // Set loading true saat mulai fetch
  //     Promise.all([
  //       dispatch(getAllTeamsInMatch(match?.MatchID)),
  //       dispatch(getAllGamesForMatch(match?.MatchID)),
  //     ])
  //       .then(() => setLoading(false)) // Selesai fetch
  //       .catch((error) => {
  //         console.error("Error loading data:", error);
  //         setLoading(false);
  //       });
  //   }
  // }, [dispatch, match?.MatchID, games?.length]);

  const columns = [
    { label: "Game", field: "game", type: "text" },
    { label: "First Pick", field: "first", type: "select" },
    { label: "Second Pick", field: "second", type: "select" },
    { label: "Win", field: "win", type: "select" },
  ];

  const initialData = [{
    id: 1,
    game: "Game 1",
    first: "1",
    second: "2",
    win: "1",
  }];

  let selectOptions = [];
  // if (teams) {
  //   selectOptions = {
  //     first: teams.map((team) => ({
  //       value: team.TeamID,
  //       label: team.Name,
  //       logo: team.Logo,
  //     })),
  //     second: teams.map((team) => ({
  //       value: team.TeamID,
  //       label: team.Name,
  //       logo: team.Logo,
  //     })),
  //     win: teams.map((team) => ({
  //       value: team.TeamID,
  //       label: team.Name,
  //       logo: team.Logo,
  //     })),
  //   };
  // }

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
    <div className="mb-2 w-full">
      <p className="text-xl font-bold mb-4">Match: RRQ - EVOS</p>
      <div className="flex flex-row space-x-5 w-full">
        <Card className="mb-6 p-8 text-white flex flex-1">
          <div className="flex flex-col space-y-6">
            <div>
              <p className="text-sm text-gray-400">Week 1 - August 11, 2024 - 18:15 WIB</p>
              <p className="text-3xl text-white font-bold">Day 2</p>
            </div>
            <div className="flex flex-row space-x-5 items-center">
              <div className="flex flex-col space-y-3">
                <button>
                  <div className="w-40 h-40 bg-gray-500"></div>
                </button>
                <div className="px-5 py-2 bg-[#61AB76] rounded-full">
                  <p className="text-center font-bold text-xl">2</p>
                </div>
              </div>
              <div className="text-3xl text-white font-bold">VS</div>
              <div className="flex flex-col space-y-3">
                <button>
                  <div className="w-40 h-40 bg-gray-500"></div>
                </button>
                <div className="px-5 py-2 bg-[#1F1F21] rounded-full border border-[#454545]">
                  <p className="text-center font-bold text-xl">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="flex w-full">
                <EditableTable
                  columns={columns}
                  initialData={initialData}
                  selectOptions={selectOptions}
                  onSaveRow={handleSaveRow}
                />
            </div> */}
          {/* </div> */}
          {/* </div> */}
        </Card>
        <Card className="flex flex-1 w-full mb-6 p-8">
          <div>Loading</div>
        </Card>
      </div>
    </div>
  );
}
