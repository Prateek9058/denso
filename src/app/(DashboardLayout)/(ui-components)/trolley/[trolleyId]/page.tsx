"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Grid, Typography, Button } from "@mui/material";
import AddDevice from "../(addTrolley)/addTrolley";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import empImg from "../../../../../../public/Img/trolleyImg.png";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import Site from "../../../../../../public/Img/Layout.jpg";
import ToastComponent, {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import { AxiosError } from "axios";
import moment from "moment";
import TrolleyTrack from "./trolleyTrack";
import DetailsListingSkeleton from "@/app/(components)/mui-components/Skeleton/detailsListingSkeleton";
import AddRepair from "../(addRepairStatus)/addRepair";
import { useSitesData } from "@/app/(context)/SitesContext";

const viewCount = [
  {
    _id: "2020",
    views: "230",
  },
  {
    _id: "2021",
    views: "190",
  },
  {
    _id: "2022",
    views: "140",
  },
  {
    _id: "2023",
    views: "200",
  },
  {
    _id: "2024",
    views: "250",
  },
];
type Breadcrumb = {
  label: string;
  link: string;
};
interface ErrorResponse {
  error?: string;
}
const Page: React.FC = () => {
  const { trolleyId } = useParams<{ trolleyId: string }>();
  const router = useRouter();
  const { selectedSite } = useSitesData();
  const [open, setOpen] = useState<boolean>(false);
  const [openRepair, setOoenRepair] = useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [trolleyDetails, setTrolleyDetails] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [date, setDate] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [analyticsDate, setAnalyticsDate] = useState<any>(null);
  const breadcrumbItems: Breadcrumb[] = [
    { label: "Dashboard", link: "/" },
    { label: "Trolley Tracking ", link: "/trolley" },
    {
      label: trolleyDetails?.trolleyUid
        ? trolleyDetails?.trolleyUid
        : trolleyId,
      link: "",
    },
  ];
  const getDataFromChildHandler = (date: any, dataArr: any) => {
    setDate(date);
    setAnalyticsDate(dataArr);
  };
  /// api call's ///
  const getTrolleyDetails = async () => {
    setLoading(true);
    try {
      let res = await axiosInstance.get(
        `trolleys/getSingleTrollye/${trolleyId}`
      );
      if (res?.status === 200 || res?.status === 201) {
        setTrolleyDetails(res?.data?.data);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (trolleyId) {
      getTrolleyDetails();
    }
  }, [trolleyId]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenAgent = () => {
    setOoenRepair(true);
  };
  const getTrolleyRepairData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `trolleyRepairing/getSingleTrolleyRepairingData/${trolleyId}?page=${
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
    getTrolleyRepairData();
  }, [page, rowsPerPage, searchQuery, trolleyId]);
  /// delete user ///
  const deleteTrolley = async () => {
    try {
      const res = await axiosInstance.delete(
        `trolleys/deleteTrolley/${trolleyId}`
      );
      if (res?.status === 200 || res?.status === 201) {
        console.log(res);
        notifySuccess("Trolley deleted successfully");
        router.push("/trolley");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError("Error deleting employee");
    }
  };
  const handleRoute = (name: any) => {
    const formattedName = name?.toUpperCase().replace(/\s+/g, "-");
    router.push(`/trolley/${trolleyId}/${formattedName}`);
  };
  return (
    <Grid sx={{ padding: "12px 15px" }}>
      <ToastComponent />
      <AddDevice
        open={open}
        setOpen={setOpen}
        getTrolleyData={getTrolleyDetails}
        selectedDevice={trolleyDetails}
        selectedSite={selectedSite}
      />
      <AddRepair
        open={openRepair}
        setOpen={setOoenRepair}
        getTrolleyData={getTrolleyDetails}
        selectedDevice={trolleyDetails}
      />
      <ManagementGrid
        moduleName="Trolley Details"
        subHeading="Manage Trolley details"
        button="Edit Trolley"
        buttonAgent={"Add Repair Info"}
        deleteBtn="Delete Trolley"
        handleClickOpen={handleClickOpen}
        handleClickOpenAgent={handleClickOpenAgent}
        breadcrumbItems={breadcrumbItems}
        deleteFunction={deleteTrolley}
        edit={true}
      />
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
                  defaultValue={
                    trolleyDetails ? trolleyDetails?.trolleyUid : ""
                  }
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
                  defaultValue={
                    trolleyDetails ? trolleyDetails?.trolleyMacId : ""
                  }
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
                    trolleyDetails ? trolleyDetails?.runningTime : ""
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
                    trolleyDetails
                      ? moment(trolleyDetails?.repairDate).format("lll")
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
                  Date of purchase
                </Typography>
                <CustomTextField
                  disabled
                  defaultValue={
                    trolleyDetails
                      ? moment(trolleyDetails?.purchaseDate).format("lll")
                      : ""
                  }
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
        <Grid item>
          {" "}
          <Button
            onClick={() => handleRoute(trolleyDetails?.trolleyUid)}
            variant="contained"
            size="medium"
            sx={{
              color: "#FFFFFF",
              backgroundColor: "#4C4C4C",
            }}
          >
            Animated route
          </Button>
        </Grid>
      </Grid>
      <TrolleyTrack userDetails={trolleyId} />

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
