"use client";
import React, { useState, useEffect } from "react";
import { Grid, Typography, Button } from "@mui/material";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import Image from "next/image";
import empImg from "../../../../../../public/Img/trolleyImg.png";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import ToastComponent, {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import moment from "moment";
import DetailsListingSkeleton from "@/app/(components)/mui-components/Skeleton/detailsListingSkeleton";
import CommonDialog from "@/app/(components)/mui-components/Dialog";
import Breadcrumb from "@/app/(components)/mui-components/Breadcrumbs";
import { IoMdAddCircleOutline } from "react-icons/io";
import Feedback from "./feedback";

type Breadcrumb = {
  label: string;
  link: string;
};
type GetDataHandler = (state: any, resultArray: any) => void;
const Page = ({ params }: { params: { maintenanceId: string } }) => {
  const [openRepair, setOoenRepair] = useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [trolleyDetails, setTrolleyDetails] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [startDate, setStartDate] = React.useState<any>(moment());
  const [endDate, setEndDate] = React.useState<any>(moment());
  const breadcrumbItems: Breadcrumb[] = [
    { label: "Dashboard", link: "/" },
    { label: "Maintenance ", link: "/maintenance" },
    { label: trolleyDetails?.name, link: "" },
  ];
  const getDataFromChildHandler: GetDataHandler = (state) => {
    const startDate = moment(state?.[0]?.startDate);
    const endDate = moment(state?.[0]?.endDate);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const getTrolleyDetails = async () => {
    try {
      setLoading(true);
      const { data, status } = await axiosInstance.get(
        `/trolleys/getSingleTrollye/${params?.maintenanceId}`
      );
      if (status === 200 || status === 201) {
        setTrolleyDetails(data?.data);
        setLoading(false);
      }
    } catch (error: any) {
      notifyError(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    getTrolleyDetails();
  }, []);

  const getAllTrolleyRepairings = async () => {
    try {
      setLoading(true);
      const { data, status } = await axiosInstance.get(
        `/trolleyRepairing/getSingleTrolleyRepairingData/${params?.maintenanceId}?page=${page + 1}&limit=${rowsPerPage}&sortType=1&search=${searchQuery}&startDate=${moment(startDate).format("YYYY-MM-DD")}&endDate=${moment(endDate).format("YYYY-MM-DD")}`
      );
      if (status === 200 || status === 201) {
        setDeviceData(data?.data);
        setLoading(false);
      }
    } catch (error: any) {
      notifyError(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    getAllTrolleyRepairings();
  }, [page, rowsPerPage, searchQuery, startDate, endDate]);

  const handleClickOpenAgent = () => {
    setOoenRepair(true);
  };
  const handleCancel = () => {
    setOoenRepair(false);
  };

  const handleConfirm = async () => {
    try {
      const { status } = await axiosInstance.post(
        `trolleyRepairing/updateTrolleyToRepair/${params?.maintenanceId}`
      );
      if (status === 200 || status === 201) {
        getTrolleyDetails();
        getAllTrolleyRepairings();
        notifySuccess("Trolley marked as repaired successfully");
        handleCancel();
      }
    } catch (error: any) {
      notifyError(error?.response?.data?.message);
    }
  };
  return (
    <>
      {openRepair && (
        <Feedback
          open={openRepair}
          setOpen={setOoenRepair}
          getTrolleyDetails={getTrolleyDetails}
          getAllTrolleyRepairings={getAllTrolleyRepairings}
          id={params?.maintenanceId}
        />
      )}
      <ToastComponent />
      {/* <CommonDialog
        open={openRepair}
        fullWidth={true}
        maxWidth={"xs"}
        title="Confirmation"
        message="Are you sure you want to Marked trolley as repaired?"
        color="error"
        onClose={handleCancel}
        onConfirm={handleConfirm}
      /> */}
      <Grid container justifyContent={"space-between"}>
        <Grid item>
          <Breadcrumb breadcrumbItems={breadcrumbItems} />
        </Grid>
        <Grid item>
          {trolleyDetails?.isRepairing ? (
            <Button
              onClick={handleClickOpenAgent}
              startIcon={<IoMdAddCircleOutline />}
              variant="contained"
            >
              Resolved Issue
            </Button>
          ) : (
            ""
          )}
        </Grid>
      </Grid>

      {loading ? (
        <DetailsListingSkeleton listingHead={new Array(15).fill(0)} />
      ) : (
        <Grid container justifyContent={"space-between"} gap={2} mt={3}>
          <Grid item md={2.5}>
            <Grid container>
              <Grid item sx={{ width: "100%", height: "100%" }}>
                <Image
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    borderRadius: "10px",
                    border: "1px solid #E9E9EB",
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
                  Trolley ID
                </Typography>
                <CustomTextField
                  disabled
                  defaultValue={trolleyDetails ? trolleyDetails?.uId : ""}
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
                  defaultValue={trolleyDetails ? trolleyDetails?.age : ""}
                />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Mac ID
                </Typography>
                <CustomTextField
                  disabled
                  defaultValue={trolleyDetails ? trolleyDetails?.macId : ""}
                />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Trolley health
                </Typography>
                <CustomTextField
                  disabled
                  defaultValue={trolleyDetails ? trolleyDetails?.health : ""}
                />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Running Time
                </Typography>
                <CustomTextField
                  disabled
                  defaultValue={
                    trolleyDetails ? trolleyDetails?.runningTime : "0"
                  }
                />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Last repair
                </Typography>
                <CustomTextField
                  disabled
                  defaultValue={
                    trolleyDetails?.repairDate
                      ? moment(trolleyDetails?.repairDate).format("llll")
                      : ""
                  }
                />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Date of createdAt
                </Typography>
                <CustomTextField
                  disabled
                  defaultValue={
                    trolleyDetails?.createdAt
                      ? moment(trolleyDetails?.createdAt).format("llll")
                      : ""
                  }
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
        getDataFromChildHandler={getDataFromChildHandler}
      />
    </>
  );
};

export default Page;
