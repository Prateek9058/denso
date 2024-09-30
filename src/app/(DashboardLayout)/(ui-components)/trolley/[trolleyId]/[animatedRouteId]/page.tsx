"use client";
import React from "react";
import { Grid } from "@mui/material";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import { useParams } from "next/navigation";
import EmpTrack from "./emp";
type Breadcrumb = {
  label: string;
  link: string;
};
const Page: React.FC = () => {
  const { trolleyId, animatedRouteId } = useParams<{
    trolleyId: string;
    animatedRouteId: string;
  }>();
  const breadcrumbItems: Breadcrumb[] = [
    { label: "Dashboard", link: "/" },
    { label: "Trolley Tracking ", link: "/trolley" },
    {
      label: trolleyId,
      link: `/trolley/${trolleyId}`,
    },
    {
      label: animatedRouteId,
      link: "",
    },
  ];
  return (
    <Grid sx={{ padding: "12px 15px" }}>
      <ManagementGrid
        moduleName="Trolley Details"
        subHeading="Animated route"
        breadcrumbItems={breadcrumbItems}
      />
      <EmpTrack userDetails={trolleyId} name={animatedRouteId} />
    </Grid>
  );
};

export default Page;
