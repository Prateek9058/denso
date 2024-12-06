"use client";
import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import dynamic from "next/dynamic";

const AddDevice = dynamic(
  () => import("@/app/(components)/pages/trolley/addTrolley/addTrolley"),
  { ssr: false }
);
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
import UploadFile from "@/app/(components)/pages/trolley/uploadFile";
import Tabs from "@/app/(components)/mui-components/Tabs/CustomTab";
import AddCategory from "@/app/(components)/pages/trolley/addCategory";
import Breadcrumb from "@/app/(components)/mui-components/Breadcrumbs";

type Breadcrumb = {
  label: string;
  link: string;
};
interface TabData {
  label: string;
}
type Category = "all" | "assigned" | "not_assigned";
const breadcrumbItems: Breadcrumb[] = [
  { label: "Dashboard", link: "/" },
  { label: "Trolley Tracking ", link: "" },
];
const tabs: TabData[] = [
  { label: "Trolley details" },
  { label: "Trolley Category" },
];
const columns1 = [
  "Trolley ID",
  "Trolley name",
  "MAC ID",
  "Running Time",
  "Ideal Time",
  "Assign Count",
  "Action",
];
const columns2 = ["Trolley ID", "Trolley name", "Trolly color", "Date"];
const Page: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openCat, setOpenCat] = useState<boolean>(false);
  const [openUpload, setOpenUpload] = useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [categoryData, setCategoryData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [value, setTabValue] = useState<number>(0);

  useEffect(() => {
    getTrolleyData();
  }, [page, rowsPerPage, searchQuery, value]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    setSearchQuery("");
    setPage(0);
    setRowsPerPage(10);
  };

  const getTrolleyData = async (status?: Category) => {
    let statusValue = "";
    if (status === "assigned") {
      statusValue = "true";
    } else if (status === "not_assigned") {
      statusValue = "false";
    } else if (status === "all") {
      statusValue = "";
    }
    setLoading(true);
    const Url =
      value == 0
        ? "trolleys/getAllTrolleys"
        : "trolleyCategory/getAllTrolleyCategories";
    try {
      const res = await axiosInstance.get(
        `${Url}?page=${page + 1}&limit=${rowsPerPage}&search=${searchQuery}&status=${statusValue}`
      );
      if (res?.status === 200 || res?.status === 201) {
        if (value === 0) {
          setCategoryData(res?.data?.data);
        } else {
          setDeviceData(res?.data?.data);
        }
        setLoading(false);
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

  const TabPanelList = [
    {
      component: (
        <Table
          columns={columns1}
          deviceData={categoryData}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          setPage={setPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          loading={loading}
          value={value}
          getTrolleyData={getTrolleyData}
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
    <Grid>
      <ToastComponent />
      {value == 0 ? (
        <AddDevice
          open={open}
          setOpen={setOpen}
          getTrolleyData={getTrolleyData}
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
      <Breadcrumb breadcrumbItems={breadcrumbItems} />
      <Grid container justifyContent={"space-between"}>
        <Grid item xs={12}>
          <Tabs
            button={value === 0 ? "Add Trolley" : "Add Category"}
            value={value}
            handleChange={handleChange}
            tabs={tabs}
            handleClickOpen={value === 0 ? handleClickOpen : handleClickOpenCat}
            TabPanelList={TabPanelList}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Page;
