"use client";
import React, { useState, useRef, useEffect } from "react";
import { Grid, Paper, Button, Box } from "@mui/material";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import DeleteIcon from "@mui/icons-material/Delete";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import allowedCoordinates from "./allowedCoordinates";

type Point = [number, number];

interface PointWithMarker {
  x: number;
  y: number;
  showMarker: boolean;
}
interface TrolleyRouteProps {
  points: PointWithMarker[];
  setPoints: React.Dispatch<React.SetStateAction<PointWithMarker[]>>;
}
interface Graph {
  [key: string]: { [key: string]: number };
}

const TrolleyRoute: React.FC<TrolleyRouteProps> = ({ points, setPoints }) => {
  const coordInfoRef = useRef<HTMLDivElement>(null);
  let markerCounter = 1;
  useEffect(() => {
    const img = new Image();
    img.src = "/Img/Layoutdenso.png";
  }, []);

  useEffect(() => {
    const activeMarkers: Point[] = points
      .filter((point) => point.showMarker)
      .map((point) => [point.x, point.y] as Point);
  }, [points]);

  const getDistance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
  };

  const buildGraph = (): Graph => {
    const graph: Graph = {};
    allowedCoordinates?.forEach((point1, i) => {
      const pointKey1 = `${point1[0]},${point1[1]}`;
      graph[pointKey1] = {};
      allowedCoordinates?.forEach((point2, j) => {
        if (i !== j) {
          const pointKey2 = `${point2[0]},${point2[1]}`;
          const distance = getDistance(point1, point2);
          if (distance < 3) {
            graph[pointKey1][pointKey2] = distance;
          }
        }
      });
    });
    return graph;
  };
  console.log("markerCounter", markerCounter);
  const findShortestPath = (start: Point, end: Point): Point[] => {
    const graph = buildGraph();
    const startKey = `${start[0]},${start[1]}`;
    const endKey = `${end[0]},${end[1]}`;
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const unvisited = new Set<string>();

    Object.keys(graph).forEach((vertex) => {
      distances[vertex] = Infinity;
      previous[vertex] = null;
      unvisited.add(vertex);
    });
    distances[startKey] = 0;

    while (unvisited.size > 0) {
      let minDistance = Infinity;
      let current = "";
      unvisited.forEach((vertex) => {
        if (distances[vertex] < minDistance) {
          minDistance = distances[vertex];
          current = vertex;
        }
      });

      if (current === endKey) break;
      unvisited.delete(current);

      Object.entries(graph[current] || {}).forEach(([neighbor, distance]) => {
        if (unvisited.has(neighbor)) {
          const alt = distances[current] + distance;
          if (alt < distances[neighbor]) {
            distances[neighbor] = alt;
            previous[neighbor] = current;
          }
        }
      });
    }

    const path: Point[] = [];
    let current = endKey;
    while (current) {
      const [lat, lng] = current.split(",").map(Number);
      path.unshift([lat, lng]);
      current = previous[current] || "";
    }
    return path;
  };

  const getNearestAllowedPoint = (lat: number, lng: number): Point => {
    return allowedCoordinates.reduce((nearest, point) => {
      const distance = getDistance([lat, lng], point);
      const currentDistance = getDistance([lat, lng], nearest);
      return distance < currentDistance ? point : nearest;
    }, allowedCoordinates[0]);
  };

  const MapClickHandler: React.FC = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const newPoint = getNearestAllowedPoint(lat, lng);

        setPoints((prev) => {
          if (prev.length === 0) {
            return [{ x: newPoint[0], y: newPoint[1], showMarker: true }];
          }

          const lastPoint = prev[prev.length - 1];
          const path = findShortestPath([lastPoint.x, lastPoint.y], newPoint);
          const pathWithMarkers = path.slice(1).map((point, index, array) => ({
            x: point[0],
            y: point[1],
            showMarker: index === array.length - 1,
          }));
          return [...prev, ...pathWithMarkers];
        });

        if (coordInfoRef.current) {
          coordInfoRef.current.textContent = `Clicked at: (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
        }
      },
      mousemove(e) {
        const { lat, lng } = e.latlng;
        if (coordInfoRef.current) {
          coordInfoRef.current.textContent = `Coordinates: (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
        }
      },
    });
    return null;
  };

  const getNumberedIcon = (number: number) => {
    console.log("markerCounterjj", number);
    return L.divIcon({
      html: `<div style="display: flex; align-items: center; justify-content: center;
              width: 25px; height: 25px; background-color: red; border-radius: 50%; color: white;
              font-size: 14px;">${number}</div>`,
      className: "",
      iconSize: [25, 25],
      iconAnchor: [12, 12],
    });
  };

  const handleMarkerClick = (point: PointWithMarker) => {
    setPoints((prevPoints) =>
      prevPoints.filter((p) => p?.x !== point?.x || p?.y !== point?.y)
    );
  };

  const imageBounds: [[number, number], [number, number]] = [
    [0, 0],
    [100, 220],
  ];

  console.log("points", points);
  return (
    <Grid container spacing={2} zIndex={1}>
      <Grid item xs={12}>
        <Paper
          elevation={3}
          sx={{ height: "550px", position: "relative", overflow: "hidden" }}
        >
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
            <ImageOverlay url="/Img/Layoutdenso.png" bounds={imageBounds} />
            <MapClickHandler />

            {points.map((point, index) => (
              <React.Fragment key={`${point.x}-${point.y}-${index}`}>
                {point.showMarker && (
                  <Marker
                    position={[point.x, point.y]}
                    icon={getNumberedIcon(markerCounter++)}
                    eventHandlers={{
                      click: () => handleMarkerClick(point),
                    }}
                  />
                )}
                {index < points.length - 1 && (
                  <Polyline
                    positions={[
                      [point.x, point.y],
                      [points[index + 1].x, points[index + 1].y],
                    ]}
                    pathOptions={{ color: "black" }}
                    // weight={3}
                    // opacity={0.7}
                    // dashArray="5, 10"
                  />
                )}
              </React.Fragment>
            ))}
          </MapContainer>

          <Paper
            ref={coordInfoRef}
            sx={{
              position: "absolute",
              top: 106,
              left: 16,
              padding: "4px 8px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: 1000,
            }}
          />

          <Box
            sx={{ position: "absolute", bottom: 16, left: 16, zIndex: 1000 }}
          >
            <Button
              startIcon={<DeleteIcon />}
              onClick={() => setPoints([])}
              color="error"
              disabled={points.length === 0}
              variant="contained"
            >
              Clear Route
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TrolleyRoute;
