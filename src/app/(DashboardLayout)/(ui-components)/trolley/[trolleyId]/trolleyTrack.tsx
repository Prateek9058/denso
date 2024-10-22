import React, { useState, useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Polyline,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import Site from "../../../../../../public/Img/Layoutdenso.jpg";
import "leaflet/dist/leaflet.css";
import trolleyIconSrc from "../../../../../../public/Img/trolleyLive.png";
interface empProps {
  userDetails: any;
}
const EmpTrack: React.FC<empProps> = ({ userDetails }) => {
  const [trolleyPosition, setTrolleyPosition] =
    useState<L.LatLngExpression | null>(null);
  const [routeCovered, setRouteCovered] = useState<L.LatLngExpression[]>([]);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const movingRef = useRef(false);

  // const points: { position: L.LatLngExpression; label: string }[] = [
  //   { position: [27.015625, 9.6875], label: "A" },
  //   { position: [27.0625, 50.5], label: "B" },
  //   { position: [46.6875, 50.375], label: "C" },
  //   { position: [47.1875, 66.25], label: "D" },
  // ];
  const coordinates = [
    [9.234375, 9.03125],
    [9.140625, 18.03125],
    [9.203125, 27.09375],
    [26.78125, 27.0625],
    [26.96875, 35.1875],
    [5.09375, 35.0625],
    [5.03125, 49.125],
    [26.84375, 49.25],
    [27.5625, 66.125],
    [47.0625, 65.875],
    [47.3125, 93.5],
    [27.3125, 93.875],
    [27.0625, 102],
    [64.5625, 101.625],
    [78.8125, 101.5],
  ];

  const points = coordinates.map((coord: any, index: any) => ({
    position: coord,
    label: String.fromCharCode(65 + index),
  }));

  const trolleyIcon = L.icon({
    iconUrl: trolleyIconSrc.src,
    iconSize: [35, 35],
    iconAnchor: [15, 15],
  });
  const imageBounds: [[number, number], [100, 200]] = [
    [0, 0],
    [100, 200],
  ];
  const moveTrolley = (startPoint: any, endPoint: any) => {
    const steps = 100;
    let stepCount = 0;
    movingRef.current = true;
    const moveInterval = setInterval(() => {
      if (stepCount >= steps) {
        clearInterval(moveInterval);
        movingRef.current = false;
        setCurrentPointIndex((prevIndex) => prevIndex + 1);
        return;
      }
      const latStep = (endPoint[0] - startPoint[0]) / steps;
      const lngStep = (endPoint[1] - startPoint[1]) / steps;

      const newPosition: L.LatLngExpression = [
        startPoint[0] + latStep * stepCount,
        startPoint[1] + lngStep * stepCount,
      ];
      setTrolleyPosition(newPosition);
      setRouteCovered((prevRoute) => [...prevRoute, newPosition]);

      stepCount++;
    }, 200);
  };
  useEffect(() => {
    if (!movingRef.current && currentPointIndex < points.length - 1) {
      const startPoint = points[currentPointIndex].position;
      const endPoint = points[currentPointIndex + 1].position;

      setTrolleyPosition(startPoint);
      moveTrolley(startPoint, endPoint);
    }
  }, [currentPointIndex]);
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
          {points.map((point, index) => (
            <CircleMarker
              key={index}
              center={point.position}
              radius={5}
              fillColor="green"
              color="green"
              fillOpacity={1}
            >
              <Tooltip direction="top" permanent>
                <span>{point.label}</span>
              </Tooltip>
            </CircleMarker>
          ))}
          {trolleyPosition && (
            <Marker position={trolleyPosition} icon={trolleyIcon} />
          )}
          {routeCovered.length > 1 && (
            <Polyline
              positions={routeCovered}
              pathOptions={{ color: "red", dashArray: "5, 10" }}
            />
          )}
        </MapContainer>
      </Grid>
    </Grid>
  );
};

export default EmpTrack;
