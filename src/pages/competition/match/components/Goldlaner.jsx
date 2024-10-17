import React, { useEffect, useMemo, useState } from "react";
import EditableTable from "../../../../components/global/EditableTable";
import CustomEditableTable from "../../../../archive/CustomEditableTable";
import { getAllHeroes } from "../../../../redux/thunks/heroThunk";
import { useDispatch, useSelector } from "react-redux";

export default function Goldlaner({ game }) {
  const dispatch = useDispatch();

  const { heroes } = useSelector((state) => state.hero);

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);

  const columns = [
    {
      label: "Hero", field: "hero", type: "select", renderCell: (value, options) => {
        const hero = options.find(option => option.value == value);
        return (
          <div className="flex items-center gap-2 justify-center">
            <img src={"https://via.placeholder.com/32"} alt="Hero" className="w-8 h-8 rounded-full" />
            <span>{hero?.label || "Unknown"}</span>
          </div>
        );
      }
    },
    {
      label: "Early Result", field: "early_result", type: "select", renderCell: (value, options) => {
        const result = options.find(option => option.value == value);
        let style = "bg-[#4b3232] text-[#ab6161]";
        if (result?.value === "win") {
          style = "bg-[#324B39] text-[#61AB76]";
        } else if (result?.value === "draw") {
          style = "bg-[#494b32] text-[#d4b560]";
        }
        
        return (
          <div className={`${style} px-4 py-2 rounded-full`}>
            <span>{result?.label || "Unknown"}</span>
          </div>
        );
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
      early_result: [
        { value: "win", label: "Win" },
        { value: "draw", label: "Draw" },
        { value: "lose", label: "Lose" },
      ],
    };
  }, [heroes]);

  const handleSaveRow = (rowData) => {
    console.log("Data yang disimpan:", rowData);
  };

  const handleDeleteRow = (index) => {
    console.log("Data yang dihapus:", initialData[index]);

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
    <div className="w-full flex flex-col">
      <CustomEditableTable columns={columns} initialData={initialData} selectOptions={selectOptions} onSaveRow={handleSaveRow} onDeleteRow={handleDeleteRow} />
    </div>
  );
}
