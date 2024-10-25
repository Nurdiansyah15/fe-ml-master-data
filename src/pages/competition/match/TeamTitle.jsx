import React from "react";

export default function TeamTitle({ team }) {
  return (
    <div className="flex  items-center w-full space-x-4">
      <div className="flex flex-1">
        <div className="w-24 h-24 rounded-full items-center justify-center flex border border-gray-600">
          <img
            src={team.image}
            alt={team.name}
            className="w-16 h-16 object-contain bg-center "
          />
        </div>
      </div>
      <h2 className="text-2xl w-1/4 font-bold text-white">
        {team.name} Statistics
      </h2>
      <div className="w-full border-b border-gray-700"></div>
    </div>
  );
}
