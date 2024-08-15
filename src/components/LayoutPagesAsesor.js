import React from "react";
import { SharedDataProvider } from "./SharedDataContext";
import NavigationPageAsesor from "./NavigationPageAsesor";
import FooterPageAsesor from "./FooterPageAsesor";
import { useParams } from "react-router-dom";

const LayoutPagesAsesor = ({ children }) => {
  const { asesorId } = useParams();
  console.log(asesorId);
  return (
    <SharedDataProvider>
      <div className="bg-white">
        <NavigationPageAsesor asesorId={asesorId} />
        {children}
        <FooterPageAsesor />
      </div>
    </SharedDataProvider>
  );
};

export default LayoutPagesAsesor;
