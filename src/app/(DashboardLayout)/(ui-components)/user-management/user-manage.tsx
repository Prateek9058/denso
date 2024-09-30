"use client";
import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import AddShift from "./(addUser)/addUser";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
type Breadcrumb = {
  label: string;
  link: string;
};
const breadcrumbItems: Breadcrumb[] = [
  { label: "Dashboard", link: "/" },
  { label: "User Management ", link: "/user-management" },
];
const Profile: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");

  ///// Api call's /////
  const getAllUser = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/v1/users/getAllUsers?page=${
          page + 1
        }&limit=${rowsPerPage}&search=${searchQuery}`
      );
      if (res?.status === 200 || 201) {
        setDeviceData(res?.data?.data);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllUser();
  }, [page, rowsPerPage, searchQuery]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <Grid sx={{ padding: "12px 15px" }}>
      <ToastComponent />
      <AddShift open={open} setOpen={setOpen} getDeviceData={getAllUser} />
      <ManagementGrid
        moduleName="User Management"
        subHeading="Manage Users"
        button="Add User"
        handleClickOpen={handleClickOpen}
        breadcrumbItems={breadcrumbItems}
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

export default Profile;
