import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/Card";
import { PageContext } from "../../contexts/PageContext";
import {
  createMatch,
  deleteMatch,
  getAllMatches,
  updateMatch,
} from "../../redux/thunks/matchThunk";
import { getTournamentByID } from "../../redux/thunks/tournamentThunk";
import { fromUnixTime, toUnixTime } from "../../utils/timeFormator";
import MatchForm from "./components/MatchForm";
import TeamSelect from "../../components/layout/TeamSelect";
import { div, g, s } from "framer-motion/client";

export default function Tournament() {
  const { updatePage } = useContext(PageContext);
  const nav = useNavigate();
  const { tournamentID } = useParams();
  const dispatch = useDispatch();
  const { matches } = useSelector((state) => state.match);
  const { tournament } = useSelector((state) => state.tournament);

  const { team } = useSelector((state) => state.team);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [filteredMatches, setFilteredMatches] = useState([]);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false); // Modal konfirmasi
  const [matchToDelete, setMatchToDelete] = useState(null);

  useEffect(() => {
    dispatch(getAllMatches(tournamentID))
      .unwrap()
      .then((value) => {
        if (value.length === 0) {
          setFilteredMatches([]);
        } else {
          if (filteredMatches.length === 0) {
            const filter = value.filter(
              (match) =>
                match?.team_a_id === team?.team_id ||
                match?.team_b_id === team?.team_id
            );
            const groups = groupMatchesByStage(filter);
            setFilteredMatches(groups);
          }
        }
      });
    dispatch(getTournamentByID(tournamentID));
  }, [dispatch, tournamentID]);

  useEffect(() => {
    if (matches && matches.length > 0) {
      if (team) {
        const filter = matches.filter(
          (match) =>
            match?.team_a_id === team?.team_id ||
            match?.team_b_id === team?.team_id
        );
        const groups = groupMatchesByStage(filter);
        setFilteredMatches(groups);
      } else {
        const groups = groupMatchesByStage(matches);
        setFilteredMatches(groups);
      }
    }
  }, [team, matches]);

  const order = ['season', 'groupstage', 'playoff', 'grandfinal'];

  const groupMatchesByStage = (matches) => {
    const groupedMatches = matches.reduce((acc, match) => {
      let groupKey = match.stage.replace(/\s+/g, "").toLowerCase(); // Hilangkan spasi dan lowercase

      // Jika groupKey mengandung "week", masukkan ke "season"
      if (groupKey.includes("week")) {
        groupKey = "season";
      }

      // Jika groupKey mengandung "group", masukkan ke "groupstage"
      if (groupKey.includes("group")) {
        groupKey = "groupstage";
      }

      // Cari key yang berhubungan di 'order' (yang lebih pendek atau lebih panjang)
      const existingKey = order.find(item => groupKey.includes(item) || item.includes(groupKey));

      // Jika key yang lebih pendek ditemukan di 'order', dan groupKey lebih panjang, gantikan
      if (existingKey && groupKey.length > existingKey.length) {
        const index = order.indexOf(existingKey);
        order.splice(index, 1, groupKey); // Ganti key yang lebih pendek dengan yang lebih panjang

        // Update juga accumulator dengan key baru
        if (acc[existingKey]) {
          acc[groupKey] = acc[existingKey];
          delete acc[existingKey]; // Hapus key lama
        }
      }
      // Jika key yang cocok belum ada, tambahkan groupKey baru
      else if (!existingKey) {
        order.splice(2, 0, groupKey); // Tambahkan di index ke-2
      }

      // Gunakan groupKey yang sudah ada di 'order' (pastikan ini key yang benar)
      const matchedGroup = order.find(item => groupKey.includes(item) || item.includes(groupKey));
      if (matchedGroup) {
        groupKey = matchedGroup; // Pakai key dari 'order'
      }

      // Jika key belum ada di accumulator, inisialisasi dengan array kosong
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }

      // Masukkan pertandingan ke dalam grup yang sesuai
      acc[groupKey].push(match);
      return acc;
    }, {});

    // Sorting khusus untuk "season" berdasarkan Week dan Day
    if (groupedMatches["season"]) {
      groupedMatches["season"] = groupedMatches["season"].sort((a, b) => {
        const weekA = parseInt(a.stage.match(/\d+/), 10); // Ambil angka dari "Week"
        const weekB = parseInt(b.stage.match(/\d+/), 10);

        if (weekA === weekB) {
          return a.day - b.day; // Sorting berdasarkan hari jika minggu sama
        }
        return weekA - weekB; // Sorting berdasarkan minggu
      });
    }

    // Sorting untuk grup lainnya berdasarkan hari
    Object.keys(groupedMatches).forEach((key) => {
      if (key !== "season") {
        groupedMatches[key] = groupedMatches[key].sort((a, b) => {
          return a.day - b.day; // Sorting berdasarkan hari
        });
      }
    });

    // Konversi hasil grouping dari objek ke array of objects
    const filter = Object.keys(groupedMatches).map((stage) => ({
      stage, // Nama stage ("season", "playoff", dll.)
      matches: groupedMatches[stage], // Array pertandingan
    }));

    // Sorting berdasarkan urutan yang ada di 'order'
    return Object.values(filter).sort((a, b) => {
      return order.indexOf(a.stage.toLowerCase()) - order.indexOf(b.stage.toLowerCase());
    });
  };





  const handleFormSubmit = (formData) => {
    const data = {
      stage: formData.stage.charAt(0).toUpperCase() + formData.stage.slice(1),
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
        <TeamSelect />
        {/* <input
          type="text"
          placeholder="Search"
          className="max-w-xs text-white bg-[#141414] px-4 py-2 rounded-xl border border-gray-600 focus:border-gray-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        /> */}
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

  const openConfirmModal = (match) => {
    setMatchToDelete(match);
    setConfirmModalOpen(true);
  };

  const handleDeleteMatch = () => {
    console.log("matchToDelete:", matchToDelete);
    dispatch(deleteMatch(matchToDelete.match_id))
      .unwrap()
      .catch(console.error)
      .finally(() => {
        dispatch(getAllMatches(tournamentID));
        setConfirmModalOpen(false);
        setMatchToDelete(null);
        setLoading(false);
      });
  };

  return (
    <div className="text-white flex flex-col justify-start items-start h-full w-full p-4">
      <div className="flex flex-col flex-wrap gap-2 justify-start items-start w-full">
        {filteredMatches &&
          filteredMatches.map((group) => (
            <div
              key={group.stage}
              style={{ marginBottom: "20px" }}
              className="w-full"
            >
              <h2 className="text-2xl font-semibold mb-4">
                {group.stage.charAt(0).toUpperCase() + group.stage.slice(1)}
              </h2>

              {/* Looping melalui matches di dalam setiap stage */}
              <div className="flex flex-row flex-wrap gap-4 justify-start items-start w-full">
                {Array.isArray(group.matches) && group.matches.length > 0 ? (
                  group.matches.map((match) => (
                    <div
                      key={match.match_id}
                      onClick={() =>
                        nav(
                          `/tournament/${tournamentID}/match/${match.match_id}`
                        )
                      }
                    >
                      <Card className="hover:bg-[#29292b] cursor-pointer p-4 mb-4">
                        <div className="flex flex-row justify-between items-center">
                          <div className="text-[12px] text-gray-400">
                            {match.stage}, Day {match.day}
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
                              onClick={() => openConfirmModal(match)}
                            />
                          </div>
                        </div>
                        <div className="flex flex-row justify-between space-x-3 items-center mt-3">
                          <TeamInfo team={match.team_a} />
                          <div className="text-xl font-bold">
                            {match.team_a_score} - {match.team_b_score}
                          </div>
                          <TeamInfo team={match.team_b} />
                        </div>
                      </Card>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No matches available for this stage.
                  </p>
                )}
              </div>
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

      {/* Modal Konfirmasi Hapus */}
      <Modal
        Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
      >
        <ModalContent className="bg-gray-800 text-white">
          <ModalHeader>Delete Confirmation</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this match?</p>
            <p className="text-red-500">
              This action will{" "}
              <span className="font-bold">delete all data related</span> to this
              match.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleDeleteMatch}>
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
