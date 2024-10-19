import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllHeroes } from "../../../../redux/thunks/heroThunk";
import {
  addGoldlaner,
  deleteGoldLaner,
  getAllGoldlaners,
  updateGoldlaner,
} from "../../../../redux/thunks/gameThunk";
import GameRoleResultTable from "./GameRoleResultTable";
import { clearGoldlaner } from "../../../../redux/features/goldlanerSlice";
import { getAllHeroPicks } from "../../../../redux/thunks/matchThunk";

export default function Goldlaner({ game, team, match }) {
  const dispatch = useDispatch();

  const { heroes } = useSelector((state) => state.hero);
  const { heroPicks } = useSelector((state) => state.heroPick);
  const { goldlaners } = useSelector((state) => state.goldlaner);

  const [initialData, setInitialData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil data heroes dan goldlaners berdasarkan game dan team ID
  useEffect(() => {
    if (game && team) {
      dispatch(getAllHeroes());
      dispatch(
        getAllHeroPicks({ matchID: match.match_id, teamID: team.team_id })
      );
      dispatch(
        getAllGoldlaners({ gameID: game.game_id, teamID: team.team_id })
      );
    }

    return () => {
      dispatch(clearGoldlaner())
    }
  }, [dispatch, game, team]);

  console.log("Goldlaners:", goldlaners);
  console.log("Heroes:", heroes);

  // Parsing kolom untuk tabel
  const columns = useMemo(
    () => [
      { label: "Hero", field: "hero", type: "select" },
      { label: "Early Result", field: "early_result", type: "select" },
    ],
    []
  );

  // Parsing data awal dari goldlaners untuk tabel
  useEffect(() => {
    if (goldlaners) {
      const parsedData = goldlaners.map((goldlaner) => ({
        id: goldlaner.goldlaner_id,
        hero: goldlaner.hero.hero_id,
        early_result: goldlaner.early_result,
      }));
      setInitialData(parsedData);
    }
    return () => {
      setInitialData([]);
    }
  }, [goldlaners]);

  console.log("Initial Data:", initialData);

  // Opsi select untuk heroes
  const heroOptions = useMemo(
    () =>
      heroPicks.map((hero) => ({
        value: hero.hero.hero_id,
        label: hero.hero.name,
        image: hero.hero.image,
      })),
    [heroPicks]
  );

  // Opsi select untuk early_result
  const earlyResultOptions = [
    { value: "win", label: "Win" },
    { value: "draw", label: "Draw" },
    { value: "lose", label: "Lose" },
  ];

  const onSaveRow = (dataForm) => {
    console.log("Saved Row Data:", dataForm);
    setLoading(true);

    const data = {
      gameID: game.game_id,
      teamID: team.team_id,
      hero_id: parseInt(dataForm.hero, 10),
      early_result: dataForm.early_result,
    };

    const action = dataForm.isNew
      ? addGoldlaner(data)
      : updateGoldlaner({ goldLanerID: dataForm.id, ...data });

    dispatch(action)
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllGoldlaners({ gameID: game.game_id, teamID: team.team_id })
        );
        setLoading(false);
      });
  };

  const handleDeleteRow = (id) => {
    setLoading(true);
    if (id === undefined) return;

    dispatch(
      deleteGoldLaner({
        gameID: game.game_id,
        teamID: team.team_id,
        goldLanerID: id,
      })
    )
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllGoldlaners({ gameID: game.game_id, teamID: team.team_id })
        );
        setLoading(false);
      });
  };

  return (
    <div className="w-full flex">
      <GameRoleResultTable
        columns={columns}
        initialData={initialData}
        selectOptions={{
          hero: heroOptions,
          early_result: earlyResultOptions,
        }}
        onDelete={handleDeleteRow}
        onSaveRow={onSaveRow}
        maxRows={1}
      />
    </div>
  );
}
