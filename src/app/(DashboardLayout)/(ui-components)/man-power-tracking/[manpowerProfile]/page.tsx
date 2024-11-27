"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Grid, Typography, Button } from "@mui/material";
import AddDevice from "@/app/(components)/pages/ManPower/addManpower/index";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import Image from "next/image";
import DetailsListingSkeleton from "@/app/(components)/mui-components/Skeleton/detailsListingSkeleton";
import LineChartCom from "@/app/(components)/mui-components/CustomGraph/LineChart";
import CommonDatePicker from "@/app/(components)/mui-components/Text-Field's/Date-range-Picker";
import empImg from "../../../../../../public/Img/empImg.png";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import moment from "moment";
import EmpTrack from "./emp";
import ToastComponent, {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";

type Breadcrumb = {
  label: string;
  link: string;
};
interface ErrorResponse {
  error?: string;
}
const Page: React.FC = () => {
  const { manpowerProfile } = useParams<{ manpowerProfile: string }>();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [userDetails, setUserDetails] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [date, setDate] = useState<any>(null);
  const [empJoinedDate, setEmpJoinedDate] = useState<any>(null);
  const [analyticsDate, setAnalyticsDate] = useState<any>(null);
  const breadcrumbItems: Breadcrumb[] = [
    { label: "Dashboard", link: "/" },
    { label: "Manpower Tracking ", link: "/man-power-tracking" },
    {
      label: userDetails?.fullName ? userDetails?.fullName : "",
      link: "",
    },
  ];
  const getDataFromChildHandler = (date: any, dataArr: any) => {
    setDate(date);
    setAnalyticsDate(dataArr);
  };
  const getUserDetails = async () => {
    setLoading(true);
    try {
      let res = await axiosInstance.get(
        `employees/getEmployee/${manpowerProfile}`
      );
      if (res?.status === 200 || res?.status === 201) {
        setUserDetails(res?.data?.data);
        setEmpJoinedDate(moment(res?.data?.data?.createdAt).format("lll"));
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (manpowerProfile) {
      getUserDetails();
    }
  }, [manpowerProfile]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const deleteUser = async () => {
    try {
      const res = await axiosInstance.delete(
        `employees/deleteEmployee/${manpowerProfile}`
      );
      if (res?.status === 200 || res?.status === 201) {
        console.log(res);
        notifySuccess("Employee deleted successfully");
        router.push("/man-power-tracking");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError("Error deleting employee");
    }
  };
  const getEmployeeData = async () => {
    if (!manpowerProfile) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `employees/employeeAttendanceDayMonthGraphData/${manpowerProfile}?startDate=${moment(
          date?.[0]?.startDate
        ).format("YYYY-MM-DD")}&endDate=${moment(date?.[0]?.endDate).format(
          "YYYY-MM-DD"
        )}`
      );
      if (res?.status === 200 || res?.status === 201) {
        setDeviceData(res?.data?.data?.data);
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
  }, [manpowerProfile, date]);
  const handleRoute = (name: any) => {
    const formattedName = name?.toUpperCase().replace(/\s+/g, "-");
    router.push(`/man-power-tracking/${manpowerProfile}/${formattedName}`);
  };

  return (
    <>
      <ToastComponent />
      {open && (
        <AddDevice
          open={open}
          setOpen={setOpen}
          getEmployeeData={getUserDetails}
          selectedDevice={userDetails}
        />
      )}
      <ManagementGrid
        moduleName="Manpower Details"
        subHeading="Manage manpower details"
        button="Edit Details"
        deleteBtn="Delete profile"
        handleClickOpen={handleClickOpen}
        breadcrumbItems={breadcrumbItems}
        deleteFunction={deleteUser}
        edit={true}
      />
      {loading ? (
        <DetailsListingSkeleton listingHead={new Array(15).fill(0)} />
      ) : (
        <Grid container justifyContent={"space-between"} gap={2} mt={3}>
          <Grid item md={2.5}>
            <Grid container>
              <Grid item sx={{ width: "100%" }}>
                <Image
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    borderRadius: "10px",
                  }}
                  src={empImg}
                  alt="employee Img"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            md={9.3}
            xs={12}
            pt={1}
            px={3}
            sx={{ bgcolor: "white", borderRadius: "10px" }}
          >
            <Grid container justifyContent={"space-between"}>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Name
                </Typography>
                <CustomTextField
                  disabled
                  value={userDetails ? userDetails?.fullName : ""}
                />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Manpower ID
                </Typography>
                <CustomTextField
                  disabled
                  value={userDetails ? userDetails?.uId : ""}
                />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Email Address
                </Typography>
                <CustomTextField
                  disabled
                  defaultValue={userDetails ? userDetails?.email : ""}
                />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Phone Number
                </Typography>
                <CustomTextField
                  disabled
                  value={userDetails ? userDetails?.phoneNumber : ""}
                />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Age
                </Typography>
                <CustomTextField
                  disabled
                  value={userDetails ? userDetails?.age : ""}
                />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Job Role
                </Typography>
                <CustomTextField
                  disabled
                  value={userDetails ? userDetails?.jobRole : ""}
                />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Shift
                </Typography>
                <CustomTextField
                  disabled
                  value={userDetails ? userDetails?.shift?.shiftName : ""}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid
        container
        justifyContent={"space-between"}
        alignItems={"center"}
        mt={1}
      >
        <Grid item>
          <Typography variant="h4">Location</Typography>
        </Grid>
      </Grid>
      <EmpTrack userDetails={manpowerProfile} />{" "}
      <Table deviceId={manpowerProfile} empJoinedDate={empJoinedDate} />
      <Grid container justifyContent={"space-between"}>
        <Grid mt={3} item md={12} sm={12} xs={12}>
          <Grid sx={{ backgroundColor: "white", borderRadius: "10px" }} p={2}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h5">
                  Manpower working and waiting time
                </Typography>
              </Grid>
              <Grid item>
                <CommonDatePicker
                  empJoinedDate={empJoinedDate}
                  getDataFromChildHandler={getDataFromChildHandler}
                />
              </Grid>
            </Grid>
            <Grid pt={2}>
              <LineChartCom
                deviceData={deviceData}
                analyticsDate={analyticsDate}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Page;
