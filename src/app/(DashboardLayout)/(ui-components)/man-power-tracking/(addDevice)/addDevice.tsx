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
  Avatar,
} from "@mui/material";
import AssignDialog from "@/app/(components)/mui-components/Dialog/assign-dialog";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import AvtarIcon from '../../../../../../public/Img/clarityAvatarLine.png';
import axiosInstance from "@/app/api/axiosInstance";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useDropzone } from "react-dropzone";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Image from "next/image";

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
  // const [progress, setProgress] = useState<number>(0);
  const [filePreview, setFilePreview] = useState<string | null>(null);
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
    // setFile(acceptedFiles[0]);
    const selectedFile = acceptedFiles[0];
    // setProgress(0);
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 10485760,
  });
  useEffect(() => {
    const storedSite = localStorage.getItem("selectedSite");
    console.log("dataaaa",storedSite)
    if (storedSite) {
      setSelectedSite(JSON.parse(storedSite));
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const getAllShifts = useCallback(async () => {
    // if (!selectedSite?._id) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/v1/shifts/getAllShifts/`
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
    console.log(formData,'formmmmmmm data');
      
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
      console.log('body',body)

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
    if(activeStep < steps.length - 1){
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    if(activeStep > 0){
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  console.log('activeStep',activeStep)

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
                            <Image src={AvtarIcon} alt="icon" />
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
                      {...register("age", {
                        required: "Age is required",
                      })}
                      field='number'
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
                    <CustomTextField
                      {...register("shift", {
                        required: "Shift is required",
                      })}
                      select="select"
                      selectData={selectData}
                      name="shift"
                      label="Assign Shift"
                      placeholder="Enter shift"
                      error={!!errors.shift}
                      helperText={errors.shift?.message}
                      onChange={handleInputChange}
                      defaultValue={selectedDevice ? "" : ""}
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <CustomTextField
                      {...register("shift", {
                        required: "Shift is required",
                        pattern: {
                          value: /^[1-7]$/,
                          message:
                            "Shift must be a number between 1 and 7",
                        },
                      })}
                      field="number"
                      name="shift"
                      label="Shift range"
                      placeholder="Enter shift"
                      error={!!errors.shift}
                      helperText={errors.shift?.message}
                      onChange={handleInputChange}
                      defaultValue={selectedDevice ? "" : ""}
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

              {activeStep < steps.length - 1 ? (
                <>

                  <ConfirmationDialog
                    title={"Cancel"}
                    handleCloseFirst={handleClose}
                    message={"Are you sure you want to cancel?"}
                  />
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ width: "150px" }}
                  >
                    Next
                  </Button>

                </>
              ) : (
                <>

                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ width: "150px" }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={handleNext}
                    sx={{ width: "150px" }}
                  >
                    Submit
                  </Button>
                </>

              )}
            </DialogActions>
          </form>
        </CommonDialog>
      </LocalizationProvider>
    </>
  );
};

export default AddDevice;
