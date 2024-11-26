"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Grid, Box, Button } from "@mui/material";
import AddDevice from "./(addDevice)/addManPower";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
import { useSitesData } from "@/app/(context)/SitesContext";
import CountCard from "@/app/(components)/mui-components/Card/CountCard";
import salesIcon from "../../../../../public/Img/sales.png";
import AssignDialog from "@/app/(components)/mui-components/Dialog/assign-dialog";
import Tabs from "@/app/(components)/mui-components/Tabs/CustomTab";

type Breadcrumb = {
  label: string;
  link: string;
};
const breadcrumbItems: Breadcrumb[] = [
  { label: "Dashboard", link: "/" },
  { label: "Manpower Tracking", link: "/man-power-tracking" },
];
interface TabData {
  label: string;
}
const Page: React.FC = () => {
  // const { selectedSite } = useSitesData();
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [zone, setZone] = useState<any>([]);
  const [zoneId, setZoneId] = useState<any>("");
  const [value, setTabValue] = useState<number>(0);
  const tabs: TabData[] = [{ label: "Assigned" }, { label: "Not assigned" }];
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearchQuery("");
    setPage(0);
    setRowsPerPage(10);
  };
  console.log("valuekkkk", value);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedZone = event.target.value;
    setZoneId(selectedZone);
  };
  const getEmployeeData = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get(
        `employees/getAllEmployees?page=${
          page + 1
        }&limit=${rowsPerPage}&search=${searchQuery}&sortType=-1&status=${value == 0 ? "true" : "false"}`
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
  }, [page, rowsPerPage, searchQuery, zoneId, value]);
  useEffect(() => {
    getEmployeeData();
  }, [value]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  console.log(zoneId);

  const TabPanelList = [
    {
      component: (
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
      ),
    },
    {
      component: (
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
      ),
    },
  ];

  return (
    <Grid>
      <ToastComponent />
      <AddDevice
        open={open}
        setOpen={setOpen}
        getEmployeeData={getEmployeeData}
        selectedDevice={deviceData}
      />

      <Tabs
        value={value}
        handleChange={handleChange}
        tabs={tabs}
        TabPanelList={TabPanelList}
        button={"Add manPower"}
        handleClickOpen={handleClickOpen}
      />
    </Grid>
  );
};
export default Page;
