import React from "react";

export default function TeamTitleExport({ team }) {
  return (
    <div className="flex  items-center w-full space-x-4">
      <div className="flex flex-1">
        <div className="w-24 h-24 rounded-full items-center justify-center flex border-2">
          <img
            src={team.image}
            alt={team.name}
            className="w-16 h-16 object-contain bg-center "
          />
        </div>
      </div>
      <h2 className="text-2xl w-1/4 font-bold text-black">
        {team.name} Statistics
      </h2>
      <div className="w-full border-b"></div>
    </div>
  );
}
