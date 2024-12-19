import React, { useState, useEffect, useMemo } from "react";
import { Grid } from "@mui/material";
import { MapContainer, ImageOverlay, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import allowedCoordinates from "@/app/(components)/pages/trolley/addTrolley/allowedCoordinates";
import ReactDOMServer from "react-dom/server";
import { TbTrolley } from "react-icons/tb";
import SocketServices from "@/app/api/socketService";

interface PointWithMarker {
  x: number;
  y: number;
  showMarker: boolean;
  _id: string;
}

interface empProps {
  trolleyPath: PointWithMarker[];
  trolleyId?: string;
}

const EmpTrack: React.FC<empProps> = ({ trolleyPath = [], trolleyId }) => {
  const [trolleyCoordinates, setTrolleyCoordinates] = useState<
    PointWithMarker[]
  >([]);
  // Coordinate Mapping on Layout

  useEffect(() => {
    if (trolleyId) {
      (async () => {
        await SocketServices.initialiseWS();
        SocketServices.emit("joinTrolley", { trolleyId });
        SocketServices.on("trolleyData", (data) => {
          if (data && Object.keys(data).length > 0) {
            setTrolleyCoordinates([data]);
          }
        });
      })();
      return () => {
        if (trolleyId) {
          console.log("disconnecting.....", trolleyId);
          SocketServices.emit("disconnectTrolley", { trolleyId });
          SocketServices.off("trolleyData");
        }
        localStorage.removeItem("trolleyId");
        setTrolleyCoordinates([]);
      };
    }
  }, [trolleyId]);
  const [linePositions, setLinePositions] = useState<
    [number, number, boolean][]
  >([]);
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
      const filtered = trolleyCoordinates.filter((point) =>
        allowedCoordinates?.some(
          (allowed) => allowed[0] === point?.y && allowed[1] === point?.x
        )
      );
      setFilteredCoordinates(filtered);
      const positions = trolleyPath
        .filter((point) => point?.x !== undefined && point?.y !== undefined)
        .map(
          (point) =>
            [point?.x, point?.y, point?.showMarker] as [number, number, boolean]
        );
      setLinePositions(positions);
    }
  }, [trolleyCoordinates, trolleyPath]);

  const customIcon = L.divIcon({
    html: ReactDOMServer.renderToString(
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "25px",
          height: "25px",
          borderRadius: "50%",
          backgroundColor: "white",
          border: "1px solid red",
        }}
      >
        <TbTrolley color="red" size={18} />
      </div>
    ),
    className: "",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

  const IncrementIcon = (markerLabel: number) =>
    L?.divIcon({
      html: `<div style="width: 20px; height: 20px; background-color: grey; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 50%; border: 2px solid white;">${markerLabel}</div>`,
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
          <ImageOverlay
            url="/Img/Layoutdenso.png"
            bounds={bounds}
            eventHandlers={{
              error: (e) => {
                console.error("Error loading image:", e);
              },
            }}
          />
          <Polyline
            positions={linePositions?.map(([x, y]) => [x, y])}
            pathOptions={{ color: "black" }}
            weight={4}
            opacity={0.7}
            dashArray="5, 10"
          />
          {filteredCoordinates?.length > 0 &&
            filteredCoordinates.map((point) => (
              <Marker
                key={point._id}
                position={[point?.y, point?.x]}
                icon={customIcon}
              />
            ))}
          {linePositions?.length > 0 &&
            (() => {
              const markersToShow = linePositions.filter(
                ([, , showMarker]) => showMarker
              );
              return (
                <>
                  {markersToShow?.map(([x, y], index) => {
                    const markerLabel = index + 1;
                    return (
                      <Marker
                        key={index}
                        position={[x, y]}
                        icon={IncrementIcon(markerLabel)}
                      />
                    );
                  })}
                </>
              );
            })()}
        </MapContainer>
      </Grid>
    </Grid>
  );
};

export default EmpTrack;
