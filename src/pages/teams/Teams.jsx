import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "../../contexts/PageContext";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Ellipsis } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import TeamForm from "./components/TeamForm";
import { useNavigate } from "react-router-dom";
import {
  createTeam,
  deleteTeam,
  getAllTeams,
  updateTeam,
} from "../../redux/thunks/teamThunk";
import { clearTeam } from "../../redux/features/teamSlice";

export default function Teams() {
  const { updatePage } = useContext(PageContext);
  const { teams } = useSelector((state) => state.team);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); // Menentukan mode edit atau create
  const [teamToEdit, setTeamToEdit] = useState(null); // Menyimpan data tim yang akan diedit

  const [confirmModalOpen, setConfirmModalOpen] = useState(false); // Modal konfirmasi
  const [dataToDelete, setDataToDelete] = useState(null);

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

    return () => {
      dispatch(clearTeam());
    };
  }, [dispatch]);

  const handleFormSubmit = (data) => {
    setLoading(true);
    console.log("data:", data);

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
      id: teamData.team_id,
      name: teamData.name,
      image: teamData.image,
    };
    setTeamToEdit(team); // Simpan data tim yang ingin diedit
    setEditMode(true); // Ubah ke mode edit
    setModalOpen(true); // Buka modal untuk mengedit tim
  };

  const openConfirmModal = (data) => {
    setDataToDelete(data);
    setConfirmModalOpen(true);
  };

  const handleDeleteData = () => {
    console.log("dataToDelete:", dataToDelete);
    if (dataToDelete) {
      dispatch(deleteTeam(dataToDelete.team_id))
        .unwrap()
        .catch(console.error)
        .finally(() => {
          setConfirmModalOpen(false);
          setDataToDelete(null);
          setLoading(false);
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-white flex flex-col justify-start h-full w-full">
      <div className="flex flex-wrap gap-4 justify-start items-start w-full">
        {teams.map((team) => (
          <div
            key={team.team_id}
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
                nav("/team/" + team.team_id);
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
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => openConfirmModal(team)}
                      >
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

      {/* Modal Konfirmasi Hapus */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
      >
        <ModalContent className="bg-gray-800 text-white">
          <ModalHeader>Delete Confirmation</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this team?</p>
            <p className="text-red-500">
              This action will{" "}
              <span className="font-bold">delete all data related</span> to this
              team.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleDeleteData}>
              Delete
            </Button>
            <Button color="default" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
