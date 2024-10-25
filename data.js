const data = {
  teamStats: {
    teamID: 1,
    totalMatch: 3,
    totalMatchAndWin: 3,
    totalMatchAndLose: 0,
    totalGame: 2,
    totalGameAndWin: 2,
    totalGameAndLose: 0,
    totalFirstPick: 2,
    totalFirstPickAndWin: 2,
    totalFirstPickAndLose: 0,
    totalSecondPick: 0,
    totalSecondPickAndWin: 0,
    totalSecondPickAndLose: 0,
  },
  matchCoaches: [
    {
      coach_match_id: 1,
      match_team_detail_id: 13,
      role: "Head",
      coach: {
        coach_id: 1,
        team_id: 1,
        name: "Nurdiansyah",
        image:
          "http://localhost:8080/public/images/coach_1cbcab11fe3de0d2_1729551706.jpeg",
      },
    },
  ],
  matchPlayers: [
    {
      player_match_id: 2,
      match_team_detail_id: 13,
      role: "goldlaner",
      player: {
        player_id: 1,
        team_id: 1,
        name: "Nurdiansyah",
        image:
          "http://localhost:8080/public/images/player_5231f02e23ba0860_1729495015.jpeg",
      },
    },
    {
      player_match_id: 3,
      match_team_detail_id: 13,
      role: "roamer",
      player: {
        player_id: 2,
        team_id: 1,
        name: "Iyan",
        image:
          "http://localhost:8080/public/images/player_b6f755e089352fcd_1729568586.jpeg",
      },
    },
  ],
  heroBans: [
    {
      hero_ban_id: 4,
      match_team_detail_id: 13,
      hero_id: 8,
      hero: {
        hero_id: 8,
        name: "Zhask",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256366/Zhask_tapj74.png",
      },
      first_phase: 2,
      second_phase: 0,
      total: 2,
      hero_ban_game: [
        {
          hero_ban_game_id: 7,
          hero_ban_id: 4,
          game_id: 8,
          game_number: 1,
          is_banned: true,
        },
        {
          hero_ban_game_id: 8,
          hero_ban_id: 4,
          game_id: 9,
          game_number: 2,
          is_banned: true,
        },
      ],
    },
    {
      hero_ban_id: 5,
      match_team_detail_id: 13,
      hero_id: 50,
      hero: {
        hero_id: 50,
        name: "Yin",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256337/Yin_ukvw9d.png",
      },
      first_phase: 2,
      second_phase: 0,
      total: 2,
      hero_ban_game: [
        {
          hero_ban_game_id: 9,
          hero_ban_id: 5,
          game_id: 8,
          game_number: 1,
          is_banned: true,
        },
        {
          hero_ban_game_id: 10,
          hero_ban_id: 5,
          game_id: 9,
          game_number: 2,
          is_banned: true,
        },
      ],
    },
  ],
  heroPicks: [
    {
      hero_pick_id: 7,
      match_team_detail_id: 13,
      hero_id: 60,
      hero: {
        hero_id: 60,
        name: "Aamon",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256330/Aamon_swxtll.png",
      },
      first_phase: 2,
      second_phase: 0,
      total: 2,
      hero_pick_game: [
        {
          hero_pick_game_id: 13,
          hero_pick_id: 7,
          game_id: 8,
          game_number: 1,
          is_picked: true,
        },
        {
          hero_pick_game_id: 14,
          hero_pick_id: 7,
          game_id: 9,
          game_number: 2,
          is_picked: true,
        },
      ],
    },
    {
      hero_pick_id: 8,
      match_team_detail_id: 13,
      hero_id: 16,
      hero: {
        hero_id: 16,
        name: "Aldous",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256361/Aldous_skkvju.png",
      },
      first_phase: 2,
      second_phase: 0,
      total: 2,
      hero_pick_game: [
        {
          hero_pick_game_id: 15,
          hero_pick_id: 8,
          game_id: 8,
          game_number: 1,
          is_picked: true,
        },
        {
          hero_pick_game_id: 16,
          hero_pick_id: 8,
          game_id: 9,
          game_number: 2,
          is_picked: true,
        },
      ],
    },
    {
      hero_pick_id: 9,
      match_team_detail_id: 13,
      hero_id: 63,
      hero: {
        hero_id: 63,
        name: "Beatrix",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256328/Beatrix_c9usct.png",
      },
      first_phase: 1,
      second_phase: 0,
      total: 1,
      hero_pick_game: [
        {
          hero_pick_game_id: 17,
          hero_pick_id: 9,
          game_id: 8,
          game_number: 1,
          is_picked: true,
        },
        {
          hero_pick_game_id: 18,
          hero_pick_id: 9,
          game_id: 9,
          game_number: 2,
          is_picked: false,
        },
      ],
    },
    {
      hero_pick_id: 10,
      match_team_detail_id: 13,
      hero_id: 34,
      hero: {
        hero_id: 34,
        name: "Atlas",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256348/Atlas_qks4sk.png",
      },
      first_phase: 1,
      second_phase: 0,
      total: 1,
      hero_pick_game: [
        {
          hero_pick_game_id: 19,
          hero_pick_id: 10,
          game_id: 8,
          game_number: 1,
          is_picked: false,
        },
        {
          hero_pick_game_id: 20,
          hero_pick_id: 10,
          game_id: 9,
          game_number: 2,
          is_picked: true,
        },
      ],
    },
    {
      hero_pick_id: 11,
      match_team_detail_id: 13,
      hero_id: 77,
      hero: {
        hero_id: 77,
        name: "Kagura",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256318/Kagura_nu9wsc.png",
      },
      first_phase: 2,
      second_phase: 0,
      total: 2,
      hero_pick_game: [
        {
          hero_pick_game_id: 21,
          hero_pick_id: 11,
          game_id: 8,
          game_number: 1,
          is_picked: true,
        },
        {
          hero_pick_game_id: 22,
          hero_pick_id: 11,
          game_id: 9,
          game_number: 2,
          is_picked: true,
        },
      ],
    },
  ],
  flexPicks: [
    {
      flex_pick_id: 3,
      match_team_detail_id: 13,
      hero: {
        hero_id: 60,
        name: "Aamon",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256330/Aamon_swxtll.png",
      },
      total: 2,
      role: "jungler",
      pick_rate: 100,
    },
    {
      flex_pick_id: 4,
      match_team_detail_id: 13,
      hero: {
        hero_id: 77,
        name: "Kagura",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256318/Kagura_nu9wsc.png",
      },
      total: 2,
      role: "exp",
      pick_rate: 100,
    },
  ],
  priorityBans: [
    {
      priority_ban_id: 2,
      match_team_detail_id: 13,
      hero: {
        hero_id: 8,
        name: "Zhask",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256366/Zhask_tapj74.png",
      },
      total: 2,
      role: "roam",
      ban_rate: 100,
    },
    {
      priority_ban_id: 3,
      match_team_detail_id: 13,
      hero: {
        hero_id: 50,
        name: "Yin",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256337/Yin_ukvw9d.png",
      },
      total: 2,
      role: "exp",
      ban_rate: 100,
    },
  ],
  priorityPicks: [
    {
      priority_pick_id: 3,
      match_team_detail_id: 13,
      hero: {
        hero_id: 60,
        name: "Aamon",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256330/Aamon_swxtll.png",
      },
      total: 2,
      role: "exp",
      pick_rate: 100,
    },
    {
      priority_pick_id: 4,
      match_team_detail_id: 13,
      hero: {
        hero_id: 77,
        name: "Kagura",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256318/Kagura_nu9wsc.png",
      },
      total: 2,
      role: "gold",
      pick_rate: 100,
    },
    {
      priority_pick_id: 5,
      match_team_detail_id: 13,
      hero: {
        hero_id: 16,
        name: "Aldous",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256361/Aldous_skkvju.png",
      },
      total: 2,
      role: "roam",
      pick_rate: 100,
    },
  ],
  gameDetails: [
    {
      gameId: 8,
      gameResults: {
        win: 1,
        draw: 1,
        lose: 1,
        result: "Ok Early",
      },
      trioMids: [
        {
          trio_mid_hero_id: 7,
          trio_mid_id: 7,
          game_id: 8,
          role: "roamer",
          early_result: "win",
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          hero: {
            hero_id: 60,
            name: "Aamon",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256330/Aamon_swxtll.png",
          },
        },
        {
          trio_mid_hero_id: 8,
          trio_mid_id: 7,
          game_id: 8,
          role: "jungler",
          early_result: "draw",
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          hero: {
            hero_id: 16,
            name: "Aldous",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256361/Aldous_skkvju.png",
          },
        },
        {
          trio_mid_hero_id: 9,
          trio_mid_id: 7,
          game_id: 8,
          role: "midlaner",
          early_result: "win",
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          hero: {
            hero_id: 63,
            name: "Beatrix",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256328/Beatrix_c9usct.png",
          },
        },
      ],
      goldlaners: [
        {
          goldlaner_id: 7,
          game_id: 8,
          team_id: 1,
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          hero_id: 60,
          hero: {
            hero_id: 60,
            name: "Aamon",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256330/Aamon_swxtll.png",
          },
          early_result: "lose",
        },
      ],
      explaners: [
        {
          explaner_id: 7,
          game_id: 8,
          team_id: 1,
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          hero_id: 16,
          hero: {
            hero_id: 16,
            name: "Aldous",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256361/Aldous_skkvju.png",
          },
          early_result: "draw",
        },
      ],
      turtles: [
        {
          turtle_result_id: 3,
          game_id: 8,
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          phase: "turtle_phase",
          setup: "early",
          initiate: "yes",
          result: "yes",
        },
        {
          turtle_result_id: 4,
          game_id: 8,
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          phase: "turtle_phase",
          setup: "late",
          initiate: "yes",
          result: "yes",
        },
      ],
      lords: [
        {
          lord_result_id: 2,
          game_id: 8,
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          phase: "lord_phase",
          setup: "late",
          initiate: "yes",
          result: "yes",
        },
      ],
    },
    {
      gameId: 9,
      gameResults: {
        win: 2,
        draw: 1,
        lose: 0,
        result: "Good Early",
      },
      trioMids: [
        {
          trio_mid_hero_id: 10,
          trio_mid_id: 8,
          game_id: 9,
          role: "jungler",
          early_result: "win",
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          hero: {
            hero_id: 16,
            name: "Aldous",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256361/Aldous_skkvju.png",
          },
        },
        {
          trio_mid_hero_id: 11,
          trio_mid_id: 8,
          game_id: 9,
          role: "midlaner",
          early_result: "win",
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          hero: {
            hero_id: 60,
            name: "Aamon",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256330/Aamon_swxtll.png",
          },
        },
        {
          trio_mid_hero_id: 12,
          trio_mid_id: 8,
          game_id: 9,
          role: "roamer",
          early_result: "draw",
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          hero: {
            hero_id: 77,
            name: "Kagura",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256318/Kagura_nu9wsc.png",
          },
        },
      ],
      goldlaners: [
        {
          goldlaner_id: 8,
          game_id: 9,
          team_id: 1,
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          hero_id: 34,
          hero: {
            hero_id: 34,
            name: "Atlas",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256348/Atlas_qks4sk.png",
          },
          early_result: "draw",
        },
      ],
      explaners: [
        {
          explaner_id: 8,
          game_id: 9,
          team_id: 1,
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          hero_id: 60,
          hero: {
            hero_id: 60,
            name: "Aamon",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256330/Aamon_swxtll.png",
          },
          early_result: "win",
        },
      ],
      turtles: [
        {
          turtle_result_id: 5,
          game_id: 9,
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          phase: "turtle_phase",
          setup: "late",
          initiate: "yes",
          result: "yes",
        },
        {
          turtle_result_id: 6,
          game_id: 9,
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          phase: "turtle_phase",
          setup: "early",
          initiate: "yes",
          result: "yes",
        },
      ],
      lords: [
        {
          lord_result_id: 3,
          game_id: 9,
          team: {
            team_id: 1,
            name: "RRQ",
            image:
              "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
          },
          phase: "lord_phase",
          setup: "early",
          initiate: "yes",
          result: "yes",
        },
      ],
    },
  ],
  games: [
    {
      game_id: 8,
      match_id: 7,
      first_pick_team_id: 1,
      first_team: {
        team_id: 1,
        name: "RRQ",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
      },
      second_pick_team_id: 3,
      second_team: {
        team_id: 3,
        name: "ALTER EGO",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/ae-256_fdchvl.png",
      },
      winner_team_id: 1,
      winner_team: {
        team_id: 1,
        name: "RRQ",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
      },
      game_number: 1,
      video_link: "https://www.youtube.com/watch?v=2NpBiYrisxw",
      full_draft_image:
        "http://localhost:8080/public/images/draft_558d649b38417de5_1729551898.jpeg",
    },
    {
      game_id: 9,
      match_id: 7,
      first_pick_team_id: 1,
      first_team: {
        team_id: 1,
        name: "RRQ",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
      },
      second_pick_team_id: 3,
      second_team: {
        team_id: 3,
        name: "ALTER EGO",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/ae-256_fdchvl.png",
      },
      winner_team_id: 1,
      winner_team: {
        team_id: 1,
        name: "RRQ",
        image:
          "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
      },
      game_number: 2,
      video_link: "https://www.youtube.com/watch?v=2NpBiYrisxw",
      full_draft_image:
        "http://localhost:8080/public/images/draft_45e09bf46047a235_1729552001.png",
    },
  ],
  tournament: {
    tournament_id: 1,
    name: "Tournament 1",
  },
  team: {
    team_id: 1,
    name: "RRQ",
    image:
      "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
  },
  match: {
    match_id: 7,
    tournament_id: 1,
    stage: "Eek 2",
    day: 2,
    date: 1729520280,
    team_a_id: 1,
    team_a: {
      team_id: 1,
      name: "RRQ",
      image:
        "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/600px-Rex_Regum_Qeon_allmode_dcgt4m.png",
    },
    team_b_id: 3,
    team_b: {
      team_id: 3,
      name: "ALTER EGO",
      image:
        "https://res.cloudinary.com/dnbreym94/image/upload/v1729256279/ae-256_fdchvl.png",
    },
    team_a_score: 2,
    team_b_score: 0,
  },
};
