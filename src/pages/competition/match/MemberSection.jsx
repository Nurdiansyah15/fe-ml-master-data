import {
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { Plus, X } from "lucide-react"; // Tambahkan ikon X
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCoachInMatchTeam,
  createPlayerInMatchTeam,
  deleteCoachInMatchTeam, // Tambahkan aksi untuk pelatih
  deletePlayerInMatchTeam, // Tambahkan aksi untuk pelatih
  getAllCoachsInMatchTeam,
  getAllPlayersInMatchTeam,
} from "../../../redux/thunks/teamThunk";
import CoachTeamForm from "./components/CoachTeamForm"; // Impor CoachTeamForm
import PlayerTeamForm from "./components/PlayerTeamForm";

export default function MemberSection({ team, match }) {
  const { matchPlayers } = useSelector((state) => state.matchPlayer);
  const { matchCoaches } = useSelector((state) => state.matchCoach);
  const dispatch = useDispatch();

  const [isPlayerModalOpen, setPlayerModalOpen] = useState(false);
  const [isCoachModalOpen, setCoachModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (team) {
      dispatch(
        getAllPlayersInMatchTeam({
          teamID: team.team_id,
          matchID: match?.match_id,
        })
      );
      dispatch(
        getAllCoachsInMatchTeam({
          teamID: team.team_id,
          matchID: match?.match_id,
        })
      );
    }
  }, [dispatch, team, match]);

  // console.log("Match Players:", matchPlayers);
  // console.log("Match Coaches:", matchCoaches);

  // Handle player form submit
  const handlePlayerFormSubmit = (formData) => {
    const data = {
      teamID: team.team_id,
      matchID: match.match_id,
      player_id: formData.player_id,
    };

    setLoading(true);
    dispatch(createPlayerInMatchTeam(data))
      .unwrap()
      .then(() => setPlayerModalOpen(false))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // Handle coach form submit
  const handleCoachFormSubmit = (formData) => {
    const data = {
      teamID: team.team_id,
      matchID: match.match_id,
      coach_id: formData.coach_id,
    };

    setLoading(true);
    dispatch(createCoachInMatchTeam(data))
      .unwrap()
      .then(() => setCoachModalOpen(false))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // Handle delete player action
  const handleDeletePlayer = (id) => {
    console.log("Deleted Player ID:", id); // Log id ke konsol
    setLoading(true);
    dispatch(
      deletePlayerInMatchTeam({
        teamID: team.team_id,
        matchID: match.match_id,
        playerID: id,
      })
    )
      .unwrap()
      .then(() => setPlayerModalOpen(false))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // Handle delete coach action
  const handleDeleteCoach = (id) => {
    console.log("Deleted Coach ID:", id); // Log id ke konsol
    setLoading(true);
    dispatch(
      deleteCoachInMatchTeam({
        teamID: team.team_id,
        matchID: match.match_id,
        coachID: id,
      })
    )
      .unwrap()
      .then(() => setCoachModalOpen(false))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full">
      <div className="flex w-full gap-20">
        {/* Players Row */}
        <div className="flex flex-col gap-4">
          <p className="text-xl font-bold">Players</p>
          <div className="flex gap-4">
            {matchPlayers.slice(0, 5).map((player, index) => (
              <div key={index} className="relative flex flex-col">
                <p className="text-lg font-semibold text-center">
                  {player.player.role}
                </p>
                <Card className="bg-gray-800 w-40">
                  <img
                    src={player.player.image}
                    alt={player.player.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </Card>
                <Card className="bg-gray-800 w-40 text-white px-3 py-1 mt-4">
                  <h3 className="font-semibold text-lg">
                    {player.player.name}
                  </h3>
                  <div className="flex gap-2">
                    <div>
                      <p className="text-[10px]">Match Rate:</p>
                      <p className="text-lg text-success">20%</p>
                    </div>
                    <div>
                      <p className="text-[10px]">Game Rate:</p>
                      <p className="text-lg text-success">20%</p>
                    </div>
                  </div>
                </Card>

                {/* Tombol Delete */}
                <button
                  className="absolute top-0 right-0 bg-red-500 p-1 rounded-full"
                  onClick={() => handleDeletePlayer(player.player.player_id)}
                >
                  <X className="text-white w-5 h-5" />
                </button>
              </div>
            ))}

            {matchPlayers.length < 5 && (
              <div
                className="flex flex-col cursor-pointer hover:scale-105 transition"
                onClick={() => setPlayerModalOpen(true)}
              >
                <p className="text-lg font-semibold text-center text-gray-400">
                  New Player
                </p>
                <Card className="bg-gray-800 w-40">
                  <div className="w-full h-48 object-cover rounded-t-lg flex justify-center items-center">
                    <Plus className="h-12 w-12 text-gray-300" />
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Coaches Row */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Coaches</h2>
          <div className="flex gap-4">
            {matchCoaches.slice(0, 2).map((coach, index) => (
              <div key={index} className="relative flex flex-col">
                <p className="text-lg font-semibold text-center">
                  {coach.coach.role}
                </p>
                <Card className="bg-gray-800 w-40">
                  <img
                    src={coach.coach.image}
                    alt={coach.coach.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </Card>
                <Card className="bg-gray-800 w-40 text-white px-3 py-1 mt-4">
                  <h3 className="font-semibold text-lg">{coach.coach.name}</h3>
                  <div className="flex gap-2">
                    <div>
                      <p className="text-[10px]">Match Rate:</p>
                      <p className="text-lg text-success">20%</p>
                    </div>
                    <div>
                      <p className="text-[10px]">Game Rate:</p>
                      <p className="text-lg text-success">20%</p>
                    </div>
                  </div>
                </Card>

                {/* Tombol Delete */}
                <button
                  className="absolute top-0 right-0 bg-red-500 p-1 rounded-full"
                  onClick={() => handleDeleteCoach(coach.coach.coach_id)}
                >
                  <X className="text-white w-5 h-5" />
                </button>
              </div>
            ))}

            {matchCoaches.length < 2 && (
              <div
                className="flex flex-col cursor-pointer hover:scale-105 transition"
                onClick={() => setCoachModalOpen(true)}
              >
                <p className="text-lg font-semibold text-center text-gray-400">
                  New Coach
                </p>
                <Card className="bg-gray-800 w-40">
                  <div className="w-full h-48 object-cover rounded-t-lg flex justify-center items-center">
                    <Plus className="h-12 w-12 text-gray-300" />
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Player */}
      <Modal
        isOpen={isPlayerModalOpen}
        onClose={() => setPlayerModalOpen(false)}
      >
        <ModalContent className="bg-gray-800 text-white pb-4">
          <ModalHeader>{"Create New Player"}</ModalHeader>
          <ModalBody>
            <PlayerTeamForm onSubmit={handlePlayerFormSubmit} team={team} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal for Coach */}
      <Modal isOpen={isCoachModalOpen} onClose={() => setCoachModalOpen(false)}>
        <ModalContent className="bg-gray-800 text-white pb-4">
          <ModalHeader>{"Create New Coach"}</ModalHeader>
          <ModalBody>
            <CoachTeamForm onSubmit={handleCoachFormSubmit} team={team} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
