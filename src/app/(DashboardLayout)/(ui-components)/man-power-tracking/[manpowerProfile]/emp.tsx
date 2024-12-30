import React from "react";
import { Grid } from "@mui/material";
import { MapContainer, ImageOverlay } from "react-leaflet";
import L from "leaflet";
import Site from "../../../../../../public/Img/Layoutdenso.png";
import "leaflet/dist/leaflet.css";

const EmpTrack: React.FC<any> = () => {
  const imageBounds: [[number, number], [number, number]] = [
    [0, 0],
    [100, 200],
  ];

  return (
    <Grid container mt={1} sx={{ position: "relative" }}>
      <Grid item md={12} sx={{ height: "600px", width: "100%" }}>
        <MapContainer
          center={[50, 100]}
          zoom={3}
          minZoom={2}
          style={{ height: "100%", width: "100%", zIndex: "5" }}
          crs={L.CRS.Simple}
        >
          <ImageOverlay url={Site.src} bounds={imageBounds} />
        </MapContainer>
      </Grid>
    </Grid>
  );
};
export default EmpTrack;
