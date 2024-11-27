"use client";
import React from "react";
import { Grid } from "@mui/material";
import Profile from "@/app/(components)/pages/settings/profileDetials";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
const Page: React.FC = () => {
  return (
    <Grid>
      <ToastComponent />
      <Profile />
    </Grid>
  );
};

export default Page;
