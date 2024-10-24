"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import axiosInstanceImg from "@/app/api/axiosInstanceImg";
import { AxiosError } from "axios";

interface ProfileContextType {
  profileData: any;
  setProfileData: React.Dispatch<React.SetStateAction<any>>;
  getProfile: () => Promise<void>;
  updateProfile: (formData: FormData) => Promise<void>;
  loading?: boolean;
}
interface ErrorResponse {
  message?: string;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getProfile = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/profile");
      if (res?.status === 200 || res?.status === 201) {
        setProfileData(res?.data?.data);
        localStorage.setItem("loginId", res?.data?.data?._id);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  const updateProfile = async (formData: FormData) => {
    try {
      let res = await axiosInstanceImg.patch("/api/update", formData);
      if (res?.status === 200 || res?.status === 201) {
        getProfile();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error(
        axiosError?.response?.data?.message || "Error updating profile"
      );
    }
  };
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        setProfileData,
        getProfile,
        updateProfile,
        loading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
