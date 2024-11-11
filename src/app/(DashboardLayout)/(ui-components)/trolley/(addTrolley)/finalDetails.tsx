import React, { ChangeEvent, useState, forwardRef, useImperativeHandle, ForwardedRef } from "react";
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
import { useForm, Controller } from "react-hook-form";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";

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
}
interface FinalSectionData {
  _id?: string;
}
interface Distance {
  distance: number;
  unit: string;
}
interface Time {
  time: number;
  unit: string;
}
interface FinalDetailsProps {
  points: PointWithMarker[];
  finalSectionDropDownData: FinalSectionDropDownDataProps[];
  setFinalSectionDistance: React.Dispatch<React.SetStateAction<Distance[]>>;
  setFinalSectionTotalTime: React.Dispatch<React.SetStateAction<Time[]>>;
  setFinalSectionRepetedCycles: React.Dispatch<React.SetStateAction<number>>;
  setFinalSectionDepartmentId: React.Dispatch<React.SetStateAction<FinalSectionData[]>>;
  setFinalSectionSectionId: React.Dispatch<React.SetStateAction<FinalSectionData[]>>;
  setFinalSectionLineId: React.Dispatch<React.SetStateAction<FinalSectionData[]>>;
}

export interface FinalDetailsRef {
  validateAndUpdateParent: () => Promise<boolean>;
}

const FinalDetails = forwardRef<FinalDetailsRef, FinalDetailsProps>(({
  points,
  finalSectionDropDownData,
  setFinalSectionDistance,
  setFinalSectionTotalTime,
  setFinalSectionRepetedCycles,
  setFinalSectionDepartmentId,
  setFinalSectionSectionId,
  setFinalSectionLineId
}, ref) => {
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
    trigger 
  } = useForm();

  const validateAndUpdateParent = async () => {
    const isValid = await trigger();
    if (isValid) {
      const values = getValues();
      // Format the values correctly when submitting
      setFinalSectionDepartmentId([{ _id: values.department }]);
      setFinalSectionSectionId([{ _id: values.section }]);
      setFinalSectionLineId([{ _id: values.line }]);
      setFinalSectionDistance([{ distance: Number(values.totalDistance), unit: 'meters' }]);
      setFinalSectionTotalTime([{ time: Number(values.totalTime), unit: 'seconds' }]);
      setFinalSectionRepetedCycles(Number(values.repetedCycles));
      return true;
    }
    return false;
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue(name, value);
    
    if (errors[name]) {
      clearErrors(name);
    }
    const values = getValues();
console.log("valuessss",value)
    // Update parent state immediately when values change
    switch (name) {
      case 'department': {
        const selectedDept = departments.find(dept => dept._id === value);
        if (selectedDept) {
          setFinalSectionDepartmentId([{ _id: selectedDept._id }]);
        }
        break;
      }
      case 'section': {
        const selectedSection = sections.find(section => section._id === value);
        if (selectedSection) {
          setFinalSectionSectionId([{ _id: selectedSection._id }]);
        }
        break;
      }
      case 'line': {
        const selectedLine = lines.find(line => line._id === value);
        if (selectedLine) {
          setFinalSectionLineId([{ _id: selectedLine._id }]);
        }
        break;
      }
      case 'totalDistance':
        setFinalSectionDistance([{ distance: Number(value), unit: 'meters' }]);
        break;
      case 'totalTime':
        setFinalSectionTotalTime([{ time: Number(value), unit: 'seconds' }]);
        break;
      case 'repetedCycles':
        setFinalSectionRepetedCycles(Number(value));
        break;
    }
  };

  // Filter dropdown data
  const departments = finalSectionDropDownData
    .filter(item => item.type === "department")
    .map(item => ({ label: item.name, _id: item._id }));

  const sections = finalSectionDropDownData
    .filter(item => item.type === "section")
    .map(item => ({ label: item.name, _id: item._id }));

  const lines = finalSectionDropDownData
    .filter(item => item.type === "line")
    .map(item => ({ label: item.name, _id: item._id }));

    
  let markerCounter = 1;
console.log("departments",departments)
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

  useImperativeHandle(ref, () => ({
    validateAndUpdateParent
  }));

  
  //   const { name, value } = event.target;
  //   setValue(name, value);
  //   if (errors[name]) {
  //     clearErrors(name);
  //   }
  
  //   const values = getValues();
  //   // switch (name) {
  //   //   case 'department':
  //   //     setFinalSectionDepartmentId([{ _id: value._id }]);
  //   //     break;
  //   //   case 'section':
  //   //     setFinalSectionSectionId([{ _id: value }]);
  //   //     break;
  //   //   case 'line':
  //   //     setFinalSectionLineId([{ _id: value }]);
  //   //     break;
  //   //   case 'totalDistance':
  //   //     setFinalSectionDistance([{ distance: Number(value), unit: 'meters' }]);
  //   //     break;
  //   //   case 'totalTime':
  //   //     setFinalSectionTotalTime([{ time: Number(value), unit: 'seconds' }]);
  //   //     break;
  //   //   case 'repetedCycles':
  //   //     setFinalSectionRepetedCycles(Number(value));
  //   //     break;
  //   // }
  // };

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
            </Grid>
            <Grid item md={2.7}>
              <CustomTextField
                {...register("totalDistance", {
                  required: "Total distance is required",
                  pattern: {
                    value: /^\d+$/,
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
                    value: /^\d+$/,
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
                    value: /^\d+$/,
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
});

FinalDetails.displayName = 'FinalDetails';

export default FinalDetails;
