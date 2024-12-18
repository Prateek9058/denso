import React, { useState, useEffect, useMemo } from "react";
import { Grid } from "@mui/material";
<<<<<<< HEAD
import { MapContainer, ImageOverlay, Polyline, useMap } from "react-leaflet";
=======
import { MapContainer, ImageOverlay, Marker, Polyline } from "react-leaflet";
>>>>>>> 76501a798eddc66f992a8bdb5d0d39997f9d3afb
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
<<<<<<< HEAD

interface AnimatedMarkerProps {
  polyline: [number, number][];
  duration?: number;
}

const interpolatePosition = (
  start: [number, number],
  end: [number, number],
  t: number
): [number, number] => {
  if (!start || !end || start.length !== 2 || end.length !== 2) {
    console.error("Invalid input to interpolatePosition:", { start, end });
    return [0, 0]; // Default fallback position
  }
  return [
    start[0] + t * (end[0] - start[0]),
    start[1] + t * (end[1] - start[1]),
  ];
};

const AnimatedMarker: React.FC<AnimatedMarkerProps> = ({
  polyline,
  duration = 1000,
}) => {
  const map = useMap();
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);

  useEffect(() => {
    if (!marker && polyline.length > 0) {
      const icon = L.divIcon({
        html: `
          <div style="width: 20px; height: 20px; background-color: #ff4444; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>
        `,
        className: "",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const initialMarker = L.marker(polyline[0], { icon }).addTo(map);
      setMarker(initialMarker);
    }

    if (marker && polyline.length > 1) {
      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        const progress = Math.min(elapsed / duration, 1);
        const start = polyline[currentPointIndex];
        const end = polyline[(currentPointIndex + 1) % polyline.length];

        // Ensure both start and end are valid before calling interpolatePosition
        if (start && end) {
          const interpolatedPosition: [number, number] = interpolatePosition(
            start,
            end,
            progress
          );
          marker.setLatLng(interpolatedPosition);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCurrentPointIndex((prev) => (prev + 1) % polyline.length);
          startTime = null;
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [map, marker, polyline, duration, currentPointIndex]);

  return null;
};

const EmpTrack: React.FC<empProps> = ({ userDetails, trolleyCoordinates }) => {
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
=======
const EmpTrack: React.FC<empProps> = ({ trolleyCoordinates, trolleyPath }) => {
>>>>>>> 76501a798eddc66f992a8bdb5d0d39997f9d3afb
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
<<<<<<< HEAD

  const getDistance = (p1: [number, number], p2: [number, number]): number => {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
  };

  const getNearestAllowedPoint = (
    point: [number, number]
  ): [number, number] => {
    let nearestPoint: [number, number] = allowedCoordinates[0];
    let minDistance = Infinity;

    allowedCoordinates.forEach((allowedPoint) => {
      const distance = getDistance(point, allowedPoint);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = allowedPoint;
      }
    });

    return nearestPoint;
  };

  const buildGraph = (): { [key: string]: { [key: string]: number } } => {
    const graph: { [key: string]: { [key: string]: number } } = {};
    allowedCoordinates.forEach((point1) => {
      const pointKey1 = `${point1[0]},${point1[1]}`;
      graph[pointKey1] = {};
      allowedCoordinates.forEach((point2) => {
        if (point1 !== point2) {
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

  const findShortestPath = (
    start: [number, number],
    end: [number, number]
  ): [number, number][] => {
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
      let current = Array.from(unvisited).reduce((a, b) =>
        distances[a] < distances[b] ? a : b
      );

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

    const path: [number, number][] = [];
    let current = endKey;
    while (current) {
      const [lat, lng] = current.split(",").map(Number);
      path.unshift([lat, lng]);
      current = previous[current] || "";
    }
    return path;
  };

=======
>>>>>>> 76501a798eddc66f992a8bdb5d0d39997f9d3afb
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

<<<<<<< HEAD
  useEffect(() => {
    if (linePositions.length === 0) {
      return; 
    }

    const duration = 1000;
    const intervalId = setInterval(() => {
      setCurrentPointIndex(
        (prevIndex) => (prevIndex + 1) % linePositions.length
      );
    }, duration);

    return () => clearInterval(intervalId);
  }, [linePositions]);
=======
  
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
>>>>>>> 76501a798eddc66f992a8bdb5d0d39997f9d3afb
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
