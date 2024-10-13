import { Outlet } from "react-router-dom";
import ProtectedPage from "../components/auth/ProtectedPage";
import Layout from "../components/layout/Layout";
import Login from "../pages/auth/Login";
import Competition from "../pages/competition/Competition";
import MatchDetail from "../pages/competition/MatchDetail";
import CompetitionDetail from "../pages/competition/TeamDetail";
import Heroes from "../pages/heroes/Heroes";
import Home from "../pages/home/Home";
import Teams from "../pages/teams/Teams";
import TeamDetail from "../pages/teams/TeamDetail";

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
        path: "tournaments/:tournamentID",
        element: <Competition />,
      },
      {
        path: "tournaments/:tournamentID/teams/:teamID/matches",
        element: <CompetitionDetail />,
      },
      {
        path: "competition/team/match",
        element: <MatchDetail />,
      },
      { path: "teams", element: <Teams /> },
      { path: "teams/:teamID", element: <TeamDetail /> },
      { path: "heroes", element: <Heroes /> },
    ],
  },
];
export default routes;
