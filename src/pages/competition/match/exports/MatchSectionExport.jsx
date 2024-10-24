import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
} from "@nextui-org/react";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditableTableForGame from "../../../../archive/EditableTableForGame";
import Card from "../../../../components/Card";
import {
    createMatchGame,
    deleteGame,
    getAllMatchGames,
    updateGame,
} from "../../../../redux/thunks/gameThunk";
import { getAllTeamsInMatch } from "../../../../redux/thunks/teamThunk";

export default function MatchSectionExport({ match, handleChooseTeam }) {
    const dispatch = useDispatch();
    const { teams } = useSelector((state) => state.teamMatch);
    const { games } = useSelector((state) => state.game);

    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState([]);
    const [isAlertVisible, setAlertVisible] = useState(false); // State for alert

    useEffect(() => {
        if (match) {
            setLoading(true);
            Promise.all([
                dispatch(getAllTeamsInMatch(match?.match_id)),
                dispatch(getAllMatchGames(match?.match_id)),
            ]).finally(() => setLoading(false));
        }
    }, [dispatch, match]);

    useEffect(() => {
        const data = games.map((game) => ({
            id: game.game_id,
            game: game.game_number,
            first: game.first_pick_team_id,
            second: game.second_pick_team_id,
            win: game.winner_team_id,
        }));
        setInitialData(data);

        return () => {
            setInitialData([]);
        };
    }, [games]);

    const selectOptions = useMemo(() => {
        if (!teams) return {};
        return ["first", "second", "win"].reduce((options, key) => {
            options[key] = teams.map((team) => ({
                value: team.team_id,
                label: team.name,
                image: team.image,
            }));
            return options;
        }, {});
    }, [teams]);

    const handleTeamClick = (team) => {
        if (games.length === 0) {
            setAlertVisible(true); // Show alert if no game details
            return;
        }
        handleChooseTeam(team); // Proceed if there are games
    };

    const handleSaveRow = (rowData) => {
        console.log(rowData);
        setLoading(true);
        const data = {
            matchID: match?.match_id,
            gameNumber: parseInt(rowData.game, 10),
            firstPickTeamID: parseInt(rowData.first, 10),
            secondPickTeamID: parseInt(rowData.second, 10),
            winnerTeamID: parseInt(rowData.win, 10),
            videoLink: "",
            fullDraftImage: "",
        };

        const action = rowData.isNew
            ? createMatchGame(data)
            : updateGame({ ...data, gameID: rowData.id });

        dispatch(action)
            .unwrap()
            .then(() => dispatch(getAllMatchGames(match?.match_id)))
            .catch((error) => console.error("Error:", error))
            .finally(() => setLoading(false));
    };

    const handleDeleteRow = (data) => {
        console.log("Data yang dihapus (data):", data);
        setLoading(true);
        dispatch(deleteGame({ matchID: match?.match_id, gameID: data.id }))
            .unwrap()
            .then(() => dispatch(getAllMatchGames(match?.match_id)))
            .catch((error) => console.error("Error:", error))
            .finally(() => setLoading(false));
    };

    function findSmallestMissingNumber(numbers) {
        const sorted = [...new Set(numbers)].sort((a, b) => a - b);
        let expected = 1;

        for (let num of sorted) {
            if (num !== expected) break;
            expected++;
        }

        return expected;
    }

    if (loading)
        return (
            <div className="w-full flex justify-center">
                <Spinner />
            </div>
        );

    return (
        <div className="w-full">
            <div className="text-xl font-semibold">Data Match</div>
            <div className="flex flex-col w-full space-y-5">
                <div className="flex flex-col flex-1 w-full">
                    <div className="flex flex-col space-y-6 pb-10">
                        <div className="flex flex-row space-x-20 justify-center items-center p-2">
                            <div className="flex space-x-20 items-center">
                                <div className="flex flex-col items-center space-y-2">
                                    <div
                                        className="w-44 h-44 rounded-full items-center justify-center flex border-2"
                                    // onClick={() => handleTeamClick(match?.team_a)}
                                    >
                                        <img
                                            src={match?.team_a?.image}
                                            alt={match?.team_a?.name}
                                            className="w-32 h-32 object-contain bg-center"
                                        />
                                    </div>
                                    <div className="text-black text-4xl font-bold">{match?.team_a?.name}</div>
                                </div>
                                <p className="text-center font-bold text-5xl text-black">
                                    {match?.team_a_score}
                                </p>
                            </div>

                            <div className="text-3xl text-black font-bold">VS</div>

                            <div className="flex space-x-20 items-center">
                                <p className="text-center font-bold text-5xl text-black">
                                    {match?.team_b_score}
                                </p>
                                <div className="flex flex-col items-center space-y-2">
                                    <div
                                        className="w-40 h-40 rounded-full items-center justify-center flex border-2"
                                    // onClick={() => handleTeamClick(match?.team_b)}
                                    >
                                        <img
                                            src={match?.team_b?.image}
                                            alt={match?.team_b?.name}
                                            className="w-28 h-28 object-contain bg-center"
                                        />
                                    </div>
                                    <div className="text-black text-4xl font-bold">{match?.team_b?.name}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full">
                            <EditableTableForGame
                                headerClassName="bg-gray-200 text-black"
                                cellClassName="text-black"
                                maxRows={match?.team_a_score + match?.team_b_score}
                                onDeleteRow={handleDeleteRow}
                                columns={[
                                    {
                                        label: "Game",
                                        field: "game",
                                        type: "text",
                                        readOnly: true,
                                        defaultValue: findSmallestMissingNumber(
                                            ([...games] || []).map((game) => game.game_number)
                                        ),
                                    },
                                    {
                                        label: "First Pick",
                                        field: "first",
                                        type: "select",
                                        renderCell: (value, options) => {
                                            const hero = options.find(
                                                (option) => option.value == value
                                            );
                                            return (
                                                <div className="flex items-center gap-2 justify-center">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                                        <img
                                                            src={hero?.image}
                                                            alt="Hero"
                                                            className="w-8 h-8 object-contain bg-center"
                                                        />
                                                    </div>
                                                    <span className="text-black">{hero?.label || "Unknown"}</span>
                                                </div>
                                            );
                                        },
                                    },
                                    {
                                        label: "Second Pick",
                                        field: "second",
                                        type: "select",
                                        renderCell: (value, options) => {
                                            const hero = options.find(
                                                (option) => option.value == value
                                            );
                                            return (
                                                <div className="flex items-center gap-2 justify-center">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                                        <img
                                                            src={hero?.image}
                                                            alt="Hero"
                                                            className="w-8 h-8 object-contain bg-center"
                                                        />
                                                    </div>
                                                    <span className="text-black">{hero?.label || "Unknown"}</span>
                                                </div>
                                            );
                                        },
                                    },
                                    {
                                        label: "Win", field: "win", type: "select",
                                        renderCell: (value, options) => {
                                            const hero = options.find(
                                                (option) => option.value == value
                                            );
                                            return (
                                                <div className="flex items-center gap-2 justify-center">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                                        <img
                                                            src={hero?.image}
                                                            alt="Hero"
                                                            className="w-8 h-8 object-contain bg-center"
                                                        />
                                                    </div>
                                                    <span className="text-black">{hero?.label || "Unknown"}</span>
                                                </div>
                                            );
                                        },
                                    },
                                ]}
                                initialData={initialData}
                                selectOptions={selectOptions}
                                onSaveRow={handleSaveRow}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isAlertVisible} onClose={() => setAlertVisible(false)}>
                <ModalContent className="bg-gray-800 text-white pb-4">
                    <ModalHeader>No Game Details</ModalHeader>
                    <ModalBody>Please add game details</ModalBody>
                    <ModalFooter>
                        <Button onClick={() => setAlertVisible(false)}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
