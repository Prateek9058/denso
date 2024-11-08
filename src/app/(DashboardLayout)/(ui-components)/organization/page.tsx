"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Grid, Box } from "@mui/material";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import AddDepartment from "./(addDepartment)";
import Image from "next/image";
import noData from "../../../../../public/Img/nodata.png";
import Tabs from "@/app/(components)/mui-components/Tabs/CustomTab";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
import { useSitesData } from "@/app/(context)/SitesContext";
type Breadcrumb = {
  label: string;
  link: string;
};
const breadcrumbItems: Breadcrumb[] = [
  { label: "Dashboard", link: "/" },
  { label: "Attendance Details", link: "/attendance" },
];
interface TabData {
  label: string;
}
const Page: React.FC = () => {
  const { selectedSite } = useSitesData();
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [value, setTabValue] = useState<number>(0);
  const tabs: TabData[] = [
    { label: "Department" },
    { label: "Section" },
    { label: "Line" },
  ];
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearchQuery("");
    setPage(0);
    setRowsPerPage(10);
  };
  const getDeviceData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `organizations/getAllData?type=${value == 0 ? "department" : value == 1 ? "section" : "line"}&page=${
          page + 1
        }&limit=${rowsPerPage}&search=${searchQuery}`
      );
      if (res?.status === 200 || res?.status === 201) {
  console.log("deviceData",res)

        setDeviceData(res?.data?.data);
        console.log(res);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  // console.log("deviceData",deviceData)
  useEffect(() => {
    getDeviceData();
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
          value={value}
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
          value={value}
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
          value={value}
        />
      ),
    },
  ];
  const getButtonLabel = (value: number) => {
    if (value == 0) {
      return "Add Department";
    } else if (value == 1) {
      return "Add Section";
    } else {
      return "Add Line";
    }
  };
  return (
    <Grid sx={{ padding: "12px 15px" }}>
      <ToastComponent />
      <AddDepartment
        open={open}
        type={value == 0 ? "department" : value == 1 ? "section" : "line"}
        setOpen={setOpen}
        getDeviceData={getDeviceData}
      />
      <ManagementGrid
        moduleName="Organization Management"
        button={getButtonLabel(value)}
        handleClickOpen={handleClickOpen}
        breadcrumbItems={breadcrumbItems}
      />
      {tabs.length > 0 ? (
        <Tabs
          value={value}
          handleChange={handleChange}
          tabs={tabs}
          TabPanelList={TabPanelList}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Image src={noData} alt="nodata" />
          </Grid>
        </Box>
      )}
    </Grid>
  );
};
export default Page;
