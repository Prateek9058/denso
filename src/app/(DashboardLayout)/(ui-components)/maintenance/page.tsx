"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Grid } from "@mui/material";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
import { useSitesData } from "@/app/(context)/SitesContext";
import salesIcon from "../../../../../public/Img/trolleydash.png";
import CountCard from "@/app/(components)/mui-components/Card/CountCard";
import moment from "moment";

type GetDataHandler = (state: any, resultArray: any) => void;
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
  const [startDate, setStartDate] = React.useState<any>(moment());
  const [endDate, setEndDate] = React.useState<any>(moment());

  const getDataFromChildHandler: GetDataHandler = (state, resultArray) => {
    const startDate = moment(state?.[0]?.startDate);
    const endDate = moment(state?.[0]?.endDate);
    setStartDate(startDate);
    setEndDate(endDate);
  };
  const [stats, setStats] = useState<any>([
    {
      title: "Average repair time",
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
      title: "Repaired trolleys",
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
      title: "Not repaired trolleys",
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

  ///// Api call's /////
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
        // Update stats based on the fetched data
        setStats((prevStats: any) =>
          prevStats.map((stat: any) => {
            if (stat.title === "Average repair time") {
              return { ...stat, value: res?.data?.data?.avgRepairTime || 0 };
            }
            if (stat.title === "Repaired trolleys") {
              return { ...stat, value: res?.data?.data?.reapirTrollyes || 0 };
            }
            if (stat.title === "Not repaired trolleys") {
              return {
                ...stat,
                value: res?.data?.data?.notReapirTrollyes || 0,
              };
            }
            return stat;
          })
        );
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
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenUpload = () => {
    setOpenUpload(true);
  };

  return (
    <Grid>
      <ToastComponent />
      <CountCard cardDetails={stats} progress={true} />

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
