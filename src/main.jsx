import React from "react";
import ReactDOM from "react-dom/client";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AuthContextProvider } from "./context/authContext";
import App from "./app";
import { AlertContextProvider } from "./context/alertContext";
import { Update } from "@mui/icons-material";
import { UpdateInfoContextProvider } from "./context/updateInfoContext";

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
