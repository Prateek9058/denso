"use client";
import React, { ChangeEvent, useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  DialogActions,
  Button,
  DialogContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Box,
  Typography,
} from "@mui/material";
import AssignDialog from "@/app/(components)/mui-components/Dialog/assign-dialog";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import axiosInstance from "@/app/api/axiosInstance";
import { AxiosError } from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useDropzone } from "react-dropzone";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

interface AddDeviceProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getEmployeeData: () => void;
  selectedDevice?: any;
}
interface ErrorResponse {
  message?: string;
}
const AddDevice: React.FC<AddDeviceProps> = ({
  open,
  setOpen,
  getEmployeeData,
  selectedDevice,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
    control,
    reset,
  } = useForm();
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [selectData, setSelectData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const steps = ["Add Manpower", "Assign Trolley"];

  useEffect(() => {
    if (selectedDevice) {
      setValue("name", selectedDevice?.fullName);
      setValue("manpowerId", selectedDevice?.uId);
      setValue("phone", selectedDevice?.phoneNumber);
      setValue("macId", selectedDevice?.macId);
      setValue("email", selectedDevice?.email);
      setValue("jobRole", selectedDevice?.jobRole);
      setValue("shift", selectedDevice?.shift);
      setValue("age", selectedDevice?.age);
      setValue("countryCode", selectedDevice?.countryCode);
    } else {
      reset();
    }
  }, [setValue, reset, selectedDevice]);
  const handleClose = () => {
    setOpen(false);
    getEmployeeData();
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
  useEffect(() => {
    const storedSite = localStorage.getItem("selectedSite");
    if (storedSite) {
      setSelectedSite(JSON.parse(storedSite));
    }
  }, [open]);
  const getAllShifts = useCallback(async () => {
    if (!selectedSite?._id) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/v1/shifts/getAllShifts/${selectedSite?._id}`
      );
      if (res?.status === 200 || res?.status === 201) {
        setSelectData(res?.data?.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [selectedSite]);
  useEffect(() => {
    if (open) {
      getAllShifts();
    }
  }, [open, selectedSite]);
  const onSubmit = async () => {
    if (!selectedSite?._id) return;
    try {
      const formData = getValues();
      const body = {
        name: formData?.name,
        uId: formData?.manpowerId,
        phoneNumber: `${formData?.phone}`,
        macId: formData?.macId,
        email: formData?.email,
        age: formData?.age,
        jobRole: formData?.jobRole,
        shift: formData?.shift,
        countryCode: "91",
      };
      let res;
      if (selectedDevice) {
        res = await axiosInstance.patch(
          `api/v1/employees/updateEmployee/${selectedDevice?._id}`,
          body
        );
      } else {
        res = await axiosInstance.post(
          `/api/v1/employees/addEmployee/${selectedSite._id}`,
          body
        );
      }
      if (res?.status === 200 || res?.status === 201) {
        console.log(res);
        notifySuccess(
          `Employee ${selectedDevice ? "Edit" : "created"} successfully`
        );
        getEmployeeData();
        handleClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(
        axiosError?.response?.data?.message || "Error creating employee"
      );
      console.log(error);
      // handleClose();
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
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CommonDialog
          open={open}
          maxWidth={"lg"}
          fullWidth={true}
          title={`${selectedDevice ? "Edit" : "Add"} Manpower`}
          message={"Are you sure you want to cancel?"}
          titleConfirm={"Cancel"}
          onClose={handleClose}
        >
          <Stepper
            sx={{ paddingTop: "15px" }}
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
                      {...register("name", {
                        required: "Name is required",
                      })}
                      name="name"
                      label="Name"
                      placeholder="Enter name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      onChange={handleInputChange}
                      defaultValue={
                        selectedDevice ? selectedDevice?.fullName : ""
                      }
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <CustomTextField
                      {...register("manpowerId", {
                        required: "Manpower Id is required",
                        pattern: {
                          value: /^[a-zA-Z0-9]/,
                          message:
                            "Manpower id must be 15 alphanumeric characters",
                        },
                      })}
                      name="manpowerId"
                      label="Manpower ID"
                      placeholder="Enter manpower id"
                      error={!!errors.manpowerId}
                      helperText={errors.manpowerId?.message}
                      onChange={handleInputChange}
                      defaultValue={selectedDevice ? selectedDevice?.uId : ""}
                    />
                  </Grid>

                  <Grid item md={5.8}>
                    <CustomTextField
                      {...register("email", {
                        required: "email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Enter a valid email address",
                        },
                      })}
                      name="email"
                      label="Email"
                      placeholder="Enter email address"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      onChange={handleInputChange}
                      defaultValue={selectedDevice ? selectedDevice?.email : ""}
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <CustomTextField
                      {...register("phone", {
                        required: "Phone is required",
                        validate: {
                          length: (value) =>
                            value.length === 10 ||
                            "Phone number must be exactly 10 digits without country code",
                        },
                      })}
                      field="number"
                      name="phone"
                      label="Phone Number"
                      placeholder="Enter phone number"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      onChange={handleInputChange}
                      defaultValue={
                        selectedDevice ? selectedDevice?.phoneNumber : ""
                      }
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <CustomTextField
                      {...register("age", {
                        required: "Age is required",
                      })}
                      name="age"
                      label="Age"
                      placeholder="Enter age"
                      error={!!errors.age}
                      helperText={errors.age?.message}
                      onChange={handleInputChange}
                      defaultValue={selectedDevice ? selectedDevice?.age : ""}
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <CustomTextField
                      {...register("jobRole", {
                        required: "Job role is required",
                      })}
                      name="jobRole"
                      label="Job Role"
                      placeholder="Enter job role"
                      error={!!errors.jobRole}
                      helperText={errors.jobRole?.message}
                      onChange={handleInputChange}
                      defaultValue={
                        selectedDevice ? selectedDevice?.jobRole : ""
                      }
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <CustomTextField
                      {...register("salary", {
                        required: "Salary is required",
                      })}
                      name="salary"
                      field="number"
                      label="Salary"
                      placeholder="Enter salary"
                      error={!!errors.salary}
                      helperText={errors.salary?.message}
                      onChange={handleInputChange}
                      defaultValue={
                        selectedDevice ? selectedDevice?.salary : ""
                      }
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <CustomTextField
                      {...register("shift", {
                        required: "Shift is required",
                      })}
                      select="select"
                      selectData={selectData}
                      name="shift"
                      label="Shift"
                      placeholder="Enter shift"
                      error={!!errors.shift}
                      helperText={errors.shift?.message}
                      onChange={handleInputChange}
                      defaultValue={selectedDevice ? "" : ""}
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <CustomTextField
                      {...register("category", {
                        required: "Shift is required",
                      })}
                      select="select"
                      selectData={selectData}
                      name="category"
                      label="Category"
                      placeholder="Enter category"
                      error={!!errors.category}
                      helperText={errors.category?.message}
                      onChange={handleInputChange}
                      defaultValue={selectedDevice ? "" : ""}
                    />
                  </Grid>
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
                </Grid>
              )}
              {activeStep === 1 && (
                <Grid container justifyContent={"space-between"}>
                  <AssignDialog
                    open={open}
                    url="/api/user/get-all-user"
                    setOpen={setOpen}
                    title="Assign User"
                  />
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
