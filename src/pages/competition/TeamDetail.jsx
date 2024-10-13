import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { ChevronRight, Copy, Edit } from "lucide-react"; // Import icon Edit
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PageContext } from "../../contexts/PageContext";
import MatchForm from "./components/MatchForm";
import { getTeamByID } from "../../redux/features/teamSlice";
import { useParams } from "react-router-dom";
import { getAllTeamMatches } from "../../redux/features/matchSlice";

export default function TeamDetail() {
  const { updatePage } = useContext(PageContext);
  const { teamID, tournamentID } = useParams();
  const nav = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const { team } = useSelector((state) => state.team);
  const { matches } = useSelector((state) => state.match);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTeamByID(teamID));
    dispatch(getAllTeamMatches({ tournamentID, teamID }));
  }, [dispatch]);

  console.log(matches);

  // Sample weeks and days data
  const weeks = [
    { week: "Week 1", days: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"] },
    { week: "Week 2", days: ["Day 1", "Day 2", "Day 3"] },
    { week: "Week 3", days: ["Day 1", "Day 2", "Day 3"] },
    { week: "Week 4", days: ["Day 1", "Day 2", "Day 3"] },
  ];

  useEffect(() => {
    updatePage(
      "Competition",
      <>
        <Button color="primary" onClick={() => setModalOpen(true)}>
          New Data
        </Button>
        <Button color="secondary">Export</Button>
      </>
    );
  }, [updatePage, team?.name]);

  const handleFormSubmit = (data) => {
    console.log("New Match Created:", data);
    setModalOpen(false);
  };

  return (
    <div className="text-white flex flex-col justify-start items-start h-full w-full p-4">
      {/* Team Header */}
      <div className="flex items-center mb-6">
        <img
          src={team?.Logo}
          alt={team?.Name}
          className="w-16 h-16 object-cover rounded-lg mr-4"
        />
        <h1 className="text-xl font-bold">{team?.Name}</h1>
      </div>

      {/* Weeks and Days */}
      <div className="w-full flex flex-col gap-6">
        {weeks.map((week, idx) => (
          <div key={idx} className="w-full">
            {/* Week Title */}
            <h2 className="text-xl font-semibold mb-3">{week.week}</h2>
            <div className="grid grid-cols-3 gap-4">
              {week.days.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  onClick={() => nav(`/competition/team/match`)}
                  className="bg-gray-800 rounded-lg p-4 shadow-lg hover:bg-gray-700 hover:shadow-xl transition-shadow flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    {/* Day Label */}
                    <h3 className="text-md font-semibold mr-2">{day}</h3>

                    {/* Copy Icon */}
                    <Copy className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white transition-colors" />

                    {/* Edit Icon */}
                    <Edit className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white transition-colors" />
                  </div>

                  {/* Chevron Right Icon for Detail */}
                  <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Example (can be used for 'New Data' or similar) */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent className="bg-gray-800 text-white pb-4">
          <ModalHeader>Create New Data</ModalHeader>
          <ModalBody>
            <MatchForm onSubmit={handleFormSubmit} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
