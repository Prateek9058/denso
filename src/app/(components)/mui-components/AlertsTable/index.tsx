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
import TableSkeleton from "@/app/(components)/mui-components/Skeleton/tableSkeleton";
import CustomTable from "@/app/(components)/mui-components/Table/customTable";
interface TableProps {
  deviceData?: any;
  loading?: boolean;
}
const AlertsTable: React.FC<TableProps> = ({ loading }) => {
  const columns = [
    "Alert",
    "Current Value",
    "Mac Id",
    "Temperature",
  ];
    return (
    <>
      <Grid container>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems="center"
          p={2}
          sx={{ backgroundColor: "#FFFFFF", borderRadius: "8px" }}
        >
          <Grid item>
            <Typography variant="h5">Alerts</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="medium"
              sx={{
                border: "1px solid #2D9CDB",
                color: "#2D9CDB",
                backgroundColor: "#fffff",
              }}
            >
              See All
            </Button>
          </Grid> 
        </Grid>{" "}
        {loading ? (
          <TableSkeleton
            rowNumber={new Array(10).fill(0)}
            tableCell={new Array(5).fill("15%")}
            actions={new Array(2).fill(0)}
          />
        ) : (
          <CustomTable rows={[]} columns={columns} pagination={true} />
        )}
      </Grid>
    </>
  );
};
export default AlertsTable;
