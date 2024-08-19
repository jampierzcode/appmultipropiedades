import React from "react";
import NavigationPage from "./NavigationPage";
import FooterPage from "./FooterPage";
import { SharedDataProvider } from "./SharedDataContext";
import { useParams } from "react-router-dom";

const LayoutPages = ({ children }) => {
  const { businessId } = useParams();
  return (
    <SharedDataProvider>
      <div className="bg-white">
        <NavigationPage businessId={businessId} />
        {children}
        <FooterPage />
      </div>
    </SharedDataProvider>
  );
};

export default LayoutPages;
