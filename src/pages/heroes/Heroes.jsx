import React from "react";
import EditableTable from "../../components/global/EditableTable";

export default function Heroes() {
  const columns = [
    { label: "Hero", field: "hero", type: "text" },
    { label: "Game 1", field: "game1", type: "text" },
    { label: "Game 2", field: "game2", type: "text" },
    { label: "Total", field: "total", type: "text" },
    { label: "First Phase", field: "firstPhase", type: "text" },
    { label: "Second Phase", field: "secondPhase", type: "text" },
  ];

  const initialData = [
    {
      hero: "Hero 1",
      game1: 1,
      game2: 2,
      total: 10,
      firstPhase: 5,
      secondPhase: 5,
    },
    {
      hero: "Hero 1",
      game1: 1,
      game2: 2,
      total: 10,
      firstPhase: 5,
      secondPhase: 5,
    },
  ];
  return (
    <div className="flex w-full flex-col mt-10">
      <EditableTable columns={columns} initialData={initialData} />
    </div>
  );
}