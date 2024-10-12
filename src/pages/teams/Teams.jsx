import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "../../contexts/PageContext";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Ellipsis } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  createTeam,
  getAllTeams,
  updateTeam,
} from "../../redux/features/teamSlice"; // Tambahkan updateTeam thunk
import TeamForm from "./components/TeamForm";
import { useNavigate } from "react-router-dom";

export default function Teams() {
  const { updatePage } = useContext(PageContext);
  const { teams } = useSelector((state) => state.team);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); // Menentukan mode edit atau create
  const [teamToEdit, setTeamToEdit] = useState(null); // Menyimpan data tim yang akan diedit

  useEffect(() => {
    updatePage(
      "Teams Master Data",
      <>
        <Button
          onClick={() => {
            setTeamToEdit(null); // Reset tim yang diedit
            setEditMode(false); // Pastikan mode create
            setModalOpen(true); // Buka modal
          }}
          color="primary"
        >
          Create
        </Button>
      </>
    );
  }, [updatePage]);

  useEffect(() => {
    dispatch(getAllTeams());
  }, [dispatch]);

  const handleFormSubmit = (data) => {
    setLoading(true);

    const action =
      editMode && teamToEdit
        ? updateTeam({ teamID: teamToEdit.id, ...data })
        : createTeam(data);

    dispatch(action)
      .unwrap()
      .then(() => {
        setModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEdit = (teamData) => {
    const team = {
      id: teamData.TeamID,
      name: teamData.Name,
      logo: teamData.Logo,
    };
    setTeamToEdit(team); // Simpan data tim yang ingin diedit
    setEditMode(true); // Ubah ke mode edit
    setModalOpen(true); // Buka modal untuk mengedit tim
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-white flex flex-col justify-start h-full w-full">
      <div className="flex flex-wrap gap-4 justify-start items-start w-full">
        {teams.map((team) => (
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
                nav("/teams/" + team.TeamID);
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
                      <Button
                        color="warning"
                        size="sm"
                        className="text-white"
                        onClick={() => handleEdit(team)} // Aktifkan edit mode
                      >
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

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent className="bg-gray-800 text-white pb-4">
          <ModalHeader>
            {editMode ? "Edit Team" : "Create New Team"}
          </ModalHeader>
          <ModalBody>
            <TeamForm onSubmit={handleFormSubmit} teamData={teamToEdit} />
            {/* Kirim data tim jika edit */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
