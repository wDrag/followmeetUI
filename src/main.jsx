import axios from 'axios';
import React from "react";
import ReactDOM from "react-dom/client";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AuthContextProvider } from "./context/authContext";
import App from "./app";
import { AlertContextProvider } from "./context/alertContext";
import { Update } from "@mui/icons-material";
import { UpdateInfoContextProvider } from "./context/updateInfoContext";

const instance = axios.create({
    baseURL: import.meta.env.BASE_URL
});

instance.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <AlertContextProvider>
        <AuthContextProvider>
          <UpdateInfoContextProvider>
            <App />
          </UpdateInfoContextProvider>
        </AuthContextProvider>
      </AlertContextProvider>
    </DarkModeContextProvider>
  </React.StrictMode>
);
