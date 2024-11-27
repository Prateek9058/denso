"use client";
import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import Table from "./table";
import moment from "moment";
import axiosInstance from "@/app/api/axiosInstance";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";

type GetDataHandler = (state: any, resultArray: any) => void;
const Page: React.FC = () => {
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [startDate, setStartDate] = React.useState<any>(moment());
  const [endDate, setEndDate] = React.useState<any>(moment());

  const getDataFromChildHandler: GetDataHandler = (state, resultArray) => {
    const startDate = moment(state?.[0]?.startDate);
    const endDate = moment(state?.[0]?.endDate);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const getTrolleyData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `trolleyRepairing/getAllTrolleyRepairings?page=${
          page + 1
        }&limit=${rowsPerPage}&search=${searchQuery}&sortType=1&startDate=${moment(startDate).format("YYYY-MM-DD")}&endDate=${moment(endDate).format("YYYY-MM-DD")}`
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
  };
  useEffect(() => {
    getTrolleyData();
  }, [startDate, endDate, searchQuery, page, rowsPerPage]);

  return (
    <Grid>
      <ToastComponent />
      <Table
        deviceData={deviceData}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        page={page}
        setPage={setPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={loading}
        getDataFromChildHandler={getDataFromChildHandler}
      />
    </Grid>
  );
};

export default Page;
