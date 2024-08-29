// SharedDataContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const SharedDataContextAsesor = createContext();

export const useSharedDataAsesor = () => {
  return useContext(SharedDataContextAsesor);
};

export const SharedDataProviderAsesor = ({ children }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [webData, setWebData] = useState([]);
  const [business, setBusiness] = useState(null);
  const [dataUser, setDataUser] = useState(null);
  const { asesorId } = useParams();
  console.log(asesorId);
  const fetchWebData = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/configwebbybusiness/${id}`);
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
      const response = await axios.get(`${apiUrl}/businessbyuser/${asesorId}`);
      const data = response.data;
      console.log(data);
      if (data.length > 0) {
        const business = data[0];
        const infoBusiness = {
          id: business.id || "",
          logo: business.logo || "",
          user_id: business.user_id || "",
          nombre_razon: business.nombre_razon || "",
          website: business.website || "",
          direccion: business.direccion || "",
          phone_contact: business.phone_contact || "",
          email: business.email || "",
        };
        setBusiness(infoBusiness);
        await fetchWebData(business.id);
      } else {
        navigate("/404");
      }
    } catch (error) {
      console.error("Error fetching business data", error);
    }
  };
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/usuario/${asesorId}`);
      const data = response.data;
      console.log(data);
      if (data !== false) {
        setDataUser(data);
      } else {
        navigate("/404");
      }
    } catch (error) {
      console.error("Error fetching business data", error);
    }
  };
  useEffect(() => {
    if (asesorId !== undefined) {
      console.log("entro aqui");
      fetchUserData();
      fetchBusinessData();
    }
  }, [asesorId]);
  // Esta llamada inicial se ejecuta una vez al montar el componente

  return (
    <SharedDataContextAsesor.Provider value={{ webData, business, dataUser }}>
      {children}
    </SharedDataContextAsesor.Provider>
  );
};
