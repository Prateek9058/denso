import React, { useState, useEffect, useMemo } from "react";
import { Grid } from "@mui/material";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Polyline,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PointWithMarker {
  x: number;
  y: number;
  showMarker: boolean;
  _id: string;
}
interface empProps {
  userDetails: any;
  trolleyCoordinates: PointWithMarker[];
}
interface AnimatedMarkerProps {
  points: PointWithMarker[];
  currentPointIndex: number;
}
const AnimatedMarker: React.FC<AnimatedMarkerProps> = ({
  points,
  currentPointIndex,
}) => {
  const map = useMap();
  const [marker, setMarker] = useState<L.Marker | null>(null);
  // console.log('points1233333',points)
  console.log("currentPointIndex233333", currentPointIndex);

  useEffect(() => {
    if (!marker) {
      const icon = L.divIcon({
        html: `
          <div style="
            width: 20px;
            height: 20px;
            background-color: #ff4444;
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
          "></div>
        `,
        className: "",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const newMarker = L?.marker([points[0]?.x, points[0]?.y], { icon });
      newMarker.addTo(map);
      setMarker(newMarker);
    } else {
      const currentPoint = points[currentPointIndex];
      const newLatLng = L.latLng(currentPoint?.x, currentPoint?.y);

      marker.setLatLng(newLatLng);
    }
  }, [map, marker, points, currentPointIndex]);

  return null;
};

const EmpTrack: React.FC<empProps> = ({ userDetails, trolleyCoordinates }) => {
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const bounds: [[number, number], [number, number]] = useMemo(
    () => [
      [0, 0],
      [100, 220],
    ],
    []
  );
  let markerCounter = 1;

  const getNumberedIcon = (number: number) => {
    return L.divIcon({
      html: `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25px;
          height: 25px;
          background-color: #ff4444;
          border-radius: 50%;
          color: white;
          font-size: 14px;
          border: 2px solid white;
          box-shadow: 0 0 5px rgba(0,0,0,0.3);
        ">${number}</div>
      `,
      className: "",
      iconSize: [25, 25],
      iconAnchor: [12, 12],
    });
  };

  useEffect(() => {
    console.log("trolleyCoordinateskkk", trolleyCoordinates?.length);
    const duration = 1000;
    const intervalId = setInterval(() => {
      setCurrentPointIndex(
        (prevIndex) => (prevIndex + 1) % trolleyCoordinates?.length
      );
    }, duration);

    return () => clearInterval(intervalId);
  }, [trolleyCoordinates]);

  const linePositions: [number, number][] = useMemo(
    () => trolleyCoordinates?.map((point) => [point.x, point.y]),
    [trolleyCoordinates]
  );

  return (
    <Grid container mt={1}>
      <Grid item md={12} sx={{ height: "600px", width: "100%" }}>
        <MapContainer
          center={[50, 100]}
          zoom={2}
          minZoom={1}
          maxZoom={3}
          style={{ height: "100%", width: "100%" }}
          crs={L.CRS.Simple}
          maxBounds={[
            [-10, -10],
            [110, 210],
          ]}
          maxBoundsViscosity={1.0}
        >
          <ImageOverlay
            url="/Img/Layoutdenso.png"
            bounds={bounds}
            eventHandlers={{
              error: (e) => {
                console.error("Error loading image:", e);
              },
            }}
          />
          {/* <Polyline
            positions={linePositions}
            pathOptions={{ color: "black" }}
            weight={2}
            opacity={0.7}
            dashArray="5, 10"
          /> */}
          {/* {trolleyCoordinates?.map(
            (point, index) =>
              point.showMarker && (
                <Marker
                  key={`static-${index}`}
                  position={[point.x, point.y]}
                  icon={getNumberedIcon(markerCounter++)}
                />
              )
          )} */}
          <AnimatedMarker
            points={trolleyCoordinates}
            currentPointIndex={currentPointIndex}
          />
        </MapContainer>
      </Grid>
    </Grid>
  );
};

export default EmpTrack;
