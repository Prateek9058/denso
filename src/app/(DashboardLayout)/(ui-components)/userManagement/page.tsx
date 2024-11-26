"use client";
import React, { useState } from "react";
import { Grid } from "@mui/material";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";

const Page: React.FC = () => {
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");

  const FetchUserDetails = async () => {
    try {
      setLoading(true);
      const { data, status } = await axiosInstance.get(
        `/users/getAllUsers?page=${page + 1}&limit=${rowsPerPage}&search=${searchQuery}`
      );

      if (status === 200 || status === 201) {
        setDeviceData(data?.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    FetchUserDetails();
  }, [page, rowsPerPage, searchQuery]);
  return (
    <Grid>
      <ToastComponent />
      <Table
        FetchUserDetails={FetchUserDetails}
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
