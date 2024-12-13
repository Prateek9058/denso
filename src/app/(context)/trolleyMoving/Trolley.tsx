"use client";
import SocketServices from "@/app/api/socketService";
import { stringify } from "querystring";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";

interface LiveContextType {
  value: any;
}

export const LiveDataContext = createContext<any>(
  undefined
);

export const LiveDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [value, setValue] = React.useState<object>({});
  const userId = useMemo(() => {
    const profileString = localStorage?.getItem("profile");
    const profileObj = JSON?.parse(profileString || "{}");
    return profileObj?._id;
  }, []);

  useEffect(() => {
    if (userId) {
      (async () => {
        await SocketServices.initialiseWS();

        SocketServices.emit("login", { userId });

        SocketServices.on("notification", (data) => {
          console.log("notificaton", data);
          setValue(data);
        });
      })();

      return () => {
        SocketServices?.close();
      };
    }
  }, []);
  return (
    <LiveDataContext.Provider value={{ value }}>
      {children}
    </LiveDataContext.Provider>
  );
};
