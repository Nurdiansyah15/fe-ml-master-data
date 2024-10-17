import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllHeroes } from "../../../../redux/thunks/heroThunk";
import {
  addTrioMid,
  deleteTrioMid,
  getAllTrioMids,
  updateTrioMid,
} from "../../../../redux/thunks/gameThunk";
import { clearTrioMid } from "../../../../redux/features/trioMidSlice";
import GameRoleResultTable from "./GameRoleResultTable";

export default function TrioMid({ game, team }) {
  const dispatch = useDispatch();

  const { heroes } = useSelector((state) => state.hero);
  const { trioMids } = useSelector((state) => state.trioMid);

  const [initialData, setInitialData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil data heroes dan trioMids berdasarkan game dan team ID
  useEffect(() => {
    if (game && team) {
      dispatch(getAllHeroes());
      dispatch(getAllTrioMids({ gameID: game.game_id, teamID: team.team_id }));
    }

    return () => {
      dispatch(clearTrioMid());
    };
  }, [dispatch, game, team]);

  console.log("TriosMid:", trioMids);
  console.log("Heroes:", heroes);

  // Parsing kolom untuk tabel
  const columns = useMemo(
    () => [
      { label: "Hero", field: "hero", type: "select" },
      { label: "Role", field: "role", type: "select" },
      { label: "Early Result", field: "early_result", type: "select" },
    ],
    []
  );

  // Parsing data awal dari trioMids untuk tabel
  useEffect(() => {
    if (trioMids) {
      const parsedData = trioMids.map((trioMid) => ({
        id: trioMid.trio_mid_hero_id,
        hero: trioMid.hero.hero_id,
        role: trioMid.role,
        early_result: trioMid.early_result,
      }));
      setInitialData(parsedData);
    }
  }, [trioMids]);

  console.log("Initial Data:", initialData);

  // Opsi select untuk heroes
  const heroOptions = useMemo(
    () =>
      heroes.map((hero) => ({
        value: hero.hero_id,
        label: hero.name,
        image: hero.image,
      })),
    [heroes]
  );

  // Opsi select untuk performance
  const earlyResultOptions = [
    { value: "win", label: "Win" },
    { value: "draw", label: "Draw" },
    { value: "lose", label: "Lose" },
  ];

  // 'jungler', 'midlaner', 'roamer'
  const roleOptions = [
    { value: "jungler", label: "Jungler" },
    { value: "midlaner", label: "Midlaner" },
    { value: "roamer", label: "Roamer" },
  ];

  const onSaveRow = (dataForm) => {
    console.log("Saved Row Data:", dataForm);
    setLoading(true);

    const data = {
      gameID: game.game_id,
      teamID: team.team_id,
      role: dataForm.role,
      hero_id: parseInt(dataForm.hero, 10),
      early_result: dataForm.early_result,
    };

    const action = dataForm.isNew
      ? addTrioMid(data)
      : updateTrioMid({ trioMidHeroID: dataForm.id, ...data });

    dispatch(action)
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllTrioMids({ gameID: game.game_id, teamID: team.team_id })
        );
        setLoading(false);
      });
  };

  const handleDeleteRow = (id) => {
    setLoading(true);
    if (id === undefined) return;

    dispatch(
      deleteTrioMid({
        gameID: game.game_id,
        teamID: team.team_id,
        trioMidHeroID: id,
      })
    )
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllTrioMids({ gameID: game.game_id, teamID: team.team_id })
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
          role: roleOptions,
        }}
        onDelete={handleDeleteRow}
        onSaveRow={onSaveRow}
      />
    </div>
  );
}
