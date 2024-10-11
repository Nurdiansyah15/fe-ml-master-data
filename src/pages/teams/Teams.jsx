import React from "react";
import { useContext } from "react";
import { PageContext } from "../../contexts/PageContext";
import { useEffect } from "react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Ellipsis } from "lucide-react";

const teams = [
  { id: 1, name: "Team Alpha", image: "https://via.placeholder.com/150" },
  { id: 2, name: "Team Beta", image: "https://via.placeholder.com/150" },
];

export default function Teams() {
  const { updatePage } = useContext(PageContext);

  useEffect(() => {
    updatePage(
      "Teams Master Data",
      <>
        <Button color="primary">Create</Button>
      </>
    );
  }, [updatePage]);
  return (
    <div className="text-white flex flex-col justify-start h-full w-full">
      <div className="flex flex-wrap gap-4 justify-start items-start w-full">
        {teams.map((team) => (
          <div
            key={team.id}
            className="relative bg-gray-800 rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Image and Name */}
            <img
              src={team.image}
              alt={team.name}
              className="w-36 h-36 object-cover rounded-lg"
            />
            <h3 className="text-md font-semibold mt-1 text-center">
              {team.name}
            </h3>

            {/* Detail Button */}
            <Button
              onPress={() => {
                nav("/competition/team");
              }}
              color="primary"
              className="mt-2 w-full text-sm"
            >
              Detail
            </Button>

            {/* Hover Edit/Delete Button */}
            <div className="absolute top-0 right-0 opacity-0 hover:opacity-100 transition-opacity">
              <Popover placement="right-start">
                <PopoverTrigger>
                  <Button isIconOnly size="sm" className="bg-gray-600">
                    <Ellipsis size={16} color="white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  color="white"
                  className="bg-gray-700 border border-gray-500"
                >
                  <div className="p-2 flex flex-col gap-2">
                    {/* Edit Button */}
                    <div className="flex items-center gap-2">
                      <Button color="warning" size="sm" className="text-white">
                        Edit
                      </Button>
                    </div>

                    {/* Delete Button */}
                    <div className="flex items-center gap-2">
                      <Button color="danger" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
