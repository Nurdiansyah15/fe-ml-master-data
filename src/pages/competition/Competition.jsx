import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Ellipsis } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PageContext } from "../../contexts/PageContext";
import {
  createTeamforTournament,
  getAllTeamsinTournament,
} from "../../redux/features/teamTournamentSlice";
import TeamForm from "./components/TeamForm";

export default function Competition() {
  const { updatePage } = useContext(PageContext);
  const nav = useNavigate();
  const { tournamentID } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const { teams } = useSelector((state) => state.teamTournament);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getAllTeamsinTournament(tournamentID));
  }, [dispatch, tournamentID]);

  // Filter teams based on search term
  const filteredTeams = teams.filter((team) =>
    team.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleFormSubmit = (data) => {
    setLoading(true);
    dispatch(createTeamforTournament({ tournamentID, teamID: data.team }))
      .unwrap()
      .then(() => setModalOpen(false))
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        setLoading(false);
      });
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
            key={team.TeamID}
            className="relative bg-gray-800 rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Image and Name */}
            <img
              src={team.Logo}
              alt={team.Name}
              className="w-36 h-36 object-cover rounded-lg"
            />
            <h3 className="text-md font-semibold mt-1 text-center">
              {team.Name}
            </h3>

            {/* Detail Button */}
            <Button
              onPress={() => {
                nav(
                  "/tournaments/" +
                    tournamentID +
                    "/teams/" +
                    team.TeamID +
                    "/matches"
                );
              }}
              color="primary"
              className="mt-2 w-full text-sm"
            >
              Matches
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
