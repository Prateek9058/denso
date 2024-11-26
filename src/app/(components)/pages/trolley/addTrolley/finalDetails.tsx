import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Grid,
  DialogTitle,
  DialogContent,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { MapContainer, ImageOverlay, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useForm, Controller, FormProvider } from "react-hook-form";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import axiosInstance from "@/app/api/axiosInstance";

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  padding: 0,
  height: 710,
  overflow: "hidden",
  border: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: theme.shadows[1],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  position: "relative",
}));
interface PointWithMarker {
  x: number;
  y: number;
  showMarker: boolean;
}
interface FinalSectionDropDownDataProps {
  createdAt: string;
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
  selectedDevice?: any;
}

const FinalDetails = forwardRef<HTMLDivElement, FinalDetailsProps>(
  ({ points, finalSectionDropDownData, methods, selectedDevice }, ref) => {
    const {
      formState: { errors },
      setValue,
      clearErrors,
      control,
      getValues,
      watch,
    } = methods;

    const [site, setSite] = useState<any>(null);
    const [Line, setLine] = useState<any>(null);
    // const [id, setId] = useState<any>(departmentId);
    const bounds: [[number, number], [number, number]] = useMemo(
      () => [
        [0, 0],
        [100, 220],
      ],
      []
    );
    let markerCounter = 1;

    useEffect(() => {
      if (selectedDevice) {
        setValue("department", selectedDevice?.departmentId?._id);
        setValue("section", selectedDevice?.sectionId?._id);
        setValue("line", selectedDevice?.lineId?._id);
      }
    }, [selectedDevice]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setValue(name, value);
      if (errors[name]) {
        clearErrors(name);
      }
    };

    const getNumberedIcon = (number: number) => {
      return L.divIcon({
        html: `<div style="display: flex; align-items: center; justify-content: center;
              width: 25px; height: 25px; background-color: red; border-radius: 50%; color: white;
              font-size: 14px;">${number}</div>`,
        className: "",
        iconSize: [25, 25],
        iconAnchor: [12, 12],
      });
    };

    const sectionId = watch("section");
    const departmentId = watch("department");
    const handleSection = async () => {
      try {
        const { data, status } = await axiosInstance(
          `/section/departmentBaseSections/${departmentId}`
        );
        if (status === 200 || status === 201) {
          setSite(data?.data);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    const handleLine = async () => {
      try {
        const { data, status } = await axiosInstance(
          `/line/sectionBaseLine/${sectionId}`
        );
        if (status === 200 || status === 201) {
          setLine(data?.data);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    useEffect(() => {
      handleSection();

      handleLine();
    }, [departmentId, sectionId]);

    return (
      <Grid container justifyContent="space-between">
        <Grid item xs={12}>
          <DialogContent>
            <Grid
              container
              justifyContent="space-between"
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Grid item md={5.8}>
                <FormControl
                  fullWidth
                  error={!!errors?.department}
                  sx={{ mt: 1 }}
                >
                  <InputLabel>Department</InputLabel>
                  <Controller
                    name="department"
                    control={control}
                    defaultValue={selectedDevice?.departmentId?._id || ""}
                    rules={{
                      required: "At least one department must be selected",
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Department"
                        value={field.value || ""}
                      >
                        {finalSectionDropDownData?.map(
                          (item: any, index: number) => (
                            <MenuItem key={index} value={item?._id}>
                              {item?.name}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    )}
                  />
                  <FormHelperText>
                    {(errors as any)?.department?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={5.8}>
                <FormControl fullWidth error={!!errors?.section} sx={{ mt: 1 }}>
                  <InputLabel>Section </InputLabel>
                  <Controller
                    name="section"
                    control={control}
                    defaultValue={selectedDevice?.sectionId?._id || ""}
                    rules={{
                      required: " At least one section must be selected",
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="section"
                        label={"Section"}
                        // disabled={!departmentId}
                        value={field.value || ""}
                      >
                        {site &&
                          site?.map((item: any, index: number) => (
                            <MenuItem key={index} value={item?._id}>
                              {item?.name}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>
                    {(errors as any) && errors?.section?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={5.8}>
                <FormControl fullWidth error={!!errors?.line} sx={{ mt: 1 }}>
                  <InputLabel>Line </InputLabel>
                  <Controller
                    name="line"
                    control={control}
                    rules={{
                      required: " At least one line must be selected",
                    }}
                    defaultValue={selectedDevice?.lineId?._id || ""}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="line"
                        label={"Line"}
                        value={field.value || ""}
                        // disabled={!sectionId}
                      >
                        {Line &&
                          Line?.map((item: any, index: number) => (
                            <MenuItem key={index} value={item?._id}>
                              {item?.name}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>
                    {(errors as any) && errors?.line?.message}
                  </FormHelperText>
                </FormControl>
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
                      defaultValue={
                        selectedDevice ? selectedDevice?.totalTime?.time : ""
                      }
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
                      defaultValue={
                        selectedDevice
                          ? selectedDevice?.distance?.distanceValue
                          : ""
                      }
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
                      defaultValue={
                        selectedDevice ? selectedDevice?.repetedCycles : ""
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <StyledDialogTitle>
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
                positions={points.map((point) => [point.x, point.y])}
                color="black"
                weight={2}
              />
              {points.map(
                (point, index) =>
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
        </Grid>
      </Grid>
    );
  }
);

FinalDetails.displayName = "FinalDetails";
export default FinalDetails;
