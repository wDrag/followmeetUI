import { useContext } from "react";
import { AlertContext } from "../../context/alertContext";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// info.name = Positive for success, Negative for error, else for normal text
//info.message = message to display
//info.showButton = true/false
//info.confirmText = text for confirm button
//info.declineText = text for decline button
//info.handleConfirm = function for confirm button
//info.handleDecline = function for decline button
const PopoutAlert = ({ info }) => {
  const { hideAlert } = useContext(AlertContext);
  return (
    <div className="popoutAlert">
      {info.noCancel ? (
        <div className="background" />
      ) : (
        <div className="background" onClick={hideAlert} />
      )}
      <div className="alert">
        {info.name === "Positive" ? (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="positiveIcon title"
          />
        ) : info.name === "Negative" ? (
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="negativeIcon title"
          />
        ) : (
          <h1 className="titletext title">{info.name}</h1>
        )}
        <p className="message">{info.message}</p>
        {info.showButton && (
          <div className="buttons">
            <button className="confirm" onClick={info.handleConfirm}>
              {info.confirmText}
            </button>
            <button className="cancel" onClick={info.handleDecline}>
              {info.declineText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopoutAlert;
