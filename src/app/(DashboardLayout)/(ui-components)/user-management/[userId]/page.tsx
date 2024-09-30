"use client";
import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import DetailsListingSkeleton from "@/app/(components)/mui-components/Skeleton/detailsListingSkeleton";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import { useParams } from "next/navigation";
import ToastComponent, {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import AssignDialog from "@/app/(components)/mui-components/Dialog/assign-dialog";
import { AxiosError } from "axios";

interface ErrorResponse {
  error?: string;
}
type Breadcrumb = {
  label: string;
  link: string;
};

const Page: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [userDetails, setUserDetails] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [open, setOpen] = useState<boolean>(false);

  const breadcrumbItems: Breadcrumb[] = [
    { label: "Dashboard", link: "/" },
    { label: "User Management ", link: "/user-management" },
    {
      label: userId,
      link: "",
    },
  ];
  const handleClickOpen = () => {
    setOpen(true);
  };
  /// api call's ///
  const getUserDetails = async () => {
    setLoading(true);
    try {
      let res = await axiosInstance.get(
        `/api/v1/users/getSingleUser/${userId}`
      );
      if (res?.status === 200 || res?.status === 201) {
        setUserDetails(res?.data?.data);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userId) {
      getUserDetails();
    }
  }, [userId]);
  const getUserAssignedSite = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/v1/users/getUserAssingedSites/${userId}?page=${
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
    getUserAssignedSite();
  }, [page, rowsPerPage, searchQuery, userId]);
  const unAssigned = async (id: any) => {
    try {
      const res = await axiosInstance.post(
        `/api/v1/site/removeSiteFromUser/${userId}/${id}`
      );
      if (res?.status === 200 || res?.status === 201) {
        notifySuccess("Sites Unassigned successfully");
        getUserAssignedSite();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(axiosError?.response?.data?.error || "Error assigning agent");
    }
  };
  return (
    <Grid sx={{ padding: "12px 15px" }}>
      <ToastComponent />
      <AssignDialog
        open={open}
        url="/api/v1/site/getAllSites?assignType=false"
        setOpen={setOpen}
        title="Assign Sites"
        macId={userDetails?._id}
        reFetch={getUserAssignedSite}
        deviceAssign={true}
      />
      <ManagementGrid
        moduleName="User Details"
        subHeading="Manage User details"
        breadcrumbItems={breadcrumbItems}
        handleClickOpen={handleClickOpen}
        button={"Assigned Site"}
      />
      {loading ? (
        <DetailsListingSkeleton listingHead={new Array(15).fill(0)} />
      ) : (
        <Grid container justifyContent={"space-between"} gap={2} mt={3}>
          <Grid
            item
            md={12}
            xs={12}
            pt={1}
            px={3}
            sx={{ bgcolor: "white", borderRadius: "10px" }}
          >
            <Grid container justifyContent={"space-between"}>
              <Grid item md={3.9} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  User Name
                </Typography>
                <CustomTextField
                  disabled
                  defaultValue={userDetails ? userDetails?.fullName : ""}
                />
              </Grid>
              <Grid item md={3.9} xs={12}>
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
              <Grid item md={3.9} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Phone Number
                </Typography>
                <CustomTextField
                  disabled
                  defaultValue={userDetails ? userDetails?.phoneNumber : ""}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      <Table
        deviceData={deviceData}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        page={page}
        setPage={setPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={loading}
        unAssigned={unAssigned}
      />
    </Grid>
  );
};

export default Page;
