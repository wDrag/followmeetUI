import { light } from "@mui/material/styles/createPalette";
import LeftBar from "./components/leftBar/leftBar";
import NavBar from "./components/navBar/navBar";
import RightBar from "./components/rightBar/rightBar";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Profile from "./pages/profile/profile";
import Register from "./pages/register/register";
import "./style.scss";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext.jsx";
import { AuthContext } from "./context/authContext.jsx";
import Page404 from "./pages/page404/page404.jsx";
import Cookies from "./pages/cookies/cookies.jsx";
import Search from "./pages/search/search.jsx";
import { UpdateInfoContext } from "./context/updateInfoContext.jsx";
import { BrowserRouter as Router } from 'react-router-dom';
import TrashCan from "./pages/trashcan/trashcan.jsx";

const App = () => {
  const { currentUser } = useContext(AuthContext);

  const { darkMode } = useContext(DarkModeContext);

  const Layout = () => {
    document.body.className = `theme-${darkMode ? "dark" : "light"}`;

    document.body.style.backgroundColor = darkMode ? "#333" : "#f6f3f3";

    return (
      <div>
        <NavBar />
        <div
          style={{
            display: "flex",
            paddingTop: "4.748rem",
          }}
        >
          <LeftBar />
          <Outlet />
          <RightBar />
        </div>
      </div>
    );
  };

  const Layout404 = () => {
    document.body.className = `theme-${darkMode ? "dark" : "light"}`;

    document.body.style.backgroundColor = darkMode ? "#333" : "#f6f3f3";

    return (
      <div>
        <NavBar />
        <Outlet />
      </div>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:username",
          element: <Profile />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/search",
          element: <Search />
        },
        {
          path: "/trashcan",
          element: <TrashCan />
        }
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "*",
      element: <Layout404 />,
      children: [
        {
          path: "*",
          element: <Page404 />,
        },
      ],
    },
    {
      path: "/cookies",
      element: <Cookies />,
      children: [
        {
          path: "/cookies",
          element: <Cookies />,
        },
      ],
    },

  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
