import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllHeroes } from "../../../../redux/thunks/heroThunk";
import EditableTable from "../../../../archive/EditableTable";
import CustomEditableTable from "../../../../archive/CustomEditableTable";
import {
  addPriorityPick,
  deletePriorityPick,
  getAllPriorityPicks,
  updatePriorityPick,
} from "../../../../redux/thunks/priorityPickThunk";
import { getAllHeroPicks } from "../../../../redux/thunks/matchThunk";

export default function PriorityPick({ headerClassName, cellClassName, team, match }) {
  const dispatch = useDispatch();

  const { heroPicks } = useSelector((state) => state.heroPick);

  const { priorityPicks } = useSelector((state) => state.priorityPick);

  const { games } = useSelector((state) => state.game);

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);

  useEffect(() => {
    if (match) {
      dispatch(
        getAllHeroPicks({ matchID: match.match_id, teamID: team.team_id })
      );
    }
  }, [dispatch, match]);

  const columns = [
    {
      label: "Hero",
      field: "hero",
      type: "select",
      renderCell: (value, options) => {
        const hero = options.find((option) => option.value == value);
        return (
          <div className="flex items-center gap-2 justify-center">
            <img
              src={hero?.image || "https://via.placeholder.com/32"}
              alt="Hero"
              className="w-8 h-8 rounded-full"
            />
            <span>{hero?.label || "Unknown"}</span>
          </div>
        );
      },
    },
    {
      label: "Total",
      field: "total",
      type: "number",
      dependsOn: ["hero"],
      calculate: (rowData) => {
        const selectedHeroPick = heroPicks.filter(
          (heroPick) => heroPick.hero.hero_id === parseInt(rowData.hero, 10)
        );
        return selectedHeroPick.length > 0 ? selectedHeroPick[0].total : 0;
      },
      readOnly: true,
    },
    { label: "Role", field: "role", type: "select" },
    {
      label: "Rate Pick",
      field: "ratePick",
      type: "number",
      dependsOn: ["total"],
      readOnly: true,
      calculate: (rowData) => {
        console.log("rowData: ", rowData);

        console.log(
          "total: ",
          ((rowData.total / games?.length) * 100).toFixed(2)
        );

        const selectedHeroPick = heroPicks.filter(
          (heroPick) => heroPick.hero.hero_id === parseInt(rowData.hero, 10)
        );
        return selectedHeroPick.pick_rate
          ? selectedHeroPick.pick_rate
          : ((rowData.total / games?.length) * 100).toFixed(2);
      },
    },
  ];

  const selectOptions = useMemo(() => {
    if (!heroPicks || heroPicks.length === 0) return {};

    return {
      hero: heroPicks
        .filter((heroPick) => heroPick.first_phase !== 0)
        .map((heroPick) => ({
          value: heroPick.hero.hero_id,
          label: heroPick.hero.name,
          image: heroPick.hero.image,
        })),
      role: [
        { value: "exp", label: "EXP" },
        { value: "roam", label: "Roam" },
        { value: "jungler", label: "Jungler" },
        { value: "gold", label: "Gold" },
        { value: "mid", label: "Mid" },
      ],
    };
  }, [heroPicks]);

  const handleSaveRow = (rowData) => {
    console.log("Data yang disimpan:", rowData);
    // console.log("sdsd: ", match);
    setLoading(true);

    const data = {
      matchID: match.match_id,
      teamID: team.team_id,
      heroID: parseInt(rowData.hero, 10),
      pickRate: parseFloat(rowData.ratePick),
      role: rowData.role,
      total: rowData.total,
    };

    const action = rowData.isNew
      ? addPriorityPick(data)
      : updatePriorityPick({ priorityPickID: rowData.id, ...data });

    dispatch(action)
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllPriorityPicks({ matchID: match.match_id, teamID: team.team_id })
        );
        setLoading(false);
      });
  };

  const handleDeleteRow = (index, rowData) => {
    const id = rowData.id;
    console.log("Data yang dihapus (id):", id);
    console.log("Data yang dihapus (rowdata):", rowData);
    setLoading(true);
    if (id === undefined) {
      setLoading(false);
      return;
    };

    dispatch(
      deletePriorityPick({
        matchID: match.match_id,
        teamID: team.team_id,
        priorityPickID: id,
      })
    )
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllPriorityPicks({ matchID: match.match_id, teamID: team.team_id })
        );
        setLoading(false);
      });
  };

  const handleHeroChange = (rowIndex, field, value, updatedRowData) => {
    console.log("Field: ", field, "Value: ", value);
    console.log("idx: ", rowIndex);
    console.log("updatedRowData: ", updatedRowData);

    const selectedHeroPick = heroPicks.find((hp) => hp.hero.hero_id == value);
    if (selectedHeroPick) {
      const updatedData = [...initialData];
      updatedData[rowIndex] = {
        ...updatedData[rowIndex],
        hero: value,
        total: selectedHeroPick.total,
        ratePick: ((selectedHeroPick.total / games?.length) * 100).toFixed(2),
        isNew: updatedRowData.isNew,
      };
      setInitialData(updatedData);
    }
  };

  useEffect(() => {
    dispatch(getAllHeroes())
      .unwrap()
      .then(() => {
        setLoading(false);
      });
    if (match && team) {
      dispatch(
        getAllPriorityPicks({ matchID: match.match_id, teamID: team.team_id })
      )
        .unwrap()
        .then(() => {
          setLoading(false);
        });
    }
  }, [dispatch]);

  useEffect(() => {
    if (priorityPicks && priorityPicks.length > 0) {
      const initialpriorityPicks = priorityPicks
        .filter((hp) => hp.first_phase !== 0)
        .map((hp) => ({
          id: hp.priority_pick_id,
          hero: hp.hero.hero_id,
          total: hp.total,
          role: hp.role,
          ratePick: ((hp.total / games?.length) * 100).toFixed(2),
        }));
      setInitialData(initialpriorityPicks);
    }

    return () => {
      setInitialData([]);
    };
  }, [priorityPicks, games]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full flex">
      <CustomEditableTable
        headerClassName={headerClassName}
        cellClassName={cellClassName}
        columns={columns}
        initialData={initialData}
        selectOptions={selectOptions}
        onSaveRow={handleSaveRow}
        onDeleteRow={handleDeleteRow}
        onFieldChange={handleHeroChange}
      />
    </div>
  );
}
