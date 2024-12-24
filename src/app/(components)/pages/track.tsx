"use client";
import React, { useState, useEffect } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axiosInstance from "@/app/api/axiosInstance";
import Site from "../../../../public/Img/Layoutdenso.png";
import trolleyIconSrc from "../../../../public/Img/trolleyLive.png";

const imageBounds: [[number, number], [number, number]] = [
  [0, 0],
  [100, 200],
];

export default function Track() {
  const [employees, setEmployees] = useState<any>(null);

  const trolleyIcon = L.icon({
    iconUrl: trolleyIconSrc.src,
    iconSize: [35, 35],
    iconAnchor: [15, 15],
  });
  const stringToColor = (string: string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  };

  const maxY = 100;
  const getInitials = (name: string) => {
    const nameParts = name?.split(" ");
    const initials = nameParts?.map((part) => part?.charAt(0)).join("");
    return initials;
  };
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
    <>
      <Grid container mt={2} sx={{ position: "relative" }}>
        <Grid item md={12} sx={{ height: "500px", width: "100%" }}>
          <MapContainer
            center={[50, 100]}
            zoom={3}
            minZoom={2}
            style={{ height: "100%", width: "100%", zIndex: "5" }}
            crs={L.CRS.Simple}
          >
            <ImageOverlay url={Site.src} bounds={imageBounds} />
            {employees && (
              <>
                {employees?.employeeData?.map((employee: any, index: any) => (
                  <Marker
                    key={index}
                    position={[
                      transformY(
                        parseFloat(employee?.positions?.x?.toFixed(2)) * 4 + 22
                      ) || 0,
                      parseFloat(employee?.positions?.y?.toFixed(2)) * 4 + 16 ||
                        0,
                    ]}
                    icon={createAvatarIcon(employee?.fullName)}
                  >
                    <Popup>
                      <Box>
                        <Typography variant="subtitle1">
                          {employee?.fullName}
                        </Typography>
                        <Typography variant="body2">
                          {" "}
                          Job role : {employee?.jobRole}
                        </Typography>
                      </Box>
                    </Popup>
                  </Marker>
                ))}
                {employees?.trolleyData?.map((trolley: any, index: any) => (
                  <Marker
                    key={index}
                    position={[
                      transformY(trolley?.positions?.x.toFixed(2) * 4 + 22),
                      trolley?.positions?.y.toFixed(2) * 4 + 16,
                    ]}
                    icon={trolleyIcon}
                  >
                    <Popup>
                      <Box>
                        <Typography variant="subtitle1">
                          {trolley?.trolleyUid}
                        </Typography>
                      </Box>
                    </Popup>
                  </Marker>
                ))}
              </>
            )}
          </MapContainer>
        </Grid>
      </Grid>
    </>
  );
}
