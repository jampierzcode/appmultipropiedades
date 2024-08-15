// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    console.log(user);
    return <Navigate to="/login" />;
  }

  const token = user.token;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      sessionStorage.removeItem("session");
      return <Navigate to="/login" />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    sessionStorage.removeItem("session");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
