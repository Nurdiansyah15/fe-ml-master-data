import { Card } from "@nextui-org/react";
import { Plus } from "lucide-react";
import React from "react";

export default function MemberSection({ players, coaches }) {
  return (
    <div className="w-full">
      {/* Players and Coaches Section */}
      <div className="flex w-full gap-20">
        {/* Players Row */}
        <div className="flex flex-col gap-4">
          <p className="text-xl font-bold">Players</p>
          <div className="flex gap-4">
            {players.slice(0, 4).map((player, index) => (
              <div key={index} className="flex flex-col">
                <p className="text-lg font-semibold text-center">
                  {player.role}
                </p>
                <Card className="bg-gray-800 w-40">
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </Card>
                <Card className="bg-gray-800 w-40 text-white px-3 py-1 mt-4">
                  <h3 className="font-semibold text-lg">{player.name}</h3>
                  <div className="flex gap-2">
                    <div>
                      <p className="text-[10px]">Match Rate:</p>
                      <p className="text-lg text-success">{player.matchRate}</p>
                    </div>
                    <div>
                      <p className="text-[10px]">Game Rate:</p>
                      <p className="text-lg text-success">{player.gameRate}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-center text-gray-400">
                New Player
              </p>
              <Card className="bg-gray-800 w-40">
                <div className="w-full h-48 object-cover rounded-t-lg flex justify-center items-center">
                  <Plus className="h-12 w-12 text-gray-300" />
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Coaches Row */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Coaches</h2>
          <div className="flex gap-4">
            {coaches.slice(0, 1).map((coach, index) => (
              <div key={index} className="flex flex-col">
                <p className="text-lg font-semibold text-center">
                  {coach.role}
                </p>
                <Card className="bg-gray-800 w-40">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </Card>
                <Card className="bg-gray-800 w-40 text-white px-3 py-1 mt-4">
                  <h3 className="font-semibold text-lg">{coach.name}</h3>
                  <div className="flex gap-2">
                    <div>
                      <p className="text-[10px]">Match Rate:</p>
                      <p className="text-lg text-success">{coach.matchRate}</p>
                    </div>
                    <div>
                      <p className="text-[10px]">Game Rate:</p>
                      <p className="text-lg text-success">{coach.gameRate}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-center text-gray-400">
                New Coach
              </p>
              <Card className="bg-gray-800 w-40">
                <div className="w-full h-48 object-cover rounded-t-lg flex justify-center items-center">
                  <Plus className="h-12 w-12 text-gray-300" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
