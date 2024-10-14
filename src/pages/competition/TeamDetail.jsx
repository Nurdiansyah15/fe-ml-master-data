import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PageContext } from "../../contexts/PageContext";
import {
  createMatch,
  getAllTeamMatches,
  updateMatch,
} from "../../redux/features/matchSlice";
import { getTeamByID } from "../../redux/features/teamSlice";
import MatchForm from "./components/MatchForm";
import { fromUnixTime, toUnixTime } from "../../utils/timeFormator";
import moment from "moment";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { ChevronRight, Copy, Edit, Swords } from "lucide-react";

export default function TeamDetail() {
  const { updatePage } = useContext(PageContext);
  const { teamID, tournamentID } = useParams();
  const nav = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const { team } = useSelector((state) => state.team);
  const { matches } = useSelector((state) => state.match);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTeamByID(teamID));
    dispatch(getAllTeamMatches({ tournamentID, teamID }));
  }, [dispatch, tournamentID, teamID]);


  // Group matches by week
  const groupedMatches = Array.isArray(matches)
    ? matches.reduce((acc, match) => {
        const { Week } = match;
        if (!acc[Week]) acc[Week] = [];
        acc[Week].push(match);
        return acc;
      }, {})
    : {};

  const weeks = ["1", "2", "3", "4"];

  useEffect(() => {
    updatePage(
      "Tournament",
      <>
        <Button
          color="primary"
          onClick={() => {
            setEditingMatch(null);
            setModalOpen(true);
          }}
        >
          New Data
        </Button>
        <Button color="secondary">Export</Button>
      </>
    );
  }, [updatePage, team?.name]);

  const handleFormSubmit = (formData) => {
    const data = {
      opponentTeamID: formData.team,
      week: parseInt(formData.week),
      day: parseInt(formData.day),
      date: toUnixTime(formData.datetime),
    };

    setLoading(true);
    if (editingMatch) {
      dispatch(updateMatch({ matchID: editingMatch.MatchID, ...data }))
        .unwrap()
        .then(() => {
          setModalOpen(false);
          setEditingMatch(null);
          dispatch(getAllTeamMatches({ tournamentID, teamID }));
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      dispatch(createMatch({ tournamentID, teamID, ...data }))
        .unwrap()
        .then(() => {
          setModalOpen(false);
          dispatch(getAllTeamMatches({ tournamentID, teamID }));
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleEdit = (match) => {
    setEditingMatch(match);
    setModalOpen(true);
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

      {/* Weeks */}
      <div className="w-full flex flex-col gap-6">
        {weeks.map((week) => {
          const matchesForWeek = groupedMatches[week];

          return matchesForWeek && matchesForWeek.length > 0 ? (
            <div key={week} className="w-full">
              <h2 className="text-xl font-semibold mb-3">Week {week}</h2>
              <div className="flex flex-wrap gap-4">
                {matchesForWeek.map((match) => (
                  <div
                    key={match.MatchID}
                    className="bg-gray-800 rounded-lg p-4 px-6 shadow-lg hover:bg-gray-700 hover:shadow-xl transition-shadow flex justify-between items-center w-[460px] gap-10"
                  >
                    <div className="flex items-center gap-3">
                      <Swords size={"2rem"} color="white" />
                      <img
                        src={match.OpponentTeam?.Logo}
                        alt={match.OpponentTeam?.Name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                      <div className="flex flex-col mr-2">
                        <h3 className="text-lg font-semibold">
                          {match.OpponentTeam?.Name}
                        </h3>
                        <h3 className="text-xs font-normal">
                          {moment(fromUnixTime(match.Date)).format(
                            "MMMM Do YYYY, h:mm A"
                          )}
                        </h3>
                      </div>
                      <Copy className="w-5 h-5 mr-2 text-gray-400 cursor-pointer hover:text-white transition-colors" />
                      <Edit
                        className="w-5 h-5 mr-2 text-gray-400 cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleEdit(match)}
                      />
                    </div>

                    <ChevronRight
                      onClick={() =>
                        nav(
                          `/tournaments/${tournamentID}/teams/${teamID}/matches/${match.MatchID}`
                        )
                      }
                      className="w-5 h-5 text-gray-400 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })}

        {Object.keys(groupedMatches).length === 0 && (
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg flex justify-center items-center text-gray-500 w-fit">
            No matches available
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingMatch(null);
        }}
      >
        <ModalContent className="bg-gray-800 text-white pb-4">
          <ModalHeader>
            {editingMatch ? "Edit Match" : "Create New Data"}
          </ModalHeader>
          <ModalBody>
            <MatchForm
              onSubmit={handleFormSubmit}
              editingMatch={editingMatch}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
