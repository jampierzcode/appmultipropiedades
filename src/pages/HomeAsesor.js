import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useSharedData } from "../components/SharedDataContext";
import { Helmet } from "react-helmet-async";
import ListPropiedadesPageAsesor from "../components/ListPropiedadesPageAsesor";
import { useSharedDataAsesor } from "../components/SharedDataContextAsesor";
const { Option } = Select;
const HomeAsesor = () => {
  const { asesorId, asesorNombre } = useParams();
  const { webData, business } = useSharedDataAsesor();
  const settings = {
    color_primary: webData.length === 0 ? "#000" : webData[0].color_primary,
    color_secondary: webData.length === 0 ? "#000" : webData[0].color_secondary,
    is_capa_fondo_portada:
      webData.length === 0 ? false : webData[0].is_capa_fondo_portada,
    color_fondo_portada:
      webData.length === 0 ? "#000" : webData[0].color_fondo_portada,
    color_capa_fondo_portada:
      webData.length === 0 ? "#000" : webData[0].color_capa_fondo_portada,
    portada: webData.length === 0 ? "" : webData[0].portada,
  };
  const [properties, setProperties] = useState([]);
  const [minPrecio, setMinPrecio] = useState("");
  const [maxPrecio, setMaxPrecio] = useState("");
  const [moneda, setMoneda] = useState("PEN");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedLocation, setSelectedLocation] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const buscarPropiedades = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/propiedadesbybusiness/${business.id}`
      );

      setProperties(response.data);
    } catch (error) {
      console.error("Error al obtener las propiedades:", error);
    }
  };
  const handleSearch = () => {
    const type = selectedType.toLowerCase();
    let urlPrecios = "";
    if (minPrecio !== null && minPrecio !== "") {
      urlPrecios += `-desde-${minPrecio}`;
    }
    if (maxPrecio !== null && maxPrecio !== "") {
      urlPrecios += `-hasta-${maxPrecio}`;
    }
    if (minPrecio !== null && minPrecio !== "") {
      urlPrecios += `-${moneda.toLocaleLowerCase()}`;
    }

    console.log(type);
    let urlType = "";
    if (type === "todos") {
      urlType += "departamento-o-casa-o-oficina-o-lote";
    } else {
      urlType += type;
    }
    let searchURL = `/busqueda/venta-de-${urlType}`;
    console.log(searchURL);
    if (selectedLocation !== "") {
      const [region, provincia, distrito, codigo] = selectedLocation.split("-");
      searchURL += `-en-${region}`;

      if (provincia) {
        searchURL += `-${provincia}`;
      }
      if (distrito) {
        searchURL += `-${distrito}`;
      }
      if (codigo) {
        searchURL += `-${codigo}`;
      }
    }
    searchURL += `${urlPrecios}`;
    navigate(searchURL);
  };
  const uniqueRegions = [
    ...new Set(properties.map((p) => `${p.region_name}-${p.region}`)),
  ];
  const uniqueProvincias = [
    ...new Set(
      properties.map(
        (p) => `${p.region_name}-${p.provincia_name}-${p.provincia}`
      )
    ),
  ];
  const uniqueDistritos = [
    ...new Set(
      properties.map(
        (p) =>
          `${p.region_name}-${p.provincia_name}-${p.distrito_name}-${p.distrito}`
      )
    ),
  ];
  const clearPrecios = () => {
    setMinPrecio(null);
    setMaxPrecio(null);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (business !== null) {
      buscarPropiedades();
    }
  }, [business]);

  return (
    <>
      <Helmet>
        <link rel="icon" href={`${window.location.origin + "/logo3.png"}`} />
        <meta name="theme-color" content="#000" />
        <link
          rel="apple-touch-icon"
          href={`${window.location.origin + "/logo3.png"}`}
        />

        <link rel="canonical" href="/" />
        <meta property="og:title" content="Tu vivienda" />
        <meta
          property="og:image"
          content={`${window.location.origin + "/logo3.png"}`}
        />
        <meta
          name="description"
          data-rh="true"
          content="La propiedad que buscas a un click"
        />
        <meta
          property="og:description"
          content="La propiedad que buscas a un click"
        />
        <meta
          property="og:url"
          content="https://tuvivienda.tuviviendaya.com/"
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div
        className="w-full h-[95vh] relative"
        style={{
          backgroundImage: `url("${settings.portada}")`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundColor: `${settings?.color_fondo_portada}`,
        }}
      >
        {Number(settings.is_capa_fondo_portada) === 1 ? (
          <div
            style={{ background: settings.color_capa_fondo_portada }}
            className="absolute top-0 left-0 w-full h-full bottom-0 right-0"
          ></div>
        ) : null}

        <div className="max-w-[860px] px-3 absolute top-[25%] left-0 right-0 mx-auto flex items-center justify-center">
          <div className="w-full py-8 px-4 bg-white bg-opacity-95 rounded ">
            <h1
              style={{ color: settings.color_primary }}
              className={`text-md md:text-2xl font-bold text-center mb-4`}
            >
              ¡Busca tus propiedades aqui!
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 rounded text-xs md:text-sm bg-gray-300"
                >
                  <option value="Todos">Todos</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Oficina">Oficina</option>
                  <option value="Casa">Casa</option>
                  <option value="Lote">Lote</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Select
                  showSearch
                  variant="borderless"
                  className="w-full px-3 py-2 rounded text-xs md:text-sm bg-gray-300"
                  placeholder="Ubicación"
                  onChange={(value) => setSelectedLocation(value)}
                >
                  {uniqueRegions.map((region) => (
                    <Option key={region} value={region}>
                      {region.split("-")[0]}
                    </Option>
                  ))}
                  {uniqueProvincias.map((provincia) => (
                    <Option key={provincia} value={provincia}>
                      {provincia.split("-")[0]}, {provincia.split("-")[1]}
                    </Option>
                  ))}
                  {uniqueDistritos.map((distrito) => (
                    <Option key={distrito} value={distrito}>
                      {distrito.split("-")[0]}, {distrito.split("-")[1]},{" "}
                      {distrito.split("-")[2]}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <button
                  onClick={() => handleSearch()}
                  style={{ background: settings.color_primary }}
                  className="px-3 py-2 w-full text-xs md:text-sm rounded font-medium  text-white"
                >
                  Buscar
                </button>
              </div>
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="col-span-3 flex gap-3">
                  <select
                    value={moneda}
                    onChange={(e) => setMoneda(e.target.value)}
                    name=""
                    id="moneda"
                    className="px-3 py-2 rounded font-medium text-xs md:text-sm bg-gray-300"
                  >
                    <option value="PEN">S/</option>
                    <option value="DOLLAR">$</option>
                  </select>
                  <input
                    value={minPrecio}
                    onChange={(e) => setMinPrecio(e.target.value)}
                    className="w-full px-3 py-2 rounded text-xs md:text-sm bg-gray-300"
                    type="number"
                    step={0.01}
                    placeholder="precio desde"
                  />
                  <input
                    value={maxPrecio}
                    onChange={(e) => setMaxPrecio(e.target.value)}
                    step={0.01}
                    className="w-full px-3 py-2 rounded text-xs md:text-sm bg-gray-300"
                    type="number"
                    placeholder="precio hasta"
                  />
                </div>
                <div>
                  <button
                    onClick={() => clearPrecios()}
                    style={{ background: settings.color_secondary }}
                    className=" text-white text-xs  md:text-sm rounded p-2"
                  >
                    retirar precio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full py-[40px] px-3">
        <div className="max-w-[980px] mx-auto">
          <h1
            style={{ color: settings.color_primary }}
            className="text-2xl font-bold mb-4"
          >
            Propiedades Destacadas
          </h1>
          <ListPropiedadesPageAsesor
            settings={settings}
            propiedades={properties}
            asesorNombre={asesorNombre}
            asesorId={asesorId}
          />
        </div>
      </div>
    </>
  );
};

export default HomeAsesor;
