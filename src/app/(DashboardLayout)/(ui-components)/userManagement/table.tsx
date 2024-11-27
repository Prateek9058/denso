"use client";
import React, { useState, useEffect } from "react";
import { Grid, Typography, IconButton, Tooltip, Button } from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import CommonDialog from "@/app/(components)/mui-components/Dialog";
import Link from "next/link";
import TableSkeleton from "@/app/(components)/mui-components/Skeleton/tableSkeleton";
import { IoMdAddCircleOutline } from "react-icons/io";
import { BsEye } from "react-icons/bs";
import CustomTable from "@/app/(components)/mui-components/Table/customTable";
import AddUser from "@/app/(components)/pages/userManagement/addUser";
import Breadcrumb from "@/app/(components)/mui-components/Breadcrumbs";
import DeleteAction from "@/app/(components)/pages/userManagement/deleteUser";
interface TableProps {
  deviceData: any;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  searchQuery: string;
  loading: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  FetchUserDetails: any;
}
type Breadcrumb = {
  label: string;
  link: string;
};
const breadcrumbItems: Breadcrumb[] = [
  { label: "Dashboard", link: "/" },
  { label: "User ", link: "" },
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
  FetchUserDetails,
}) => {
  const columns = ["Sno.", "username", "Phone Number", "Department", "View"];
  const [open, setOpenDialog] = React.useState(false);
  const [openUser, setOpenUser] = useState<boolean>(false);
  const handleClickOpen = () => {
    setOpenUser(true);
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

  const handleConfirm = () => {
    handleCancel();
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const getFormattedData = (data: any[]) => {
    return data?.map((item, index) => ({
      sno: index + 1,
      fullName: item?.fullName ?? "N/A",
      phoneNumber: item?.phoneNumber ? item?.phoneNumber : "N/A",
      departmentId: item?.departmentId ? item?.departmentId?.name : "N/A",
      Action: [
        <Grid
          container
          alignItems={"center"}
          justifyContent="space-around"
          key={index}
        >
          <Link href={`/userManagement/${item?._id}`}>
            <Tooltip title="View">
              <IconButton size="small">
                <BsEye color="#DC0032" />
              </IconButton>
            </Tooltip>
          </Link>
          <DeleteAction id={item?._id} getFetchAllDetails={FetchUserDetails} />
        </Grid>,
      ],
    }));
  };

  return (
    <>
      <AddUser
        open={openUser}
        setOpen={setOpenUser}
        selectedDevice={""}
        FetchUserDetails={FetchUserDetails}
      />
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
        <Grid container justifyContent={"space-between"}>
          <Grid item>
            <Breadcrumb breadcrumbItems={breadcrumbItems} />
          </Grid>
          <Grid item>
            <Button
              onClick={handleClickOpen}
              startIcon={<IoMdAddCircleOutline />}
              variant="contained"
            >
              Add User
            </Button>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems="center"
          p={2}
          sx={{ backgroundColor: "#FFFFFF", borderRadius: "8px" }}
        >
          <Grid item>
            <Typography variant="h5"> User Management</Typography>
            <Typography variant="body1">
              Showing {deviceData?.data?.length ?? 0} out of{" "}
              {deviceData?.totalCount} User{" "}
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
