import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTeams, getTeamByID } from '../../redux/thunks/teamThunk';
import { clearTeam } from '../../redux/features/teamSlice';

const TeamSelect = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const { team, teams } = useSelector((state) => state.team);
    const [teamID, setTeamID] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    console.log("teams idddd: ", team?.team_id);

    console.log("teams xxxx: ", teams);
    
    

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        setLoading(true);
        console.log("cek dulu sini");
        
        dispatch(getAllTeams())
            .unwrap()
            .then(() => {
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [team]);

    useEffect(() => {
        
        const id = localStorage.getItem("teamID");
        if (id) {
            dispatch(getTeamByID(id));
        }

        // return () => {
        //     dispatch(clearTeam());
        // };
    }, [dispatch, teamID]);

    useEffect(() => {
        console.log("djskhdkjsda");
        const id = localStorage.getItem("teamID");
        if (id) {
            dispatch(getTeamByID(id));
        }
    }, []);

    const handleTeamSelect = (team) => {
        setSelectedTeam(team);
        setTeamID(team?.team_id);
        setIsOpen(false);
        localStorage.setItem("teamID", team?.team_id);
    };

    return (
        <div className="relative w-48">
            <button
                onClick={toggleDropdown}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none"
            >
                {team && <div className="flex items-center">
                    <img src={team?.image} alt={team?.name} className="w-6 h-6 mr-2" />
                    <span>{team?.name}</span>
                </div>}
                {!team && <span>Select Team</span>}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <ul className="absolute w-full mt-1 bg-gray-700 rounded-md shadow-lg">
                    {loading ?
                        <li
                            className="flex items-center px-4 py-2 hover:bg-gray-600 cursor-pointer">
                            <span className="text-white">Loading...</span>
                        </li>
                        : <li
                            className="flex items-center px-4 py-2 hover:bg-gray-600 cursor-pointer">
                            <span className="text-white">Chhose team</span>
                        </li>
                    }
                    {teams?.map((team) => (
                        <li
                            key={team?.team_id}
                            onClick={() => handleTeamSelect(team)}
                            className="flex items-center px-4 py-2 hover:bg-gray-600 cursor-pointer"
                        >
                            <img src={team?.image} alt={team?.name} className="w-6 h-6 mr-2" />
                            <span className="text-white">{team?.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TeamSelect;