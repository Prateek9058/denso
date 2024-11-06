"use client";
import React, { useState, useEffect } from "react";
import { Grid, Typography, IconButton, Tooltip } from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import CommonDialog from "@/app/(components)/mui-components/Dialog";
import Link from "next/link";
import moment from "moment";
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
  value:any;
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
}) => {
  const columns1 = [
    "Trolley ID",
    "Trolley name",
    "MAC ID",
    "Running Time" ,
     "Ideal Time",
    "Assign status" ,
    "Action" ,
  ];
  const columns2 = [
    "Trolley ID",
    "Trolley name",
    'Trolly color',
    'Date',
  ];
  
  const [open, setOpenDialog] = React.useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
console.log("deviceData123456",deviceData)
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    handleCancel();
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };
  const getFormattedData = (data: any[]) => {
    return data?.map((item, index) => ({
      // sno: index + 1,
      trolleyUid: item?.trolleyUid ?? "N/A",
      trolleyMacId: value == 0 ? item?.trolleyMacId ? item?.trolleyMacId : "N/A" : item?.uId ?? "N/A",
      purchaseDate: moment(item?.purchaseDate).format("lll") ?? "N/A",
      createdAt: moment(item?.createdAt).format("lll") ?? "N/A",
      zoneName: item?.zone ? `zone ${item?.zone}` : "N/A",
      Action: value == 0 ? [
        <Grid container justifyContent="center" key={index}>
          <Grid item>
            <Link href={`/trolley/${item?._id}`}>
              <Tooltip title="View">
                <IconButton size="small">
                  <BsEye color="#DC0032" />
                </IconButton>
              </Tooltip>
            </Link>
          </Grid>
        </Grid>,
      ] : null,
    }));
  };

  const getFormattedDataTable2 = (data: any[]) => {
    console.log("table2 response data", data)
    return data?.map((item, index) => ({
      // sno: index + 1,
      trolleyUid: item?.uId ?? "N/A",
      trolleyName: item?.name ?? "N/A",
      color:item?.color ?? "N/A",
      createdAt: moment(item?.createdAt).format("lll") ?? "N/A",
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
            <Typography variant="h5">
              {" "}
              Showing {deviceData ? deviceData?.data?.length : 0} out of{" "}
              {deviceData?.totalCount} Trolleys
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
        ) : value == 0 ? (
          <CustomTable
            page={page}
            rows={getFormattedData(deviceData?.data)}
            count={deviceData?.totalCount}
            columns={columns1}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        ) 
        :  (
          <CustomTable
            page={page}
            rows={getFormattedDataTable2(deviceData?.data)}
            count={deviceData?.totalCount}
            columns={columns2}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        )
        }
      </Grid>
    </>
  );
};
export default Table;
