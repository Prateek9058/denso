import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Button,
  Badge,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import Image from "next/image";
import Trolley from "../../../../../../public/Img/trolleyDashboard.png";
import Filter from "./filter";
import axiosInstance from "@/app/api/axiosInstance";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const TrolleyDetails = () => {
  const [open, setOpen] = React.useState(false);
  const [trolleysData, setTrolleysData] = useState<any>([]);

  const chartData = [
    {
      name: "Total trolleys",
      value: trolleysData?.trolleyCount,
      color: "#E30613",
      unit: null,
    },
    {
      name: "Running time",
      value:
        trolleysData?.runningTime?.length > 0
          ? trolleysData?.runningTime?.map(
              (item: any) => item?.runningTimeValue
            )
          : 0,
      color: "#4A4A4A",
      unit: trolleysData?.runningTime?.map((item: any) => item?.unit),
    },
    {
      name: "Idle time",
      value:
        trolleysData?.idleTime?.map((item: any) => item?.idleTimeValue) || 0,
      color: "#008000",
      unit: trolleysData?.idleTime?.map((item: any) => item?.unit),
    },
  ];
  const [trolley, setTrolley] = useState<any>([]);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleTrolleyData = async (
    trolley?: any,
    startDate?: any,
    endDate?: any
  ) => {
    try {
      const filter = {
        trolleyIds: trolley ?? [],
      };
      const encodedFilter = encodeURIComponent(JSON.stringify(filter));

      const { data, status } = await axiosInstance.get(
        `/dashboard/getdashboardTrolleyGraphData?filter=${encodedFilter}&startDate=${startDate}&endDate=${endDate}`
      );
      if (status === 200 || status === 201) {
        setTrolleysData(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    handleTrolleyData();
  }, []);
  const badgeCount = [trolley.length > 0 ? 1 : null]?.filter(Boolean)?.length;

  return (
    <Grid mt={2} item md={6} sm={12} xs={12} sx={{ height: "100%" }}>
      {open && (
        <Filter
          open={open}
          setOpen={setOpen}
          setTrolley={setTrolley}
          trolley={trolley}
          handleTrolleyData={handleTrolleyData}
        />
      )}
      <Grid
        sx={{
          backgroundColor: "white",
          borderRadius: "10px",
          minHeight: "470px",
        }}
        p={2}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Trolley details</Typography>
          <Grid>
            <Badge badgeContent={badgeCount} color="error" overlap="circular">
              <Button
                variant="contained"
                size="medium"
                startIcon={<FilterListIcon sx={{ color: "white" }} />}
                onClick={handleOpen}
              >
                Filter
              </Button>
            </Badge>
          </Grid>
        </Grid>
        <Grid container mt={1} spacing={2} justifyContent="center">
          {chartData.map((item, index) => (
            <Grid item xs={12} sm={4} textAlign="center" key={index}>
              <Typography variant="h6" color={"#767676"}>
                {item?.name}
              </Typography>
              <Typography variant="h4" mb={1}>
                {" "}
                {item.value}{" "}
                {item.name.includes("time") ? item?.unit : "trolleys"}
              </Typography>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "250px",
                  height: "auto",
                  aspectRatio: "1",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Doughnut
                  data={{
                    labels: ["Used"],
                    datasets: [
                      {
                        label: item.name,
                        data: [item.value, 100 - item.value],
                        backgroundColor: [item.color, "#E0E0E0"],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        enabled: true,
                      },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "70%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                  }}
                >
                  {/* <Typography variant="h6">{item.value}</Typography>
                  <Typography variant="body2">
                    {item.name.includes("time") ? "minutes" : "trolleys"}
                  </Typography> */}
                  <Image src={Trolley} alt="Trolley" width={40} />
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
        <Grid container mt={0.5} spacing={1} justifyContent="center">
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6" color={"#767676"}>
              <span style={{ color: "#DC0032", fontSize: "24px" }}>●</span>{" "}
              Total trolleys
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6" color={"#767676"}>
              <span style={{ color: "#4C4C4C", fontSize: "24px" }}>●</span>{" "}
              Running time
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6" color={"#767676"}>
              <span style={{ color: "#227B52", fontSize: "24px" }}>●</span> Idle
              Idle time
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default TrolleyDetails;
