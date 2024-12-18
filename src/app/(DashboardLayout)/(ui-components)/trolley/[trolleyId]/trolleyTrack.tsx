import React, { useState, useEffect, useMemo } from "react";
import { Grid } from "@mui/material";
import { MapContainer, ImageOverlay, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import allowedCoordinates from "@/app/(components)/pages/trolley/addTrolley/allowedCoordinates";
interface PointWithMarker {
  x: number;
  y: number;
  showMarker: boolean;
  _id: string;
}
interface empProps {
  trolleyCoordinates: PointWithMarker[];
  trolleyPath: PointWithMarker[];
}
const EmpTrack: React.FC<empProps> = ({ trolleyCoordinates, trolleyPath }) => {
  const [linePositions, setLinePositions] = useState<[number, number][]>([]);
  const [filteredCoordinates, setFilteredCoordinates] = useState<
    PointWithMarker[]
  >([]);
  const bounds: [[number, number], [number, number]] = useMemo(
    () => [
      [0, 0],
      [100, 220],
    ],
    []
  );
  useEffect(() => {
    if (trolleyCoordinates?.length > 0) {
      const filtered = trolleyCoordinates?.filter((point) =>
        allowedCoordinates?.some(
          (allowed) => allowed[0] === point.y && allowed[1] === point.x
        )
      );
      setFilteredCoordinates(filtered);
      const positions = trolleyPath?.map(
        (point) => [point?.x, point?.y] as [number, number]
      );
      setLinePositions(positions);
    }
  }, [trolleyCoordinates]);

  
  const customIcon = L.divIcon({
    html: `<div style="width: 12px; height: 12px; background-color: red; border-radius: 50%; border: 1px solid white;"></div>`,
    className: "",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
  const startIcon = L.divIcon({
    html: `<div style="width: 20px; height: 20px; background-color: green; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 50%; border: 2px solid white;">A</div>`,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
  const endIcon = L.divIcon({
    html: `<div style="width: 20px; height: 20px; background-color: red; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 50%; border: 2px solid white;">B</div>`,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
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
          {/* Background Image */}
          <ImageOverlay
            url="/Img/Layoutdenso.png"
            bounds={bounds}
            eventHandlers={{
              error: (e) => {
                console.error("Error loading image:", e);
              },
            }}
          />
          {/* Polyline */}
          <Polyline
            positions={linePositions}
            pathOptions={{ color: "black" }}
            weight={4}
            opacity={0.7}
            dashArray="5, 10"
          />
          {/* Render Markers for Valid Coordinates */}
          {filteredCoordinates?.map((point) => (
            <Marker
              key={point._id}
              position={[point?.y, point.x]}
              icon={customIcon}
            />
          ))}
          []
          {/* Start Marker (A) */}
          {linePositions?.length > 1 && (
            <Marker position={linePositions[0]} icon={startIcon} />
          )}
          {/* End Marker (B) */}
          {linePositions?.length > 1 && (
            <Marker
              position={linePositions[linePositions?.length - 1]}
              icon={endIcon}
            />
          )}
        </MapContainer>
      </Grid>
    </Grid>
  );
};
export default EmpTrack;
