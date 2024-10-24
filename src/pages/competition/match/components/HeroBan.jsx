import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMatchGames } from "../../../../redux/thunks/gameThunk";
import { getAllHeroes } from "../../../../redux/thunks/heroThunk";
import HeroPickBanTable from "./HeroPickBanTable";
import {
  addHeroBan,
  deleteHeroBan,
  getAllHeroBans,
  updateHeroBan,
} from "../../../../redux/thunks/matchThunk";
import { clearHero } from "../../../../redux/features/heroSlice";
import { clearHeroBans } from "../../../../redux/features/heroBanSlice";

export default function HeroBan({ headerClassName, cellClassName, match, team }) {
  const dispatch = useDispatch();

  const { games } = useSelector((state) => state.game);
  const { heroes } = useSelector((state) => state.hero);
  const { heroBans } = useSelector((state) => state.heroBan);

  const [initialData, setInitialData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch games, heroes, and hero bans based on match_id
  useEffect(() => {
    if (match) {
      dispatch(getAllMatchGames(match.match_id));
      dispatch(getAllHeroes());
      dispatch(
        getAllHeroBans({ matchID: match.match_id, teamID: team.team_id })
      );
    }

    return () => {
      dispatch(clearHero());
      dispatch(clearHeroBans());
    };
  }, [dispatch, match]);

  // Parsing columns dynamically based on the number of games
  const columns = useMemo(() => {
    const gameColumns = games.map((game, index) => ({
      label: `Game ${game.game_number}`,
      field: `game-${game.game_number}-${game.game_id}`,
      type: "checkbox",
    }));

    return [
      { label: "Hero", field: "hero", type: "select" },
      ...gameColumns,
      { label: "Total", field: "total", type: "text" },
      { label: "First Phase", field: "firstPhase", type: "text" },
      { label: "Second Phase", field: "secondPhase", type: "text" },
    ];
  }, [games]);

  // Parsing initial data from heroBans for the table
  useEffect(() => {
    if (heroBans) {
      const parsedData = heroBans.map((ban) => {
        const gameFields = ban.hero_ban_game?.reduce((acc, game) => {
          acc[`game-${game.game_number}-${game.game_id}`] = game.is_banned;
          return acc;
        }, {});

        return {
          id: ban.hero_ban_id,
          hero: ban.hero.hero_id,
          ...gameFields,
          total: ban.total,
          firstPhase: ban.first_phase,
          secondPhase: ban.second_phase,
        };
      });
      setInitialData(parsedData);
    }
    return () => {
      setInitialData([]);
    };
  }, [heroBans]);

  // Options for selecting heroes
  const selectOptions = useMemo(() => {
    return heroes.map((hero) => ({
      value: hero.hero_id,
      label: hero.name,
      image: hero.image,
    }));
  }, [heroes]);

  const onSaveRow = (dataForm) => {
    console.log("Saved Row Data:", dataForm);
    setLoading(true);

    const heroBanGame = Object.entries(dataForm)
      .filter(([key]) => key.startsWith("game"))
      .map(([key, value]) => ({
        game_id: parseInt(key.split("-")[2], 10),
        game_number: parseInt(key.split("-")[1], 10),
        is_banned: value,
      }));

    const data = {
      matchID: match.match_id,
      teamID: team.team_id,
      heroID: parseInt(dataForm.hero, 10),
      firstPhase: parseInt(dataForm.firstPhase, 10),
      secondPhase: parseInt(dataForm.secondPhase, 10),
      total: parseInt(dataForm.total, 10),
      heroBanGame,
    };

    const action = dataForm.isNew
      ? addHeroBan(data)
      : updateHeroBan({ heroBanID: dataForm.id, ...data });

    dispatch(action)
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllHeroBans({ matchID: match.match_id, teamID: team.team_id })
        );
        setLoading(false);
      });
  };

  const handleDeleteRow = (id) => {
    setLoading(true);
    if (id === undefined) {
      setLoading(false);
      return;
    };
    dispatch(
      deleteHeroBan({
        matchID: match.match_id,
        teamID: team.team_id,
        heroBanID: id,
      })
    )
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllHeroBans({ matchID: match.match_id, teamID: team.team_id })
        );
        setLoading(false);
      });
  };

  return (
    <div className="w-full flex">
      <HeroPickBanTable
        headerClassName={headerClassName}
        cellClassName={cellClassName}
        columns={columns}
        initialData={initialData}
        selectOptions={{ hero: selectOptions }}
        onDelete={handleDeleteRow}
        onSaveRow={onSaveRow}
      />
    </div>
  );
}
