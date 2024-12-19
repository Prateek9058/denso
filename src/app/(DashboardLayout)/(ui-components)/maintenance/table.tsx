"use client";
import React, { useState, useEffect } from "react";
import { Grid, Typography, IconButton, Tooltip, Chip } from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import CommonDialog from "@/app/(components)/mui-components/Dialog";
import Link from "next/link";
import moment from "moment";
import TableSkeleton from "@/app/(components)/mui-components/Skeleton/tableSkeleton";
import { BsEye } from "react-icons/bs";
import CommonDatePicker from "@/app/(components)/mui-components/Text-Field's/Date-range-Picker";
import CustomTable from "@/app/(components)/mui-components/Table/customTable";
import Breadcrumb from "@/app/(components)/mui-components/Breadcrumbs";

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
type Breadcrumb = {
  label: string;
  link: string;
};
const breadcrumbItems: Breadcrumb[] = [
  { label: "Dashboard", link: "/" },
  { label: "Maintenance ", link: "" },
];
const Table: React.FC<TableProps> = ({
  deviceData,
  rowsPerPage,
  setRowsPerPage,
  page,
  setPage,
  searchQuery,
  setSearchQuery,
  loading,
  getDataFromChildHandler,
}) => {
  const columns = [
    "Sno.",
    "Trolley ID",
    "Date",
    "Issue",
    "Repair time",
    "Status",
    "View",
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    handleCancel();
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };
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

  const getFormattedData = (data: any[]) => {
    return data?.map((item, index) => ({
      sno: index + 1,
      uId: item?.uId ?? "N/A",
      createdAt: moment(item?.createdAt).format("lll") ?? "N/A",
      trolleyMacId: item?.trolleyMacId ? item?.trolleyMacId : "N/A",

      avgRepairTime: item?.avgRepairTime
        ? `${item?.avgRepairTime} ${item?.unit}`
        : "0 ",
      status: item?.status ? renderPowerStatus(item?.status) : "N/A",
      Action: [
        <Grid container justifyContent="center" key={index}>
          <Grid item>
            <Link href={`/maintenance/${item?._id}`}>
              <Tooltip title="View">
                <IconButton size="small">
                  <BsEye color="#DC0032" />
                </IconButton>
              </Tooltip>
            </Link>
          </Grid>
        </Grid>,
      ],
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
      <Grid container>
        <Grid item>
          <Breadcrumb breadcrumbItems={breadcrumbItems} />
        </Grid>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems="center"
          p={2}
          sx={{ backgroundColor: "#FFFFFF", borderRadius: "8px" }}
        >
          <Grid item>
            <Typography variant="h5">Maintenance Management</Typography>
            <Typography variant="body1">
              Showing {deviceData?.data?.length ?? 0} out of{" "}
              {deviceData?.totalCount ?? 0} Trolleys
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
