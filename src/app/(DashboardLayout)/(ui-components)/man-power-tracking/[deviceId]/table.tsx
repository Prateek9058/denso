"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Grid, Typography, IconButton, Tooltip, Chip } from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import CommonDialog from "@/app/(components)/mui-components/Dialog";
import Link from "next/link";
import moment from "moment";
import TableSkeleton from "@/app/(components)/mui-components/Skeleton/tableSkeleton";
import { BsEye } from "react-icons/bs";
import CustomTable from "@/app/(components)/mui-components/Table/customTable";
import CommonDatePicker from "@/app/(components)/mui-components/Text-Field's/Date-range-Picker";
import axiosInstance from "@/app/api/axiosInstance";
interface TableProps {
  deviceId: any;
  empJoinedDate: any;
}
const Table: React.FC<TableProps> = ({ deviceId, empJoinedDate }) => {
  const columns = [
    "Sno.",
    "Date",
    "Status",
    "Check In",
    "Check Out",
    "Work Hours",
  ];
  const [open, setOpenDialog] = React.useState(false);
  const [date, setDate] = useState<any>(null);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [analyticsDate, setAnalyticsDate] = useState<any>(null);
  const getDataFromChildHandler = (date: any, dataArr: any) => {
    setDate(date);
    setAnalyticsDate(dataArr);
  };
  const getEmployeeData = async () => {
    if (!deviceId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/v1/employees/employeeAttendanceData/${deviceId}?page=${
          page + 1
        }&limit=${rowsPerPage}&startDate=${moment(date?.[0]?.startDate).format(
          "YYYY-MM-DD"
        )}&endDate=${moment(date?.[0]?.endDate).format("YYYY-MM-DD")}`
      );
      if (res?.status === 200 || res?.status === 201) {
        setDeviceData(res?.data?.data);
        console.log(res);
      }
    } catch (err) {
      setLoading(false);
      console.error("Error fetching device data:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (date) {
      getEmployeeData();
    }
  }, [deviceId, page, rowsPerPage, date]);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    handleCancel();
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const getStatus = (str: string) => {
    if (str?.toUpperCase() === "PRESENT")
      return { status: "Present", color: "customChip activeGreen" };
    else return { status: "Absent", color: "customChip activeRed" };
  };
  const getStatusInfo = (ele: string, index: number) => {
    if (ele?.toUpperCase() === "PRESENT") {
      return [
        <Chip
          key={index}
          sx={{ width: "120px" }}
          className="customChip activeGreen"
          label={ele}
        />,
      ];
    } else {
      return [
        <Chip
          key={index}
          className={getStatus(ele)?.color}
          sx={{ width: "120px" }}
          label={getStatus(ele)?.status}
        />,
      ];
    }
  };
  const getFormattedData = (data: any[]) => {
    return data?.map((item, index) => ({
      sno: index + 1,
      date: moment(item?.date).format("lll"),
      status: getStatusInfo(item?.presentStatus ? "Present" : "Absent", index),
      checkIn: item?.checkIn ? item?.checkIn : "N/A",
      checkOut: item?.checkOut ? item?.checkOut : "N/A",
      workTime: item?.workTime ? item?.workTime : "N/A",
    }));
  };
  return (
    <>
      <CommonDialog
        open={open}
        fullWidth={true}
        maxWidth={"xs"}
        title="Confirmation"
        message="Are you sure you want to delete this device?"
        color="error"
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
      <Grid container mt={3}>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems="center"
          p={2}
          sx={{ backgroundColor: "#FFFFFF", borderRadius: "8px" }}
        >
          <Grid item>
            <Typography variant="h3">Attendance</Typography>
            <Typography variant="body1">
              {" "}
              Showing {deviceData ? deviceData?.data?.length : 0} out of{" "}
              {deviceData?.totalCount} Attendance
            </Typography>
          </Grid>
          <Grid item>
            <Grid container justifyContent={"space-between"} gap={1}>
              <Grid item>
                <CommonDatePicker
                  empJoinedDate={empJoinedDate}
                  getDataFromChildHandler={getDataFromChildHandler}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>{" "}
        {loading ? (
          <TableSkeleton
            rowNumber={new Array(10).fill(0)}
            tableCell={new Array(5).fill("15%")}
            actions={new Array(2).fill(0)}
          />
        ) : (
          <CustomTable
            page={page}
            rows={getFormattedData(deviceData?.data)}
            count={deviceData?.totalCount}
            columns={columns}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        )}
      </Grid>
    </>
  );
};
export default Table;
