import React, { useEffect, useMemo, useState } from 'react'
import DraftLinkForm from '../components/DraftLinkForm'
import TrioMid from '../components/TrioMid'
import Goldlaner from '../components/Goldlaner'
import Explaner from '../components/Explaner'
import GameResult from '../components/GameResult'
import Turtle from '../components/Turtle'
import Lord from '../components/Lord'
import { getAllExplaners, getAllGoldlaners, getAllTrioMids, getTrioMidResult } from '../../../../redux/thunks/gameThunk'
import { useDispatch, useSelector } from 'react-redux'
import { getAllHeroes } from '../../../../redux/thunks/heroThunk'
import { getAllHeroPicks } from '../../../../redux/thunks/matchThunk'
import EarlyResultForm from '../components/EarlyResultForm'
import GameRoleResultTable from '../components/GameRoleResultTable'
import { getAllTurtleResults } from '../../../../redux/thunks/turtleThunk'
import { getAllLordResults } from '../../../../redux/thunks/lordThunk'
import LordTurtleResultTable from '../components/LordTurtleResultTable'
import { useParams } from 'react-router-dom'

export default function GameDataExport({ match, game, team, handleSaveDraft }) {

    const [trioMidData, setTrioMidData] = useState([])
    const [trioMidInitialData, setTrioMidInitialData] = useState([])
    const [loading, setLoading] = useState(false)
    const [goldLanerData, setGoldLanerData] = useState([])
    const [goldLanerInitialData, setGoldLanerInitialData] = useState([])
    const [explanerData, setExplanerData] = useState([])
    const [explanerInitialData, setExplanerInitialData] = useState([])
    const [gameResultData, setGameResultData] = useState([])
    const [turtleData, setTurtleData] = useState([])
    const [turtleInitialData, setTurtleInitialData] = useState([])
    const [lordData, setLordData] = useState([])
    const [lordInitialData, setLordInitialData] = useState([])
    const [trioMidResultData, setTrioMidResultData] = useState([])

    const { matchID } = useParams()

    const { heroPicks } = useSelector((state) => state.heroPick);

    const dispatch = useDispatch();

    const trioMidColumns = useMemo(
        () => [
            { label: "Hero", field: "hero", type: "select" },
            { label: "Role", field: "role", type: "select" },
            { label: "Early Result", field: "early_result", type: "select" },
        ],
        []
    );

    const goldlanerColumns = useMemo(
        () => [
            { label: "Hero", field: "hero", type: "select" },
            { label: "Early Result", field: "early_result", type: "select" },
        ],
        []
    );

    const explanerColumns = useMemo(
        () => [
            { label: "Hero", field: "hero", type: "select" },
            { label: "Early Result", field: "early_result", type: "select" },
        ],
        []
    );

    const turtleLordColumns = [
        {
            label: "Setup",
            field: "setup",
            type: "select",
            renderCell: (value, options) => {
                const result = options.find((option) => option.value == value);
                let style = "text-white bg-[#ab6161]";
                if (result?.value === "early") {
                    style = "text-white bg-[#61AB76]";
                } else if (result?.value === "late") {
                    style = "text-white bg-[#d4b560]";
                }

                return (
                    <div className={`${style} px-4 py-2 rounded-full`}>
                        <span>{result?.label || "Unknown"}</span>
                    </div>
                );
            },
        },
        {
            label: "Initiate",
            field: "initiate",
            type: "select",
            renderCell: (value, options) => {
                const result = options.find((option) => option.value == value);
                let style = "text-white bg-[#ab6161]";
                if (result?.value === "yes") {
                    style = "text-white bg-[#61AB76]";
                }

                return (
                    <div className={`${style} px-4 py-2 rounded-full`}>
                        <span>{result?.label || "Unknown"}</span>
                    </div>
                );
            },
        },
        {
            label: "Result",
            field: "result",
            type: "select",
            renderCell: (value, options) => {
                const result = options.find((option) => option.value == value);
                let style = "text-white bg-[#ab6161]";
                if (result?.value === "yes") {
                    style = "text-white bg-[#61AB76]";
                }

                return (
                    <div className={`${style} px-4 py-2 rounded-full`}>
                        <span>{result?.label || "Unknown"}</span>
                    </div>
                );
            },
        },
    ];

    const earlyResultOptions = [
        { value: "win", label: "Win" },
        { value: "draw", label: "Draw" },
        { value: "lose", label: "Lose" },
    ];

    const turtleLordSelectOptions = useMemo(() => {
        return {
            setup: [
                { value: "early", label: "Early" },
                { value: "late", label: "Late" },
                { value: "no", label: "No" },
            ],
            initiate: [
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
            ],
            result: [
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
            ],
        };
    }, []);

    // 'jungler', 'midlaner', 'roamer'
    const roleOptions = [
        { value: "jungler", label: "Jungler" },
        { value: "midlaner", label: "Midlaner" },
        { value: "roamer", label: "Roamer" },
    ];

    const heroOptions = useMemo(
        () =>
            heroPicks.map((hero) => ({
                value: hero.hero.hero_id,
                label: hero.hero.name,
                image: hero.hero.image,
            })),
        [heroPicks]
    );

    useEffect(() => {
        if (game && team) {
            dispatch(getAllHeroes());
            dispatch(
                getAllHeroPicks({ matchID: matchID, teamID: team?.team_id })
            );
        }
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllTrioMids({ gameID: game?.game_id, teamID: team?.team_id }))
            .unwrap()
            .then((response) => {
                setTrioMidData(response)
            })

        dispatch(getTrioMidResult({ gameID: game?.game_id, teamID: team?.team_id }))
            .unwrap()
            .then((response) => {
                setTrioMidResultData(response)
            })

        dispatch(getAllGoldlaners({ gameID: game?.game_id, teamID: team?.team_id }))
            .unwrap()
            .then((response) => {
                setGoldLanerData(response)
            })
        dispatch(getAllExplaners({ gameID: game?.game_id, teamID: team?.team_id }))
            .unwrap()
            .then((response) => {
                setExplanerData(response)
            })
        dispatch(getAllTurtleResults({ matchID: matchID, gameID: game?.game_id }))
            .unwrap()
            .then((response) => {
                console.log("game ", game?.game_number);
                console.log("response tutel: ", response);

                setTurtleData(response)
            })
        dispatch(getAllLordResults({ matchID: matchID, gameID: game?.game_id }))
            .unwrap()
            .then((response) => {
                console.log("game ", game?.game_number);

                console.log("response lord: ", response);

                setLordData(response)
            })
    }, []);

    useEffect(() => {
        if (trioMidData) {
            const parsedData = trioMidData.map((trioMid) => ({
                id: trioMid.trio_mid_hero_id,
                hero: trioMid.hero.hero_id,
                role: trioMid.role,
                early_result: trioMid.early_result,
            }));
            setTrioMidInitialData(parsedData);
        }
        return () => {
            setTrioMidInitialData([]);
        }
    }, [trioMidData]);

    useEffect(() => {
        if (goldLanerData) {
            const parsedData = goldLanerData.map((goldlaner) => ({
                id: goldlaner.goldlaner_id,
                hero: goldlaner.hero.hero_id,
                early_result: goldlaner.early_result,
            }));
            setGoldLanerInitialData(parsedData);
        }
        return () => {
            setGoldLanerInitialData([]);
        }
    }, [goldLanerData]);

    useEffect(() => {
        if (explanerData) {
            const parsedData = explanerData.map((explaner) => ({
                id: explaner.explaner_id,
                hero: explaner.hero.hero_id,
                early_result: explaner.early_result,
            }));
            setExplanerInitialData(parsedData);
        }
        return () => {
            setExplanerInitialData([]);
        }
    }, [explanerData]);

    useEffect(() => {
        if (turtleData) {
            const initialTurtleResults = turtleData.map((turtle) => ({
                id: turtle.turtle_result_id,
                initiate: turtle.initiate,
                // phase: turtle.phase,
                result: turtle.result,
                setup: turtle.setup,
            }));
            setTurtleInitialData(initialTurtleResults);
        }
        return () => {
            setTurtleInitialData([]);
        };
    }, [turtleData]);

    useEffect(() => {
        if (lordData) {
            const initialLordResults = lordData.map((lord) => ({
                id: lord.lord_result_id,
                initiate: lord.initiate,
                // phase: lord.phase,
                result: lord.result,
                setup: lord.setup,
            }));
            setLordInitialData(initialLordResults);
        }
        return () => {
            setLordInitialData([]);
        };
    }, [lordData]);

    return (
        <>
            <div className="flex flex-row items-center space-x-3">
                <div className="text-4xl font-bold">Game {game?.game_number}</div>
                <div
                    className={`px-4 py-1 ${game?.winner_team_id === team?.team_id
                        ? "bg-[#61AB76] text-white"
                        : "bg-[#ab6161] text-white"
                        } text-xl rounded-full font-bold`}
                >
                    {game.winner_team_id === team?.team_id ? "Win" : "Lose"}
                </div>
            </div>
            <div className="bg-transparent text-white mt-3">
                <div className="flex flex-row space-x-5 items-center">
                    <DraftLinkForm
                        className="bg-white border-2 border-gray-200 text-black"
                        onSave={handleSaveDraft}
                        initialImageLink={game?.full_draft_image}
                        initialVideoLink={game?.video_link}
                    />
                </div>

                <div className="w-full">
                    <div className="flex flex-row mt-5 space-x-4">
                        {trioMidData && <div className="text-black flex-1 flex-col flex">
                            <div className="text-xl font-bold mb-2">Trio Mid</div>
                            <div className="border-2 rounded-xl flex-1">
                                <GameRoleResultTable
                                    headerClassName="bg-gray-200 text-black"
                                    cellClassName="text-black bg-white"
                                    columns={trioMidColumns}
                                    initialData={trioMidInitialData}
                                    selectOptions={{
                                        hero: heroOptions,
                                        early_result: earlyResultOptions,
                                        role: roleOptions,
                                    }}
                                    onDelete={() => { }}
                                    onSaveRow={() => { }}
                                    maxRows={3}
                                />
                                <div className="flex px-10 w-full text-5xl text-black">
                                    {trioMidData?.early_result}
                                </div>
                            </div>
                        </div>}
                        {<div className="text-black flex-1 flex-col flex">
                            <div className="text-xl font-bold mb-2">Goldlaner</div>
                            <div className="border-2 rounded-xl flex-1">
                                <GameRoleResultTable
                                    headerClassName="bg-gray-200 text-black"
                                    cellClassName="text-black bg-white"
                                    columns={goldlanerColumns}
                                    initialData={goldLanerInitialData}
                                    selectOptions={{
                                        hero: heroOptions,
                                        early_result: earlyResultOptions,
                                    }}
                                    onDelete={() => { }}
                                    onSaveRow={() => { }}
                                    maxRows={1}
                                />
                            </div>
                        </div>}
                        {<div className="text-black flex-1 flex-col flex">
                            <div className="text-xl font-bold mb-2">Explaner</div>
                            <div className="border-2 rounded-xl flex-1">
                                <GameRoleResultTable
                                    headerClassName="bg-gray-200 text-black"
                                    cellClassName="text-black bg-white"
                                    columns={explanerColumns}
                                    initialData={explanerInitialData}
                                    selectOptions={{
                                        hero: heroOptions,
                                        early_result: earlyResultOptions,
                                    }}
                                    onDelete={() => { }}
                                    onSaveRow={() => { }}
                                    maxRows={1}
                                />
                            </div>
                        </div>}
                    </div>
                </div>

                <div className="flex w-full flex-col p-1 mt-2">
                    <GameResult className="bg-white border-2 border-gray-200 rounded-xl text-black" textClassName="text-black" game={game} team={team} />
                </div>

                <div className="flex w-full flex-row mt-5 space-x-5 flex-1">
                    {<div className="flex flex-col space-y-3 flex-1">
                        <div className="text-xl font-bold text-black">Turtle Results</div>
                        <div className="border-2 rounded-xl flex-col flex-1">
                            <div className="w-full flex flex-col">
                                <LordTurtleResultTable headerClassName="bg-gray-200 text-black"
                                    cellClassName="text-black bg-white" columns={turtleLordColumns} initialData={turtleInitialData} selectOptions={turtleLordSelectOptions} onSaveRow={() => { }} onDeleteRow={() => { }} />
                            </div>
                        </div>
                    </div>}
                    {<div className="flex flex-col space-y-3 flex-1">
                        <div className="text-xl font-bold text-black">Lord Results</div>
                        <div className="border-2 rounded-xl flex-col flex-1">
                            <div className="w-full flex flex-col">
                                <LordTurtleResultTable headerClassName="bg-gray-200 text-black"
                                    cellClassName="text-black bg-white" columns={turtleLordColumns} initialData={lordInitialData} selectOptions={turtleLordSelectOptions} onSaveRow={() => { }} onDeleteRow={() => { }} />
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </>
    )
}
