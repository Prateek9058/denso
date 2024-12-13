"use client";
import React, { useState, useEffect, ChangeEvent, useContext } from "react";
import { Grid, Typography } from "@mui/material";
import AddDevice from "@/app/(components)/pages/trolley/addTrolley/addTrolley";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import Table from "./table";
import axiosInstance from "@/app/api/axiosInstance";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import empImg from "../../../../../../public/Img/trolleyImg.png";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import ToastComponent, {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import { AxiosError } from "axios";
import moment from "moment";
import TrolleyTrack from "./trolleyTrack";
import DetailsListingSkeleton from "@/app/(components)/mui-components/Skeleton/detailsListingSkeleton";
import AddRepair from "@/app/(components)/pages/trolley/addRepair";
import Breadcrumb from "@/app/(components)/mui-components/Breadcrumbs";
import {
  LiveDataContext,
  LiveDataProvider,
} from "@/app/(context)/trolleyMoving/Trolley";
import SocketServices from "@/app/api/socketService";

type Breadcrumb = {
  label: string;
  link: string;
};
interface PointWithMarker {
  x: number;
  y: number;
  showMarker: boolean;
  _id: string;
}
interface ErrorResponse {
  error?: string;
}
type GetDataHandler = (state: any, resultArray: any) => void;
const Page: React.FC = () => {
  const { trolleyId } = useParams<{ trolleyId: any }>();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [openRepair, setOoenRepair] = useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [trolleyDetails, setTrolleyDetails] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [startDate, setStartDate] = React.useState<any>(moment());
  const [endDate, setEndDate] = React.useState<any>(moment());

  const { value } = useContext(LiveDataContext);
  console.log("value", value);
  useEffect(() => {
    if (trolleyId) {
      (async () => {
        await SocketServices.initialiseWS();
        SocketServices.emit("joinTrolley", { trolleyId });
        SocketServices.on("trolleyData", (data) => {
          console.log("data form ", data);
        });
      })();
    } else {
      () => {
        SocketServices.emit("deleteTrolley", { trolleyId });
      };
    }
  }, [trolleyId]);

  console.log("ksjdh", value);

  const getDataFromChildHandler: GetDataHandler = (state, resultArray) => {
    const startDate = moment(state?.[0]?.startDate);
    const endDate = moment(state?.[0]?.endDate);
    setStartDate(startDate);
    setEndDate(endDate);
  };
  const [trolleyCoordinates, setTrolleyCoordinates] = useState<
    PointWithMarker[]
  >([]);
  console.log("trollet", trolleyCoordinates);

  const breadcrumbItems: Breadcrumb[] = [
    { label: "Dashboard", link: "/" },
    { label: "Trolley Tracking ", link: "/trolley" },
    {
      label: trolleyDetails?.name ?? "--",
      link: "",
    },
  ];

  const getTrolleyDetails = async () => {
    setLoading(true);
    try {
      let res = await axiosInstance.get(
        `trolleys/getSingleTrollye/${trolleyId}`
      );
      if (res?.status === 200 || res?.status === 201) {
        setTrolleyDetails(res?.data?.data);
        setLoading(false);
        getTrolleyRepairData();
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

  useEffect(() => {
    if (value && Object.keys(value).length > 0) {
      setTrolleyCoordinates((prevCoordinates) => [...prevCoordinates, value]);
    }
    // if (data) {
    //   setTrolleyCoordinates(data);
    // }
  }, [value]);

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
        }&limit=${rowsPerPage}&search=${searchQuery}&startDate=${moment(startDate).format("YYYY-MM-DD")}&endDate=${moment(endDate).format("YYYY-MM-DD")}`
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
  }, [page, rowsPerPage, searchQuery, trolleyId, startDate, endDate]);
  const deleteTrolley = async () => {
    try {
      const res = await axiosInstance.delete(
        `trolleys/deleteTrolley/${trolleyId}`
      );
      if (res?.status === 200 || res?.status === 201) {
        notifySuccess("Trolley deleted successfully");
        router.push("/trolley");
      }
    } catch (error) {
      notifyError("Error deleting employee");
    }
  };
  return (
    <>
      <ToastComponent />
      {open && (
        <AddDevice
          open={open}
          setOpen={setOpen}
          getTrolleyData={getTrolleyDetails}
          selectedDevice={trolleyDetails}
        />
      )}
      {openRepair && (
        <AddRepair
          open={openRepair}
          setOpen={setOoenRepair}
          getTrolleyData={getTrolleyDetails}
          selectedDevice={trolleyDetails}
        />
      )}
      <ManagementGrid
        moduleName="Trolley Details"
        button="Edit Trolley"
        buttonAgent={
          trolleyDetails?.isRepairing ? "" : "Mark trolley as repaire"
        }
        deleteBtn="Delete Trolley"
        handleClickOpen={handleClickOpen}
        handleClickOpenAgent={handleClickOpenAgent}
        deleteFunction={deleteTrolley}
        edit={true}
        breadcrumbItems={breadcrumbItems}
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
        {/* <Grid item>
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
        </Grid> */}
      </Grid>
      {trolleyCoordinates.length > 0 && (
        <TrolleyTrack
          userDetails={trolleyId}
          trolleyCoordinates={trolleyCoordinates}
        />
      )}

      <Table
        deviceData={deviceData}
        rowsPerPage={rowsPerPage}
        getDataFromChildHandler={getDataFromChildHandler}
        setRowsPerPage={setRowsPerPage}
        page={page}
        setPage={setPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={loading}
      />
    </>
  );
};

export default Page;
