import { Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { ChevronDownIcon, Edit, Eye } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ExcelExport from "../../components/export/ExcelExport";
import MatchEditContext from "../../contexts/MatchEditContext";
import { PageContext } from "../../contexts/PageContext";
import { clearMatch } from "../../redux/features/matchSlice";
import { getMatchByID } from "../../redux/thunks/matchThunk";
import { getTeamByID } from "../../redux/thunks/teamThunk";
import { getTournamentByID } from "../../redux/thunks/tournamentThunk";
import GameSection from "./match/GameSection";
import HeroSection from "./match/HeroSection";
import MatchSection from "./match/MatchSection";
import MemberSection from "./match/MemberSection";
import PrioritySection from "./match/PrioritySection";
import TeamStatsSection from "./match/TeamStatsSection";
import TeamTitle from "./match/TeamTitle";
import { usePDF } from "react-to-pdf";

export default function Match() {
  const { updatePage } = useContext(PageContext);
  const { isEditingMatch, toggleEditing, removeEditing } =
    useContext(MatchEditContext);
  const { tournamentID, matchID } = useParams();
  const navigation = useNavigate();
  const { match } = useSelector((state) => state.match);
  const { tournament } = useSelector((state) => state.tournament);
  const { games } = useSelector((state) => state.game);
  const [gameLength, setGameLength] = useState(0);
  const [isShowDetailMatch, setShowDetailMatch] = useState(false);
  const { team } = useSelector((state) => state.team);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [teamID, setTeamID] = useState("");

  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  useEffect(() => {
    return () => {
      removeEditing();
    };
  }, []);

  useEffect(() => {
    dispatch(getMatchByID(matchID));
    dispatch(getTournamentByID(tournamentID));
    const id = localStorage.getItem("teamID");
    if (id) {
      dispatch(getTeamByID(id));
    }
    return () => {
      dispatch(clearMatch());
    };
  }, [dispatch]);

  useEffect(() => {
    const gms = games?.filter(
      (game) =>
        game?.first_team.team_id === team?.team_id ||
        game?.second_team.team_id === team?.team_id
    );
    setGameLength(gms.length);
    const cek =
      gms.length > 0 &&
      (match?.team_a_id === team?.team_id ||
        match?.team_b_id === team?.team_id);

    setShowDetailMatch(cek);
  }, [games, team]);

  useEffect(() => {
    updatePage(
      `${tournament?.name}`,
      <div className="flex flex-row space-x-4 justify-start items-center">
        <div className="flex space-x-4 justify-center items-center">
          {isEditingMatch && (
            <div className="text-white whitespace-nowrap text-sm px-4 py-2 bg-[#2c7ab6] rounded-full">
              Editing Mode
            </div>
          )}
          {isEditingMatch ? (
            <Eye
              className={`opacity-100 cursor-pointer`}
              onClick={() => {
                if (isEditingMatch) {
                  toggleEditing();
                }
              }}
            />
          ) : (
            <Edit
              size={22}
              className={`opacity-100 cursor-pointer`}
              onClick={() => {
                if (!isEditingMatch) {
                  toggleEditing();
                }
              }}
            />
          )}
        </div>
        <div className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none">
          {team && (
            <div className="flex items-center">
              <img
                src={team?.image}
                alt={team?.name}
                className="w-6 h-6 mr-2"
              />
              <span>{team?.name}</span>
            </div>
          )}
          {!team && <span>Select Team</span>}
        </div>
        <Popover placement="bottom" offset={20} showArrow>
          <PopoverTrigger>
            <Button color="secondary">
              Export
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="">
            <div className="p-2 flex flex-col gap-2">
              {/* Edit Button */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => navigation(`/export/tournament/${tournamentID}/match/${matchID}`)}
                >
                  PDF
                </Button>
              </div>

              {/* Delete Button */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                >
                  <ExcelExport />
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }, [updatePage, tournament?.name, team, isEditingMatch, toggleEditing]);

  const handleChooseTeam = (team) => {
    console.log("Team Selected:", team);
    // setTeamID(team?.team_id);
  };

  return (
    <div
      ref={targetRef}
      className="text-white flex bg-[#161618] flex-col justify-start items-start w-full p-4 gap-10"
    >
      <MatchSection handleChooseTeam={handleChooseTeam} match={match} />
      {team && isShowDetailMatch && <TeamTitle team={team} />}
      {team && isShowDetailMatch && (
        <TeamStatsSection team={team} match={match} />
      )}
      {team && isShowDetailMatch && <MemberSection team={team} match={match} />}
      {team && isShowDetailMatch && <HeroSection team={team} match={match} />}
      {team && isShowDetailMatch && (
        <PrioritySection team={team} match={match} />
      )}
      {team && isShowDetailMatch && <GameSection team={team} match={match} />}
    </div>
  );
}
