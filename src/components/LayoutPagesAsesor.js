import React from "react";
import NavigationPageAsesor from "./NavigationPageAsesor";
import FooterPageAsesor from "./FooterPageAsesor";
import { useParams } from "react-router-dom";
import { SharedDataProviderAsesor } from "./SharedDataContextAsesor";

const LayoutPagesAsesor = ({ children }) => {
  const { asesorNombre, asesorId } = useParams();

  return (
    <SharedDataProviderAsesor>
      <div className="bg-white">
        <NavigationPageAsesor asesorId={asesorId} asesorNombre={asesorNombre} />
        {children}
        <FooterPageAsesor />
      </div>
    </SharedDataProviderAsesor>
  );
};

export default LayoutPagesAsesor;
