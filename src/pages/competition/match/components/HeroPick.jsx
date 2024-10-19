import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMatchGames } from "../../../../redux/thunks/gameThunk";
import { getAllHeroes } from "../../../../redux/thunks/heroThunk";
import HeroPickBanTable from "./HeroPickBanTable";
import {
  addHeroPick,
  deleteHeroPick,
  getAllHeroPicks,
  updateHeroPick,
} from "../../../../redux/thunks/matchThunk";

export default function HeroPick({ match, team }) {
  const dispatch = useDispatch();

  const { games } = useSelector((state) => state.game);
  const { heroes } = useSelector((state) => state.hero);
  const { heroPicks } = useSelector((state) => state.heroPick);

  const [initialData, setInitialData] = useState([]);

  const [loading, setLoading] = useState(false);

  // Ambil games berdasarkan match_id
  useEffect(() => {
    if (match) {
      dispatch(getAllMatchGames(match.match_id));
      dispatch(getAllHeroes());
      dispatch(
        getAllHeroPicks({ matchID: match.match_id, teamID: team.team_id })
      );
    }
  }, [dispatch, match]);

  console.log("HeroPicks:", heroPicks);
  console.log("Games:", games);
  console.log("Heroes:", heroes);

  // Parsing kolom game secara dinamis berdasarkan jumlah games
  const columns = useMemo(() => {
    const gameColumns = games.map((game, index) => ({
      label: `Game ${game.game_number}`,
      field: `game${index + 1}`,
      type: "checkbox",
    }));

    return [
      { label: "Hero", field: "hero", type: "select" },
      ...gameColumns,
      { label: "Total", field: "total", type: "text" },
      { label: "First Phase", field: "firstPhase", type: "number" },
      { label: "Second Phase", field: "secondPhase", type: "number" },
    ];
  }, [games]);

  // Parsing initial data dari heroPicks untuk tabel
  useEffect(() => {
    if (heroPicks) {
      const parsedData = heroPicks.map((pick) => {
        const gameFields = pick.hero_pick_game.reduce((acc, game) => {
          acc[`game${game.game_number}`] = game.is_picked;
          return acc;
        }, {});

        return {
          id: pick.hero_pick_id,
          hero: pick.hero.hero_id,
          ...gameFields,
          total: pick.total,
          firstPhase: pick.first_phase,
          secondPhase: pick.second_phase,
        };
      });
      setInitialData(parsedData);
    }
    return () => {
      setInitialData([]);
    }
  }, [heroPicks]);

  console.log("Initial Data:", initialData);

  // Opsi select untuk memilih hero
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

    const heroPickGame = Object.entries(dataForm)
      .filter(([key]) => key.startsWith("game"))
      .map(([key, value]) => ({
        game_number: parseInt(key.replace("game", ""), 10),
        is_picked: value,
      }));

    const data = {
      matchID: match.match_id,
      teamID: team.team_id,
      heroID: parseInt(dataForm.hero, 10),
      firstPhase: parseInt(dataForm.firstPhase, 10),
      secondPhase: parseInt(dataForm.secondPhase, 10),
      total: parseInt(dataForm.total, 10),
      heroPickGame,
    };

    const action = dataForm.isNew
      ? addHeroPick(data)
      : updateHeroPick({ heroPickID: dataForm.id, ...data });

    dispatch(action)
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllHeroPicks({ matchID: match.match_id, teamID: team.team_id })
        );
        setLoading(false);
      });
  };

  const handleDeleteRow = (id) => {
    setLoading(true);
    if (id === undefined) return;
    dispatch(
      deleteHeroPick({
        matchID: match.match_id,
        teamID: team.team_id,
        heroPickID: id,
      })
    )
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllHeroPicks({ matchID: match.match_id, teamID: team.team_id })
        );
        setLoading(false);
      });
  };

  return (
    <div className="w-full flex">
      <HeroPickBanTable
        columns={columns}
        initialData={initialData}
        selectOptions={{ hero: selectOptions }}
        onDelete={handleDeleteRow}
        onSaveRow={onSaveRow}
      />
    </div>
  );
}
