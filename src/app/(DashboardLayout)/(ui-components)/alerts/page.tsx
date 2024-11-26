"use client";
import React, { useState } from "react";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
import NotificationsList from "./layoutNoti";
import Tabs from "@/app/(components)/mui-components/Tabs/CustomTab";
import Breadcrumb from "@/app/(components)/mui-components/Breadcrumbs";

interface TabData {
  label: string;
}
type Breadcrumb = {
  label: string;
  link: string;
};
const tabs: TabData[] = [{ label: "Unread" }, { label: "Read" }];
const breadcrumbItems: Breadcrumb[] = [
  { label: "Dashboard", link: "/" },
  { label: "Alerts ", link: "" },
];

const Page: React.FC = () => {
  const [value, setTabValue] = useState<number>(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const TabPanelList = [
    {
      component: <NotificationsList value={value} />,
    },
    {
      component: <NotificationsList value={value} />,
    },
  ];
  return (
    <>
      <ToastComponent />
      <Breadcrumb breadcrumbItems={breadcrumbItems} />
      <Tabs
        value={value}
        handleChange={handleChange}
        tabs={tabs}
        TabPanelList={TabPanelList}
      />
    </>
  );
};

export default Page;
