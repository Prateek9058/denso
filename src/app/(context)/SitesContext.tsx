"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "@/app/api/axiosInstance";
interface Site {
  _id: string;
  siteName: string;
}
interface SitesContextType {
  sites: Site[] | null;
  setSites: React.Dispatch<React.SetStateAction<Site[] | null>>;
  getSites: () => Promise<void>;
  loading?: boolean;
  selectedSite: Site | null;
  setSelectedSite: React.Dispatch<React.SetStateAction<Site | null>>;
}
const SitesContext = createContext<SitesContextType | undefined>(undefined);
export const SitesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sites, setSites] = useState<Site[] | null>(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const getSites = async () => {
    setLoading(true);
    try {
      const storedSite = localStorage.getItem("selectedSite");
      const res = await axiosInstance.get("/api/v1/site/getAllSites");
      if (res?.status === 200 || res?.status === 201) {
        const siteData = res?.data?.data?.data;
        setSites(siteData);
        if (!storedSite && siteData.length > 0) {
          setSelectedSite(siteData[0]);
        }
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    getSites();
  }, []);
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
    <SitesContext.Provider
      value={{
        sites,
        setSites,
        getSites,
        loading,
        selectedSite,
        setSelectedSite,
      }}
    >
      {children}
    </SitesContext.Provider>
  );
};
export const useSitesData = () => {
  const context = useContext(SitesContext);
  if (!context) {
    throw new Error("useSitesData must be used within a SitesProvider");
  }
  return context;
};
