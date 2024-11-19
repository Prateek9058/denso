"use client";
import React, { useState } from "react";
import { Grid } from "@mui/material";
import Profile from "@/app/(components)/pages/user-Manangement/profileDetials";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
interface TabData {
  label: string;
}
const tabs: TabData[] = [{ label: "Profile" }, { label: "User management" }];
const Page: React.FC = () => {
  return (
    <Grid sx={{ padding: "12px 15px" }}>
      <ToastComponent />
      <Profile />
    </Grid>
  );
};

export default Page;
