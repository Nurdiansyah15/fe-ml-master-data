import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import React, { useState } from "react";
import HeroPick from "../components/HeroPick";
import HeroBan from "../components/HeroBan";

export default function HeroSectionExport({ team, match }) {
  return (
    <div className="flex w-full flex-col space-y-10 mt-5">
      <div className="flex flex-col space-y-3">
        <div className="text-xl font-bold">Hero Picks</div>
        <div className="w-full rounded-xl border-2">
          <HeroPick headerClassName="bg-gray-200 text-black"
            cellClassName="text-black bg-white" team={team} match={match} />
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <div className="text-xl font-bold">Hero Bans</div>
        <div className="w-full rounded-xl border-2">
          <HeroBan headerClassName="bg-gray-200 text-black"
            cellClassName="text-black bg-white" team={team} match={match} />
        </div>
      </div>
    </div>
  );
}
