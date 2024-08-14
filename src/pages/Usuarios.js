import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Dropdown,
  Input,
  message,
  Modal,
  Select,
  Space,
} from "antd";
import { MdAdd } from "react-icons/md";
import { TbAdjustments, TbCaretDownFilled } from "react-icons/tb";
import { Link, NavLink } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import dayjs from "dayjs";
import {
  FaBuilding,
  FaEdit,
  FaEllipsisV,
  FaEye,
  FaTrash,
  FaUserCog,
} from "react-icons/fa";
import { BsViewList } from "react-icons/bs";
import { FiImage } from "react-icons/fi";
import EmpresaSelect from "../components/EmpresaSelect";
const { Option } = Select;
const { RangePicker } = DatePicker;
const Usuarios = () => {
  const session = JSON.parse(sessionStorage.getItem("session"));
  const apiUrl = process.env.REACT_APP_API_URL;

  //   business
  const [business, setBusiness] = useState([]);
  const [businessActive, setBusinessActive] = useState("Todas");
  //   usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [filterUsuarios, setFilterUsuarios] = useState([]);

  const items = [
    {
      key: "1",
      label: (
        <p
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          Editar
        </p>
      ),
    },
  ];
  const buscarEmpresas = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/businessbyuser/${session.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      let todas = { id: "Todas", nombre_razon: "Todas" };
      //   setBusinessActive(response.data[0].id);
      response.data.push(todas);
      console.log(response.data);
      setBusiness(response.data);
    } catch (error) {
      console.error("Error al obtener las empresas:", error);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line
    buscarEmpresas();
  }, [0]);
  const buscarUsuarios = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/usuariosbyadmin/${session.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      console.log(response);
      setUsuarios(response.data);
      setFilterUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener las propiedades:", error);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line
    buscarUsuarios();
  }, [0]);
  // ESTADOS PARA LA TABLA DINAMICA
  const [selectsProperties, setSelectsProperties] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10); //items por pagina
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleUsuarios, setVisibleUsuarios] = useState([]);
  const [activeFilter, setActiveFilter] = useState(false);
  const [filters, setFilters] = useState({
    tipo: "",
    precioRange: [0, Infinity],
    pais: "",
    region: "",
    provincia: "",
    distrito: "",
    fechaCreatedRange: [null, null],
    fechaEntregaRange: [null, null],
  });

  // Función para aplicar el filtro
  const detectarTotalPages = (data) => {
    if (data.length === 0) {
      setTotalPages(1);
    } else {
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    }
  };
  const applyFilters = () => {
    const regex = /^[a-zA-Z0-9\s]*$/; // Permite solo letras, números y espacios
    const bol = regex.test(searchTerm) ? true : false;

    if (bol && filterUsuarios.length > 0) {
      const filteredUsuarios = filterUsuarios.filter((usuario) => {
        const searchRegex = new RegExp(searchTerm, "i");

        const matchSearch = Object.values(usuario).some((value) =>
          searchRegex.test(value.toString())
        );

        const matchFilters =
          !filters.fechaCreatedRange[0] ||
          ((dayjs(usuario.fecha_created).isAfter(
            filters.fechaCreatedRange[0],
            "day"
          ) ||
            dayjs(usuario.fecha_created).isSame(
              filters.fechaCreatedRange[0],
              "day"
            )) &&
            (dayjs(usuario.fecha_created).isBefore(
              filters.fechaCreatedRange[1],
              "day"
            ) ||
              dayjs(usuario.fecha_created).isSame(
                filters.fechaCreatedRange[1],
                "day"
              )));

        return matchSearch && matchFilters;
      });
      detectarTotalPages(filteredUsuarios);
      const objetosOrdenados = filteredUsuarios.sort((a, b) =>
        dayjs(b.fecha_created).isAfter(dayjs(a.fecha_created)) ? 1 : -1
      );
      const startIndex = (currentPage - 1) * itemsPerPage;
      // setCurrentPage(1);
      const paginatedUsuarios = objetosOrdenados.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      setVisibleUsuarios(paginatedUsuarios);
    } else {
      setSearchTerm(bol);
    }
  };

  // useEffect para manejar el filtrado y paginación
  useEffect(() => {
    applyFilters(); // Aplicar filtro inicialmente
  }, [filterUsuarios, currentPage, itemsPerPage, searchTerm]);

  const handleSelect = (e, id) => {
    e.stopPropagation();
    setSelectsProperties((prevSelects) => {
      if (prevSelects.includes(id)) {
        return prevSelects.filter((p) => p !== id);
      } else {
        return [...prevSelects, id];
      }
    });
  };
  const handleCheckSelect = (e, id) => {
    e.stopPropagation();
    let active = e.target.checked;
    if (active) {
      setSelectsProperties((prevSelects) => [...prevSelects, id]);
    } else {
      setSelectsProperties((prevSelects) =>
        prevSelects.filter((p) => p !== id)
      );
    }
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const visiblePropertyIds = visibleUsuarios.map((propiedad) => propiedad.id);

    if (isChecked) {
      setSelectsProperties((prevSelects) => [
        ...new Set([...prevSelects, ...visiblePropertyIds]),
      ]);
    } else {
      setSelectsProperties((prevSelects) =>
        prevSelects.filter((id) => !visiblePropertyIds.includes(id))
      );
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFiltersChange = (changedFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...changedFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      tipo: "",
      precioRange: [0, Infinity],
      pais: "",
      region: "",
      provincia: "",
      distrito: "",
      fechaCreatedRange: [null, null],
      fechaEntregaRange: [null, null],
    });

    setSearchTerm("");
    setCurrentPage(1);
    detectarTotalPages(filterUsuarios);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsuarios = filterUsuarios.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    setVisibleUsuarios(paginatedUsuarios);
  };
  const handleEditarProperty = (e, id) => {
    e.stopPropagation();
    console.log(id);
  };
  const eliminar_property = (propiedad_id) => {
    return new Promise(async (resolve, reject) => {
      const response = await axios.delete(
        `${apiUrl}/propiedades/${propiedad_id}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      console.log(response);
      resolve(response.data);
    });
  };
  const handleEliminarProperty = async (id) => {
    console.log(id);
    let propiedad_id = id;
    try {
      const response = await eliminar_property(propiedad_id);
      buscarUsuarios();
      message.success("Se elimino correctamente la propiedad");
    } catch (error) {
      message.error("No se elimino la propiedad, hubo un error");
    }
  };

  return (
    <div className="w-full p-6 app-container-sections">
      <div className="w-full mb-4">
        <EmpresaSelect
          businessActive={businessActive}
          setBusinessActive={setBusinessActive}
          listBusiness={business}
        />
      </div>
      <div
        className="mb-[32px] flex items-center justify-between py-4 pr-4"
        style={{ background: "linear-gradient(90deg,#fff0,#fff)" }}
      >
        <div className="data">
          <div className="title font-bold text-xl text-bold-font">Usuarios</div>
          <div className="subtitle max-w-[30vw] text-xs font-normal text-light-font">
            Lista de tus usuarios
          </div>
        </div>
        <div className="options bg-gray-50 p-4">
          <div className="page-top-card flex items-center gap-3">
            <div className="icon bg-light-purple p-4 rounded text-dark-purple">
              <FaUserCog />
            </div>
            <div>
              <div className="value font-bold text-bold-font text-xl">
                {usuarios.length}
              </div>
              <div className="text-sm font-normal text-light-font">
                Total usuarios
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="horizontal-options flex items-center mb-[24px]">
        <div className="search-hook flex-grow">
          <div className="inmocms-input bg-white border rounded border-gray-300 flex text-sm h-[46px] overflow-hidden font-normal">
            <input
              className="h-full px-[12px] w-full border-0 border-none focus:outline-none"
              placeholder="Buscar usuarios"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="on"
            />
            <AiOutlineSearch className="h-full w-[24px] min-w-[24px] opacity-5 mx-[12px]" />
          </div>
        </div>
        <div className="horizontal-options-items ml-[28px] flex items-center">
          <button
            onClick={() => setActiveFilter(!activeFilter)}
            className="inmocms-button bg-dark-blue text-white rounded p-4"
          >
            <TbAdjustments />
          </button>
          <NavLink className="" to={"/propiedades/nuevo"}>
            <button className="btn-new ml-[12px] h-[46px] flex gap-2 items-center">
              <MdAdd className="text-white" />
              <span className="mobile-hide">Nuevo Usuario</span>
            </button>
          </NavLink>
        </div>
      </div>
      <div
        className={`${
          activeFilter ? "" : "hidden"
        } filters grid grid-cols-1 md:grid-cols-6 gap-4 bg-white py-4 px-3 mb-4`}
      >
        <div className="col-span-2">
          <RangePicker
            className="w-full text-sm"
            value={filters.fechaCreatedRange}
            onChange={(dates) =>
              handleFiltersChange({ fechaCreatedRange: dates })
            }
            placeholder={["Fecha Creación Desde", "Fecha Creación Hasta"]}
          />
        </div>
        <div className="col-span-2">
          <RangePicker
            className="w-full text-sm"
            value={filters.fechaEntregaRange}
            onChange={(dates) => {
              if (dates === null) {
                handleFiltersChange({ fechaEntregaRange: [null, null] });
              } else {
                handleFiltersChange({ fechaEntregaRange: dates });
              }
            }}
            placeholder={["Fecha Entrega Desde", "Fecha Entrega Hasta"]}
          />
        </div>
        <div className="w-full flex flex-col md:flex-row">
          <button
            className="p-3 rounded bg-white text-light-font text-xs"
            onClick={() => handleClearFilters()}
          >
            Limpiar
          </button>
          <button
            className="p-3 rounded bg-dark-purple text-white text-xs"
            onClick={() => applyFilters()}
          >
            Buscar
          </button>
        </div>
      </div>
      <div className="box-table">
        <table
          className="inmocms-table"
          cellPadding="0"
          cellSpacing="0"
          border="0"
        >
          <thead>
            <tr>
              <td className="check-field">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={visibleUsuarios.every((propiedad) =>
                    selectsProperties.includes(propiedad.id)
                  )}
                />
              </td>
              <td>Nombres </td>
              <td>Email </td>
              <td>Documento </td>
              <td>Estado </td>
              <td className="ajustes-tabla-celda"></td>
            </tr>
          </thead>
          <tbody>
            {visibleUsuarios.length > 0 &&
              visibleUsuarios.map((usuario, index) => {
                return (
                  <tr
                    className=""
                    key={index}
                    onClick={(e) => handleSelect(e, usuario.id)}
                  >
                    <td className="check-field">
                      <input
                        type="checkbox"
                        value={usuario.id || ""}
                        onClick={(e) => handleCheckSelect(e, usuario.id)}
                        checked={selectsProperties.find((s) => {
                          if (s === usuario.id) {
                            return true;
                          } else {
                            return false;
                          }
                        })}
                      />
                    </td>
                    <td>
                      <div className="flex flex-col align-center">
                        {usuario.nombres}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col align-center">
                        {usuario.email}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col align-center">
                        {usuario.documento}
                      </div>
                    </td>
                    <td>
                      <div style={{ textAlign: "center" }}>
                        <div>
                          <span className="estado publicado">
                            {usuario.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="ajustes-tabla-celda">
                      <div className="ajustes-tabla-celda-item px-4">
                        <Dropdown
                          className="text-sm text-gray-500"
                          placement="bottomRight"
                          menu={{
                            items: [
                              {
                                label: (
                                  <Link
                                    target="_blank"
                                    to={`/proyectos/${usuario.id}`}
                                    className="pr-6 rounded flex items-center gap-2 text-sm text-gray-500"
                                  >
                                    <FaEye /> Ver Propiedad
                                  </Link>
                                ),
                                key: 0,
                              },
                              {
                                label: (
                                  <Link
                                    to={`/propiedades/editar/${usuario.id}`}
                                    className="pr-6 rounded flex items-center gap-2 text-sm text-gray-500"
                                  >
                                    <FaEdit /> Editar info
                                  </Link>
                                ),
                                key: 1,
                              },
                              {
                                label: (
                                  <button
                                    onClick={() => {
                                      Modal.confirm({
                                        title:
                                          "¿Está seguro de eliminar la propiedad?",
                                        content:
                                          "Al eliminar la propiedad, se eliminarán los datos relacionados con la propiedad como: modelos, unidades y contenido multimedia",
                                        onOk: () =>
                                          handleEliminarProperty(usuario.id),
                                        okText: "Eliminar",
                                        cancelText: "Cancelar",
                                      });
                                    }}
                                    className="w-full pr-6 p-2 rounded flex items-center gap-2 text-sm text-red-500"
                                  >
                                    <FaTrash /> Eliminar
                                  </button>
                                ),
                                key: 2,
                              },
                              {
                                label: (
                                  <Link
                                    to={`/property/${usuario.id}/models`}
                                    className="pr-6 rounded flex items-center gap-2 text-sm text-gray-500 "
                                  >
                                    <BsViewList /> Ver Modelos
                                  </Link>
                                ),
                                key: 3,
                              },
                              {
                                label: (
                                  <Link
                                    to={`/property/${usuario.id}/multimedia`}
                                    className="pr-6 rounded flex items-center gap-2 text-sm text-gray-500 "
                                  >
                                    <FiImage /> Multimedia
                                  </Link>
                                ),
                                key: 4,
                              },
                            ],
                          }}
                          trigger={["click"]}
                        >
                          <div
                            className="text-xs w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Space>
                              <FaEllipsisV />
                            </Space>
                          </div>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="table-controls">
        <div className="page">
          <div className="txt">
            Página {currentPage} de {totalPages}
          </div>
          <div style={{ marginBottom: "12px", marginRight: "24px" }}>
            <Select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e));
                setCurrentPage(1); // Reset page to 1 on items per page change
              }}
              // style={{
              //   width: 120,
              // }}
              // dropdownMatchSelectWidth={false}
              placement={"topLeft"}
              options={[
                {
                  value: "1",
                  label: "1",
                },
                {
                  value: "10",
                  label: "10",
                },
                {
                  value: "25",
                  label: "25",
                },
                {
                  value: "50",
                  label: "50",
                },
                {
                  value: "100",
                  label: "100",
                },
                {
                  value: "500",
                  label: "500",
                },
              ]}
            />
          </div>
          <div className="disabled" style={{ marginBottom: "12px" }}>
            <Dropdown
              menu={{ items }}
              placement="bottomLeft"
              trigger={["click"]}
              disabled={selectsProperties.length > 0 ? false : true}
            >
              <Button>
                Editar selección <TbCaretDownFilled />
              </Button>
            </Dropdown>
          </div>
        </div>
        <div className="pagination-controls flex gap-2 items-center">
          <button
            className={`p-3 text-xs rounded ${
              currentPage === 1
                ? "bg-light-purple text-dark-purple"
                : "bg-dark-purple text-white"
            }  `}
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            1
          </button>
          <button
            className={`p-3 text-xs rounded ${
              currentPage === 1
                ? "bg-light-purple text-dark-purple"
                : "bg-dark-purple text-white"
            }  `}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <button className="p-3 rounded bg-dark-purple text-white text-xs">
            {currentPage}
          </button>
          <button
            className={`p-3 text-xs rounded ${
              currentPage === totalPages
                ? "bg-light-purple text-dark-purple"
                : "bg-dark-purple text-white"
            }  `}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
          <button
            className={`p-3 text-xs rounded ${
              currentPage === totalPages
                ? "bg-light-purple text-dark-purple"
                : "bg-dark-purple text-white"
            }  `}
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            {totalPages}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
