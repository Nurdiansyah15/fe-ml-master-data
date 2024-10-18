import React from "react";

export default function TeamTitle({ team }) {
  return (
    <div className="flex  items-center w-full space-x-4">
      <div className="w-24 h-16">
        <img
          src={team.image}
          alt={team.name}
          className="w-16 h-16 rounded-full border-2 border-gray-600 object-cover"
        />
      </div>
      <h2 className="text-2xl w-1/4 font-bold text-white">
        {team.name} Statistics
      </h2>
      <div className="w-full border-b border-gray-700"></div>
    </div>
  );
}
