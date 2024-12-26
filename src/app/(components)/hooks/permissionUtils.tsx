"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import SocketServices from "@/app/api/socketService";

interface Permission {
  allowed: boolean;
}

interface PermissionState {
  accessPermission: Permission[];
}

const PermissionUtils = (): [Permission[]] => {
  const [state, setState] = useState<PermissionState>({
    accessPermission: [],
  });

  const getPermission = useCallback(async (): Promise<void> => {
    try {
      const { data, status } = await axiosInstance.get(
        `users/getUserPermissions`
      );
      setState({ accessPermission: data?.data?.permissions });
    } catch (err) {
      console.log("Error fetching permissions:", err);
    }
  }, []);

  useEffect(() => {
    try {
      SocketServices.on("userPermissionUpdated", (data) => {
        setState({ accessPermission: data.data });
      });
    } catch (error) {
      console.error("Error initializing socket:", error);
    }
  }, [SocketServices]);

  const allowedPermissions = useMemo(
    () => state.accessPermission.filter((item) => item),
    [state.accessPermission]
  );

  useEffect(() => {
    getPermission();
  }, []);

  return [allowedPermissions];
};

export default PermissionUtils;
