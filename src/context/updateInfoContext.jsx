import { createContext, useState } from "react";
import PopoutUpdateInfo from "../components/popoutUpdateInfo/popoutUpdateInfo";
import "../components/popoutUpdateInfo/popoutUpdateInfo.scss";
import { BrowserRouter as Router } from 'react-router-dom';

export const UpdateInfoContext = createContext();

export const UpdateInfoContextProvider = ({ children }) => {
  const [showPop, setShowPop] = useState(false);

  const showPopout = () => {
    setShowPop(true);
  };

  const hidePopout = () => {
    setShowPop(false);
  };

  return (
    <UpdateInfoContext.Provider value={{ showPopout, hidePopout }}>
      {children}
      {showPop && (
        <Router>
          <PopoutUpdateInfo />
        </Router>
      )}
    </UpdateInfoContext.Provider>
  );
};
