import React, { useEffect, useMemo, useState } from "react";
import EditableTable from "../../../../components/global/EditableTable";
import CustomEditableTable from "../../../../archive/CustomEditableTable";
import { getAllHeroes } from "../../../../redux/thunks/heroThunk";
import { useDispatch, useSelector } from "react-redux";
import {
  addPriorityBan,
  deletePriorityBan,
  getAllPriorityBans,
  updatePriorityBan,
} from "../../../../redux/thunks/priorityBanThunk";
import { getAllHeroBans } from "../../../../redux/thunks/matchThunk";

export default function PriorityBan({ team, match }) {
  const dispatch = useDispatch();

  const { heroBans } = useSelector((state) => state.heroBan);

  const { priorityBans } = useSelector((state) => state.priorityBan);

  const { games } = useSelector((state) => state.game);

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);

  useEffect(() => {
    if (match) {
      dispatch(
        getAllHeroBans({ matchID: match.match_id, teamID: team.team_id })
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
        const selectedHeroPick = heroBans.filter(
          (heroPick) => heroPick.hero.hero_id === parseInt(rowData.hero, 10)
        );
        return selectedHeroPick.length > 0 ? selectedHeroPick[0].total : 0;
      },
      readOnly: true,
    },
    { label: "Role", field: "role", type: "select" },
    {
      label: "Rate Ban",
      field: "rateBan",
      type: "number",
      dependsOn: ["total"],
      readOnly: true,
      calculate: (rowData) => {
        console.log("rowData: ", rowData);

        console.log(
          "total: ",
          ((rowData.total / games?.length) * 100).toFixed(2)
        );

        const selectedHeroPick = heroBans.filter(
          (heroPick) => heroPick.hero.hero_id === parseInt(rowData.hero, 10)
        );
        return selectedHeroPick.pick_rate
          ? selectedHeroPick.pick_rate
          : ((rowData.total / games?.length) * 100).toFixed(2);
      },
    },
  ];

  const selectOptions = useMemo(() => {
    if (!heroBans || heroBans.length === 0) return {};

    return {
      hero: heroBans
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
  }, [heroBans]);

  const handleSaveRow = (rowData) => {
    console.log("Data yang disimpan:", rowData);
    // console.log("sdsd: ", match);
    setLoading(true);

    const data = {
      matchID: match.match_id,
      teamID: team.team_id,
      heroID: parseInt(rowData.hero, 10),
      banRate: parseFloat(rowData.rateBan),
      role: rowData.role,
      total: rowData.total,
    };

    const action = rowData.isNew
      ? addPriorityBan(data)
      : updatePriorityBan({ priorityBanID: rowData.id, ...data });

    dispatch(action)
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllPriorityBans({ matchID: match.match_id, teamID: team.team_id })
        );
        setLoading(false);
      });
  };

  const handleDeleteRow = (index, rowData) => {
    const id = rowData.id;
    console.log("Data yang dihapus:", initialData[index]);
    console.log("Data yang dihapus (rowdata):", rowData);
    setLoading(true);
    if (id === undefined) return;

    dispatch(
      deletePriorityBan({
        matchID: match.match_id,
        teamID: team.team_id,
        priorityBanID: id,
      })
    )
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllPriorityBans({ matchID: match.match_id, teamID: team.team_id })
        );
        setLoading(false);
      });
  };

  const handleHeroChange = (rowIndex, field, value, updatedRowData) => {
    console.log("Field: ", field, "Value: ", value);
    console.log("idx: ", rowIndex);
    console.log("updatedRowData: ", updatedRowData);

    const selectedHeroPick = heroBans.find((hp) => hp.hero.hero_id == value);
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
        getAllPriorityBans({ matchID: match.match_id, teamID: team.team_id })
      )
        .unwrap()
        .then(() => {
          setLoading(false);
        });
    }
  }, [dispatch]);

  useEffect(() => {
    if (priorityBans && priorityBans.length > 0) {
      const initialpriorityBans = priorityBans
        .filter((hp) => hp.first_phase !== 0)
        .map((hp) => ({
          id: hp.priority_ban_id,
          hero: hp.hero.hero_id,
          total: hp.total,
          role: hp.role,
          rateBan: ((hp.total / games?.length) * 100).toFixed(2),
        }));
      setInitialData(initialpriorityBans);
    }

    return () => {
      setInitialData([]);
    };
  }, [priorityBans, games]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full flex">
      <CustomEditableTable
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
