// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Define un componente que acepta diferentes componentes para renderizar
const AccesRoute = ({ roles, components }) => {
  const { user } = useAuth();
  const RoleComponent =
    components[Number(user.rol) === 2 ? "admin" : "asesor"] ||
    components["default"];

  return RoleComponent ? <RoleComponent /> : <Navigate to="/unauthorized" />;
};

export default AccesRoute;
