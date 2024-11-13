import React, { ChangeEvent, forwardRef } from "react";
import {
  Grid,
  DialogTitle,
  DialogContent,
  styled,
  Paper,
  TextField
} from '@mui/material';
import { MapContainer, ImageOverlay, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useForm, Controller, useFormContext, FieldValues, FormProvider  } from "react-hook-form";
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
interface PointWithMarker {
  x: number;
  y: number;
  showMarker: boolean;
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
interface FinalDetailsProps {
  points: PointWithMarker[];
  finalSectionDropDownData: FinalSectionDropDownDataProps[];
  methods: ReturnType<typeof useForm>;
}
export interface FinalDetailsRef {
  validateAndUpdateParent: () => Promise<boolean>;
}
const FinalDetails = forwardRef<FinalDetailsRef, FinalDetailsProps>(({
  points,
  finalSectionDropDownData,
  methods,
}, ref) => {
  const { formState: { errors }, setValue, clearErrors, getValues, trigger, control } = methods;
  console.log('finalSectionDropDownData',finalSectionDropDownData)
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log('name',name)

    setValue(name, value);
    if (errors[name]) {
      clearErrors(name);
    }
  };
  const departments = finalSectionDropDownData
    .filter(item => item.type === "department")
    .map(item => ({ label: item.name, _id: item._id, value:item._id }));
  const sections = finalSectionDropDownData
    .filter(item => item.type === "section")
    .map(item => ({ label: item.name, _id: item._id, value:item._id }));
  const lines = finalSectionDropDownData
    .filter(item => item.type === "line")
    .map(item => ({ label: item.name, _id: item._id, value:item._id }));
  let markerCounter = 1;
  const bounds: [[number, number], [number, number]] = [
    [0, 0],
    [100, 220]
  ];
  console.log("department",departments)
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
  const values = getValues();
  console.log("values final",values)
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
              positions={points.map(point => [point.x, point.y])} 
              color="black"
              weight={2}
            />
            {points.map((point, index) =>
              point.showMarker && (
                <Marker
                  key={index}
                  position={[point.x, point.y]}  
                  icon={getNumberedIcon(markerCounter++)}
                />
              )
            )}
          </MapContainer>
        </StyledDialogTitle>
        <DialogContent>
          <Grid container justifyContent={"space-between"} spacing={2} sx={{ mt: 2 }}>
           <FormProvider {...methods}>
            <Grid item md={5.8}> 
              <Controller
                name="department"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select="select"
                    selectData={departments}
                    label="Department"
                    placeholder="Enter department"
                    error={!!errors.department}
                    helperText={errors.department?.message}
                    onChange={handleInputChange}
                    defaultValue={departments ? "" :""}
                  />


                )}
              />


            </Grid>
            <Grid item md={5.8}>
              <Controller
                name="section"
                control={control}
                rules={{ required: "Section is required" }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select="select"
                    selectData={sections}
                    label="Section"
                    placeholder="Enter section"
                    error={!!errors.section}
                    helperText={errors.section?.message}
                    onChange={handleInputChange}
                    defaultValue={finalSectionDropDownData ? "" :""}
                  />
                )}
              />
            </Grid>
            <Grid item md={5.8}>
              <Controller
                name="line"
                control={control}
                rules={{ required: "Line is required" }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select="select"
                    selectData={lines}
                    label="Line"
                    placeholder="Enter line"
                    error={!!errors.line}
                    helperText={errors.line?.message}
                    onChange={handleInputChange}
                    defaultValue={finalSectionDropDownData ? "" :""}
                  />
                )}
              />
            </Grid> 
            <Grid item md={2.7}>
              <Controller
                name="totalDistance"
                control={control}
                rules={{
                  required: "Total distance is required",
                  pattern: {
                    value: /^(?:[1-9]\d*|0)$/,
                    message: "Enter a valid number",
                  },
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    field="number"
                    label="Total distance"
                    placeholder="Distance in meters"
                    error={!!errors.totalDistance}
                    helperText={errors.totalDistance?.message}
                    defaultValue={finalSectionDropDownData ? "" :""}
                  />
                )}
              />
            </Grid>
            <Grid item md={2.7}>
              <Controller
                name="totalTime"
                control={control}
                rules={{
                  required: "Total Time is required",
                  max: {
                    value: 60, 
                    message: "Total Time cannot exceed 60 second",
                  },
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    field="number"
                    
                    label="Total Time"
                    placeholder="Time in seconds"
                    error={!!errors.totalTime}
                    helperText={errors.totalTime?.message}
                    defaultValue={finalSectionDropDownData ? "" :""}
                  />
                )}
              />
            </Grid>
            <Grid item md={5.8}>
              <Controller
                name="repetedCycles"
                control={control}
                rules={{
                  required: "Repeated Cycle is required",
                  pattern: {
                    value: /^(?:[1-9]\d*|0)$/,
                    message: "Enter a valid number",
                  },
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    field="number"
                    label="Repeated Cycle"
                    placeholder="Enter Repeated Cycles"
                    error={!!errors.repetedCycles}
                    helperText={errors.repetedCycles?.message}
                    onChange={handleInputChange}
                    defaultValue={finalSectionDropDownData ? "" :""}
                  />
                )}
              />
             </Grid>
           </FormProvider>
          </Grid>
        </DialogContent>
      </Grid>
    </Grid>
  );
});
export default FinalDetails;