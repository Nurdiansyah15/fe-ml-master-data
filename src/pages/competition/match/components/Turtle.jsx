import React, { useEffect, useMemo, useState } from "react";
import EditableTable from "../../../../components/global/EditableTable";
import CustomEditableTable from "../../../../archive/CustomEditableTable";
import { useDispatch, useSelector } from "react-redux";
import { addTurtleResult, deleteTurtleResult, getAllTurtleResults, updateTurtleResult } from "../../../../redux/thunks/turtleThunk";

export default function Turtle({ game, match, team }) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);

  const { turtles } = useSelector((state) => state.turtle);

  const columns = [
    {
      label: "Phase", field: "phase", type: "text"
    },
    {
      label: "Setup", field: "setup", type: "select", renderCell: (value, options) => {
        const result = options.find(option => option.value == value);
        let style = "bg-[#4b3232] text-[#ab6161]";
        if (result?.value === "early") {
          style = "bg-[#324B39] text-[#61AB76]";
        } else if (result?.value === "late") {
          style = "bg-[#494b32] text-[#d4b560]";
        }
        
        return (
          <div className={`${style} px-4 py-2 rounded-full`}>
            <span>{result?.label || "Unknown"}</span>
          </div>
        );
      }
    },
    {
      label: "Initiate", field: "initiate", type: "select", renderCell: (value, options) => {
        const result = options.find(option => option.value == value);
        let style = "bg-[#4b3232] text-[#ab6161]";
        if (result?.value === "early") {
          style = "bg-[#324B39] text-[#61AB76]";
        } else if (result?.value === "late") {
          style = "bg-[#494b32] text-[#d4b560]";
        }
        
        return (
          <div className={`${style} px-4 py-2 rounded-full`}>
            <span>{result?.label || "Unknown"}</span>
          </div>
        );
      }
    },
    {
      label: "Result", field: "result", type: "select", renderCell: (value, options) => {
        const result = options.find(option => option.value == value);
        let style = "bg-[#4b3232] text-[#ab6161]";
        if (result?.value === "early") {
          style = "bg-[#324B39] text-[#61AB76]";
        } else if (result?.value === "late") {
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
    return {
      setup: [
        { value: "early", label: "Early" },
        { value: "late", label: "Late" },
        { value: "no", label: "No" },
      ],
      initiate: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      result: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    };
  }, []);

  const handleSaveRow = (rowData) => {
    console.log("Data yang disimpan:", rowData);
    // console.log("sdsd: ", match);
    setLoading(true);

    const data = {
      gameID: game.game_id,
      matchID: match.match_id,
      phase: rowData.phase,
      setup: rowData.setup,
      initiate: rowData.initiate,
      result: rowData.result,
      teamID: team.team_id  
    };

    console.log("Data ", data);
    

    const action = rowData.isNew
      ? addTurtleResult(data)
      : updateTurtleResult({ turtleResultID: rowData.id, ...data });

    dispatch(action)
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllTurtleResults({ matchID: match.match_id, gameID: game.game_id })
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
      deleteTurtleResult({
        matchID: match.match_id,
        gameID: game.game_id,
        turtleResultID: id,
      })
    )
      .unwrap()
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        dispatch(
          getAllTurtleResults({ matchID: match.match_id, gameID: game.game_id })
        );
        setLoading(false);
      });
  };


  useEffect(() => {
    if (turtles && turtles.length > 0) {
      console.log("Turtles:", turtles);
      
      const initialTurtleResults = turtles.map(turtle => ({
        id: turtle.turtle_result_id,
        initiate: turtle.initiate,
        phase: turtle.phase,
        result: turtle.result,
        setup: turtle.setup,
      }));
      setInitialData(initialTurtleResults);
    }
    return () => {
      setInitialData([]);
    }
  }, [turtles, game]);

  useEffect(() => {
    if (match && game) {
      dispatch(getAllTurtleResults({ matchID: match.match_id, gameID: game.game_id }))
        .unwrap()
        .then(() => {
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;


  // if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full flex flex-col">
      <CustomEditableTable columns={columns} initialData={initialData} selectOptions={selectOptions} onSaveRow={handleSaveRow} onDeleteRow={handleDeleteRow} />
    </div>
  );
}
