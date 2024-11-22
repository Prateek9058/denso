"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Grid,
  Paper,
  Button,
  Box,
  Checkbox,
  TextField,
  Card,
  Typography,
} from "@mui/material";
type assignProps = {
  selectedPermissions: any;
  handleCheckboxChange: any;
};
type cardProps = {
  label: string;
  value: string;
  permission: object;
};

const RolesData: cardProps[] = [
  { label: "Username", value: "Manpower tracking", permission: {"manpower":true} },
  {
    label: "Email Address",
    value: "Trolley tracking",
    permission: {"trolley":true},
  },
  {
    label: "Phone Number",
    value: "Attendance details",
    permission: {"attandence":true},
  },
  { label: "Department", value: "User Management", permission:{"department":true} },
  { label: "Alerts", value: "Alerts", permission: {"Alerts":true} },
];
const UserPermission = ({
  selectedPermissions,
  handleCheckboxChange,
}: assignProps) => {
  console.log("persmissss",selectedPermissions)
  return (
    <Grid container spacing={2}>
      <Grid container spacing={2} mt={1.5}>
        {RolesData?.map((item, index) => (
          <Grid item xs={4} key={index} display={"flex"}>
            <Checkbox
              checked={selectedPermissions.includes(item.permission)}
              onChange={() => handleCheckboxChange(item.permission)}
            />
            <Card sx={{ width: "100%", p: 2, border: "1px solid #e5e5e5" }}>
              <Typography>{item?.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default UserPermission;
