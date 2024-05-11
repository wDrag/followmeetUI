import { useContext } from "react";
import { UpdateInfoContext } from "../../context/updateInfoContext";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ax from "../../../axios";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../context/alertContext";
import { AuthContext } from "../../context/authContext";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

const PopoutUpdateInfo = ({}) => {
  const navigate = useNavigate();
  const { showAlert, hideAlert } = useContext(AlertContext);

  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let messageFailed = "";
    const username = document.getElementById("username").value;
    const fullName = document.getElementById("fullName").value;
    const Biography = document.getElementById("Biography").value;
    const email = document.getElementById("email").value;
    const data = {
      userId: currentUser.id,
      username: username,
      fullName: fullName,
      bio: Biography,
      email: email,
    };
    if (!username) delete data.username;
    if (!fullName) delete data.fullName;
    if (!Biography) delete data.bio;
    if (!email) delete data.email;
    try {
      await ax.post(`${API_ENDPOINT}/api/user/updateInfo`, data);
    } catch (err) {
      messageFailed = err.response.data;
    }
    hidePopout();

    try {
      const res = await ax.get(
        `${API_ENDPOINT}/api/user/getUserInfos?userId=${currentUser.id}`
      );
      setCurrentUser(res.data);
    } catch (err) {
      currentUser.username = username || currentUser.username;
      currentUser.fullName = fullName || currentUser.fullName;
      currentUser.bio = Biography || currentUser.bio;
      currentUser.email = email || currentUser.email;
    }

    console.log(messageFailed);

    if (messageFailed === "") {
      const info = {
        name: "Positive",
        message: "Update successfully!",
        showButton: false,
      };
      showAlert(info);
      setTimeout(() => {
        window.location.reload();
        hideAlert();
      }, 750);
      if (username) {
        navigate(`/profile/${username}`);
      }
    } else {
      const info = {
        name: "Negative",
        message: messageFailed,
        showButton: false,
      };
      showAlert(info);
      setTimeout(() => {
        hideAlert();
      }, 1500);
    }
  };

  const { hidePopout } = useContext(UpdateInfoContext);
  return (
    <div className="popoutUpdateInfo">
      <div className="background" onClick={hidePopout} />
      <div className="alert">
        <h1>Update Profile</h1>
        <div className="container">
          <div className="cta-form">
            <h3></h3>
          </div>
          <form action="" className="form">
            <input
              type="text"
              placeholder="Username"
              className="form__input"
              id="username"
            />
            <label htmlFor="username" className="form__label">
              Username
            </label>

            <input
              type="text"
              placeholder="Name"
              className="form__input"
              id="fullName"
            />
            <label htmlFor="fullName" className="form__label">
              Name
            </label>

            <input
              type="text"
              placeholder="Biography"
              className="form__input"
              id="Biography"
            />
            <label htmlFor="Biography" className="form__label">
              Biography
            </label>

            <input
              type="email"
              placeholder="Email"
              className="form__input"
              id="email"
            />
            <label htmlFor="email" className="form__label">
              Email
            </label>

            <div className="buttons-container">
              <button className="button-arounder" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopoutUpdateInfo;
