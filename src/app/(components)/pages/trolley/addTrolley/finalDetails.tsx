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
  Autocomplete,
  Checkbox,
  TextField,
} from "@mui/material";
import { MapContainer, ImageOverlay, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useForm, Controller } from "react-hook-form";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import axiosInstance from "@/app/api/axiosInstance";
// import Autocomplete from "@/app/(components)/mui-components/Text-Field's/Autocomplete/index";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
  setSelectedIds: React.Dispatch<React.SetStateAction<any>>;
  selectIDs?: any;
  lineIds?: any;
  setLineIds: React.Dispatch<React.SetStateAction<any>>;
}

const FinalDetails = forwardRef<HTMLDivElement, FinalDetailsProps>(
  (
    {
      points,
      finalSectionDropDownData,
      methods,
      selectedDevice,
      selectIDs,
      setSelectedIds,
      setLineIds,
      lineIds,
    },
    ref
  ) => {
    const {
      formState: { errors },
      setValue,
      clearErrors,
      control,
      watch,
      getValues,
    } = methods;

    const [site, setSite] = useState<any>(null);
    const [Line, setLine] = useState<any>(null);
    const [selectedSections, setSelectedSections] = React.useState<any[]>([]);
    const [selectedLines, setSelectedLines] = React.useState<any[]>([]);

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
        setValue(
          "section",
          selectedDevice?.sectionId?.map((section: any) => section?._id) || []
        );
        setValue(
          "line",
          selectedDevice?.lineId?.map((line: any) => line?._id) || []
        );
        setValue("totalTime", selectedDevice?.totalTime?.time);
        setValue("totalDistance", selectedDevice?.distance?.distanceValue);
        setValue("repetedCycles", selectedDevice?.repetedCycles);
        setSelectedIds(
          selectedDevice?.sectionId?.map((section: any) => section?._id) || []
        );
        setLineIds(selectedDevice?.lineId?.map((line: any) => line?._id) || []);
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

    const departmentId = watch("department");

    const handleChangeAutocompleteSIte = (event: any, value: any[]) => {
      const selectedIds = value.map((item) => item._id);
      setSelectedSections(value);
      setSelectedIds(selectedIds);
    };
    const handleChangeAutocompleteLine = (event: any, value: any[]) => {
      const selectedIds = value.map((item) => item._id);
      setSelectedLines(value);
      setLineIds(selectedIds);
    };

    const handleSection = async () => {
      try {
        const { data, status } = await axiosInstance.get(
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
        const { data, status } = await axiosInstance.post(
          `/line/getAllLines/`,
          { sectionIds: selectIDs }
        );
        if (status === 200 || status === 201) {
          setLine(data?.data?.data);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    useEffect(() => {
      handleSection();
      setSelectedSections([]);
      setSelectedLines([]);
    }, [departmentId]);
    useEffect(() => {
      handleLine();
      setSelectedLines([]);
    }, [selectIDs, selectedDevice]);

    return (
      <Grid container justifyContent="space-between">
        <Grid item xs={12}>
          <DialogContent>
            <Grid
              container
              justifyContent="space-between"
              spacing={2}
              zIndex={0}
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
                <Controller
                  name="section"
                  control={control}
                  rules={{
                    required: "Section is required",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      id="section"
                      multiple
                      options={site?.length > 0 ? site : []}
                      disabled={!departmentId}
                      getOptionLabel={(option: any) => option?.name}
                      onChange={(event, value) => {
                        handleChangeAutocompleteSIte(event, value);
                        field.onChange(
                          value?.map((option: any) => option?._id)
                        );
                      }}
                      value={
                        site?.filter((section: any) =>
                          field.value?.includes(section?._id)
                        ) || []
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Section"
                          placeholder="Select section"
                          variant="outlined"
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option?.name}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item md={5.8}>
                <Controller
                  name="line"
                  control={control}
                  rules={{
                    required: "line is required",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      id="line"
                      multiple
                      options={Line || []}
                      disabled={!selectIDs}
                      getOptionLabel={(option: any) => option?.name}
                      onChange={(event, value) => {
                        handleChangeAutocompleteLine(event, value);
                        field.onChange(
                          value?.map((option: any) => option?._id)
                        );
                      }}
                      value={
                        Line?.filter((section: any) =>
                          field?.value?.includes(section?._id)
                        ) || []
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select line"
                          placeholder="Select line"
                          variant="outlined"
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option?.name}
                        </li>
                      )}
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
                      defaultValue={
                        selectedDevice
                          ? selectedDevice?.distance?.distanceValue
                          : ""
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
                        selectedDevice ? selectedDevice?.totalTime?.time : ""
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
