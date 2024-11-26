"use client";
import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
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
import DetailsListingSkeleton from "@/app/(components)/mui-components/Skeleton/detailsListingSkeleton";
import AddRepair from "@/app/(components)/pages/trolley/addRepair";
import { useSitesData } from "@/app/(context)/SitesContext";
import Router from "next/router";
import CommonDialog from "@/app/(components)/mui-components/Dialog";

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
const Page = ({ params }: { params: { maintenanceId: string } }) => {
  const { trolleyId } = useParams<{ trolleyId: any }>();
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
  const [startDate, setStartDate] = React.useState<any>(moment());
  const [endDate, setEndDate] = React.useState<any>(moment());

  const getDataFromChildHandler: GetDataHandler = (state, resultArray) => {
    const startDate = moment(state?.[0]?.startDate);
    const endDate = moment(state?.[0]?.endDate);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  /// api call's ///
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
  const handleBack = () => {
    router.push("/maintenance");
  };

  const handleConfirm = async () => {
    try {
      const { data, status } = await axiosInstance.post(
        `trolleyRepairing/updateTrolleyToRepair/${params?.maintenanceId}`
      );
      if (status === 200 || status === 201) {
        notifySuccess("Trolley marked as repaired successfully");
        handleCancel();
      }
    } catch (error: any) {
      notifyError(error?.response?.data?.message);
    }
  };
  return (
    <Grid sx={{ padding: "12px 15px" }}>
      <ToastComponent />
      <CommonDialog
        open={openRepair}
        fullWidth={true}
        maxWidth={"xs"}
        title="Confirmation"
        message="Are you sure you want to Marked trolley as repaired?"
        color="error"
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
      {/* <AddRepair
        open={openRepair}
        setOpen={setOoenRepair}
        getTrolleyData={[]}
        selectedDevice={trolleyDetails}
      /> */}
      <ManagementGrid
        buttonAgent={
          trolleyDetails?.isRepairing ? "Mark trolley as repaired" : ""
        }
        handleClickOpenAgent={handleClickOpenAgent}
        back="Back"
        handleBack={handleBack}
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
                      ? moment(trolleyDetails?.updatedAt).format("lll")
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
