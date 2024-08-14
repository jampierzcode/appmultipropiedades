import React, { useEffect, useState } from "react";
import { FaChevronDown, FaRegArrowAltCircleDown } from "react-icons/fa";

const EmpresaSelect = ({ businessActive, setBusinessActive, listBusiness }) => {
  const [activeSelect, setActiveSelect] = useState(false);
  const [businessChange, setBusinessChange] = useState(null);
  useEffect(() => {
    let active = listBusiness.find((b) => b.id === businessActive);

    setBusinessChange(active);
  }, [listBusiness, businessActive]);

  const handleClickSelect = (id) => {
    setActiveSelect(false);
    setBusinessActive(id);
  };
  return (
    <div className="w-auto px-[12px] py-2 rounded relative bg-white shadow-md max-w-max">
      <div
        onClick={() => setActiveSelect(!activeSelect)}
        className="flex items-center gap-2 justify-start cursor-pointer"
      >
        {businessChange?.id !== "Todas" ? (
          <img
            className="w-6 h-6 object-cover object-center shadow-md rounded-full"
            src={businessChange?.logo}
            alt="logo"
          />
        ) : null}

        <span className="text-sm font-bold" data-value={businessChange?.id}>
          {businessChange?.nombre_razon}
        </span>
        <span>
          <FaChevronDown />
        </span>
      </div>
      {activeSelect ? (
        <div className="absolute top-[110%] left-0 w-max shadow-md">
          {listBusiness.map((b, index) => {
            return (
              <div
                className={` ${
                  businessActive === b.id
                    ? "bg-dark-purple text-white"
                    : "bg-white text-black hover:bg-gray-300"
                } flex items-center w-full p-2 cursor-pointer gap-2 transition duration-300`}
                aria-disabled={businessActive === b.id}
                key={index}
                value={b.id}
                onClick={() => handleClickSelect(b.id)}
              >
                {b?.id !== "Todas" ? (
                  <img
                    className="w-6 h-6 object-cover object-center shadow-md rounded-full"
                    src={b?.logo}
                    alt="logo"
                  />
                ) : null}
                <p className="text-sm whitespace-nowrap block">
                  {b.nombre_razon}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default EmpresaSelect;
