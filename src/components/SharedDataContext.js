// SharedDataContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SharedDataContext = createContext();

export const useSharedData = () => {
  return useContext(SharedDataContext);
};

export const SharedDataProvider = ({ children }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [webData, setWebData] = useState([]);
  const [business, setBusiness] = useState(null);
  const { businessId } = useParams();
  console.log(businessId);
  const fetchWebData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/configwebbybusiness/1`);
      const data = response.data;
      console.log(data);
      if (data.length === 0) {
        setWebData([]);
      } else {
        setWebData(data);
      }
    } catch (error) {
      console.error("Error fetching business data", error);
    }
  };
  const fetchBusinessData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/businessbyname/${businessId}`
      );
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
    if (businessId !== undefined) {
      fetchBusinessData();
    }
  }, [businessId]);
  // Esta llamada inicial se ejecuta una vez al montar el componente

  useEffect(() => {
    fetchWebData();
  }, []);

  return (
    <SharedDataContext.Provider value={{ webData }}>
      {children}
    </SharedDataContext.Provider>
  );
};
