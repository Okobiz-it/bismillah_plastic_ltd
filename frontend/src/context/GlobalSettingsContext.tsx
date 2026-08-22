"use client";

import React, { createContext, useContext, useState } from "react";
import { siteConfig } from "@/config/siteConfig";

type GlobalSettingsContextType = {
  companyName: string;
  loading: boolean;
};

const GlobalSettingsContext = createContext<GlobalSettingsContextType>({
  companyName: siteConfig.companyName,
  loading: false,
});

export const GlobalSettingsProvider = ({ 
  children, 
}: { 
  children: React.ReactNode, 
}) => {
  const [companyName] = useState(siteConfig.companyName);

  return (
    <GlobalSettingsContext.Provider value={{ companyName, loading: false }}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};

export const useGlobalSettings = () => useContext(GlobalSettingsContext);
