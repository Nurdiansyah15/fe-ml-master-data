import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Ellipsis, Plus } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PageContext } from "../../contexts/PageContext";

import MemberForm from "./components/MemberForm";
import {
  createCoachInTeam,
  createPlayerInTeam,
  getAllCoachesInTeam,
  getAllPlayersInTeam,
  getTeamByID,
  updateCoachInTeam,
  updatePlayerInTeam,
} from "../../redux/thunks/teamThunk";

export default function TeamDetail() {
  const { updatePage } = useContext(PageContext);
  const { teamID } = useParams();
  const { players } = useSelector((state) => state.player);
  const { team } = useSelector((state) => state.team);
  const { coaches } = useSelector((state) => state.coach);
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); // Determines create/edit mode
  const [memberToEdit, setMemberToEdit] = useState(null); // Handles both player and coach
  const [modalRole, setModalRole] = useState(""); // Role for the modal (either 'Player' or 'Coach')
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch all players and coaches in the team on mount
  useEffect(() => {
    dispatch(getAllPlayersInTeam(teamID));
    dispatch(getAllCoachesInTeam(teamID));
    dispatch(getTeamByID(teamID));
  }, [dispatch, teamID]);

  // Update page title
  useEffect(() => {
    updatePage("Teams Master Data");
  }, [updatePage]);

  const handleEdit = (data, type) => {
    const member = {
      id: type === "player" ? data.player_id : data.coach_id,
      name: data.name,
      role: data.role,
      image: data.image,
    };
    setMemberToEdit(member);
    setModalRole(type === "player" ? "Player" : "Coach");
    setEditMode(true);
    setModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    setLoading(true);
    if (editMode && memberToEdit) {
      const action =
        modalRole === "Player" ? updatePlayerInTeam : updateCoachInTeam;
      dispatch(action({ id: memberToEdit.id, ...data }))
        .unwrap()
        .finally(() => {
          setLoading(false);
          setModalOpen(false);
        });
    } else {
      const action =
        modalRole === "Player" ? createPlayerInTeam : createCoachInTeam;
      dispatch(action({ teamID: teamID, ...data }))
        .unwrap()
        .finally(() => {
          setLoading(false);
          setModalOpen(false);
        });
    }
  };

  const openCreateModal = (role) => {
    setMemberToEdit(null); // Reset member to edit
    setModalRole(role); // Set modal role (either 'Player' or 'Coach')
    setEditMode(false); // Switch to create mode
    setModalOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>; // Loading indicator
  }

  return (
    <div className="text-white flex flex-col justify-start items-start w-full p-4">
      <div className="flex items-center mb-10">
        <img
          src={team?.image}
          alt={team?.name}
          className="w-16 h-16 object-cover rounded-lg mr-4"
        />
        <h1 className="text-xl font-bold">{team?.name}</h1>
      </div>
      {/* Players Section */}
      <div className="flex flex-col gap-4">
        <p className="text-xl font-bold">Players</p>
        <div className="flex gap-4">
          {players.map((player, index) => (
            <div key={index} className="flex flex-col relative">
              <Card className="bg-gray-800 w-40">
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </Card>
              <Card className="bg-gray-800 w-40 text-white px-3 py-1 mt-4">
                <h3 className="font-semibold text-lg truncate">
                  {player.name}
                </h3>
              </Card>
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
                      <Button
                        color="warning"
                        size="sm"
                        className="text-white"
                        onClick={() => handleEdit(player, "player")}
                      >
                        Edit
                      </Button>
                      <Button color="danger" size="sm">
                        Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
          {players.length < 5 && (
            <div
              className="flex flex-col cursor-pointer"
              onClick={() => openCreateModal("Player")}
            >
              <Card className="bg-gray-800 hover:opacity-50 w-40 transition-opacity duration-1000">
                <div className="w-full h-48 object-cover rounded-t-lg flex justify-center items-center">
                  <Plus className="h-12 w-12 text-gray-300" />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Coaches Section */}
      <div className="flex flex-col gap-4 mt-10">
        <p className="text-xl font-bold">Coaches</p>
        <div className="flex gap-4">
          {coaches.map((coach, index) => (
            <div key={index} className="flex flex-col relative">
              <Card className="bg-gray-800 w-40">
                <img
                  src={coach.image}
                  alt={coach.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </Card>
              <Card className="bg-gray-800 w-40 text-white px-3 py-1 mt-4">
                <h3 className="font-semibold text-lg truncate">{coach.name}</h3>
              </Card>
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
                      <Button
                        color="warning"
                        size="sm"
                        className="text-white"
                        onClick={() => handleEdit(coach, "coach")}
                      >
                        Edit
                      </Button>
                      <Button color="danger" size="sm">
                        Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
          {coaches.length < 2 && (
            <div
              className="flex flex-col cursor-pointer"
              onClick={() => openCreateModal("Coach")}
            >
              <Card className="bg-gray-800 hover:opacity-50 w-40 transition-opacity duration-1000">
                <div className="w-full h-48 object-cover rounded-t-lg flex justify-center items-center">
                  <Plus className="h-12 w-12 text-gray-300" />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit Member */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent className="bg-gray-800 text-white pb-4">
          <ModalHeader>
            {editMode ? `Edit ${modalRole}` : `Create New ${modalRole}`}
          </ModalHeader>
          <ModalBody>
            <MemberForm
              onSubmit={handleFormSubmit}
              memberData={memberToEdit}
              role={modalRole}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
