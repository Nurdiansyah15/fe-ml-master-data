import { Button } from "@nextui-org/react";
import { Edit, Eye } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ExcelExport from "../../components/export/ExcelExport";
import MatchEditContext from "../../contexts/MatchEditContext";
import { PageContext } from "../../contexts/PageContext";
import { clearMatch } from "../../redux/features/matchSlice";
import { getMatchByID } from "../../redux/thunks/matchThunk";
import { getTeamByID } from "../../redux/thunks/teamThunk";
import { getTournamentByID } from "../../redux/thunks/tournamentThunk";
import MatchSectionExport from "./match/exports/MatchSectionExport";
import TeamTitleExport from "./match/exports/TeamTitleExport";
import TeamStatsSectionExport from "./match/exports/TeamStatsSectionExport";
import MemberSectionExport from "./match/exports/MemberSectionExport";
import HeroSectionExport from "./match/exports/HeroSectionExport";
import PrioritySectionExport from "./match/exports/PrioritySectionExport";
import GameSectionExport from "./match/exports/GameSectionExport";
import moment from "moment";
import generatePDF, { Margin, Resolution, usePDF } from "react-to-pdf";


export default function ExportMatch() {
  const { isEditingMatch, toggleEditing, removeEditing } =
    useContext(MatchEditContext);
  const { tournamentID, matchID } = useParams();
  const { match } = useSelector((state) => state.match);
  const { tournament } = useSelector((state) => state.tournament);
  const { games } = useSelector((state) => state.game);
  const [gameLength, setGameLength] = useState(0);
  const [isShowDetailMatch, setShowDetailMatch] = useState(false);
  const { team } = useSelector((state) => state.team);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [teamID, setTeamID] = useState("");

  const [isExportDataMatch, setExportDataMatch] = useState(true);
  const [isExportTeamStats, setExportTeamStats] = useState(true);
  const [isExportTeamRoaster, setExportTeamRoaster] = useState(true);
  const [isExportHeroSection, setExportHeroSection] = useState(true);
  const [isExportPrioritySection, setExportPrioritySection] = useState(true);
  const [isExportGameDetail, setExportGameDetail] = useState(true);


  const { toPDF, targetRef } = usePDF({ filename: `EXPORT_${tournament?.name}_${match?.stage}_${team?.name}.pdf` })



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

  const handleChooseTeam = (team) => {
    console.log("Team Selected:", team);
    // setTeamID(team?.team_id);
  };

  const options = {
    // default is `save`
    method: 'save',
    // default is Resolution.MEDIUM = 3, which should be enough, higher values
    // increases the image quality but also the size of the PDF, so be careful
    // using values higher than 10 when having multiple pages generated, it
    // might cause the page to crash or hang.
    resolution: Resolution.LOW,
    page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.SMALL,
      // default is 'A4'
      format: 'letter',
      // default is 'portrait'
      // orientation: 'landscape',
    },
    canvas: {
      // default is 'image/jpeg' for better size performance
      mimeType: 'image/png'
    },
    // Customize any value passed to the jsPDF instance and html2canvas
    // function. You probably will not need this and things can break, 
    // so use with caution.
    overrides: {
      // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
      pdf: {
        compress: true
      },
      // see https://html2canvas.hertzen.com/configuration for more options
      canvas: {
        useCORS: true
      }
    },
  };

  const handleExportData = () => {
    if (match && team && tournament) {
      return generatePDF(targetRef, options)
    }
  }

  return (
    <div className="w-full h-screen flex flex-row overflow-hidden">
      <div className="overflow-scroll flex-1">
        <div ref={targetRef} className="flex flex-col justify-start items-start min-w-[1080px] w-full p-4 px-8 gap-10">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-col space-y-1">
              <div className="text-2xl font-semibold">{tournament?.name}</div>
              <div className="text-4xl font-bold">{match?.stage} - Day {match?.day}</div>
              <div className="text-lg">{moment(match?.datetime).format("MMM Do, YYYY h:mm A")}</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-16">
                <img
                  src={team?.image}
                  alt={team?.name}
                  className="w-16 h-16 object-contain bg-center"
                />
              </div>
              <span className="text-5xl font-bold">{team?.name}</span>
            </div>
          </div>
          <MatchSectionExport handleChooseTeam={handleChooseTeam} match={match} />
          {isExportTeamStats && team && isShowDetailMatch && <TeamTitleExport team={team} />}
          {isExportTeamStats && team && isShowDetailMatch && (
            <TeamStatsSectionExport team={team} match={match} />
          )}
          {isExportTeamRoaster && team && isShowDetailMatch && <MemberSectionExport team={team} match={match} />}
          {isExportHeroSection && team && isShowDetailMatch && <HeroSectionExport team={team} match={match} />}
          {isExportHeroSection && team && isShowDetailMatch && (
            <PrioritySectionExport team={team} match={match} />
          )}
          {isExportGameDetail && team && isShowDetailMatch && <GameSectionExport team={team} match={match} />}
        </div>
      </div>
      <div className="w-[300px] h-screen bg-[#161618] flex flex-col p-6">
        <div className="text-white text-xl font-bold mb-6">Export Settings</div>
        <div className="flex flex-row items-center space-x-4">
          <input
            type="checkbox"
            checked={isExportDataMatch}
            onChange={(e) => setExportDataMatch(e.target.checked)}
            disabled={true}
            className="w-5 h-6 cursor-pointer"
          />
          <div className="text-white text-lg">Data Match (Default)</div>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <input
            type="checkbox"
            checked={isExportTeamStats}
            onChange={(e) => setExportTeamStats(e.target.checked)}
            // disabled={isDisabled}
            className="w-5 h-6 cursor-pointer"
          />
          <div className="text-white text-lg">Team Statistics</div>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <input
            type="checkbox"
            checked={isExportTeamRoaster}
            onChange={(e) => setExportTeamRoaster(e.target.checked)}
            // disabled={isDisabled}
            className="w-5 h-6 cursor-pointer"
          />
          <div className="text-white text-lg">Team Roaster</div>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <input
            type="checkbox"
            checked={isExportHeroSection}
            onChange={(e) => setExportHeroSection(e.target.checked)}
            // disabled={isDisabled}
            className="w-5 h-6 cursor-pointer"
          />
          <div className="text-white text-lg">Hero Section</div>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <input
            type="checkbox"
            checked={isExportGameDetail}
            onChange={(e) => setExportGameDetail(e.target.checked)}
            // disabled={isDisabled}
            className="w-5 h-6 cursor-pointer"
          />
          <div className="text-white text-lg">Game Detail</div>
        </div>
        <div className="mt-5">
          <Button onClick={() => handleExportData()} color="primary">Export</Button>
        </div>
      </div>
    </div>
  );
}
