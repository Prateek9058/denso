"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Grid, Box } from "@mui/material";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import AddShift from "./(addShift)/addShift";
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
const Page: React.FC = () => {
  const { selectedSite } = useSitesData();
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [value, setTabValue] = useState<number>(0);
  const [shiftId, setShiftId] = useState<any>("");
  const [tabs, setTabs] = useState<any>([]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearchQuery("");
    setPage(0);
    setRowsPerPage(10);
    const newShiftId = tabs[newValue]?.id;
    setShiftId(newShiftId);
  };
  const getAllShifts = useCallback(async () => {
    if (!selectedSite?._id) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/v1/shifts/getAllShifts/${selectedSite?._id}`
      );
      if (res?.status === 200 || res?.status === 201) {
        const shiftData = res?.data?.data?.map((item: any) => ({
          label: item?.shiftName,
          id: item?._id,
        }));
        setTabs(shiftData);
        if (shiftData.length > 0) {
          setShiftId(shiftData[value]?.id);
        }
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [selectedSite, value]);
  useEffect(() => {
    getAllShifts();
  }, [selectedSite]);
  const getDeviceData = useCallback(async () => {
    if (!shiftId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/v1/shifts/shiftWiseEmployeeData/${shiftId}?page=${
          page + 1
        }&limit=${rowsPerPage}&search=${searchQuery}`
      );
      if (res?.status === 200 || res?.status === 201) {
        setDeviceData(res?.data?.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [shiftId, page, rowsPerPage, searchQuery, value]);
  useEffect(() => {
    getDeviceData();
  }, [shiftId, page, rowsPerPage, searchQuery, value]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const TabPanelList = tabs.map((tab: any, index: number) => ({
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
  }));
  return (
    <Grid sx={{ padding: "12px 15px" }}>
      <ToastComponent />
      <AddShift
        open={open}
        selectedSite={selectedSite}
        setOpen={setOpen}
        getDeviceData={getAllShifts}
      />
      <ManagementGrid
        moduleName="Attendance Details"
        subHeading="Track Attendance"
        button="Add Shift"
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
