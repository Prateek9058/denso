import React, { useState } from "react";
import { Grid } from "@mui/material";
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
const TrolleyRoute: React.FC<empProps> = ({ points, setPoints }) => {
  const transformY = (y: number) => {
    return 100 - y;
  };
  const transformPosition = (pos: any) => {
    return [transformY(pos?.x * 4 + 22), pos?.y * 4 + 16];
  };
  const AddPointOnClick = () => {
    useMapEvents({
      click(e) {
        const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
        setPoints([...points, newPoint]);
      },
    });
    return null;
  };

  const trolleyIcon = L.icon({
    iconUrl: trolleyIconSrc.src,
    iconSize: [35, 35],
    iconAnchor: [15, 15],
  });

  const imageBounds: [[number, number], [number, number]] = [
    [0, 0],
    [100, 200],
  ];
  return ( 
    <Grid
      item
      xs={12}
      md={12}
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
        <AddPointOnClick />
        {points.map(
          (point: L.LatLngExpression, index: React.Key | null | undefined) => (
            <Marker key={index} position={point} icon={trolleyIcon} />
          )
        )}
        {points.length > 1 && (
          <Polyline
            positions={points}
            pathOptions={{ color: "blue", dashArray: "5, 10" }}
          />
        )}
      </MapContainer>
    </Grid>
  );
};

export default TrolleyRoute;
