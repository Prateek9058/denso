"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Grid } from "@mui/material";
import AddDevice from "./(addDevice)/addDevice";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
import { useSitesData } from "@/app/(context)/SitesContext";
import CountCard from "@/app/(components)/mui-components/Card/CountCard";
type Breadcrumb = {
  label: string;
  link: string;
};
const breadcrumbItems: Breadcrumb[] = [
  { label: "Dashboard", link: "/" },
  { label: "Manpower Tracking", link: "/man-power-tracking" },
];
const Page: React.FC = () => {
  const { selectedSite } = useSitesData();
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [zone, setZone] = useState<any>([]);
  const [zoneId, setZoneId] = useState<any>("");
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedZone = event.target.value;
    setZoneId(selectedZone);
  };
  const getEmployeeData = useCallback(async () => {
    if (!selectedSite?._id) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/v1/employees/getAllEmployees/${selectedSite?._id}?page=${
          page + 1
        }&limit=${rowsPerPage}&search=${searchQuery}&zone=${zoneId}`
      );
      if (res?.status === 200 || res?.status === 201) {
        setDeviceData(res?.data?.data);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.error("Error fetching device data:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedSite, page, rowsPerPage, searchQuery, zoneId]);
  useEffect(() => {
    getEmployeeData();
  }, [getEmployeeData]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const getAllZone = useCallback(async () => {
    if (!selectedSite?._id) return;
    try {
      const res = await axiosInstance.get(
        `/api/v1/zone/zoneData/${selectedSite?._id}`
      );
      if (res?.status === 200 || res?.status === 201) {
        const zoneData = Object.values(res?.data?.data[0]?.zones);
        setZone(zoneData);
      }
    } catch (err) {
    } finally {
    }
  }, [selectedSite]);
  useEffect(() => {
    getAllZone();
  }, [selectedSite]);
  console.log(zoneId);

  return (
    <Grid sx={{ padding: "12px 15px" }}>
      <ToastComponent />
      <AddDevice
        open={open}
        setOpen={setOpen}
        getEmployeeData={getEmployeeData}
        // selectedSite={selectedSite}
      />
      <CountCard />
      <ManagementGrid
        moduleName="Manpower Management"
        subHeading="Track manpower"
        button="Add manpower"
        handleClickOpen={handleClickOpen}
        breadcrumbItems={breadcrumbItems}
        select={true}
        zone={zone}
        zoneId={zoneId}
        handleInputChange={handleInputChange}
      />
      <Table
        deviceData={deviceData}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        page={page}
        setPage={setPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={loading}
      />
    </Grid>
  );
};
export default Page;
