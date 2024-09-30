"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Grid } from "@mui/material";
import AddDevice from "./(addTrolley)/addTrolley";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
import UploadFile from "./(upload-file)/uploadFile";
import { useSitesData } from "@/app/(context)/SitesContext";
type Breadcrumb = {
  label: string;
  link: string;
};
const breadcrumbItems: Breadcrumb[] = [
  { label: "Dashboard", link: "/" },
  { label: "Trolley Tracking ", link: "" },
];
const Page: React.FC = () => {
  const { selectedSite } = useSitesData();
  const [open, setOpen] = useState<boolean>(false);
  const [openUpload, setOpenUpload] = useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [zone, setZone] = useState<any>([]);
  const [zoneId, setZoneId] = useState<any>("");
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedZone = event.target.value;
    setZoneId(selectedZone);
  };
  ///// Api call's /////
  const getTrolleyData = useCallback(async () => {
    if (!selectedSite?._id) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/v1/trolleys/getAllTrolleys/${selectedSite._id}?page=${
          page + 1
        }&limit=${rowsPerPage}&search=${searchQuery}&zone=${zoneId}`
      );
      if (res?.status === 200 || res?.status === 201) {
        setDeviceData(res?.data?.data);
        setLoading(false);
        console.log(res);
      }
    } catch (err) {
      setLoading(false);
      console.error("Error fetching device data:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedSite, page, rowsPerPage, searchQuery, zoneId]);
  useEffect(() => {
    getTrolleyData();
  }, [getTrolleyData]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenUpload = () => {
    setOpenUpload(true);
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
  return (
    <Grid sx={{ padding: "12px 15px" }}>
      <ToastComponent />
      <AddDevice
        open={open}
        setOpen={setOpen}
        getTrolleyData={getTrolleyData}
        selectedSite={selectedSite}
      />
      <UploadFile
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        getDeviceData={getTrolleyData}
      />
      <ManagementGrid
        moduleName="Trolley Tracking"
        subHeading="Track trolley"
        button="Add Trolley"
        // buttonUpload={"Bulk Upload"}
        handleClickOpen={handleClickOpen}
        handleClickOpenUpload={handleClickOpenUpload}
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
