import { Button } from "@nextui-org/react";
import { CircleArrowOutUpRight } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../api/axiosInstance";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment/moment";

export default function ExcelExport() {
  const { tournament } = useSelector((state) => state.tournament);
  const { team } = useSelector((state) => state.team);
  const { match } = useSelector((state) => state.match);
  const { games } = useSelector((state) => state.game);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    if (!match?.match_id || !team?.team_id || !tournament?.tournament_id) {
      console.warn("Missing required IDs for data fetching");
      return null; // Return null if IDs are missing
    }

    try {
      const [
        teamStatsRes,
        matchCoachesRes,
        matchPlayersRes,
        heroBansRes,
        heroPicksRes,
        flexPicksRes,
        priorityBansRes,
        priorityPicksRes,
      ] = await Promise.all([
        axiosInstance.get(
          `/api/tournaments/${tournament.tournament_id}/teams/${team.team_id}/team-statistics`
        ),
        axiosInstance.get(
          `/api/matches/${match.match_id}/teams/${team.team_id}/coaches`
        ),
        axiosInstance.get(
          `/api/matches/${match.match_id}/teams/${team.team_id}/players`
        ),
        axiosInstance.get(
          `/api/matches/${match.match_id}/teams/${team.team_id}/hero-bans`
        ),
        axiosInstance.get(
          `/api/matches/${match.match_id}/teams/${team.team_id}/hero-picks`
        ),
        axiosInstance.get(
          `/api/matches/${match.match_id}/teams/${team.team_id}/flex-picks`
        ),
        axiosInstance.get(
          `/api/matches/${match.match_id}/teams/${team.team_id}/priority-bans`
        ),
        axiosInstance.get(
          `/api/matches/${match.match_id}/teams/${team.team_id}/priority-picks`
        ),
      ]);

      // Iterasi untuk setiap game
      const gameDetails = await Promise.all(
        games.map(async (game) => {
          const gameId = game.game_id;
          const [
            gameResultsRes,
            trioMidsRes,
            goldlanersRes,
            explanersRes,
            turtlesRes,
            lordsRes,
          ] = await Promise.all([
            axiosInstance.get(
              `/api/games/${gameId}/teams/${team.team_id}/game-results`
            ),
            axiosInstance.get(
              `/api/games/${gameId}/teams/${team.team_id}/trio-mids`
            ),
            axiosInstance.get(
              `/api/games/${gameId}/teams/${team.team_id}/goldlaners`
            ),
            axiosInstance.get(
              `/api/games/${gameId}/teams/${team.team_id}/explaners`
            ),
            axiosInstance.get(
              `/api/matches/${match.match_id}/games/${gameId}/turtle-results`
            ),
            axiosInstance.get(
              `/api/matches/${match.match_id}/games/${gameId}/lord-results`
            ),
          ]);

          return {
            gameId,
            gameResults: gameResultsRes.data,
            trioMids: trioMidsRes.data,
            goldlaners: goldlanersRes.data,
            explaners: explanersRes.data,
            turtles: turtlesRes.data,
            lords: lordsRes.data,
          };
        })
      );

      return {
        teamStats: teamStatsRes.data,
        matchCoaches: matchCoachesRes.data,
        matchPlayers: matchPlayersRes.data,
        heroBans: heroBansRes.data,
        heroPicks: heroPicksRes.data,
        flexPicks: flexPicksRes.data,
        priorityBans: priorityBansRes.data,
        priorityPicks: priorityPicksRes.data,
        gameDetails,
        games,
        tournament,
        team,
        match,
      };
    } catch (error) {
      console.error("Error fetching data for export:", error);
      return null; // Return null on error
    }
  };

  const setCellBorder = () => ({
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  });

  // Fungsi membuat satu sel dengan border dan nilai
  const createOneCell = (worksheet, value, row, col, isTitle = false) => {
    const cell = worksheet.getCell(row, col);
    cell.border = setCellBorder();
    cell.value = value;
    cell.alignment = { horizontal: "center", vertical: "middle" };

    // Set gaya font jika ini adalah judul
    if (isTitle) {
      cell.font = {
        bold: true, // Mengatur font menjadi tebal
        size: 12, // Mengubah ukuran font (misalnya 14)
        color: { argb: "000000" }, // Mengatur warna font (optional, misalnya hitam)
      };
    }
  };

  // Fungsi untuk mengambil nilai berdasarkan field yang mungkin nested (contoh: "stats.winRate")
  const getNestedValue = (obj, field) => {
    return field.split(".").reduce((acc, key) => acc && acc[key], obj);
  };

  // Fungsi membuat section dengan header dinamis
  const createDynamicSection = (
    worksheet,
    title,
    headers,
    data,
    startRow,
    startCol
  ) => {
    // Set judul section dengan menggabungkan sel
    worksheet.mergeCells(
      startRow,
      startCol,
      startRow,
      startCol + headers.length - 1
    ); // Merge sel untuk judul
    createOneCell(worksheet, title, startRow, startCol, true);
    startRow++;

    // Set header
    headers.forEach((header, index) => {
      createOneCell(worksheet, header.label, startRow, startCol + index);
    });
    startRow++;

    // Isi data pada section
    data.forEach((rowData, rowIndex) => {
      headers.forEach((header, colIndex) => {
        const value = getNestedValue(rowData, header.field); // Ambil nilai sesuai field
        createOneCell(
          worksheet,
          value !== undefined ? value : "N/A",
          startRow + rowIndex,
          startCol + colIndex
        );
      });
    });

    return startCol + headers.length + 1; // Kembalikan kolom berikutnya (space 1 kolom) untuk section berikutnya
  };

  // Fungsi utama untuk membuat beberapa section
  const generateExcelReport = (
    worksheet,
    sections,
    startRow = 1,
    startCol = 1
  ) => {
    let currentCol = startCol;

    sections.forEach((section) => {
      const { title, headers, data } = section;
      currentCol = createDynamicSection(
        worksheet,
        title,
        headers,
        data,
        startRow,
        currentCol
      );
    });
  };

  const calculateWinRate = (wins, total) =>
    total > 0 ? Math.round((wins / total) * 100) : 0;

  const getPlayerStats = async (playerID) => {
    try {
      const result = await axiosInstance.get(
        `/api/tournaments/${match?.tournament_id}/players/${playerID}/player-statistics`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching team stats:", error);
    }
  };

  const getCoachStats = async (coachID) => {
    try {
      const result = await axiosInstance.get(
        `/api/tournaments/${match?.tournament_id}/coachs/${coachID}/coach-statistics`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching team stats:", error);
    }
  };

  const exportToExcel = async () => {
    setIsLoading(true);

    const exportData = await getData(); // Fetch data for export
    if (!exportData) {
      setIsLoading(false);
      return; // Exit if no data is available
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Match Data");

    let startCol = 2;
    let startRow = 2;

    console.log("Exporting data to Excel...", exportData);

    const titleSection = (worksheet, startRow, startCol) => {
      worksheet.mergeCells(startRow + 1, startCol, startRow + 2, startCol);
      worksheet.mergeCells(
        startRow + 1,
        startCol + 2,
        startRow + 2,
        startCol + 2
      );

      createOneCell(worksheet, match.team_a.name, startRow, startCol, true);
      createOneCell(worksheet, match.team_b.name, startRow, startCol + 2, true);
      createOneCell(worksheet, match.team_a_score, startRow + 1, startCol);
      createOneCell(worksheet, "VS", startRow + 1, startCol + 1);
      createOneCell(worksheet, match.team_b_score, startRow + 1, startCol + 2);
      createOneCell(worksheet, tournament.name, startRow, startCol + 6, true);
      createOneCell(worksheet, match.stage, startRow + 1, startCol + 6);
      createOneCell(
        worksheet,
        moment(match.date).format("MMMM dd, YYYY - HH:mm a"),
        startRow + 2,
        startCol + 6
      );
    };

    titleSection(worksheet, startRow, startCol);

    startRow = startRow + 4;

    let sections = [
      {
        title: "Games",
        headers: [
          { label: "Game", field: "game_number" },
          { label: "First Pick", field: "first_team.name" },
          { label: "Second Pick", field: "second_team.name" },
          { label: "Win", field: "winner_team.name" },
        ],
        data: exportData.games,
      },
    ];
    generateExcelReport(worksheet, sections, startRow, startCol);
    startRow = startRow + exportData.games.length + 3;

    worksheet.getCell(startRow, startCol).value = team.name + " Statistics";
    startRow++;
    startRow++;

    sections = [
      {
        title: "First Pick",
        headers: [
          { label: "Win", field: "win" },
          { label: "Lose", field: "lose" },
          { label: "Total", field: "total" },
          { label: "Win Rate", field: "winRate" },
        ],
        data: [
          {
            win: exportData.teamStats.totalFirstPickAndWin,
            lose: exportData.teamStats.totalFirstPickAndLose,
            total: exportData.teamStats.totalFirstPick,
            winRate:
              (
                (exportData.teamStats.totalFirstPickAndWin /
                  (exportData.teamStats.totalFirstPick || 1)) *
                100
              ).toFixed(2) + "%", // Format win rate menjadi dua desimal
          },
        ],
      },
      {
        title: "Second Pick",
        headers: [
          { label: "Win", field: "win" },
          { label: "Lose", field: "lose" },
          { label: "Total", field: "total" },
          { label: "Win Rate", field: "winRate" },
        ],
        data: [
          {
            win: exportData.teamStats.totalSecondPickAndWin,
            lose: exportData.teamStats.totalSecondPickAndLose,
            total: exportData.teamStats.totalSecondPick,
            winRate:
              (
                (exportData.teamStats.totalSecondPickAndWin /
                  (exportData.teamStats.totalSecondPick || 1)) *
                100
              ).toFixed(2) + "%",
          },
        ],
      },
      {
        title: "Match Summary",
        headers: [
          { label: "Win", field: "win" },
          { label: "Lose", field: "lose" },
          { label: "Total", field: "total" },
          { label: "Win Rate", field: "winRate" },
        ],
        data: [
          {
            win: exportData.teamStats.totalMatchAndWin,
            lose: exportData.teamStats.totalMatchAndLose,
            total: exportData.teamStats.totalMatch,
            winRate:
              (
                (exportData.teamStats.totalMatchAndWin /
                  (exportData.teamStats.totalMatch || 1)) *
                100
              ).toFixed(2) + "%",
          },
        ],
      },
      {
        title: "Game Summary",
        headers: [
          { label: "Win", field: "win" },
          { label: "Lose", field: "lose" },
          { label: "Total", field: "total" },
          { label: "Win Rate", field: "winRate" },
        ],
        data: [
          {
            win: exportData.teamStats.totalGameAndWin,
            lose: exportData.teamStats.totalGameAndLose,
            total: exportData.teamStats.totalGame,
            winRate:
              (
                (exportData.teamStats.totalGameAndWin /
                  (exportData.teamStats.totalGame || 1)) *
                100
              ).toFixed(2) + "%",
          },
        ],
      },
    ];
    generateExcelReport(worksheet, sections, startRow, startCol);
    startRow = startRow + 1 + 3;

    // Membuat sections untuk Players dan Coaches
    sections = [
      {
        title: "Players",
        headers: [
          { label: "Name", field: "name" },
          { label: "Role", field: "role" },
          { label: "Match Rate", field: "matchRate" },
          { label: "Game Rate", field: "gameRate" },
        ],
        data: await Promise.all(
          // Menggunakan Promise.all untuk menunggu semua request selesai
          exportData.matchPlayers.map(async (player) => {
            const playerStats = await getPlayerStats(player.player.player_id); // Mendapatkan statistik pemain

            // Memastikan playerStats tidak null
            const matchRate = playerStats
              ? calculateWinRate(
                  playerStats.total_match_win,
                  playerStats.total_match
                ) // Menghitung Match Rate
              : 0; // Jika playerStats null, set matchRate ke 0

            const gameRate = playerStats
              ? calculateWinRate(
                  playerStats.total_game_win,
                  playerStats.total_game
                ) // Menghitung Game Rate
              : 0; // Jika playerStats null, set gameRate ke 0

            return {
              role: player.role,
              name: player.player.name, // Ambil nama pemain
              matchRate: `${matchRate}%`, // Format ke persentase
              gameRate: `${gameRate}%`, // Format ke persentase
            };
          })
        ),
      },
      {
        title: "Coaches",
        headers: [
          { label: "Name", field: "name" },
          { label: "Role", field: "role" },
          { label: "Match Rate", field: "matchRate" }, // Menambahkan kolom Match Rate
          { label: "Game Rate", field: "gameRate" }, // Menambahkan kolom Game Rate
        ],
        data: await Promise.all(
          // Menggunakan Promise.all untuk menunggu semua request selesai
          exportData.matchCoaches.map(async (coach) => {
            const coachStats = await getCoachStats(coach.coach.coach_id); // Mendapatkan statistik pelatih

            // Memastikan coachStats tidak null
            const matchRate = coachStats
              ? calculateWinRate(
                  coachStats.total_match_win,
                  coachStats.total_match
                ) // Menghitung Match Rate
              : 0; // Jika coachStats null, set matchRate ke 0

            const gameRate = coachStats
              ? calculateWinRate(
                  coachStats.total_game_win,
                  coachStats.total_game
                ) // Menghitung Game Rate
              : 0; // Jika coachStats null, set gameRate ke 0

            return {
              role: coach.role,
              name: coach.coach.name, // Ambil nama pelatih
              matchRate: `${matchRate}%`, // Format ke persentase
              gameRate: `${gameRate}%`, // Format ke persentase
            };
          })
        ),
      },
    ];
    generateExcelReport(worksheet, sections, startRow, startCol); // Mulai dari baris dan kolom yang ditentukan
    startRow =
      startRow +
      (exportData.matchPlayers.length > exportData.matchCoaches.length
        ? exportData.matchPlayers.length
        : exportData.matchCoaches.length) +
      3;

    sections = [
      {
        title: "Hero Bans",
        headers: [
          { label: "Hero", field: "hero.name" },
          ...exportData.games.map((game, index) => ({
            label: `Game ${index + 1}`,
            field: `hero_ban_game[${index}]`,
          })),
          { label: "Total", field: "total" },
          { label: "First Phase", field: "first_phase" },
          { label: "Second Phase", field: "second_phase" },
        ],
        data: exportData.heroBans.map((ban) => {
          const gameResults = ban.hero_ban_game.map((game) => game.is_banned);
          return {
            hero: ban.hero,
            ...Object.assign(
              {},
              ...gameResults.map((result, index) => ({
                [`hero_ban_game[${index}]`]: result,
              }))
            ),
            total: ban.total,
            first_phase: ban.first_phase,
            second_phase: ban.second_phase,
          };
        }),
      },
      {
        title: "Hero Picks",
        headers: [
          { label: "Hero", field: "hero.name" },
          ...exportData.games.map((game, index) => ({
            label: `Game ${index + 1}`,
            field: `hero_pick_game[${index}]`,
          })),
          { label: "Total", field: "total" },
          { label: "First Phase", field: "first_phase" },
          { label: "Second Phase", field: "second_phase" },
        ],
        data: exportData.heroPicks.map((pick) => {
          const gameResults = pick.hero_pick_game.map((game) => game.is_picked);
          return {
            hero: pick.hero,
            ...Object.assign(
              {},
              ...gameResults.map((result, index) => ({
                [`hero_pick_game[${index}]`]: result,
              }))
            ),
            total: pick.total,
            first_phase: pick.first_phase,
            second_phase: pick.second_phase,
          };
        }),
      },
    ];

    // Generate Excel report
    generateExcelReport(worksheet, sections, startRow, startCol);

    // Update startRow for the next section
    startRow =
      startRow +
      (exportData.heroBans.length > exportData.heroPicks.length
        ? exportData.heroBans.length
        : exportData.heroPicks.length) +
      3;

    sections = [
      {
        title: "Flex Picks",
        headers: [
          { label: "Hero", field: "hero.name" },
          { label: "Role", field: "role" },
          { label: "Total", field: "total" },
          { label: "Pick Rate (%)", field: "pick_rate" },
        ],
        data: exportData.flexPicks.map((pick) => ({
          hero: pick.hero,
          role: pick.role,
          total: pick.total,
          pick_rate: pick.pick_rate,
        })),
      },
      {
        title: "Priority Picks",
        headers: [
          { label: "Hero", field: "hero.name" },
          { label: "Role", field: "role" },
          { label: "Total", field: "total" },
          { label: "Pick Rate (%)", field: "pick_rate" },
        ],
        data: exportData.priorityPicks.map((pick) => ({
          hero: pick.hero,
          role: pick.role,
          total: pick.total,
          pick_rate: pick.pick_rate,
        })),
      },
      {
        title: "Priority Bans",
        headers: [
          { label: "Hero", field: "hero.name" },
          { label: "Role", field: "role" },
          { label: "Total", field: "total" },
          { label: "Ban Rate (%)", field: "ban_rate" },
        ],
        data: exportData.priorityBans.map((ban) => ({
          hero: ban.hero,
          role: ban.role,
          total: ban.total,
          ban_rate: ban.ban_rate,
        })),
      },
    ];
    generateExcelReport(worksheet, sections, startRow, startCol);
    startRow =
      startRow +
      (exportData.flexPicks.length > exportData.priorityPicks.length
        ? exportData.flexPicks.length > exportData.priorityBans
          ? exportData.flexPicks.length
          : exportData.priorityBans
        : exportData.priorityPicks.length) +
      3;

    console.log("startRow", startRow);
    console.log("startCol", startCol);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Games.xlsx");

    setIsLoading(false);
  };

  return (
    <Button
      color="success"
      onClick={exportToExcel}
      isLoading={isLoading}
      disabled={isLoading}
      isIconOnly
    >
      <CircleArrowOutUpRight color="white" />
    </Button>
  );
}
