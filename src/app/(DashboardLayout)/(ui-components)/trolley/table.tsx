"use client";
import React, { useState, useEffect } from "react";
import { Grid, Typography, IconButton, Tooltip, Chip } from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import CommonDialog from "@/app/(components)/mui-components/Dialog";
import Link from "next/link";
import moment from "moment";
import { FaMapLocation } from "react-icons/fa6";
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
  value: any;
  columns: any;
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
}) => {
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
  const getFormattedData = (data: any[]) => {
    return data?.map((item, index) => ({
      // sno: index + 1,
      trolleyUid: item?.uId ?? "N/A",
      name: item?.name ?? "N/A",
      trolleyMacId: item?.macId ?? "N/A",
      runningTime: item?.runningTime ?? "N/A",
      idealTime: item?.idealTime ?? "N/A",
      assignStatus: renderPowerStatus(item?.assingedTo?.length) ?? "",
      Action:
        value == 0
          ? [
              <Grid container justifyContent="center" key={index}>
                <Grid item xs={3}>
                  <Link href={`/trolley/${item?._id}`}>
                    <Tooltip title="Animated routes">
                      <IconButton size="small">
                        <FaMapLocation color="#DC0032" />
                      </IconButton>
                    </Tooltip>
                  </Link>
                </Grid>
                <Grid item xs={3}>
                  <Link href={`/trolley/${item?._id}`}>
                    <Tooltip title="View">
                      <IconButton size="small">
                        <BsEye color="#DC0032" />
                      </IconButton>
                    </Tooltip>
                  </Link>
                </Grid>
              </Grid>,
            ]
          : null,
    }));
  };

  const getFormattedDataTable2 = (data: any[]) => {
    console.log("table2 response data", data);
    return data?.map((item, index) => ({
      trolleyUid: item?.uId ?? "N/A",
      trolleyName: item?.name ?? "N/A",
      color: item?.color ?? "N/A",
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
          <Grid item>
            <CustomTextField
              type="search"
              placeholder="Search ID / Name"
              value={debouncedSearchQuery}
              onChange={handleSearchChange}
            />
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
