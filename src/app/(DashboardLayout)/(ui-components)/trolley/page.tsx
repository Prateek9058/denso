"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Grid } from "@mui/material";
import dynamic from "next/dynamic";

const AddDevice = dynamic(
  () => import("@/app/(components)/pages/trolley/addTrolley/addTrolley"),
  { ssr: false }
);
// import AddDevice from "@/app/(components)/pages/trolley/addTrolley/addTrolley";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
import UploadFile from "@/app/(components)/pages/trolley/uploadFile";
import { useSitesData } from "@/app/(context)/SitesContext";
import salesIcon from "../../../../../public/Img/trolleydash.png";
import Tabs from "@/app/(components)/mui-components/Tabs/CustomTab";
import CountCard from "@/app/(components)/mui-components/Card/CountCard";
import AddCategory from "@/app/(components)/pages/trolley/addCategory";
type Breadcrumb = {
  label: string;
  link: string;
};
interface TabData {
  label: string;
}
const breadcrumbItems: Breadcrumb[] = [
  { label: "Dashboard", link: "/" },
  { label: "Trolley Tracking ", link: "" },
];
const tabs: TabData[] = [
  { label: "Trolley details" },
  { label: "Trolley Category" },
];
const useClientSide = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
const columns1 = [
  "Trolley ID",
  "Trolley name",
  "MAC ID",
  "Running Time",
  "Ideal Time",
  "Assign status",
  "Action",
];
const columns2 = ["Trolley ID", "Trolley name", "Trolly color", "Date"];
const Page: React.FC = () => {
  const isClient = useClientSide();
  const { selectedSite } = useSitesData();
  const [open, setOpen] = useState<boolean>(false);
  const [openCat, setOpenCat] = useState<boolean>(false);
  const [openUpload, setOpenUpload] = useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [zone, setZone] = useState<any>([]);
  const [zoneId, setZoneId] = useState<any>("");
  const [value, setTabValue] = useState<number>(0);
  const [stats, setStats] = useState<any>([
    {
      title: "Trolleys",
      value: 0,
      active: deviceData ? deviceData?.activeTrollees : "0",
      assigned: "0",
      in: "0",
      nonActive: "0",
      notAssigned: "0",
      out: "0",
      icon: salesIcon,
    },
    {
      title: "Assign status",
      value: 0,
      active: "0",
      assigned: "0",
      in: "0",
      nonActive: "0",
      notAssigned: "0",
      out: "0",
      icon: salesIcon,
    },
    {
      title: "Under maintenance",
      value: 0,
      active: "0",
      assigned: "0",
      in: "0",
      nonActive: "0",
      notAssigned: "0",
      out: "0",
      icon: salesIcon,
    },
  ]);

  useEffect(() => {
    getTrolleyData();
  }, [page, rowsPerPage, searchQuery, value]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    setSearchQuery("");
    setPage(0);
    setRowsPerPage(10);
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedZone = event.target.value;
    setZoneId(selectedZone);
  };
  ///// Api call's /////
  const getTrolleyData = async () => {
    setLoading(true);
    const Url =
      value == 0
        ? "trolleys/getAllTrolleys"
        : "trolleyCategory/getAllTrolleyCategories";
    try {
      const res = await axiosInstance.get(
        `${Url}?page=${page + 1}&limit=${rowsPerPage}&search=${searchQuery}`
      );
      if (res?.status === 200 || res?.status === 201) {
        setDeviceData(res?.data?.data);
        setLoading(false);
        console.log("Api responseee", res?.data?.data);
      }
    } catch (err) {
      setLoading(false);
      console.error("Error fetching device data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenCat = () => {
    setOpenCat(true);
  };
  const handleClickOpenUpload = () => {
    setOpenUpload(true);
  };

  const TabPanelList = [
    {
      component: (
        <Table
          columns={columns1}
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
          columns={columns2}
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
  return (
    <Grid sx={{ padding: "12px 15px" }}>
      <ToastComponent />
      {value == 0 ? (
        <AddDevice
          open={open}
          setOpen={setOpen}
          getTrolleyData={getTrolleyData}
          selectedSite={selectedSite}
        />
      ) : (
        <AddCategory
          open={openCat}
          setOpen={setOpenCat}
          getCategoryData={getTrolleyData}
        />
      )}
      <UploadFile
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        getDeviceData={getTrolleyData}
      />
      <CountCard cardDetails={stats} />
      <ManagementGrid
        moduleName={value == 0 ? "Trolley List" : "Trolley Category"}
        button={value == 0 ? "Add Trolley" : "Add Category"}
        // buttonUpload={"Bulk Upload"}
        handleClickOpen={value == 0 ? handleClickOpen : handleClickOpenCat}
        handleClickOpenUpload={handleClickOpenUpload}
        breadcrumbItems={breadcrumbItems}
        handleInputChange={handleInputChange}
      />
      <Tabs
        value={value}
        handleChange={handleChange}
        tabs={tabs}
        TabPanelList={TabPanelList}
      />
    </Grid>
  );
};

export default Page;
