import { createContext, useState } from "react";
import PopoutAlert from "../components/popoutAlert/popoutAlert";
import "../components/popoutAlert/popoutAlert.scss";

export const AlertContext = createContext();

export const AlertContextProvider = ({ children }) => {
  const [showPop, setShowPop] = useState(false);
  const [popInfo, setPopInfo] = useState({
    name: "Title",
    message: "Messsage",
    showButton: true,
    confirmText: "Confirm",
    declineText: "Cancel",
    noCancel: false,
    handleConfirm: () => {
      console.log("confirm");
    },
    handleDecline: () => {
      console.log("decline");
      hideAlert();
    },
  });

  const showAlert = (info) => {
    setPopInfo(info);
    setShowPop(true);
  };

  const hideAlert = () => {
    setShowPop(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {showPop && <PopoutAlert info={popInfo} />}
    </AlertContext.Provider>
  );
};
