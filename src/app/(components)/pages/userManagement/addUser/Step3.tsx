"use client";
import React, { useState, useRef, useEffect } from "react";
import { Grid, Checkbox, TextField, Card, Typography } from "@mui/material";
type assignProps = {
  selectedPermissions: any;
  handleCheckboxChange: any;
};
type cardProps = {
  value: string;
  permission: object;
};

const RolesData: cardProps[] = [
  {
    value: "Manpower tracking",
    permission: { manpowerTracking: true },
  },
  {
    value: "Trolley tracking",
    permission: { trolleyTracking: true },
  },
  {
    value: "Trolley  Maintenance",
    permission: { maintenance: true },
  },
  {
    value: "User Management",
    permission: { user: true },
  },
  { value: "Department", permission: { department: true } },
  { value: "Alerts", permission: { alerts: true } },
  { value: "Setting", permission: { setting: true } },
];
const UserPermission = ({
  selectedPermissions,
  handleCheckboxChange,
}: assignProps) => {
  return (
    <>
      <Typography variant="h6"> Select Access Permission</Typography>
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
    </>
  );
};

export default UserPermission;
