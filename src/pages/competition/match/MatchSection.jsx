import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditableTable from "../../../archive/EditableTable";
import { getAllTeamsInMatch } from "../../../redux/thunks/teamThunk";
import {
  createMatchGame,
  updateGame,
  getAllMatchGames,
} from "../../../redux/thunks/gameThunk";
import Card from "../../../components/Card";

export default function MatchSection({ match, handleChooseTeam }) {
  const dispatch = useDispatch();
  const { teams } = useSelector((state) => state.teamMatch);
  const { games } = useSelector((state) => state.game);

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);

  // console.log("matchlalalalal", match);

  // Fetch teams and games when match_id is available
  useEffect(() => {
    if (match) {
      setLoading(true);
      Promise.all([
        dispatch(getAllTeamsInMatch(match?.match_id)),
        dispatch(getAllMatchGames(match?.match_id)),
      ]).finally(() => setLoading(false));
    }
  }, [dispatch, match]);

  // Populate initial data for the editable table
  useEffect(() => {
    const data = games.map((game) => ({
      id: game.game_id,
      game: game.game_number,
      first: game.first_pick_team_id,
      second: game.second_pick_team_id,
      win: game.winner_team_id,
    }));
    setInitialData(data);

    return () => setInitialData([]); // Clean up on unmount
  }, [games]);

  // Memoize select options for performance optimization
  const selectOptions = useMemo(() => {
    if (!teams) return {};

    return ["first", "second", "win"].reduce((options, key) => {
      options[key] = teams.map((team) => ({
        value: team.team_id,
        label: team.name,
        image: team.image,
      }));
      return options;
    }, {});
  }, [teams]);

  // Handle saving a row (create or update game)
  const handleSaveRow = (rowData) => {
    setLoading(true);
    const data = {
      matchID: match?.match_id,
      gameNumber: parseInt(rowData.game, 10),
      firstPickTeamID: parseInt(rowData.first, 10),
      secondPickTeamID: parseInt(rowData.second, 10),
      winnerTeamID: parseInt(rowData.win, 10),
      videoLink: "",
      fullDraftImage: "",
    };

    const action = rowData.isNew
      ? createMatchGame(data)
      : updateGame({ ...data, gameID: rowData.id });

    dispatch(action)
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoading(false));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mb-10 w-full">
      <p className="text-xl font-bold mb-4">
        {match?.team_a?.name} VS {match?.team_b?.name}
      </p>
      <div className="flex flex-row space-x-5 w-full">
        <Card className="text-white flex flex-1 max-w-[60%]">
          <div className="flex flex-col space-y-6 pb-10">
            <MatchDetails match={match} handleChooseTeam={handleChooseTeam} />
            <div className="flex w-full">
              <EditableTable
                columns={[
                  { label: "Game", field: "game", type: "text" },
                  { label: "First Pick", field: "first", type: "select" },
                  { label: "Second Pick", field: "second", type: "select" },
                  { label: "Win", field: "win", type: "select" },
                ]}
                initialData={initialData}
                selectOptions={selectOptions}
                onSaveRow={handleSaveRow}
              />
            </div>
          </div>
        </Card>
        <Card className="flex flex-1 w-[40%] mb-6 p-8">
          <div>Additional Content</div>
        </Card>
      </div>
    </div>
  );
}

// Component to display match details
function MatchDetails({ match, handleChooseTeam }) {
  return (
    <>
      <div>
        <p className="text-sm text-gray-400">
          Week {match?.week} -{" "}
          {moment(match?.datetime).format("MMM Do, YYYY h:mm A")}
        </p>
        <p className="text-3xl text-white font-bold">Day {match?.day}</p>
      </div>
      <div className="flex flex-row space-x-10 justify-center items-center p-2">
        <TeamCard
          team={match?.team_a}
          score={match?.team_a_score}
          handleChooseTeam={handleChooseTeam}
        />
        <div className="text-3xl text-white font-bold">VS</div>

        <TeamCard
          team={match?.team_b}
          score={match?.team_b_score}
          handleChooseTeam={handleChooseTeam}
        />
      </div>
    </>
  );
}

// Component to display individual team card
function TeamCard({ team, score, handleChooseTeam }) {
  return (
    <div className="flex flex-col space-y-3">
      <div
        className="w-40 h-40 cursor-pointer hover:scale-105 transition"
        onClick={() => handleChooseTeam(team)}
      >
        <img
          src={team?.image}
          alt={team?.name}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="px-5 py-2 bg-[#61AB76] rounded-full">
        <p className="text-center font-bold text-xl">{score}</p>
      </div>
    </div>
  );
}
