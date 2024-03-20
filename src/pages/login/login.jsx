import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./login.scss";
import { AlertContext } from "../../context/alertContext";
import { DarkModeContext } from "../../context/darkModeContext";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const { showAlert, hideAlert } = useContext(AlertContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      const info = {
        name: "Positive",
        message: "Login successful",
        showButton: false,
      };
      showAlert(info);
      //wait for 1 second
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 750);
    } catch (err) {
      const info = {
        name: "Negative",
        message: err.message,
        showButton: false,
      };
      showAlert(info);
      setTimeout(() => hideAlert(), 750);
      navigate("/login");
    }
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCapslock = (e) => {
    const CapslockWarning = document.getElementById("CapslockWarning");
    if (e.getModifierState("CapsLock")) {
      CapslockWarning.style.display = "block";
    } else {
      CapslockWarning.style.display = "none";
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Follow Meet</h1>
          <p>Connect with friends and the world around you on Follow Meet.</p>
          <span>Don't have an account?</span>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <div className="password">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                onChange={handleChange}
                onKeyUp={handleCapslock}
              />
              <FontAwesomeIcon
                className="showPassword"
                icon={showPassword ? faEye : faEyeSlash}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div
              id="CapslockWarning"
              className="CapslockWarning"
              style={{ color: "red", display: "none" }}
            >
              WARNING! Caps lock is ON.
            </div>
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
