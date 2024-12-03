"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import salesIcon from "../../../../../public/Img/sales.png";
import deviceIcon from "../../../../../public/Img/alertsdash.png";
import users from "../../../../../public/Img/trolleydash.png";
import clock from "../../../../../public/Img/attendencedash.png";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import dynamic from "next/dynamic";
import ManpowerWaiting from "@/app/(components)/pages/dashboard/manPowerWaitingTime";
import TrolleyDetails from "@/app/(components)/pages/dashboard/trolleyDetails.tsx";
import TrolleyRepairTime from "@/app/(components)/pages/dashboard/trolleyRepairTime";
import TotalAlerts from "@/app/(components)/pages/dashboard/totalAlerts";
import NotificationList from "@/app/(components)/pages/dashboard/notificationList";
import axiosInstance from "@/app/api/axiosInstance";

const DynamicHeader = dynamic(
  () => import("../../../(components)/pages/track"),
  {
    ssr: false,
  }
);
const StatCard = styled(Card)<{ selected: boolean }>(({ theme, selected }) => ({
  borderRadius: "16px",
  backgroundColor: "#E8E8EA",
  color: "#000",
  fontWeight: "700",
  padding: "0px",
}));
const Page = () => {
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
      assigned: "0",
      notAssigned: "0",
      id: "totalRegisterDevice",
      icon: salesIcon,
    },
    {
      title: "Trolleys",
      value: 0,
      assigned: "0",
      notAssigned: "0",
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
  const fetchStatsData = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        "dashboard/dashboardData"
      );

      if (status === 200 && data?.data) {
        const finalData = data?.data;
        console.log("Check finalData", finalData);
        const statsData = [
          {
            title: "Manpower",
            value: finalData?.totalEmployees,
            assigned: finalData?.totalAssignedMenPower,
            notAssigned: finalData?.totalNotAssignedMenPower,
            id: "totalRegisterDevice",
            icon: salesIcon,
          },
          {
            title: "Trolleys",
            value: finalData?.totalTrolleys,
            assigned: finalData?.totalAssignedTrolleys,
            notAssigned: finalData?.totalNotAssignedTrolleys,
            id: "totalActiveDevice",
            icon: users,
          },
          {
            title: "Maintenance trolleys",
            value: finalData?.trolleyMaintenanceCount,
            change: `${finalData?.totalRepairedTrolleyMaintenance} , ${finalData?.totalNotRepairedTrolleyMaintenance}`,
            id: "totalUser",
            icon: clock,
          },
          {
            title: "Trolley running time",
            value: finalData?.totalRunningTrolley,
            change: `${finalData?.workingHours} , ${finalData?.waitingTime} `,
            id: "pendingSubscription",
            icon: deviceIcon,
          },
        ];

        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, []);
  console.log("Check stats", stats);

  return (
    <Grid>
      <Grid container spacing={2}>
        {stats?.map((stat: any) => (
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

                {stat.title === "Manpower" && (
                  <Box>
                    <Grid container spacing={1}>
                      <Grid item xs={12} mt={1}>
                        <LinearProgress
                          variant="determinate"
                          color="success"
                          value={72} // You can replace 72 with actual progress calculation logic
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            backgroundColor: "#CCCCCC",
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          style={{ color: "#227B52" }}
                        >
                          <span style={{ color: "#227B52", fontSize: "18px" }}>
                            ●
                          </span>{" "}
                          Assigned - {stat?.assigned}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          <span style={{ color: "#b0bec5" }}>●</span> Not
                          assigned - {stat?.notAssigned}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {stat.title === "Trolleys" && (
                  <Box>
                    <Grid container spacing={1}>
                      <Grid item xs={12} mt={1}>
                        <LinearProgress
                          variant="determinate"
                          color="success"
                          value={72} // You can replace 72 with actual progress calculation logic
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            backgroundColor: "#CCCCCC",
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          style={{ color: "#227B52" }}
                        >
                          <span style={{ color: "#227B52", fontSize: "18px" }}>
                            ●
                          </span>{" "}
                          Assigned - {stat?.assigned}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          <span style={{ color: "#b0bec5" }}>●</span> Not
                          assigned - {stat?.notAssigned}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {stat.title === "Maintenance trolleys" && (
                  <Box>
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
                      <Typography variant="body1" style={{ color: "#227B52" }}>
                        <span style={{ color: "#227B52", fontSize: "18px" }}>
                          ●
                        </span>{" "}
                        Repaired - {stat?.change.split(",")[0]}
                      </Typography>
                      <Typography variant="body1">
                        <span style={{ color: "#b0bec5", fontSize: "18px" }}>
                          ●
                        </span>{" "}
                        Not repaired - {stat?.change.split(",")[1]}
                      </Typography>
                    </Grid>
                  </Box>
                )}

                {stat.title === "Trolley running time" && (
                  <Box>
                    <Box mt={1}>
                      <LinearProgress
                        variant="determinate"
                        color="success"
                        value={72} // You can replace 72 with actual progress calculation logic
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: "#CCCCCC",
                        }}
                      />
                    </Box>
                    <Grid container justifyContent="space-between" mt={1}>
                      <Typography variant="body1" style={{ color: "#227B52" }}>
                        <span style={{ color: "#227B52", fontSize: "18px" }}>
                          ●
                        </span>{" "}
                        Worked time - {stat?.change.split(",")[0]}
                      </Typography>
                      <Typography variant="body1">
                        <span style={{ color: "#b0bec5", fontSize: "18px" }}>
                          ●
                        </span>{" "}
                        Waiting time - {stat?.change.split(",")[1]}
                      </Typography>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </StatCard>
          </Grid>
        ))}
      </Grid>

      {/* <Grid container>
        <Grid item md={12} xs={12}>
          <NotificationList />
        </Grid>
      </Grid> */}

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
