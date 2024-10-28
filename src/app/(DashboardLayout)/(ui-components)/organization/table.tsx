"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Button,
} from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import CommonDialog from "@/app/(components)/mui-components/Dialog";
import Link from "next/link";
import moment from "moment";
import TableSkeleton from "@/app/(components)/mui-components/Skeleton/tableSkeleton";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { BsEye } from "react-icons/bs";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
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
  const columns = [
    "Sno.",
    "UId",
    value == 0 ? "Department" : value == 1 ? "Section" : "Line",
    "Created At",
    // "View",
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

  const getStatus = (str: string) => {
    if (str?.toUpperCase() === "PRESENT")
      return { status: "Present", color: "customChip activeGreen" };
    else return { status: "Absent", color: "customChip activeRed" };
  };
  const getStatusInfo = (ele: string, index: number) => {
    if (ele?.toUpperCase() === "PRESENT") {
      return [
        <Chip
          key={index}
          sx={{ width: "120px" }}
          className="customChip activeGreen"
          label={ele}
        />,
      ];
    } else {
      return [
        <Chip
          key={index}
          className={getStatus(ele)?.color}
          sx={{ width: "120px" }}
          label={getStatus(ele)?.status}
        />,
      ];
    }
  };

  const getFormattedData = (data: any[]) => {
    console.log("item organidation",data)

    return data?.map((item, index) => ({
      sno: index + 1,
      uId: item?.uId ?? "N/A",
      name: item?.name ? item?.name : "N/A",
      createAt: item?.createdAt ? moment(item?.createdAt).format("lll") : "N/A",
      // Action: [
      //   <Grid container justifyContent="center" key={index}>
      //     <Grid item>
      //       <Link href={`/man-power-tracking/${item?._id}`}>
      //         <Tooltip title="View">
      //           <IconButton size="small">
      //             <BsEye color="#DC0032" />
      //           </IconButton>
      //         </Tooltip>
      //       </Link>
      //     </Grid>
      //   </Grid>,
      // ],
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
              {" "}
              Showing {deviceData ? deviceData?.data?.length : 0} out of{" "}
              {deviceData?.totalCount}{" "}
              {value == 0 ? "Department" : value == 1 ? "Section" : "Line"}
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
            rowNumber={new Array(7).fill(0)}
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
