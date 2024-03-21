import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import jwt from 'jwt-decode'

const AuthContext = createContext();

const AuthProviders = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem("token"));

  const [user, setUser] = useState(null);

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
  };

  const setNewUser = (newUser) =>{
    setUser(newUser);
  }

  const logOut = () => {
    setToken_("");
    localStorage.setItem("token", "")
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const _user = jwt(token);
      setUser(_user)
      localStorage.setItem('token',token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem('token');
      setUser(null)
    }
  }, [token]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      user,
      setToken,
      setNewUser,
      logOut
    }),
    [token, user]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProviders;