"use client";
import React, { useState, useEffect } from "react";
import { Chip, Grid, Typography } from "@mui/material";
import CommonDialog from "@/app/(components)/mui-components/Dialog";
import moment from "moment";
import CommonDatePicker from "@/app/(components)/mui-components/Text-Field's/Date-range-Picker";
import TableSkeleton from "@/app/(components)/mui-components/Skeleton/tableSkeleton";
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
  getDataFromChildHandler: any;
}
const Table: React.FC<TableProps> = ({
  deviceData,
  rowsPerPage,
  setRowsPerPage,
  page,
  setPage,
  loading,
  getDataFromChildHandler,
}) => {
  const columns = ["Sno.", "Trolley ID", "Date & Time", "Issue", "Status"];
  const [open, setOpenDialog] = React.useState(false);
  const renderPowerStatus = (status: string) => (
    <Chip
      label={status === "not_repaired" ? "Not Repaired" : "Repaired"}
      variant="filled"
      sx={{
        backgroundColor: status === "not_repaired" ? "#F2F4F7" : "#ECFDF3",
        color: status === "not_repaired" ? "#364254" : "#037847",
        fontWeight: 500,
        minWidth: 110,
      }}
    />
  );

  const handleConfirm = () => {
    handleCancel();
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };
  const getFormattedData = (data: any[]) => {
    return data?.map((item, index) => ({
      sno: index + 1,
      repairId: item?.uId ?? "N/A",
      repairDate: moment(item?.createdAt).format("lll"),
      issue: item?.issue ?? "N/A",
      repairingStatus: renderPowerStatus(item?.status),
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
            <Typography variant="h3">Repairing History</Typography>
            <Typography variant="body1">
              {" "}
              Showing {deviceData ? deviceData?.data?.length : 0} out of{" "}
              {deviceData?.totalCount} History
            </Typography>
          </Grid>
          <Grid item>
            <Grid container justifyContent={"space-between"}>
              <Grid ml={2}>
                <CommonDatePicker
                  getDataFromChildHandler={getDataFromChildHandler}
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
