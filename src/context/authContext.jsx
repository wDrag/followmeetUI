import ax from "../../axios";
import { createContext, useEffect, useState } from "react";
import PopoutUpdateInfo from "../components/popoutUpdateInfo/popoutUpdateInfo";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || false
  );

  const login = async (inputs) => {
    // console.log(API_ENDPOINT);
    try {
      const tmpInputs = { ...inputs };
      const res = await ax.post(`${API_ENDPOINT}/api/auth/login`, tmpInputs);
      //add lastLogin later
      // console.log(res);
      if (res.status === 200) {
        const user = await ax.get(
          `${API_ENDPOINT}/api/user/getUserInfos?userId=${res.data}`
        );
        setCurrentUser(user.data);
        // setCurrentUser(tmpInputs);
        // setCurrentUser(pseudoUser);
      } else {
        // alert("Wrong username or password");
        // console.log(res.data);
        throw new Error("Wrong username or password");
      }
    } catch (err) {
      // console.log(err);
      throw new Error("Wrong username or password");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    ax.post(`${API_ENDPOINT}/api/auth/logout`, { userId: currentUser.id });
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <>
      <AuthContext.Provider
        value={{ currentUser, setCurrentUser, login, logout }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
