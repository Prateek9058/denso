import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import axiosInstance from "@/app/api/axiosInstance";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useDropzone } from "react-dropzone";
import TrolleyRoute from "./trolleyRoute";

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
  const [points, setPoints] = useState<[number, number][]>([]);
  const steps = [
    "Add trolley",
    "Mark pointers",
    "Select route",
    "Final details",
  ];
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
    reset,
    control,
  } = useForm();

  useEffect(() => {
    if (selectedDevice) {
      setValue("trolleyId", selectedDevice?.trolleyUid);
      setValue("macId", selectedDevice?.trolleyMacId);
    } else {
      reset();
    }
  }, [setValue, reset, selectedDevice]);

  const handleClose = () => {
    setOpen(false);
    getTrolleyData();
    setFile(null);
    setActiveStep(0);
    setPoints([]);
    reset();
  };

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setProgress(0);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 10485760,
  });

  const onSubmit = async () => {
    if (!selectedSite?._id) return;
    try {
      const formData = getValues();
      const body = {
        trolleyUid: formData?.trolleyId,
        trolleyMacId: formData?.macId,
        purchaseDate: dayjs(formData?.purchaseDate).format("YYYY-MM-DD"),
      };
      let res;
      if (selectedDevice) {
        res = await axiosInstance.patch(
          `api/v1/trolleys/updateTrolley/${selectedDevice?._id}`,
          body
        );
      } else {
        res = await axiosInstance.post(
          `/api/v1/trolleys/createTrolley/${selectedSite._id}`,
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
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };
  console.log(points);
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CommonDialog
          open={open}
          maxWidth={"md"}
          fullWidth={true}
          title={`${selectedDevice ? "Edit" : "Add"} Trolley`}
          message={"Are you sure you want to cancel?"}
          titleConfirm={"Cancel"}
          onClose={handleClose}
        >
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
          <form onSubmit={handleSubmit(onSubmit)}>
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
                        {...getRootProps()}
                        sx={{
                          border: "2px dashed #ccc",
                          borderRadius: "8px",
                          padding: "22px",
                          cursor: "pointer",
                        }}
                      >
                        <input {...getInputProps()} />
                        <CloudUploadIcon
                          sx={{ fontSize: 48, color: "#90caf9" }}
                        />
                        <Typography>
                          Choose an image or drag & drop it here
                        </Typography>
                        <Typography variant="body2">
                          (Any file type, up to 10MB)
                        </Typography>
                      </Box>
                      {file && (
                        <Box sx={{ marginBottom: "16px" }}>
                          <InsertDriveFileIcon
                            sx={{ fontSize: 48, color: "#4caf50" }}
                          />
                          <Typography>{file?.name}</Typography>
                          <Typography variant="body2">{`${(
                            file?.size / 1024
                          ).toFixed(2)} KB`}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{ marginTop: "8px" }}
                          />
                          <Typography variant="body2" sx={{ marginTop: "8px" }}>
                            {progress?.toFixed(2)}% uploaded
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item md={5.8}>
                    <CustomTextField
                      {...register("trolleyId", {
                        required: "Trolley ID is required",
                      })}
                      name="trolleyId"
                      label="Trolley ID"
                      placeholder="Enter Trolley ID"
                      error={!!errors.trolleyId}
                      helperText={errors.trolleyId?.message}
                      onChange={handleInputChange}
                      defaultValue={
                        selectedDevice ? selectedDevice?.trolleyUid : ""
                      }
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <CustomTextField
                      {...register("macId", {
                        required: "Trolley Mac ID is required",
                        pattern: {
                          value: /^[a-zA-Z0-9]/,
                          message:
                            "Trolley Mac ID must be alphanumeric characters",
                        },
                      })}
                      name="macId"
                      label="Mac ID"
                      placeholder="Enter Mac ID"
                      error={!!errors.macId}
                      helperText={errors.macId?.message}
                      onChange={handleInputChange}
                      defaultValue={
                        selectedDevice ? selectedDevice?.trolleyMacId : ""
                      }
                    />
                  </Grid>
                  {!selectedDevice && (
                    <Grid item md={5.8}>
                      <Controller
                        name="purchaseDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <DatePicker
                            sx={{ width: "100%", color: "#ACACAC" }}
                            label="Date of Purchase"
                            {...field}
                          />
                        )}
                      />
                    </Grid>
                  )}
                </Grid>
              )}
              {activeStep === 1 && (
                <Grid container justifyContent={"space-between"}>
                  <TrolleyRoute points={points} setPoints={setPoints} />
                </Grid>
              )}
              {activeStep === 2 && (
                <Grid container justifyContent={"space-between"}>
                  <TrolleyRoute points={points} setPoints={setPoints} />
                </Grid>
              )}
            </DialogContent>
            <DialogActions className="dialog-action-btn">
              <ConfirmationDialog
                title={"Cancel"}
                handleCloseFirst={handleClose}
                message={"Are you sure you want to cancel?"}
              />
              {activeStep < steps.length - 1 ? (
                <>
                  {activeStep !== 0 && (
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      sx={{ width: "150px" }}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleNext}
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
        </CommonDialog>
      </LocalizationProvider>
    </>
  );
};

export default AddDevice;
