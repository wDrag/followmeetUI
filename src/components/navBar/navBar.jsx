import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "../../img/Logo.png";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import "./navBar.scss";
import { AuthContext } from "../../context/authContext";
import { AlertContext } from "../../context/alertContext";

const NavBar = () => {
  const { toggle, darkMode, getTheme } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const { showAlert, hideAlert } = useContext(AlertContext);

  const handleLogout = () => {
    const info = {
      name: "Logout",
      message: "Are you sure you want to logout?",
      showButton: true,
      confirmText: "Yes",
      declineText: "No",
      handleConfirm: () => {
        setTimeout(() => {
          logout();
          navigate("/login");
          hideAlert();
        }, 500);
      },
      handleDecline: () => {
        hideAlert();
      },
    };
    showAlert(info);
  };

  const navigate = useNavigate();

  return (
    <div className="NavBar">
      <div className="navLeft">
        <img
          src={Logo}
          className="logo"
          alt="Logo"
          onClick={() => {
            navigate("/");
            window.scrollTo(0, 0);
            window.location.reload();
          }}
        />
        <HomeOutlinedIcon
          onClick={() => {
            navigate("/");
            window.scrollTo(0, 0);
            window.location.reload();
          }}
          className="NavButton"
        />
        {!darkMode ? (
          <DarkModeOutlinedIcon className="NavButton" onClick={toggle} />
        ) : (
          <WbSunnyOutlinedIcon className="NavButton" onClick={toggle} />
        )}
        {/* <GridViewOutlinedIcon className="NavButton" /> */}
        <div className="search">
          <SearchOutlinedIcon className="NavButton" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="navRight">
        <PersonOutlinedIcon
          className="NavButton"
          onClick={() => {
            navigate(`/profile/${currentUser.username}`);
            window.scrollTo(0, 0);
          }}
        />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user NavButton">
          <img
            src={currentUser.profilePicture}
            alt="Avatar"
            onClick={() => {
              navigate(`/profile/${currentUser.username}`);
              window.scrollTo(0, 0);
              window.location.reload();
            }}
          />
          <span
            onClick={() => {
              navigate(`/profile/${currentUser.username}`);
              window.scrollTo(0, 0);
              window.location.reload();
            }}
          >
            {currentUser.fullName}
          </span>
        </div>
        <LogoutIcon className="NavButton" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default NavBar;
