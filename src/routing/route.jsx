import { Outlet } from "react-router-dom";
import ProtectedPage from "../components/auth/ProtectedPage";
import Layout from "../components/layout/Layout";
import Login from "../pages/auth/Login";
import Competition from "../pages/competition/Tournament";
import MatchDetail from "../archive/MatchDetail";
import CompetitionDetail from "../archive/TeamDetail";
import Heroes from "../pages/heroes/Heroes";
import Home from "../pages/home/Home";
import Teams from "../pages/teams/Teams";
import TeamDetail from "../pages/teams/TeamDetail";
import Match from "../pages/competition/Match";
import Sheet from "../pages/experiment/Sheet";
import ExportMatch from "../pages/competition/ExportMatch";

const routes = [
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedPage>
        <Layout>
          <Outlet />
        </Layout>
      </ProtectedPage>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "tournament/:tournamentID",
        element: <Competition />,
      },
      // {
      //   path: "tournament/:tournamentID/team/:teamID/match",
      //   element: <CompetitionDetail />,
      // },
      {
        path: "tournament/:tournamentID/match/:matchID",
        element: <Match />,
      },
      // {
      //   path: "tournament/:tournamentID/match/:matchID/export",
      //   element: <ExportMatch />,
      // },
      // {
      //   path: "tournament/:tournamentID/match/:matchID/team/:teamID",
      //   element: <MatchDetail />,
      // },
      { path: "team", element: <Teams /> },
      { path: "team/:teamID", element: <TeamDetail /> },
      { path: "hero", element: <Heroes /> },
      { path: "sheets", element: <Sheet /> },
    ],
  },
  {
    path: "export/tournament/:tournamentID/match/:matchID",
    element: <ExportMatch />,
  },
];
export default routes;
