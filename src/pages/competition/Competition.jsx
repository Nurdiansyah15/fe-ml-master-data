import { useContext, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
  Input,
} from "@nextui-org/react";
import { PageContext } from "../../contexts/PageContext";
import { Edit, Trash, Ellipsis } from "lucide-react";
import TeamForm from "./components/TeamForm";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function Competition() {
  const { updatePage } = useContext(PageContext);
  const nav = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Sample teams data
  const teams = [
    { id: 1, name: "Team Alpha", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Team Beta", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Team Gamma", image: "https://via.placeholder.com/150" },
    { id: 4, name: "Team Delta", image: "https://via.placeholder.com/150" },
    { id: 5, name: "Team Epsilon", image: "https://via.placeholder.com/150" },
    { id: 6, name: "Team Zeta", image: "https://via.placeholder.com/150" },
    { id: 7, name: "Team Eta", image: "https://via.placeholder.com/150" },
    { id: 8, name: "Team Theta", image: "https://via.placeholder.com/150" },
  ];

  // Filter teams based on search term
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleFormSubmit = (data) => {
    console.log("Selected Team:", data.team);
    setModalOpen(false); // Close modal on form submit
  };

  useEffect(() => {
    updatePage(
      "Competition",
      <>
        <Input
          type="text"
          placeholder="Search..."
          startContent={<span className="text-gray-400">🔍</span>}
          className="max-w-xs text-white"
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        />
        <Button color="primary" onClick={() => setModalOpen(true)}>
          Create
        </Button>
      </>
    );
  }, [updatePage]);

  return (
    <div className="text-white flex flex-col justify-start items-start h-full w-full p-4">
      <div className="flex flex-wrap gap-4 justify-start items-start w-full">
        {filteredTeams.map((team) => (
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

      {/* Modal for Creating a Team */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent className="bg-gray-800 text-white pb-4">
          <ModalHeader>Create Team</ModalHeader>
          <ModalBody>
            <TeamForm onSubmit={handleFormSubmit} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
