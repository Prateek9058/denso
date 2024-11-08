import React, { ChangeEvent, useState } from "react";
import {
  Grid,
  DialogTitle,
  DialogContent,
  styled,
  Paper
} from '@mui/material';
import { MapContainer, ImageOverlay, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useForm } from "react-hook-form";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";


// Styled components using MUI's styled API
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  padding: 0,
  height: 710,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: theme.shadows[1],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  position: 'relative'
}));

const MapWrapper = styled('div')({
  height: '100%',
  width: '100%'
});


interface PointWithMarker {
  coordinates: [number, number];
  showMarker?: boolean;
}
interface FinalSectionDropDownDataProps {
  createdAt: string
  createdBy: string;
  name: string;
  type: string;
  uId: string;
  updatedAt: string;
  _id: string;
};
interface FinalDetailsProps {
  points: PointWithMarker[];
  finalSectionDropDownData: FinalSectionDropDownDataProps[]
}

const FinalDetails: React.FC<FinalDetailsProps> = ({
  points,
  finalSectionDropDownData
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();

  // Separate arrays based on type
  const departments: { label: string, _id: string }[] = finalSectionDropDownData
    .filter(item => item.type === "department")
    .map(item => ({ label: item.name, _id: item._id }));

  const sections: { label: string, _id: string }[] = finalSectionDropDownData
    .filter(item => item.type === "section")
    .map(item => ({ label: item.name, _id: item._id }));

  const lines: { label: string, _id: string }[] = finalSectionDropDownData
    .filter(item => item.type === "line")
    .map(item => ({ label: item.name, _id: item._id }));

  console.log("Departments:", departments);
  console.log("Sections:", sections);
  console.log("Lines:", lines);
  let markerCounter = 1;
  console.log("finalSectionDropDownData:", finalSectionDropDownData);

  const bounds: [[number, number], [number, number]] = [
    [0, 0],
    [100, 220]
  ];

  const getNumberedIcon = (number: number) => {
    return L.divIcon({

      html: `<div style="display: flex; align-items: center; justify-content: center;

              width: 25px; height: 25px; background-color: red; border-radius: 50%; color: white;

              font-size: 14px;">${number}</div>`,

      className: '',

      iconSize: [25, 25],

      iconAnchor: [12, 12],

    });

  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue(name, value);
    if (errors[name]) {
      clearErrors(name);
    }
  };

  return (
    <Grid container justifyContent={"space-between"}>
      <Grid item xs={12}>
        <StyledDialogTitle>

          <MapContainer
            center={[50, 100]}
            zoom={2}
            minZoom={1}
            maxZoom={3}
            style={{ height: '100%', width: '100%' }}
            crs={L.CRS.Simple}
            maxBounds={[[-10, -10], [110, 210]]}
            maxBoundsViscosity={1.0}
          >
            <ImageOverlay
              url="/Img/Layoutdenso.png"
              bounds={bounds}
              eventHandlers={{
                error: (e) => {
                  console.error('Error loading image:', e);
                }
              }}
            />

            <Polyline
              positions={points.map(point => point.coordinates)}
              color="black"
              weight={2}
            />

            {points.map((point, index) =>
              point.showMarker && (
                <Marker
                  key={index}
                  position={point.coordinates}
                  icon={getNumberedIcon(markerCounter++)}
                />
              )
            )}
          </MapContainer>

        </StyledDialogTitle>
        
        <DialogContent>
          <Grid container justifyContent={"space-between"} spacing={2} sx={{ mt: 2 }}>
            <Grid item md={5.8}>
              <CustomTextField
                {...register("department", {
                  required: "Department is required",
                })}
                select="select"
                selectData={departments}
                name="department"
                label="Department"
                placeholder="Enter department"
                error={!!errors.department}
                helperText={errors.department?.message}
                onChange={handleInputChange}
                defaultValue={finalSectionDropDownData ? "" : ""}

              />
            </Grid>
            <Grid item md={5.8}>
              <CustomTextField
                {...register("section", {
                  required: "Trolley ID is required",
                })}
                select="select"
                selectData={sections}
                name="section"
                label="Section"
                placeholder="Enter section"
                error={!!errors.section}
                helperText={errors.section?.message}
                onChange={handleInputChange}
                defaultValue={finalSectionDropDownData ? "" : ""}

              />
            </Grid>
            <Grid item md={5.8}>
              <CustomTextField
                {...register("line", {
                  required: "Line is required",
                })}
                select="select"
                selectData={lines}
                name="line"
                label="Line"
                placeholder="Enter line"
                error={!!errors.line}
                helperText={errors.line?.message}
                onChange={handleInputChange}
                defaultValue={finalSectionDropDownData ? "" : ""}
              />
               {/* 
                      defaultValue={selectedDevice ? "" : ""} */}
            </Grid>
            <Grid item md={2.7}>
              <CustomTextField
                {...register("totalDistance", {
                  required: "Total distance is required",
                  pattern: {
                    value:
                      /^\d+$/,
                    message: "Enter a valid number",
                  },
                })}
                field="number"
                name="totalDistance"
                label="Total distance"
                placeholder="Distance in meters"
                error={!!errors.totalDistance}
                helperText={errors.totalDistance?.message}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item md={2.7}>
              <CustomTextField
                {...register("totalTime", {
                  required: "Total Time is required",
                  pattern: {
                    value:
                      /^\d+$/,
                    message: "Enter a valid number",
                  },
                })}
                field="number"
                name="totalTime"
                label="Total Time"
                placeholder="Time in seconds"
                error={!!errors.totalTime}
                helperText={errors.totalTime?.message}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item md={5.8}>
              <CustomTextField
                {...register("repetedCycles", {
                  required: "Repeated Cycle is required",
                  pattern: {
                    value:
                      /^\d+$/,
                    message: "Enter a valid number",
                  },
                })}
                field="number"
                name="repetedCycles"
                label="Repeated Cycle"
                placeholder="Enter repeated cycle"
                error={!!errors.repetedCycles}
                helperText={errors.repetedCycles?.message}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
      </Grid>
    </Grid>
  );
};

export default FinalDetails;