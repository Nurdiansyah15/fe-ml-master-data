import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import CompetitionForm from "./components/CompetitionForm";
import TournamentItem from "./components/TournamentItem";

import { useEffect } from "react";
import {
  createTournament,
  deleteTournament,
  getAllTournaments,
} from "../../../redux/thunks/tournamentThunk";

import { Plus, ShieldHalf, Sword, User, X, Home } from "lucide-react"; // Tambah Home

export default function Sidebar({ isOpen, closeSidebar }) {
  const nav = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);
  const { tournaments } = useSelector((state) => state.tournament);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllTournaments());
  }, [dispatch]);

  const handleCompetitionSubmit = (data) => {
    setLoading(true);
    dispatch(createTournament(data))
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
    setModalOpen(false);
  };

  const openConfirmModal = (data) => {
    setDataToDelete(data);
    setConfirmModalOpen(true);
  };

  const handleDeleteData = () => {
    console.log("dataToDelete:", dataToDelete);
    dispatch(deleteTournament(dataToDelete.tournament_id))
      .unwrap()
      .catch(console.error)
      .finally(() => {
        setConfirmModalOpen(false);
        setDataToDelete(null);
        setLoading(false);
      });
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-52 bg-[#1F1F21] text-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 mr-5`}
    >
      <div className="flex items-center p-4 cursor-pointer">
        {/* Home Icon */}
        <Home
          color="white"
          className="h-6 w-6 mr-2"
          onClick={() => nav("/")} // Navigasi ke home
        />
        <div
          className="flex items-center space-x-2"
          onClick={() => nav("/profile")} // Log di console saat avatar diklik
        >
          <User color="blue" className="h-7 w-7" />
          <div>
            <h1 className="text-xl font-bold">{user?.username || "missing"}</h1>
          </div>
        </div>
        <button className="md:hidden text-white" onClick={closeSidebar}>
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="p-4">
        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center w-full bg-[#1F1F21] border border-[#7E7E7E] text-white py-2 rounded-xl px-3"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Tournament
        </Button>
        <nav className="mt-4 max-h-[500px] overflow-y-scroll">
          <ul>
            {loading ? (
              <p>
                <Spinner />
              </p>
            ) : (
              tournaments.map((item) => (
                <li key={item.tournament_id}>
                  <TournamentItem
                    onDelete={() => openConfirmModal(item)}
                    tournament={item}
                  />
                </li>
              ))
            )}
          </ul>
        </nav>
      </div>
      <div className="p-4">
        <hr className="border-gray-700 mb-10" />
        <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase">
          Master Data
        </h2>
        <nav className="mt-2">
          <ul>
            <li>
              <NavLink
                to="/team"
                className={({ isActive }) =>
                  `flex items-center justify-start ${
                    isActive ? "text-white bg-[#363638]" : "text-white"
                  } p-2 hover:bg-[#363638] rounded-lg px-3`
                }
              >
                <ShieldHalf className="h-4 w-4 mr-2" />
                Teams
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/hero"
                className={({ isActive }) =>
                  `flex items-center justify-start ${
                    isActive ? "text-white bg-[#363638]" : "text-white"
                  } p-2 hover:bg-[#363638] rounded-lg px-3`
                }
              >
                <Sword className="h-4 w-4 mr-2" />
                Heroes
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal for the Competition Form */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent className="bg-gray-800 text-white pb-4">
          <ModalHeader>Create New Tournament</ModalHeader>
          <ModalBody>
            <CompetitionForm onSubmit={handleCompetitionSubmit} />
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
            <p>Are you sure you want to delete this tournament?</p>
            <p className="text-red-500">
              This action will{" "}
              <span className="font-bold">delete all data related</span> to this
              tournament.
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
