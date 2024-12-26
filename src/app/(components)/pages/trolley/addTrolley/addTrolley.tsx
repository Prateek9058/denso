import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import {
  DialogActions,
  Button,
  DialogContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Box,
  Avatar,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import TrolleyIcon from "../../../../../../public/Img/clarity_avatar-trolley.png";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import axiosInstance from "@/app/api/axiosInstance";
import { AxiosError } from "axios";
import { useDropzone } from "react-dropzone";
import TrolleyRoute from "./trolleyRoute";
import Image from "next/image";
import SelectRoute from "./selectRoute";
import FinalDetails from "./finalDetails";
import { handleKeyPress } from "../../specialCharacter";

interface AddDeviceProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getTrolleyData: () => void;
  selectedDevice?: any;
}
interface ErrorResponse {
  message?: string;
}
interface PointWithMarker {
  x: number;
  y: number;
  showMarker: boolean;
}
interface ProcessFormRow {
  process: string;
  activityName: string;
  jobRole: string;
  jobNature: string;
  startTime: string;
  endTime: string;
  totalTime: {
    time: number;
    unit: string;
  };
  remarks: string;
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
const AddDevice: React.FC<AddDeviceProps> = ({
  open,
  setOpen,
  getTrolleyData,
  selectedDevice,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [points, setPoints] = useState<PointWithMarker[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectIDs, setSelectedIds] = useState<any>(null);
  const [lineIds, setLineIds] = useState<any>(null);
  const [finalSectionDropDownData, setFinalSectionDropDownData] = useState<
    FinalSectionDropDownDataProps[]
  >([]);

  const [pointCounter, setPointCounter] = useState<number>(0);

  const methods = useForm<any>();

  const {
    setValue,
    handleSubmit,
    clearErrors,
    getValues,
    watch,
    reset,
    formState: { errors },
    control,
  } = methods;
  const values = getValues();
  const [rows, setRows] = useState<ProcessFormRow[]>([
    {
      process: "",
      activityName: "",
      jobRole: "Permanent",
      jobNature: "",
      startTime: "",
      endTime: "",
      totalTime: {
        time: 0,
        unit: "min",
      },
      remarks: "Neutral",
    },
  ]);
  const steps = [
    "Add trolley",
    "Mark pointers",
    "Select route",
    "Final details",
  ];

  const [selectDropDownData, setSelectDropDownData] = useState<any>(null);

  useEffect(() => {
    if (selectedDevice) {
      setValue("trolleyCategoryId", selectedDevice?.trolleyCategoryId?._id);
      setValue("trolleyId", setcategoryUid(selectedDevice?.uId));
      setValue("macId", selectedDevice?.macId);
      setValue("name", selectedDevice?.name);
      setValue("trolleyColor", selectedDevice?.trolleyColor);
      setValue("routeProcess", selectedDevice?.routeProcess);
      setValue("pathPointers", selectedDevice?.pathPointers);
      setPoints(selectedDevice?.pathPointers);
      setValue("routeProcess", selectedDevice?.routeProcess);
      setValue("departmentId", selectedDevice?.departmentId);
      setValue("sectionId", selectedDevice?.sectionId);
      setValue("lineId", selectedDevice?.lineId);
      setValue("distance", selectedDevice?.distance);
      setValue("totalTime", selectedDevice?.totalTime);
      setValue("repetedCycles", selectedDevice?.repetedCycles);
      setRows(selectedDevice?.routeProcess);
    } else {
      reset();
    }
  }, [open, selectedDevice]);

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);
  const getTrolleyCategoriesData = async () => {
    try {
      const res = await axiosInstance.get(
        "trolleyCategory/getAllTrolleyCategories"
      );
      if (res?.status === 200 || res?.status === 201) {
        const dropdownData =
          res?.data?.data?.data.map((value: any) => ({
            _id: value?._id,
            label: value?.name,
            color: value?.color,
          })) || [];
        setSelectDropDownData(dropdownData);
      }
    } catch (err) {
      console.error("Error fetching trolley categories:", err);
      setSelectDropDownData([]);
    }
  };

  const handleFinalDetails = async () => {
    try {
      const { data, status } = await axiosInstance(
        "department/getAllDepartments?page=&limit&search"
      );
      if (status === 200 || status === 201) {
        setFinalSectionDropDownData(data?.data?.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const selectedCategory = watch("trolleyCategoryId");
  const color =
    selectDropDownData?.find(
      (item: any) => item._id === values?.trolleyCategoryId
    )?.color || "";
  useEffect(() => {
    if (open) {
      getTrolleyCategoriesData();
      handleFinalDetails();
    }
  }, [open, selectedDevice]);

  const [categoryUid, setcategoryUid] = useState<string>("");
  const handleCategoryUid = async () => {
    try {
      const { data, status } = await axiosInstance.get("/trolleys/getUid");
      if (status === 200 || status === 201) {
        setcategoryUid(data?.data);
      }
    } catch (error) {
      notifyError((error as any)?.response?.data?.message);
    }
  };
  useEffect(() => {
    if (open) {
      handleCategoryUid();
    }
    setValue("trolleyId", categoryUid);
  }, [categoryUid, open]);

  const handleClose = () => {
    setOpen(false);
    getTrolleyData();
    setFile(null);
    setActiveStep(0);
    setPoints([]);
    setRows([
      {
        process: "",
        activityName: "",
        jobRole: "Permanent",
        jobNature: "",
        startTime: "",
        endTime: "",
        totalTime: {
          time: 0,
          unit: "min",
        },
        remarks: "Neutral",
      },
    ]);
    reset();
  };
  const trolleyBoxLabel = () => {
    if (activeStep == 0) {
      return `${selectedDevice ? "Edit" : "Add"} trolley `;
    } else if (activeStep == 1) {
      return "Set animated location points";
    } else if (activeStep == 2) {
      return "Select route";
    } else if (activeStep == 3) {
      return "Final detalis";
    }
  };
  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 10485760,
  });
  console.log("formData", categoryUid);
  const onSubmit = async () => {
    setValue("trolleyCategoryId", selectedCategory);
    setValue("trolleyColor", color);
    setValue("pathPointers", points);
    setValue("routeProcess", rows);

    handleNext();

    const formData = getValues();

    const body = {
      uId: categoryUid,
      macId: formData?.macId,
      name: formData?.name,
      trolleyCategoryId: formData?.trolleyCategoryId,
      trolleyColor: formData?.trolleyColor,
      pathPointers: formData?.pathPointers,
      routeProcess: formData?.routeProcess,
      departmentId: formData?.department,
      sectionId: selectIDs,
      lineId: lineIds,
      distance: formData?.totalDistance
        ? {
            distanceValue: formData.totalDistance,
            unit: "meters",
          }
        : undefined,
      totalTime: formData?.totalTime
        ? {
            time: formData.totalTime,
            unit: "seconds",
          }
        : undefined,
      repetedCycles: formData?.repetedCycles,
    };

    try {
      let res;
      if (selectedDevice && formData?.repetedCycles && activeStep > 2) {
        res = await axiosInstance.patch(
          `trolleys/updateTrolley/${selectedDevice?._id}`,
          body
        );
      }
      if (!selectedDevice && activeStep > 2) {
        res = await axiosInstance.post(`trolleys/createTrolley`, body);
      }
      if (res?.status === 200 || res?.status === 201) {
        notifySuccess(
          `Trolley ${selectedDevice ? "Edit" : "created"} successfully`
        );
        getTrolleyData();
        handleClose();
        reset();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(
        axiosError?.response?.data?.message || "Error creating trolley"
      );
      console.log(error);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setValue(name, value);
    if (errors[name]) {
      clearErrors(name);
    }
  };
  const handleNext = () => {
    if (activeStep === 1) {
      if (points.length === 0 || points.length === 1) {
        notifyError("Please mark a trolley route");
        return;
      }
    }
    if (activeStep === 2) {
      if (rows.length === 0) {
        notifyError("Please add at least one process row");
        return;
      }
      const allRowsValid = rows.every((row) => {
        return (
          row.process.trim() !== "" &&
          row.activityName.trim() !== "" &&
          row.jobRole.trim() !== "" &&
          row.jobNature.trim() !== "" &&
          row.startTime.trim() !== "" &&
          row.endTime.trim() !== "" &&
          row.totalTime.time > 0 &&
          row.remarks.trim() !== ""
        );
      });
      if (!allRowsValid) {
        notifyError("Please fill out all fields in each process row");
        return;
      }
    }
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };
  return (
    <>
      <CommonDialog
        open={open}
        maxWidth={"xl"}
        fullWidth={true}
        title={`${trolleyBoxLabel()}`}
        message={"Are you sure you want to cancel?"}
        titleConfirm={"Cancel"}
        onClose={handleClose}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stepper
              sx={{ padding: "20px" }}
              activeStep={activeStep}
              alternativeLabel
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <DialogContent>
              {activeStep === 0 && (
                <Grid container justifyContent={"space-between"}>
                  <Grid item md={12}>
                    <Box
                      sx={{
                        borderRadius: "8px",
                        textAlign: "center",
                        marginBottom: "24px",
                      }}
                    >
                      <Box
                        {...(filePreview === null ? getRootProps() : {})}
                        sx={{
                          marginBottom: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          padding: 0,
                          borderStyle: "solid",
                          mx: "auto",
                          borderWidth: 1,
                          borderColor: "#E6E6E6",
                          boxShadow: 3,
                          position: "relative",
                          width: "200px",
                          height: "200px",
                          overflow: "hidden",
                        }}
                      >
                        <input
                          {...getInputProps()}
                          style={{ display: "none" }}
                        />
                        {filePreview === null ? (
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: "#E8E8EA",
                              border: "1px solid #24AE6E1A",
                            }}
                          >
                            <Image src={TrolleyIcon} alt="icon" />
                          </Avatar>
                        ) : (
                          <Image
                            src={filePreview}
                            alt="Uploaded file"
                            layout="fill"
                            objectFit="cover"
                          />
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={5.8}>
                    <Controller
                      name="trolleyId"
                      control={control}
                      rules={{
                        required: "Trolley ID is required",
                        // pattern: {
                        //   value: /^[a-zA-Z0-9]{6,}$/,
                        //   message:
                        //     "Trolley ID must be at least 6 alphanumeric characters",
                        // },
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label="Trolley ID"
                          placeholder="Enter Trolley ID"
                          error={!!errors.trolleyId}
                          helperText={errors.trolleyId?.message}
                          onChange={handleInputChange}
                          defaultValue={
                            categoryUid ? categoryUid : selectedDevice?.uId
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <Controller
                      name="name"
                      control={control}
                      rules={{
                        required: "Trolley name is required",
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label="Trolley Name"
                          placeholder="Enter Trolley Name"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          onChange={handleInputChange}
                          defaultValue={
                            selectedDevice ? selectedDevice?.name : ""
                          }
                        />
                      )}
                    />
                  </Grid>

                  <Grid item md={5.8}>
                    <Controller
                      name="macId"
                      control={control}
                      rules={{
                        required: "Trolley Mac ID is required",
                        pattern: {
                          value: /^[a-zA-Z0-9]{12}$/,
                          message:
                            "Trolley Mac ID must be exactly 12 alphanumeric characters",
                        },
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label="Mac ID"
                          placeholder="Enter Mac ID"
                          error={!!errors.macId}
                          helperText={errors.macId?.message}
                          onChange={handleInputChange}
                          defaultValue={
                            selectedDevice ? selectedDevice?.macId : ""
                          }
                          onKeyDown={handleKeyPress}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <FormControl
                      fullWidth
                      error={!!errors?.trolleyCategoryId}
                      sx={{ mt: 1 }}
                    >
                      <InputLabel shrink>Trolley type </InputLabel>
                      <Controller
                        name="trolleyCategoryId"
                        control={control}
                        rules={{
                          required: " At least one device must be selected",
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            placeholder="Select Trolley type"
                            label={"Trolley type"}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            displayEmpty
                            defaultValue={
                              selectedDevice
                                ? selectedDevice?.trolleyCategoryId?.name
                                : ""
                            }
                          >
                            {selectDropDownData &&
                              selectDropDownData?.map(
                                (item: any, index: number) => (
                                  <MenuItem key={index} value={item?._id}>
                                    {item?.label}
                                  </MenuItem>
                                )
                              )}
                          </Select>
                        )}
                      />
                      <FormHelperText>
                        {(errors as any) && errors?.trolleyCategoryId?.message}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item md={5.8}>
                    <CustomTextField
                      name="trolleyColor"
                      label="Trolley color"
                      value={
                        selectDropDownData?.find(
                          (item: any) => item._id === values?.trolleyCategoryId
                        )?.color
                      }
                      disabled
                    />
                  </Grid>
                </Grid>
              )}
              {activeStep === 1 && (
                <Grid container justifyContent={"space-between"}>
                  <TrolleyRoute
                    points={points}
                    setPoints={setPoints}
                    setPointCounter={setPointCounter}
                  />
                </Grid>
              )}
              {activeStep === 2 && open && (
                <Grid container justifyContent={"space-between"}>
                  <SelectRoute
                    rows={rows}
                    setRows={setRows}
                    pointCounter={pointCounter}
                  />
                </Grid>
              )}
              {activeStep === 3 && (
                <Grid container justifyContent={"space-between"}>
                  <FinalDetails
                    points={points}
                    finalSectionDropDownData={finalSectionDropDownData}
                    methods={methods}
                    selectedDevice={selectedDevice}
                    setSelectedIds={setSelectedIds}
                    selectIDs={selectIDs}
                    lineIds={lineIds}
                    setLineIds={setLineIds}
                  />
                </Grid>
              )}
            </DialogContent>
            <DialogActions className="dialog-action-btn">
              {activeStep == 0 && (
                <ConfirmationDialog
                  title={"Cancel"}
                  handleCloseFirst={handleClose}
                  message={"Are you sure you want to cancel?"}
                />
              )}
              {activeStep !== 0 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ width: "150px" }}
                >
                  Back
                </Button>
              )}
              {activeStep < steps.length - 1 ? (
                <>
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{ width: "150px" }}
                  >
                    Next
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ width: "150px" }}
                >
                  Submit
                </Button>
              )}
            </DialogActions>
          </form>
        </FormProvider>{" "}
      </CommonDialog>
    </>
  );
};

export default AddDevice;
