"use client";
import React, { useState, useEffect } from "react";
import { Grid, Typography, IconButton, Tooltip } from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import CommonDialog from "@/app/(components)/mui-components/Dialog";
import Link from "next/link";
import { TbTrolley } from "react-icons/tb";
import TableSkeleton from "@/app/(components)/mui-components/Skeleton/tableSkeleton";
import { BsEye } from "react-icons/bs";
import CustomTable from "@/app/(components)/mui-components/Table/customTable";
interface TableProps {
  deviceData: any;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  searchQuery: string;
  loading: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
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
}) => {
  const columns = [
    "ID",
    "Name",
    "Job Role",
    "Assign Trolleys",
    "Avg waiting",
    "Category",
    "Shift",
    "Action",
  ];
  const [open, setOpenDialog] = React.useState(false);
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

  const handleConfirm = () => {
    handleCancel();
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const getFormattedData = (data: any[]) => {
    return data?.map((item, index) => ({
      uId: item?.uId ?? "N/A",
      fullName: item?.fullName ? item?.fullName : "N/A",
      jobRole: item?.jobRole ?? "N/A",
      assignTrolley: item?.trolleyCount ?? "N/A",
      avgWaitingTime: item?.avgWaitingTime ?? "N/A",
      category: item?.category ?? "N/A",
      shiftName: item?.shift?.shiftName ?? "N/A",
      Action: [
        <Grid container justifyContent="center" key={index}>
          <Grid item xs={4}>
            <Link href={`/man-power-tracking/${item?._id}`}>
              <Tooltip title="View">
                <IconButton size="small">
                  <BsEye color="#DC0032" />
                </IconButton>
              </Tooltip>
            </Link>
          </Grid>
          <Grid item xs={4}>
            <Link href={`/man-power-tracking/${item?._id}`}>
              <Tooltip title="View">
                <IconButton size="small">
                  <TbTrolley color="#DC0032" />
                </IconButton>
              </Tooltip>
            </Link>
          </Grid>
        </Grid>,
      ],
    }));
  };
console.log("deviceData table",deviceData)
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
      <Grid container mt={2}>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems="center"
          p={2}
          sx={{ backgroundColor: "#FFFFFF", borderRadius: "8px" }}
        >
          <Grid item>
            <Typography variant="h5">
              {"Manpower Details | "}
              Showing {deviceData?.data?.length} out of {deviceData?.totalCount}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container justifyContent={"space-between"}>
              <Grid item className="customSearch">
                <CustomTextField
                  type="search"
                  placeholder="Search ID / Name"
                  value={debouncedSearchQuery}
                  onChange={handleSearchChange}
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
