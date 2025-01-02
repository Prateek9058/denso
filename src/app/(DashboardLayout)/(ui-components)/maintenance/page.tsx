"use client";
import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import Table from "./table";
import moment from "moment";
import axiosInstance from "@/app/api/axiosInstance";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
interface SelectedItems {
  department: string | null;
  sections: string[];
  lines: string[];
}
type GetDataHandler = (state: any, resultArray: any) => void;
const Page: React.FC = () => {
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  // const [startDate, setStartDate] = React.useState<any>(moment());
  // const [endDate, setEndDate] = React.useState<any>(moment());
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    department: null,
    sections: [],
    lines: [],
  });

  const getDataFromChildHandler: GetDataHandler = (state, resultArray) => {
    const startDate = moment(state?.[0]?.startDate);
    const endDate = moment(state?.[0]?.endDate);
    // setStartDate(startDate);
    // setEndDate(endDate);
  };

  const getTrolleyData = async (
    selectedItems?: any,
    startDate?: any,
    endDate?: any
  ) => {
    setLoading(true);
    try {
      const payload = {
        departmentId: selectedItems?.department,
        sectionIds: selectedItems?.sections,
        lineIds: selectedItems?.lines,
      };
      const res = await axiosInstance.post(
        `trolleyMaintenance/getAllTrolleyMaintenanceData?page=${
          page + 1
        }&limit=${rowsPerPage}&search=${searchQuery}&sortType=1&startDate=${moment(startDate).format("YYYY-MM-DD")}&endDate=${moment(endDate).format("YYYY-MM-DD")}`,
        payload
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
  }, [searchQuery, page, rowsPerPage]);

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
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
        getTrolleyData={getTrolleyData}
      />
    </Grid>
  );
};

export default Page;
