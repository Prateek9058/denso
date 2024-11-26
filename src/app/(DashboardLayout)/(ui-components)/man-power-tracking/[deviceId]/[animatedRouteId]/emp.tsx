import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Stack,
  StepButton,
} from "@mui/material";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import Site from "../../../../../../../public/Img/layoutPsiborg.jpg";
import "leaflet/dist/leaflet.css";
import axiosInstance from "@/app/api/axiosInstance";
import trolleyIconSrc from "../../../../../../../public/Img/trolleyLive.png";
import { Rectangle } from "react-leaflet";
import moment from "moment";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import Tabs from "@/app/(components)/mui-components/Tabs/TabsZone";

interface TabData {
  label: string;
  color: string;
}
const tabs: TabData[] = [
  // {
  //   label: "All",
  //   color: "",
  // },
  {
    label: "Zone 1",
    color: "#00ffff",
  },
  {
    label: "Zone 2",
    color: "green",
  },
  {
    label: "Zone 3",
    color: "#ff00ff",
  },
];
interface empProps {
  userDetails: any;
  name: any;
}
const EmpTrack: React.FC<empProps> = ({ userDetails, name }) => {
  const imageBounds: [[number, number], [number, number]] = [
    [0, 0],
    [100, 200],
  ];

  const geofenceBounds: [[number, number], [number, number]] = [
    [8, 13],
    [39, 48],
  ];
  const geofenceBounds1: [[number, number], [number, number]] = [
    [39, 13],
    [58, 48],
  ];
  const geofenceBounds2: [[number, number], [number, number]] = [
    [58, 13],
    [78, 48],
  ];
  const [loading, setLoading] = useState<boolean>(false);
  const [employees, setEmployees] = useState<any>(null);
  const [positions, setPositions] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(dayjs());
  const [activeStep, setActiveStep] = React.useState(0);
  const getTrackData = async () => {
    const storedSite = localStorage.getItem("selectedSite");
    if (!storedSite) {
      console.error("No site selected");
      return;
    }
    if (!userDetails) {
      console.error("No user selected");
      return;
    }
    setLoading(true);
    try {
      const selectedHour = selectedTime?.format("HH");
      const selectedMinute = selectedTime?.format("mm");
      const res = await axiosInstance.get(
        `api/v1/employees/getNavigateData?siteId=${
          JSON.parse(storedSite)?._id
        }&employeeId=${userDetails}&startDate=${selectedDate?.format(
          "YYYY-MM-DD"
        )}&hour=${selectedHour}&minutes=${selectedMinute}`
      );
      if (res?.status === 200 || res?.status === 201) {
        const data = res?.data?.data;
        setEmployees(data);
        const positionData = data?.map((entry: any) => ({
          x: entry?.position?.x,
          y: entry?.position?.y,
        }));
        setPositions(positionData);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching employee tracking data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      getTrackData();
    }
  }, [selectedDate, selectedTime]);

  const transformY = (y: number) => {
    return 100 - y;
  };
  const transformPosition = (pos: any) => {
    return [transformY(pos?.x * 4 + 22), pos?.y * 4 + 16];
  };

  const createAvatarIcon = (name: any, i: any) => {
    const initials = name;
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${
        activeStep == i ? "#6DA430" : "blue"
      }; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; font-size: 14px;">${initials}</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };
  const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#6DA430",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#6DA430",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#6DA430",
    },
  }));
  const handleStepClick = (step: number) => {
    setActiveStep(step);
    document
      .getElementById(`step-${step}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <Grid container justifyContent={"space-between"} mt={1}>
      <Grid
        item
        md={12}
        sx={{ mb: 1, display: "flex", justifyContent: "end", gap: 1 }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
            />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["TimePicker"]}>
            <TimePicker
              label="Select Time"
              value={selectedTime}
              onChange={(newValue) => setSelectedTime(newValue)}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Grid>
      <Grid
        item
        xs={12}
        md={employees?.length > 0 ? 9.9 : 12}
        sx={{ height: "550px", width: "100%", position: "relative" }}
      >
        <MapContainer
          center={[50, 100]}
          zoom={3}
          minZoom={2}
          style={{ height: "100%", width: "100%", zIndex: "5" }}
          crs={L.CRS.Simple}
        >
          <ImageOverlay url={Site.src} bounds={imageBounds} />
          <Rectangle
            bounds={geofenceBounds}
            pathOptions={{ color: "#ff00ff" }}
          />
          <Rectangle
            bounds={geofenceBounds1}
            pathOptions={{ color: "green" }}
          />
          <Rectangle
            bounds={geofenceBounds2}
            pathOptions={{ color: "#00ffff" }}
          />

          {employees &&
            employees?.map((item: any, index: any) => (
              <Marker
                position={[
                  transformY(item?.position?.x * 4 + 22),
                  item?.position?.y * 4 + 16,
                ]}
                icon={createAvatarIcon(index + 1, index)}
                key={index}
              >
                <Popup>
                  <Box>
                    <Typography variant="subtitle1">Name : {name}</Typography>
                    <Typography variant="body2">
                      Zone : Zone{item?.zone}
                    </Typography>
                    <Typography variant="body2">
                      Time : {moment(item?.createdAt).format("lll")}
                    </Typography>
                  </Box>
                </Popup>
              </Marker>
            ))}

          {positions?.length > 0 && (
            <Polyline
              positions={positions.map((pos: any) => transformPosition(pos))}
              pathOptions={{ color: "blue", dashArray: "5, 10" }}
            />
          )}
        </MapContainer>
        <Tabs tabs={tabs} zone={true} value={-1} />
      </Grid>
      <Grid item xs={12} md={employees?.length > 0 ? 2 : 12}>
        <Stack sx={{ width: "100%", mt: 1 }}>
          <Box
            p={1}
            sx={{
              width: "100%",
              overflowY: "auto",
              height: "550px",
            }}
          >
            <Stepper
              orientation="vertical"
              nonLinear
              activeStep={activeStep}
              connector={<CustomStepConnector />}
            >
              {employees &&
                employees?.map((item: any, index: any) => (
                  <Step key={index} id={`step-${index}`}>
                    <StepButton onClick={() => handleStepClick(index)}>
                      <StepLabel
                        StepIconProps={{
                          sx: {
                            color: activeStep === index ? "#6DA430" : "#DC0032",
                            "& .MuiStepIcon-text": {
                              borderRadius: "50%",
                            },
                            "&.Mui-active": {
                              color: "#6DA430",
                              borderRadius: "50%",
                            },
                            "&.Mui-completed": {
                              color: "#6DA430",
                              borderRadius: "50%",
                            },
                          },
                        }}
                      >
                        <Typography variant="body2" color="primary">
                          Zone : {item?.zone}
                        </Typography>
                        <Typography variant="body2" color="info">
                          Time : {moment(item?.createdAt).format("lll")}
                        </Typography>
                      </StepLabel>
                    </StepButton>
                  </Step>
                ))}
            </Stepper>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EmpTrack;
