"use client";

import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import config from "../config"; // Ensure config.backendUrl is properly imported

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    userLoggedin: false,
  });
  const [jwt, setJwt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for auth actions
  const router = useRouter();

  // Check token validity on app load
  useEffect(() => {
    const checkTokenValidity = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000; // Current time in seconds

          // Check if token is expired
          if (decodedToken.exp < currentTime) {
            

            if (refreshToken) {
              try {
                const response = await fetch(
                  `${config.backendUrl}/auth/token/refresh/`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refresh: refreshToken }),
                  }
                );
                const data = await response.json();

                if (data.access && data.refresh) {
                  // Store the new tokens in localStorage
                  localStorage.setItem("accessToken", data.access);
                  localStorage.setItem("refreshToken", data.refresh);
                  setJwt(data.access);
                } else {
                  console.error("Failed to refresh tokens.");
                  handleLogout(); // Logout if refresh fails
                }
              } catch (error) {
                console.error("Error refreshing token:", error);
                handleLogout();
              }
            } else {
             
              handleLogout();
            }
          } else {
            // Token is still valid
            setJwt(accessToken);
          }
        } catch (error) {
          console.error("Failed to decode access token:", error);
          handleLogout();
        }
      } else {
        handleLogout();
      }
    };

    checkTokenValidity();
  }, []);

  // Update user details when JWT changes
  useEffect(() => {
    if (jwt) {
      try {
        const decoded = jwtDecode(jwt);
        setUserDetails({
          username: decoded.username || "",
          email: decoded.email || "",
          userLoggedin: true,
        });
        router.push("/todo");
      } catch (error) {
        console.error("Error decoding JWT:", error);
        handleLogout();
      }
    } else {
      setUserDetails({ username: "", email: "", userLoggedin: false });
    }
  }, [jwt]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setJwt(null);
    setUserDetails({ username: "", email: "", userLoggedin: false });
    router.push("/");
  };

  // Handle Login
  const handleLogin = async (values) => {
    setIsSubmitting(true);
    try {

      const response = await fetch(`${config.backendUrl}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Login failed");
      }

      const data = await response.json();

      // Save tokens
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      setJwt(data.access);
      router.push("/todo");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Signup
  const handleSignup = async (values) => {
    setIsSubmitting(true);
    try {

      const response = await fetch(`${config.backendUrl}/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Signup failed");
      }

      const data = await response.json();

      alert("Signup successful!");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        jwt,
        setJwt,
        userDetails,
        isSubmitting,
        handleLogin,
        handleSignup,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
