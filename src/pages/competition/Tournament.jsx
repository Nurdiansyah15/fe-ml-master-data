import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader
} from "@nextui-org/react";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/Card";
import { PageContext } from "../../contexts/PageContext";
import {
  createMatch,
  getAllMatches,
  updateMatch,
} from "../../redux/thunks/matchThunk";
import { getTournamentByID } from "../../redux/thunks/tournamentThunk";
import { fromUnixTime, toUnixTime } from "../../utils/timeFormator";
import MatchForm from "./components/MatchForm";

export default function Tournament() {
  const { updatePage } = useContext(PageContext);
  const nav = useNavigate();
  const { tournamentID } = useParams();
  const dispatch = useDispatch();
  const { matches } = useSelector((state) => state.match);
  const { tournament } = useSelector((state) => state.tournament);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

  useEffect(() => {
    dispatch(getAllMatches(tournamentID));
    dispatch(getTournamentByID(tournamentID));
  }, [dispatch, tournamentID]);

  const handleFormSubmit = (formData) => {
    const data = {
      week: parseInt(formData.week),
      day: parseInt(formData.day),
      date: toUnixTime(formData.datetime),
      team_a_id: parseInt(formData.team_a),
      team_b_id: parseInt(formData.team_b),
      team_a_score: parseInt(formData.team_a_score),
      team_b_score: parseInt(formData.team_b_score),
    };

    setLoading(true);
    const action = editingMatch
      ? updateMatch({ tournamentID, matchID: editingMatch.match_id, ...data })
      : createMatch({ tournamentID, ...data });

    dispatch(action)
      .unwrap()
      .then(() => {
        setModalOpen(false);
        setEditingMatch(null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    updatePage(
      tournament?.name,
      <>
        <input
          type="text"
          placeholder="Search"
          className="max-w-xs text-white bg-[#141414] px-4 py-2 rounded-xl border border-gray-600 focus:border-gray-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          className="bg-[#363638] rounded-xl text-white"
          onClick={() => {
            setEditingMatch(null);
            setModalOpen(true);
          }}
        >
          Create Match
        </Button>
      </>
    );
  }, [updatePage, tournament?.name]);

  const handleEdit = (match) => {
    setEditingMatch(match);
    setModalOpen(true);
  };

  console.log("matches", matches);

  return (
    <div className="text-white flex flex-col justify-start items-start h-full w-full p-4">
      <div className="flex flex-wrap gap-4 justify-start items-start w-full">
        {matches.map((match) => (
          <div
            key={match.match_id}
            onClick={() =>
              nav(`/tournament/${tournamentID}/match/${match.match_id}`)
            }
          >
            <Card className="hover:bg-[#29292b] cursor-pointer">
              <div className="flex flex-row justify-between items-center">
                <div className="text-[10px] text-gray-400">
                  {moment(fromUnixTime(match.date)).format(
                    "MMM Do YYYY, h:mm A"
                  )}
                </div>
                <div
                  className="flex flex-row ml-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FontAwesomeIcon
                    icon={faPen}
                    className="text-gray-500 hover:text-white text-xs mr-2"
                    onClick={() => handleEdit(match)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-gray-500 hover:text-white text-xs"
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-3 items-center">
                <TeamInfo team={match.team_a} />
                <div className="text-xl font-bold">
                  {match.team_a_score} - {match.team_b_score}
                </div>
                <TeamInfo team={match.team_b} />
              </div>
            </Card>
          </div>
        ))}
      </div>

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

function TeamInfo({ team }) {
  return (
    <div className="flex flex-col items-center space-y-1">
      <img
        src={team.image}
        alt={team.name}
        className="w-12 h-12 object-cover rounded-full"
      />
      <div className="text-xs">{team.name}</div>
    </div>
  );
}
