import React, { ChangeEvent, useEffect, useRef, useState } from "react";
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
  Typography,
  LinearProgress,
  Avatar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import TrolleyIcon from '../../../../../../public/Img/clarity_avatar-trolley.png';
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import axiosInstance from "@/app/api/axiosInstance";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useDropzone } from "react-dropzone";
import TrolleyRoute from "./trolleyRoute";
import Image from "next/image";
import SelectRoute from "./selectRoute";
import FinalDetails from "./finalDetails";


interface AddDeviceProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getTrolleyData: () => void;
  selectedDevice?: any;
  selectedSite?: any;
}
interface ErrorResponse {
  message?: string;
}
type Point = [number, number];
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
  createdAt: string
  createdBy: string;
  name: string;
  type: string;
  uId: string;
  updatedAt: string;
  _id: string;
};
const AddDevice: React.FC<AddDeviceProps> = ({
  open,
  setOpen,
  getTrolleyData,
  selectedDevice,
  selectedSite,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [points, setPoints] = useState<PointWithMarker[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [finalSectionDropDownData, setFinalSectionDropDownData] = useState<FinalSectionDropDownDataProps[]>([]);

  const methods = useForm<any>();

  const { setValue, handleSubmit, clearErrors, getValues, watch, reset, formState: { errors }, control, } = methods
  const [rows, setRows] = useState<ProcessFormRow[]>([{
    process: "",
    activityName: "",
    jobRole: "Permanent",
    jobNature: "",
    startTime: "",
    endTime: "",
    totalTime: {
      time: 0,
      unit: "min"
    },
    remarks: "Neutral"
  }]);
  const steps = [
    "Add trolley",
    "Mark pointers",
    "Select route",
    "Final details",
  ];

  const [selectDropDownData, setSelectDropDownData] = useState<any>(null);

  // useEffect(() => {
  //   if (selectedDevice) {
  //     setValue("trolleyId", selectedDevice?.trolleyUid);
  //     setValue("macId", selectedDevice?.trolleyMacId);
  //   } else {
  //     reset();
  //   }
  // }, [setValue, reset, selectedDevice]);

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);
  const getTrolleyCategoriesData = async () => {
    try {
      const res = await axiosInstance.get("trolleyCategory/getAllTrolleyCategories");
      if (res?.status === 200 || res?.status === 201) {
        const dropdownData = res?.data?.data?.data.map((value: any) => ({
          _id: value?._id,
          label: value?.name,
          value: value?.color,
        }));
        setSelectDropDownData(dropdownData);
      }
    } catch (err) {
      console.error("Error fetching trolley categories:", err);
    }
  };
  const getFinalSectionDropdownData = async () => {
    try {
      const [departmentRes, sectionRes, lineRes] = await Promise.all([
        axiosInstance.get(`organizations/getAllData?type=department`),
        axiosInstance.get(`organizations/getAllData?type=section`),
        axiosInstance.get(`organizations/getAllData?type=line`),
      ]);

      const validResponses = [departmentRes, sectionRes, lineRes].filter(
        (res) => res?.status === 200 || res?.status === 201
      );

      if (validResponses.length > 0) {
        const allData = validResponses.flatMap((res) => res?.data?.data?.data || []);
        setFinalSectionDropDownData(allData);
      } else {
        console.log("No data available for dropdown.");
      }
    } catch (err) {
      console.error("Error fetching section dropdown data:", err);
    }
  };
  const selectedCategory = watch("trolleyCategoryId");
  const color = selectDropDownData?.find((item: any) => item._id === selectedCategory)?.value || ""
  useEffect(() => {
    if (open) {
      getTrolleyCategoriesData();
      getFinalSectionDropdownData();
    }
  }, [open]);



  const handleClose = () => {
    // setOpen(false);
    getTrolleyData();
    setFile(null);
    setActiveStep(0);
    setPoints([]);
    setRows([]); 
    reset();
  }
  const trolleyBoxLabel = () => {
    if (activeStep == 0) {
      return `${selectedDevice ? "Edit" : "Add"} trolley `
    } else if (activeStep == 1) {
      return 'Set animated location points'
    } else if (activeStep == 2) {
      return 'Select route'
    } else if (activeStep == 3) {
      return 'Final detalis'
    }
  }
  console.log("filePreview", file)
  const onDrop = (acceptedFiles: File[]) => {
    // setFile(acceptedFiles[0]);
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
    // setProgress(0);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 10485760,
  });

  const onSubmit = async () => {
    console.log("hello123");
    const values = getValues();
    console.log("valuessss", values)

    setValue("trolleyCategoryId", selectedCategory);
    setValue("trolleyColor", color);
    setValue("pathPointers", points);
    setValue("routeProcess", rows);

    handleNext();

    const formData = getValues();
    console.log("valuuuuuu", formData)
    const body = {
      uId: formData?.trolleyId,
      macId: formData?.macId,
      name: formData?.name,
      trolleyCategoryId: formData?.trolleyCategoryId?._id,
      trolleyColor: formData?.trolleyColor,
      pathPointers: formData?.pathPointers,
      routeProcess: formData?.routeProcess,
      departmentId: formData?.department?._id,
      sectionId: formData?.section?._id,
      lineId: formData?.line?._id,
      distance: formData?.totalDistance ? {
        distanceValue: formData.totalDistance,
        unit: "meters"
      } : undefined,
      totalTime: formData?.totalTime ? {
        time: formData.totalTime,
        unit: "seconds"
      } : undefined,
      repetedCycles: formData?.repetedCycles
    };
    console.log("bodyyyyy", body)
    // {activeStep === 3 && (() => {
    //   if (
    //     !formData?.departmentId ||
    //     !formData?.lineId ||
    //     !formData?.sectionId ||
    //     !formData?.distance ||
    //     !formData?.totalTime ||
    //     !formData?.repetedCycles
    //   ) {
    //     notifyError("Please fill in all required fields before submitting.");
    //     return null;
    //   }
    //   return null; 
    // })()}

    console.log("selectedDevicedddd", selectedDevice)
    try {
      let res;
      if (selectedDevice) {
        res = await axiosInstance.patch(
          `api/v1/trolleys/updateTrolley/${selectedDevice?._id}`,
          body
        );
      } else if (formData?.repetedCycles) {
        res = await axiosInstance.post(
          `trolleys/createTrolley`,
          body
        );
      }
      if (res?.status === 200 || res?.status === 201) {
        console.log(res);
        notifySuccess(
          `Trolley ${selectedDevice ? "Edit" : "created"} successfully`
        );
        getTrolleyData();
        handleClose();
        reset()
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
    console.log('name add', value)

    setValue(name, value);
    if (errors[name]) {
      clearErrors(name);
    }
  };
  const handleNext = () => {
    const values = getValues();
    console.log("values1", values)
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
  console.log("selectDatffa", color)
  // console.log("selectDatffa",   selectedCategory)


  return (
    <>  
    
   
        <CommonDialog
          open={open}
          maxWidth={"lg"}
          fullWidth={true}
          // title={`${selectedDevice ? "Edit" : "Add"} Trolley `}
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
                      <input {...getInputProps()} style={{ display: "none" }} />
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
                    name="name"
                    control={control}
                    defaultValue=""
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
                        defaultValue={selectedDevice ? "" : ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={5.8}>
                  <Controller
                    name="trolleyId"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Trolley ID is required",
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        label="Trolley ID"
                        placeholder="Enter Trolley ID"
                        error={!!errors.trolleyId}
                        helperText={errors.trolleyId?.message}
                        onChange={handleInputChange}
                        defaultValue={selectedDevice ? "" : ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={5.8}>
                  <Controller
                    name="macId"
                    control={control}
                    defaultValue={selectedDevice ? selectedDevice?.trolleyMacId : ""}
                    rules={{
                      required: "Trolley Mac ID is required",
                      pattern: {
                        value: /^[a-zA-Z0-9]{8}$/,
                        message: "Trolley Mac ID must be exactly 8 alphanumeric characters",
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
                        defaultValue={selectedDevice ? "" : ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={5.8}>
                  <Controller
                    name="trolleyCategoryId"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Trolley type is required",
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        select
                        selectData={selectDropDownData}
                        label="Trolley type"
                        placeholder="Select trolley type"
                        error={!!errors.trolleyCategoryId}
                        helperText={errors.trolleyCategoryId?.message}
                        onChange={handleInputChange}
                        defaultValue={selectedDevice ? "" : ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={5.8}>
                  <CustomTextField
                    name="trolleyColor"
                    label="Trolley color"
                    value={color}
                    disabled
                  />
                </Grid>
              </Grid>
            )}
            {activeStep === 1 && (
              <Grid container justifyContent={"space-between"}>
                <TrolleyRoute points={points} setPoints={setPoints} />
              </Grid>
            )}
            {activeStep === 2 && (
              <Grid container justifyContent={"space-between"}>
                <SelectRoute rows={rows} setRows={setRows} />
              </Grid>
            )}
            {activeStep === 3 && (
              <Grid container justifyContent={"space-between"}>
                <FinalDetails
                  points={points}
                  finalSectionDropDownData={finalSectionDropDownData}
                  methods={methods}
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
                  // onClick={handleNext}
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
    </FormProvider>          </CommonDialog>

    </>
  );
};

export default AddDevice;