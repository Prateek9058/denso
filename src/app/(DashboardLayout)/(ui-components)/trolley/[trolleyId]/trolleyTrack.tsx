import React, { useState, useEffect } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Site from "../../../../../../public/Img/layoutPsiborg.jpg";
import "leaflet/dist/leaflet.css";
import axiosInstance from "@/app/api/axiosInstance";
import trolleyIconSrc from "../../../../../../public/Img/trolleyLive.png";
import { Rectangle } from "react-leaflet";

interface empProps {
  userDetails: any;
}
const EmpTrack: React.FC<empProps> = ({ userDetails }) => {
  const imageBounds: [[number, number], [number, number]] = [
    [0, 0],
    [100, 200],
  ];
  const geofenceBounds: [[number, number], [number, number]] = [
    [8, 13],
    [38, 48],
  ];
  const geofenceBounds1: [[number, number], [number, number]] = [
    [38, 13],
    [58, 48],
  ];
  const geofenceBounds2: [[number, number], [number, number]] = [
    [58, 13],
    [78, 48],
  ];
  const [loading, setLoading] = useState<boolean>(false);
  const [employees, setEmployees] = useState<any>(null);
  const trolleyIcon = L.icon({
    iconUrl: trolleyIconSrc.src,
    iconSize: [35, 35],
    iconAnchor: [15, 15],
  });
  const stringToColor = (string: string) => {
    let hash = 0;
    for (let i = 0; i < string?.length; i++) {
      hash = string?.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  };
  const getTrackData = async () => {
    const storedSite = localStorage.getItem("selectedSite");
    if (!storedSite) {
      console.error("No site selected");
      return;
    }
    if (!userDetails) {
      console.error("No site selected");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `api/v1/employees/getEmployeeAndTrolleyGraphData?siteId=${
          JSON.parse(storedSite)?._id
        }&trolleyId=${userDetails}`
      );
      if (res?.status === 200 || res?.status === 201) {
        console.log(res);
        setEmployees(res?.data?.data);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setLoading(false);
    }
  };
  useEffect(() => {
    getTrackData();
    const intervalId = setInterval(() => {
      getTrackData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);
  const maxY = 100;
  const getInitials = (name: string) => {
    const nameParts = name?.split(" ");
    const initials = nameParts?.map((part) => part?.charAt(0)).join("");
    return initials;
  };
  console.log(employees?.positions?.x);
  const createAvatarIcon = (name: string) => {
    const initials = getInitials(name);
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="
              background-color: ${stringToColor(name)};
              color: white;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              display: flex;
              justify-content: center; 
              align-items: center;
              font-size: 14px;">
              ${initials}
            </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };
  const transformY = (y: number) => {
    console.log(y);
    return maxY - y;
  };
  return (
    <Grid container mt={1}>
      <Grid item md={12} sx={{ height: "600px", width: "100%" }}>
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
          {employees && (
            <Marker
              position={[
                transformY(
                  parseFloat(employees?.positions?.x?.toFixed(2)) * 4 + 22
                ) || 0,
                parseFloat(employees?.positions?.y?.toFixed(2)) * 4 + 16 || 0,
              ]}
              icon={trolleyIcon}
            >
              <Popup>
                <Box>
                  <Typography variant="subtitle1">
                    {employees?.trolleyUid}
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </Grid>
    </Grid>
  );
};

export default EmpTrack;
