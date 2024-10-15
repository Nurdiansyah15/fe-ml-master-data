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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Card from "../../components/Card";

export default function Competition() {
  const { updatePage } = useContext(PageContext);
  const nav = useNavigate();
  const { tournamentID } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const { teams } = useSelector((state) => state.teamTournament);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   dispatch(getAllTeamsinTournament(tournamentID));
  // }, [dispatch, tournamentID]);

  // Filter teams based on search term
  // const filteredTeams = teams.filter((team) =>
  //   team.Name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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
      "Tournament 1",
      <>
        <input
          type="text"
          placeholder="Search"
          className="max-w-xs text-white bg-[#141414] px-4 py-2 rounded-xl border border-gray-600 focus:border-gray-500"
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        />
        <Button className="bg-[#363638] rounded-xl text-white" onClick={() => setModalOpen(true)}>
          Create Match
        </Button>
      </>
    );
  }, [updatePage]);

  return (
    <div className="text-white flex flex-col justify-start items-start h-full w-full p-4">
      <div className="flex flex-wrap gap-4 justify-start items-start w-full">
        <button onClick={() => nav("match/1")}>
          <Card className="hover:bg-[#29292b]">
            <div className="flex flex-row justify-between items-center">
              <div className="text-[10px] text-gray-400">Week 1 day 2</div>
              <div className="flex flex-row space-x-2">
                <button
                  className="text-gray-500 hover:text-white text-xs p-0 m-0"
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button
                  className="text-gray-500 hover:text-white text-xs p-0 m-0"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
            <div className="flex flex-row justify-between space-x-3 items-center">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-red-500"></div>
                <div className="text-xs">RRQ</div>
              </div>
              <div className="text-xl font-bold">2 - 0</div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-red-500"></div>
                <div className="text-xs">Evos</div>
              </div>
            </div>
          </Card>
        </button>
        {/* <div
          key={team.TeamID}
          className="relative bg-gray-800 rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow"
        >
          <img
            src={team.Logo}
            alt={team.Name}
            className="w-36 h-36 object-cover rounded-lg"
          />
          <h3 className="text-md font-semibold mt-1 text-center">
            {team.Name}
          </h3>

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
                  <div className="flex items-center gap-2">
                    <Button color="warning" size="sm" className="text-white">
                      Edit
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button color="danger" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div> */}
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
