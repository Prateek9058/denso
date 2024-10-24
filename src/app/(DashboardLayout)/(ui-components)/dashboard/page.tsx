"use client";
import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
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
import ManpowerWaiting from "./manPowerWaitingTime";
import TrolleyDetails from "./trolleyDetails.tsx";
import TrolleyRepairTime from "./trolleyRepairTime";
import TotalAlerts from "./totalAlerts";
import NotificationList from "./notificationList";
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
      active: "0",
      assigned: "0",
      in: "0",
      nonActive: "0",
      notAssigned: "0",
      out: "0",
      id: "totalRegisterDevice",
      icon: salesIcon,
    },
    {
      title: "Trolleys",
      value: 0,
      active: "0",
      assigned: "0",
      in: "0",
      nonActive: "0",
      notAssigned: "0",
      out: "0",
      id: "totalActiveDevice",
      icon: users,
    },
    {
      title: "Maintenance trolleys",
      value: 0,
      change: "+7 from yesterday",
      id: "totalUser",
      icon: clock,
    },
    {
      title: "Trolley running time",
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
            active: "0",
            assigned: "0",
            in: "0",
            nonActive: "0",
            notAssigned: "0",
            out: "0",
            id: "totalRegisterDevice",
            icon: salesIcon,
          },
          {
            title: "Trolleys",
            value: data?.totalTrolleys,
            active: "0",
            assigned: "0",
            in: "0",
            nonActive: "0",
            notAssigned: "0",
            out: "0",
            id: "totalActiveDevice",
            icon: users,
          },
          {
            title: "Maintenance trolleys",
            value: 0,
            change: "+7 from yesterday",
            id: "totalUser",
            icon: clock,
          },
          {
            title: "Trolley running time",
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
                {(stat.title == "Manpower" || stat.title == "Trolleys") && (
                  <Box>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          <span style={{ color: "#227B52", fontSize: "18px" }}>
                            ●
                          </span>{" "}
                          Active - 100
                        </Typography>
                        <Typography variant="body1">
                          <span style={{ color: "#227B52", fontSize: "18px" }}>
                            ●
                          </span>{" "}
                          Assigned - 100
                        </Typography>
                        <Typography variant="body1">
                          <span style={{ color: "#227B52", fontSize: "18px" }}>
                            ●
                          </span>{" "}
                          In - 100
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          <span style={{ color: "#b0bec5" }}>●</span> Non-active
                          - 20
                        </Typography>
                        <Typography variant="body1">
                          <span style={{ color: "#b0bec5" }}>●</span>{" "}
                          Not-assigned - 20
                        </Typography>
                        <Typography variant="body1">
                          <span style={{ color: "#b0bec5" }}>●</span> Out - 20
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {(stat.title == "Maintenance trolleys" ||
                  stat.title == "Trolley running time") && (
                  <Box>
                    <Grid
                      container
                      spacing={1}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body1">
                        Average repair time
                      </Typography>
                      <Grid item>
                        <Typography variant="body1" display="inline">
                          4 H{" "}
                        </Typography>
                        <AccessTimeIcon fontSize="small" />
                      </Grid>
                    </Grid>

                    <Box mt={1}>
                      <LinearProgress
                        variant="determinate"
                        color="success"
                        value={72}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: "#CCCCCC",
                        }}
                      />
                    </Box>

                    <Grid container justifyContent="space-between" mt={1}>
                      <Typography variant="body2" style={{ color: "#227B52" }}>
                        <span style={{ color: "#227B52", fontSize: "18px" }}>
                          ●
                        </span>{" "}
                        Not repaired - 72
                      </Typography>
                      <Typography variant="body2">
                        <span style={{ color: "#b0bec5", fontSize: "18px" }}>
                          ●
                        </span>{" "}
                        Repaired - 17
                      </Typography>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </StatCard>
          </Grid>
        ))}
      </Grid>
      <Grid container>
        <Grid item md={12} xs={12}>
          <NotificationList />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <ManpowerWaiting />
        <TrolleyDetails />
      </Grid>

      <DynamicHeader />
      <Grid container spacing={2}>
        <TrolleyRepairTime />
        <TotalAlerts />
      </Grid>
    </Grid>
  );
};

export default Page;
