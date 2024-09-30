"use client";
import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { styled } from "@mui/system";
import salesIcon from "../../../../../public/Img/sales.png";
import deviceIcon from "../../../../../public/Img/alertsdash.png";
import users from "../../../../../public/Img/trolleydash.png";
import clock from "../../../../../public/Img/attendencedash.png";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import axiosInstance from "@/app/api/axiosInstance";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import { useSitesData } from "@/app/(context)/SitesContext";
import dynamic from "next/dynamic";
const DynamicHeader = dynamic(
  () => import("../../../(components)/pages/track"),
  {
    ssr: false,
  }
);
type Breadcrumb = {
  label: string;
  link: string;
};
const breadcrumbItems: Breadcrumb[] = [{ label: "Dashboard", link: "" }];
const StatCard = styled(Card)<{ selected: boolean }>(({ theme, selected }) => ({
  borderRadius: "16px",
  backgroundColor: "#E8E8EA",
  color: "#000",
  fontWeight: "700",
  padding: "0px",
}));
const Page = () => {
  const { selectedSite } = useSitesData();
  const [selectedCard, setSelectedCard] = useState<string | null>(
    "totalRegisterDevice"
  );
  const [selectedGraph, setSelectedGraph] = useState<string | null>(
    "Total Registered Devices"
  );
  const [stats, setStats] = useState([
    {
      title: "Manpower",
      value: 0,
      change: "+2 from yesterday",
      id: "totalRegisterDevice",
      icon: salesIcon,
    },
    {
      title: "Trolleys",
      value: 0,
      change: "+1 from yesterday",
      id: "totalActiveDevice",
      icon: users,
    },
    {
      title: "Attendance",
      value: 0,
      change: "+7 from yesterday",
      id: "totalUser",
      icon: clock,
    },
    {
      title: "Alerts",
      value: 0,
      change: "+6 from yesterday",
      id: "pendingSubscription",
      icon: deviceIcon,
    },
  ]);
  const handleCardClick = (id: string, title: string) => {
    setSelectedCard(selectedCard === id ? null : id);
    setSelectedGraph(selectedGraph === title ? null : title);
  };
  const getOverAllCount = useCallback(async () => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/dashboard/dashboardData/${selectedSite?._id}`
      );
      if (res?.status === 200 || res?.status === 201) {
        console.log(res);
        const data = res?.data?.data;
        const updatedStats = [
          {
            title: "Manpower",
            value: data?.totalEmployees,
            change: "+2 from yesterday",
            id: "totalRegisterDevice",
            icon: salesIcon,
          },
          {
            title: "Trolleys",
            value: data?.totalTrolleys,
            change: "+1 from yesterday",
            id: "totalActiveDevice",
            icon: users,
          },
          {
            title: "Attendance",
            value: data?.attendanceData,
            change: "+7 from yesterday",
            id: "totalUser",
            icon: clock,
          },
          {
            title: "Alerts",
            value: data?.totalAlerts,
            change: "+6 from yesterday",
            id: "pendingSubscription",
            icon: deviceIcon,
          },
        ];

        setStats(updatedStats);
      }
    } catch (err) {}
  }, [selectedSite]);
  useEffect(() => {
    getOverAllCount();
  }, [selectedSite]);

  return (
    <Grid sx={{ padding: "12px 15px" }}>
      <ManagementGrid
        moduleName="Dashboard"
        subHeading="Track manpower, Trolley location seamlessly"
        breadcrumbItems={breadcrumbItems}
      />
      <Grid container spacing={2}>
        {stats?.map((stat) => (
          <Grid item md={3} mt={2} sm={5.8} xs={12} key={stat?.id}>
            <StatCard
              key={stat?.id}
              selected={selectedCard === stat.id}
              onClick={() => handleCardClick(stat?.id, stat?.title)}
            >
              <CardContent>
                <Grid
                  container
                  alignItems="center"
                  justifyContent={"space-between"}
                  gap={1}
                  width={"100%"}
                >
                  <Grid>
                    <Typography variant="h5" color={"#767676"}>
                      {stat?.title}
                    </Typography>
                    <Typography variant="h3">{stat?.value}</Typography>
                  </Grid>
                  <Grid>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#E8E8EA",
                        border: "1px solid  #24AE6E1A",
                      }}
                    >
                      <Image src={stat?.icon} alt="icon" />
                    </Avatar>
                  </Grid>
                </Grid>
              </CardContent>
            </StatCard>
          </Grid>
        ))}
      </Grid>
      <DynamicHeader />
    </Grid>
  );
};

export default Page;
