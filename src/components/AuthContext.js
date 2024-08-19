// AuthContext.js
import axios from "axios";
import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const storedUser = sessionStorage.getItem("session");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    sessionStorage.setItem("session", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("session");
    setUser(null);
  };

  const fetchBusinessData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/businessbyuser/${user.id}`);
      const data = response.data;

      if (data.length !== 0) {
        const business = data[0];
        const infoBusiness = {
          logo: business.logo || "",
          user_id: business.user_id || "",
          nombre_razon: business.nombre_razon || "",
          website: business.website || "",
          direccion: business.direccion || "",
          phone_contact: business.phone_contact || "",
          email: business.email || "",
        };
        setBusiness(infoBusiness);
      }
    } catch (error) {
      console.error("Error fetching business data", error);
    }
  };
  useEffect(() => {
    if (user !== null) {
      fetchBusinessData();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, business, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
