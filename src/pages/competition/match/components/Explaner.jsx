import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllHeroes } from "../../../../redux/thunks/heroThunk";
import {
  addExplaner,
  deleteExplaner,
  getAllExplaners,
  updateExplaner,
} from "../../../../redux/thunks/gameThunk";
import GameRoleResultTable from "./GameRoleResultTable";
import { clearExplaner } from "../../../../redux/features/explanerSlice";
import { getAllHeroPicks } from "../../../../redux/thunks/matchThunk";

export default function Explaner({ headerClassName, cellClassName, game, team, match }) {
  const dispatch = useDispatch();

  const { heroes } = useSelector((state) => state.hero);
  const { explaners } = useSelector((state) => state.explaner);

  const { heroPicks } = useSelector((state) => state.heroPick);

  const [initialData, setInitialData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil data heroes dan explaners berdasarkan game dan team ID
  useEffect(() => {
    if (game && team) {
      dispatch(getAllHeroes());
      dispatch(
        getAllHeroPicks({ matchID: match.match_id, teamID: team.team_id })
      );
      dispatch(getAllExplaners({ gameID: game.game_id, teamID: team.team_id }));
    }

    return () => {
      dispatch(clearExplaner());
    };
  }, [dispatch, game, team]);

  // Parsing kolom untuk tabel
  const columns = useMemo(
    () => [
      { label: "Hero", field: "hero", type: "select" },
      { label: "Early Result", field: "early_result", type: "select" },
    ],
    []
  );

  // Parsing data awal dari explaners untuk tabel
  useEffect(() => {
    if (explaners) {
      const parsedData = explaners.map((explaner) => ({
        id: explaner.explaner_id,
        hero: explaner.hero.hero_id,
        early_result: explaner.early_result,
      }));
      setInitialData(parsedData);
    }
    return () => {
      setInitialData([]);
    }
  }, [explaners]);

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

  // Opsi select untuk performance
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
      ? addExplaner(data)
      : updateExplaner({ explanerID: dataForm.id, ...data });

    dispatch(action)
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllExplaners({ gameID: game.game_id, teamID: team.team_id })
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
      deleteExplaner({
        gameID: game.game_id,
        teamID: team.team_id,
        explanerID: id,
      })
    )
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllExplaners({ gameID: game.game_id, teamID: team.team_id })
        );
        setLoading(false);
      });
  };

  return (
    <div className="w-full flex">
      <GameRoleResultTable
        headerClassName={headerClassName}
        cellClassName={cellClassName}
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
