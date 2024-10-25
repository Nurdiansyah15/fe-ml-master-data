import { CardBody, Tab, Tabs } from "@nextui-org/react";
import React from "react";
import PriorityPick from "../components/PriorityPick";
import PriorityBan from "../components/PriorityBan";
import FlexPick from "../components/FlexPick";
import Card from "../../../../components/Card";

export default function PrioritySectionExport({ team, match }) {
  return (
    <div className="flex w-full flex-row space-x-4 mt-5">
      <div className="flex flex-col space-y-3 flex-1">
        <div className="text-xl font-bold">Priority Picks</div>
        <div className="border-2 rounded-xl flex-1">
          <PriorityPick headerClassName="bg-gray-200 text-black" cellClassName="text-black bg-white" team={team} match={match} />
        </div>
      </div>
      <div className="flex flex-col space-y-3 flex-1">
        <div className="text-xl font-bold">Priority Bans</div>
        <div className="border-2 rounded-xl flex-1">
          <PriorityBan headerClassName="bg-gray-200 text-black" cellClassName="text-black bg-white" team={team} match={match} />
        </div>
      </div>
      <div className="flex flex-col space-y-3 flex-1">
        <div className="text-xl font-bold">Flex Picks</div>
        <div className="border-2 rounded-xl flex-1">
          <FlexPick headerClassName="bg-gray-200 text-black" cellClassName="text-black bg-white" team={team} match={match} />
        </div>
      </div>
    </div>
  );
}
