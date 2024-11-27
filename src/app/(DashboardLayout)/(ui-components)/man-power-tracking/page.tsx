"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Grid } from "@mui/material";
import AddManpower from "@/app/(components)/pages/ManPower/addManpower/index";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";

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
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [value, setTabValue] = useState<number>(0);
  const tabs: TabData[] = [{ label: "Assigned" }, { label: "Not assigned" }];
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getEmployeeData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/employees/getAllEmployees?page=${
          page + 1
        }&limit=${rowsPerPage}&search=${searchQuery}&status=${value === 0 ? true : false}`
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
  }, [page, rowsPerPage, searchQuery, value]);
  useEffect(() => {
    getEmployeeData();
  }, [page, rowsPerPage, searchQuery, value]);
  const handleClickOpen = () => {
    setOpen(true);
  };

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
      <AddManpower
        open={open}
        setOpen={setOpen}
        getEmployeeData={getEmployeeData}
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
