import React, { useEffect, useMemo, useState } from "react";
import EditableTable from "../../../../components/global/EditableTable";
import CustomEditableTable from "../../../../archive/CustomEditableTable";
import { getAllHeroes } from "../../../../redux/thunks/heroThunk";
import { useDispatch, useSelector } from "react-redux";

export default function PriorityBan({ team, match }) {
  const dispatch = useDispatch();

  const { heroes } = useSelector((state) => state.hero);

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);

  const columns = [
    {
      label: "Hero",
      field: "hero",
      type: "select",
      renderCell: (value, options) => {
        const hero = options.find(option => option.value == value);
        return (
          <div className="flex items-center gap-2 justify-center">
            <img src={ "https://via.placeholder.com/32"} alt="Hero" className="w-8 h-8 rounded-full" />
            <span>{hero?.label || "Unknown"}</span>
          </div>
        );
      }
    },
    {
      label: "Total",
      field: "total",
      type: "number",
      defaultValue: 2,
      readOnly: true  // This makes the column non-editable
    },
    { label: "Role", field: "role", type: "select" },
    {
      label: "Rate Pick",
      field: "ratePick",
      type: "number",
      defaultValue: 0,
      dependsOn: ["total"],
      calculate: (rowData) => {
        return rowData.total ? (rowData.total / 2 * 100).toFixed(2) : 0;
      }
    },
  ];

  const selectOptions = useMemo(() => {
    if (!heroes || heroes.length === 0) return {};

    return {
      hero: heroes.map((hero) => ({
        value: hero.hero_id,
        label: hero.name,
        image: hero.image,
      })),
      role: [
        { value: "exp", label: "EXP" },
        { value: "roam", label: "Roam" },
        { value: "jungler", label: "Jungler" },
      ],
    };
  }, [heroes]);

  const handleSaveRow = (rowData) => {
    console.log("Data yang disimpan:", rowData);

  };

  useEffect(() => {
    dispatch(
      getAllHeroes()
    ).unwrap().then(() => {
      setLoading(false);
    });
  }, [dispatch]);


  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full flex">
      <CustomEditableTable columns={columns} initialData={initialData} selectOptions={selectOptions} onSaveRow={handleSaveRow} />
    </div>
  );
}
