"use client";
import React, { useState } from "react";
import { Grid } from "@mui/material";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import Table from "./table";
import AddUser from "@/app/(components)/pages/userManagement/addUser";
import { useSitesData } from "@/app/(context)/SitesContext";

type Breadcrumb = {
  label: string;
  link: string;
};
const breadcrumbItems: Breadcrumb[] = [
  { label: "Dashboard", link: "/" },
  { label: "User Management", link: "/userManagement" },
];
const Page: React.FC = () => {
  const { selectedSite } = useSitesData();
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const handleClickOpen = () => {
    setOpen(true);
  };
  return (
    <Grid sx={{ padding: "12px 15px" }}>
      <ToastComponent />
        <AddUser
          open={open}
          setOpen={setOpen}
          selectedDevice={selectedSite}
        />
      <ManagementGrid
        moduleName="User Management"
        button={"Add User"}
        handleClickOpen={handleClickOpen}
        // handleClickOpenUpload={handleClickOpenUpload}
        breadcrumbItems={breadcrumbItems}
        // handleInputChange={handleInputChange}
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