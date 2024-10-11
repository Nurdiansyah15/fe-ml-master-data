import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { Plus, ShieldHalf, Sword, User, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CompetitionForm from "./components/CompetitionForm";
import CompetitionItem from "./components/CompetitionItem";
import { useSelector, useDispatch } from "react-redux";

export default function Sidebar({ isOpen, closeSidebar }) {
  const nav = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleCompetitionSubmit = (data) => {
    console.log("New Competition Created:", data.name);
    setModalOpen(false);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-52 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 mr-5`}
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => nav("/")}
      >
        <div className="flex items-center space-x-2">
          <User color="blue" className="h-8 w-8" />
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
          onClick={() => setModalOpen(true)} // Open the modal when clicked
          className="flex items-center justify-center w-full bg-primary text-white py-2 rounded-lg px-3"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Competition
        </Button>
        <nav className="mt-4">
          <ul>
            {/* Wrap each item with Link */}
            <li>
              <CompetitionItem />
              <CompetitionItem />
            </li>
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
                to="/teams"
                className={({ isActive }) =>
                  `flex items-center justify-start ${
                    isActive ? "text-primary" : "text-white"
                  } p-2 hover:bg-gray-700 rounded-lg px-3`
                }
              >
                <ShieldHalf className="h-4 w-4 mr-2" />
                Teams
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/heroes"
                className={({ isActive }) =>
                  `flex items-center justify-start ${
                    isActive ? "text-primary" : "text-white"
                  } p-2 hover:bg-gray-700 rounded-lg px-3`
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
          <ModalHeader>Create New Competition</ModalHeader>
          <ModalBody>
            <CompetitionForm onSubmit={handleCompetitionSubmit} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}