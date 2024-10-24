"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
const SiteContext = createContext<any>(null);
export const SiteProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedSite, setSelectedSite] = useState<any>(null);
  
  useEffect(() => {
    const storedSite = localStorage.getItem("selectedSite");
    if (storedSite) {
      setSelectedSite(JSON.parse(storedSite));
    }
  }, []);

  useEffect(() => {
    if (selectedSite) {
      localStorage.setItem("selectedSite", JSON.stringify(selectedSite));
    }
  }, [selectedSite]);

  return (
    <SiteContext.Provider value={{ selectedSite, setSelectedSite }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
