"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Button,
  Badge,
} from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import CommonDialog from "@/app/(components)/mui-components/Dialog";
import Link from "next/link";
import FilterListIcon from "@mui/icons-material/FilterList";
import moment from "moment";
import { FaUserFriends } from "react-icons/fa";
import { FaMapLocation } from "react-icons/fa6";
import { BsEye } from "react-icons/bs";
import { GoOrganization } from "react-icons/go";
import CustomTable from "@/app/(components)/mui-components/Table/customTable";
import AssignDept from "@/app/(components)/pages/trolley/assignDeparment/index";
import Filter from "@/app/(components)/pages/trolley/filter/index";
import AssgnMen from "@/app/(components)/pages/trolley/assignMen/index";
import AnimatedTrolley from "@/app/(components)/pages/trolley/animatedRoute/index";
import { MdOutlineEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import AddCategory from "@/app/(components)/pages/trolley/addCategory";
import axiosInstance from "@/app/api/axiosInstance";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";

interface TableProps {
  deviceData: any;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  searchQuery: string;
  loading: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  value: any;
  columns: any;
  getTrolleyData?: any;
  DeptStatus?: string;
}
const Table: React.FC<TableProps> = ({
  deviceData,
  rowsPerPage,
  setRowsPerPage,
  page,
  setPage,
  searchQuery,
  setSearchQuery,
  loading,
  value,
  columns,
  getTrolleyData,
  DeptStatus,
}) => {
  const [open, setOpenDialog] = React.useState(false);
  const [openDept, setOpenDept] = React.useState<boolean>(false);
  const [openFilter, setOpenFilter] = React.useState<boolean>(false);
  const [trolleyId, setTrolleyId] = React.useState<string>("");
  const [openMen, setOpenMen] = React.useState<boolean>(false);
  const [mensData, setMensData] = React.useState<any>(null);
  const [selectedMen, setSelectedMen] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [openAnimated, setOpenAnimated] = useState<boolean>(false);
  const [trolleyData, setTrolleyData] = useState<any>(null);
  const [openCat, setOpenCat] = useState<boolean>(false);
  const [catData, setCatData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string>("");

  const handleOpenAnimatedRoute = (item: any) => {
    setOpenAnimated(true);
    setTrolleyData(item);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };
  const handleOpenDept = (id: any) => {
    setOpenDept(true);
    setTrolleyId(id);
  };
  const handleOpenMen = (data: any) => {
    setOpenMen(true);
    setMensData(data);
  };
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(debouncedSearchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearchQuery, setSearchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedSearchQuery(event.target.value);
  };

  const handleConfirm = async () => {
    try {
      const res = await axiosInstance.delete(
        `/trolleyCategory/deleteCategory/${deleteId}`
      );
      if (res.status === 200 || res.status === 201) {
        notifySuccess("trolley category deleted successfully");
        getTrolleyData();
        handleCancel();
      }
    } catch (error: any) {
      notifyError(error?.response?.data?.message);
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };
  const handleOpenDelete = (id: string) => {
    setOpenDialog(true);
    setDeleteId(id);
  };
  const renderPowerStatus = (status: any) => (
    <Chip
      label={status}
      variant="filled"
      sx={{
        color: "#000",
        fontWeight: 500,
        minWidth: 50,
      }}
    />
  );
  const badgeCount = [selectedMen, selectedDept]?.filter(Boolean)?.length;

  const getFormattedData = (data: any[]) => {
    return data?.map((item, index) => ({
      trolleyUid: item?.uId ?? "N/A",
      name: item?.name ?? "N/A",
      trolleyMacId: item?.macId ?? "N/A",
      runningTime: item?.runningTime ?? "N/A",
      idealTime: item?.idealTime ?? "N/A",
      assignStatus: renderPowerStatus(item?.assignedTo?.length) ?? "",
      Action:
        value == 0
          ? [
              <Grid container justifyContent="center" key={index}>
                <Grid item xs={3}>
                  <Link href={`/trolley/${item?._id}`}>
                    <Tooltip title="View">
                      <IconButton size="small">
                        <BsEye color="#DC0032" />
                      </IconButton>
                    </Tooltip>
                  </Link>
                </Grid>
                {DeptStatus === "false" && (
                  <Grid item xs={3}>
                    <Tooltip title="Assign departments">
                      <IconButton
                        size="small"
                        onClick={() => {
                          handleOpenDept(item);
                        }}
                      >
                        <GoOrganization color="#DC0032" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
                {/* <Grid item xs={3}>
                  <Tooltip title="Assign Menpower">
                    <IconButton
                      size="small"
                      onClick={() => {
                        handleOpenMen(item);
                      }}
                    >
                      <FaUserFriends color="#DC0032" />
                    </IconButton>
                  </Tooltip>
                </Grid> */}
                <Grid item xs={3}>
                  <Tooltip title="Animated routes">
                    <IconButton
                      size="small"
                      onClick={() => {
                        handleOpenAnimatedRoute(item);
                      }}
                    >
                      <FaMapLocation color="#DC0032" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>,
            ]
          : null,
    }));
  };

  const handleOpenCat = (data: any) => {
    setOpenCat(true);
    setCatData(data);
  };
  const getFormattedDataTable2 = (data: any[]) => {
    return data?.map((item, index) => ({
      trolleyUid: item?.uId ?? "N/A",
      trolleyName: item?.name ?? "N/A",
      color: item?.color ?? "N/A",
      createdAt: moment(item?.createdAt).format("lll") ?? "N/A",
      Action: [
        <Grid container justifyContent="center" key={index}>
          <Grid item xs={3}>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleOpenCat(item)}>
                <MdOutlineEdit color="#DC0032" />
              </IconButton>
            </Tooltip>
          </Grid>
          {/* <Grid item xs={3}>
            <Tooltip title="Delete">
              <IconButton onClick={() => handleOpenDelete(item?._id)}>
                <AiOutlineDelete />
              </IconButton>
            </Tooltip>
          </Grid> */}
        </Grid>,
      ],
    }));
  };

  return (
    <>
      {openCat && (
        <AddCategory
          open={openCat}
          setOpen={setOpenCat}
          getCategoryData={getTrolleyData}
          selectedDevice={catData}
        />
      )}
      {openAnimated && (
        <AnimatedTrolley
          open={openAnimated}
          setOpen={setOpenAnimated}
          trolleyId={trolleyData?._id}
          trolleyPath={trolleyData?.pathPointers}
        />
      )}
      {openDept && (
        <AssignDept
          open={openDept}
          setOpen={setOpenDept}
          trolleyId={trolleyId}
          getTrolleyData={getTrolleyData}
        />
      )}
      {openFilter && (
        <Filter
          open={openFilter}
          setOpen={setOpenFilter}
          getTrolleyData={getTrolleyData}
          selectedMen={selectedMen}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          setSelectedMen={setSelectedMen}
        />
      )}
      {/* {openMen && (
        <AssgnMen
          open={openMen}
          setOpen={setOpenMen}
          getTrolleyData={getTrolleyData}
          data={mensData}
        />
      )} */}
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
      <Grid container mt={1}>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems="center"
          p={2}
          sx={{ backgroundColor: "#FFFFFF", borderRadius: "8px" }}
        >
          <Grid item>
            <Typography variant="h5"> Trolleys Management</Typography>
            <Typography variant="body1">
              Showing {deviceData?.data?.length ?? 0} out of{" "}
              {deviceData?.totalCount} Trolleys{" "}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Grid container justifyContent={value === 0 ? "end" : "end"}>
              {value === 0 && (
                <Grid item sx={{ mr: 2 }}>
                  <Badge
                    badgeContent={badgeCount}
                    color="error"
                    overlap="circular"
                  >
                    <Button
                      startIcon={<FilterListIcon />}
                      variant="contained"
                      onClick={handleOpenFilter}
                      size="large"
                    >
                      Filter
                    </Button>
                  </Badge>
                </Grid>
              )}
              <Grid item xs={6}>
                <CustomTextField
                  type="search"
                  placeholder="Search ID / Name"
                  value={debouncedSearchQuery}
                  onChange={handleSearchChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <CustomTable
          page={page}
          loading={loading}
          rows={
            value === 0
              ? getFormattedData(deviceData?.data)
              : getFormattedDataTable2(deviceData?.data)
          }
          count={deviceData?.totalCount}
          columns={columns}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Grid>
    </>
  );
};
export default Table;
