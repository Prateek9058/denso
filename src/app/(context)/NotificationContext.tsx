"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import axiosInstanceImg from "@/app/api/axiosInstanceImg";
import { AxiosError } from "axios";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";

interface NotifyContextType {
  notification: any;
  setNotification: React.Dispatch<React.SetStateAction<any>>;
  getnotification: () => Promise<void>;
  loading?: boolean;
  readCount: any;
  readAll: any;
}

interface ErrorResponse {
  message?: string;
}

const NotificationContext = createContext<NotifyContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [readCount, setReadCount] = useState<any>(null);

  const getnotification = async () => {    
    const storedSite = localStorage.getItem("selectedSite");
    if (!storedSite) {
      console.error("No site selected");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `api/v1/alerts/getAllAlerts/${JSON.parse(storedSite)?._id}`
      );
      if (res?.status === 200 || res?.status === 201) {
        const notifications = res?.data?.data;
        setNotification(notifications);
        const unreadCount = notifications?.alerts?.filter(
          (notification: any) => notification.readStatus == 0
        );
        setReadCount(unreadCount.length);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setLoading(false);
    }
  };

  const readAll = async () => {
    try {
      const res = await axiosInstanceImg.patch(
        "/api/notification/mark-all-read"
      );
      if (res?.status === 200 || res?.status === 201) {
        await getnotification();
        notifySuccess("All notifications marked as read successfully");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(
        axiosError?.response?.data?.message || "Error while marking all as read"
      );
      console.error(
        axiosError?.response?.data?.message || "Error while marking all as read"
      );
    }
  };
  useEffect(() => {
    getnotification();
    const intervalId = setInterval(() => {
      getnotification();
    }, 30000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <NotificationContext.Provider
      value={{
        notification,
        setNotification,
        getnotification,
        loading,
        readCount,
        readAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
