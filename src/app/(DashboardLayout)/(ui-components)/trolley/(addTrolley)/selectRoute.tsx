import React, { useState } from "react";
import { Grid, Box } from "@mui/material";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import Site from "../../../../../../public/Img/Layoutdenso.jpg";
import "leaflet/dist/leaflet.css";
import trolleyIconSrc from "../../../../../../public/Img/trolleyLive.png";
interface empProps {
  points: any;
  setPoints: any;
}
const SelectRoute: React.FC<empProps> = ({ points, setPoints }) => {






  return ( 
    <Grid
      item
      xs={12}
      md={12}
      sx={{ height: "550px", width: "200%", position: "relative",bgcolor:'black' }}
    >
      
    
    </Grid>
  );
};

export default SelectRoute;
