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
      return null;
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

  const setAllColumnWidths = (worksheet, numColumns, width) => {
    for (let i = 1; i <= numColumns; i++) {
      worksheet.getColumn(i).width = width;
    }
  };

  // Fungsi membuat satu sel dengan border dan nilai
  const createOneCell = (worksheet, value, row, col) => {
    const cell = worksheet.getCell(row, col);

    // Mengatur nilai sel
    cell.value = value;

    // Mengatur border, alignment, dan font
    cell.border = setCellBorder();
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.font = { bold: false, size: 11, color: { argb: "000000" } };
  };

  const createSectionTitle = (
    worksheet,
    value,
    row,
    col,
    size = 11,
    bold = false
  ) => {
    const cell = worksheet.getCell(row, col);
    cell.value = value;
    cell.alignment = { vertical: "middle" };
    cell.font = {
      bold: bold,
      size: size,
      color: { argb: "000000" }, // Warna font hitam
    };
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
    createOneCell(worksheet, title, startRow, startCol);
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
    const worksheet = workbook.addWorksheet(`${match?.stage}`);

    // setAllColumnWidths(worksheet, 10, 12);

    let startCol = 2;
    let startRow = 2;

    console.log("Exporting data to Excel...", exportData);

    const titleSection = (worksheet, startRow, startCol) => {
      worksheet.mergeCells(
        startRow + 1,
        startCol + 6,
        startRow + 2,
        startCol + 6
      );

      createOneCell(worksheet, match.team_a.name, startRow + 1, startCol + 5);
      createOneCell(
        worksheet,
        match.team_b.name,
        startRow + 1,
        startCol + 5 + 2
      );
      createOneCell(
        worksheet,
        match.team_a_score,
        startRow + 1 + 1,
        startCol + 5
      );
      createOneCell(worksheet, "VS", startRow + 1 + 1, startCol + 5 + 1);
      createOneCell(
        worksheet,
        match.team_b_score,
        startRow + 1 + 1,
        startCol + 5 + 2
      );

      createSectionTitle(
        worksheet,
        tournament.name,
        startRow,
        startCol,
        14,
        true
      );
      createSectionTitle(worksheet, match.stage, startRow + 1, startCol, 12);
      createSectionTitle(
        worksheet,
        moment(match.date).format("MMMM dd, YYYY - HH:mm a"),
        startRow + 2,
        startCol
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

    createSectionTitle(
      worksheet,
      team.name + " Statistics",
      startRow,
      startCol,
      14,
      true
    );
    startRow++;
    startRow++;

    createSectionTitle(
      worksheet,
      "Team Statistics",
      startRow,
      startCol,
      12,
      true
    );
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

    createSectionTitle(worksheet, "Member Team", startRow, startCol, 12, true);
    startRow++;
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

    createSectionTitle(worksheet, "Heroes", startRow, startCol, 12, true);
    startRow++;

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

    createSectionTitle(
      worksheet,
      "Hero Priority",
      startRow,
      startCol,
      12,
      true
    );
    startRow++;

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

    createSectionTitle(worksheet, "Game Details", startRow, startCol, 12, true);
    startRow++;
    startRow++;

    exportData.games.map((game, index) => {
      createSectionTitle(
        worksheet,
        `Game ${game.game_number} :`,
        startRow,
        startCol,
        11,
        true
      );
      createSectionTitle(
        worksheet,
        game.winner_team_id === team.team_id ? "Win" : "Lose",
        startRow,
        startCol + 1
      );
      startRow++;

      createSectionTitle(worksheet, "Video Link :", startRow, startCol);
      createSectionTitle(
        worksheet,
        {
          text: `${game.video_link}`,
          hyperlink: game.video_link,
        },
        startRow,
        startCol + 1
      );
      startRow++;

      createSectionTitle(worksheet, "Draft Link :", startRow, startCol);
      createSectionTitle(
        worksheet,
        {
          text: `${game.full_draft_image}`,
          hyperlink: game.full_draft_image,
        },
        startRow,
        startCol + 1
      );
      startRow++;
      startRow++;

      const indexGameDetail = exportData.gameDetails.findIndex(
        (item) => item.gameId === game.game_id
      );

      let gameSections = [
        {
          title: "Trio Mids",
          headers: [
            { label: "Hero", field: "hero.name" },
            { label: "Role", field: "role" },
            { label: "Early Result", field: "early_result" },
          ],
          data: exportData.gameDetails[indexGameDetail].trioMids.map((mid) => ({
            hero: mid.hero,
            role: mid.role,
            early_result: mid.early_result,
          })),
        },
        {
          title: "Goldlaners",
          headers: [
            { label: "Hero", field: "hero.name" },
            { label: "Early Result", field: "early_result" },
          ],
          data: exportData.gameDetails[indexGameDetail].goldlaners.map(
            (goldlaner) => ({
              hero: goldlaner.hero,
              early_result: goldlaner.early_result,
            })
          ),
        },
        {
          title: "Explaners",
          headers: [
            { label: "Hero", field: "hero.name" },
            { label: "Early Result", field: "early_result" },
          ],
          data: exportData.gameDetails[indexGameDetail].explaners.map(
            (explaner) => ({
              hero: explaner.hero,
              early_result: explaner.early_result,
            })
          ),
        },
      ];

      // Generate Excel report
      generateExcelReport(worksheet, gameSections, startRow, startCol);
      startRow =
        startRow + exportData.gameDetails[indexGameDetail].trioMids.length + 3;

      gameSections = [
        {
          title: "Turtle Result",
          headers: [
            { label: "Phase", field: "phase" },
            { label: "Initiate", field: "initiate" },
            { label: "Setup", field: "setup" },
            { label: "Result", field: "result" },
          ],
          data: exportData.gameDetails[indexGameDetail].turtles.map(
            (turtle, index) => ({
              phase: index + 1,
              initiate: turtle.initiate,
              setup: turtle.setup,
              result: turtle.result,
            })
          ),
        },
        {
          title: "Lord Result",
          headers: [
            { label: "Phase", field: "phase" },
            { label: "Initiate", field: "initiate" },
            { label: "Setup", field: "setup" },
            { label: "Result", field: "result" },
          ],
          data: exportData.gameDetails[indexGameDetail].lords.map(
            (lord, index) => ({
              phase: index + 1,
              initiate: lord.initiate,
              setup: lord.setup,
              result: lord.result,
            })
          ),
        },
      ];

      // Generate Excel report
      generateExcelReport(worksheet, gameSections, startRow, startCol);

      startRow =
        startRow +
        (exportData.gameDetails[indexGameDetail].lords.length >
        exportData.gameDetails[indexGameDetail].turtles.length
          ? exportData.gameDetails[indexGameDetail].lords.length
          : exportData.gameDetails[indexGameDetail].turtles.length) +
        3;

      gameSections = [
        {
          title: "Game Results",
          headers: [
            { label: "Win", field: "win" },
            { label: "Draw", field: "draw" },
            { label: "Lose", field: "lose" },
            { label: "Result", field: "result" },
          ],
          data: [
            {
              win: exportData.gameDetails[indexGameDetail].gameResults.win,
              draw: exportData.gameDetails[indexGameDetail].gameResults.draw,
              lose: exportData.gameDetails[indexGameDetail].gameResults.lose,
              result:
                exportData.gameDetails[indexGameDetail].gameResults.result,
            },
          ],
        },
      ];

      // Generate Excel report
      generateExcelReport(worksheet, gameSections, startRow, startCol);

      startRow++;
      startRow++;
      startRow++;
      startRow++;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${tournament.name} - ${team.name}.xlsx`);

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
