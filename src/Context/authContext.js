"use client";

import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const [userDetails, setUserDetails] = useState({ username: "", email: "" });

  const [jwt, setJwt] = useState();

  useEffect(() => {
    if (jwt) {
      try {
        const decoded = jwtDecode(jwt);
        setUserDetails({
          username: decoded.username || "",
          email: decoded.email || "",
        });
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    } else {
      setUserDetails({ username: "", email: "" });
    }
  }, [jwt]);

  return (
    <AuthContext.Provider value={{ jwt, setJwt, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
}
