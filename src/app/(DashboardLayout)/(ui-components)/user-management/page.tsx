"use client";
import React, { useState } from "react";
import { Grid } from "@mui/material";
import UserManage from "./user-manage";
import Profile from "./(profile-manage)/profile";
import Tabs from "@/app/(components)/mui-components/Tabs/CustomTab";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
interface TabData {
  label: string;
}
const tabs: TabData[] = [{ label: "Profile" }, { label: "User management" }];
const Page: React.FC = () => {
  const [value, setTabValue] = useState<number>(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const TabPanelList = [
    {
      component: <Profile />,
    },
    {
      component: <UserManage />,
    },
  ];
  return (
    <Grid sx={{ padding: "12px 15px" }}>
      <ToastComponent />
      <Tabs
        value={value}
        handleChange={handleChange}
        tabs={tabs}
        TabPanelList={TabPanelList}
      />
    </Grid>
  );
};

export default Page;
