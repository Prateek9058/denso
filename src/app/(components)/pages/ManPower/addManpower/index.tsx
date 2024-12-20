"use client";
import React, { ChangeEvent, useEffect, useState, useCallback } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
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
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AssignDialog from "@/app/(components)/mui-components/Dialog/assign-dialog";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import AvtarIcon from "../../../../../../public/Img/clarityAvatarLine.png";
import axiosInstance from "@/app/api/axiosInstance";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useDropzone } from "react-dropzone";
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

const AddManPower: React.FC<AddDeviceProps> = ({
  open,
  setOpen,
  getEmployeeData,
  selectedDevice,
}) => {
  const [selectData, setSelectData] = useState<any>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [empUid, setEmpUid] = React.useState<string>(
    selectedDevice ? selectedDevice?.uId : ""
  );

  const [trolley, setTrolley] = useState<any>([]);

  const employmentTypes = [
    { _id: "Permanent", label: "Permanent" },
    { _id: "Temporary", label: "Temporary" },
    { _id: "Contractual", label: "Contractual" },
  ];

  const steps = ["Add Manpower", "Assign Trolley"];

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
  useEffect(() => {
    if (selectedDevice) {
      setValue("name", selectedDevice?.fullName);
      setValue("manpowerId", selectedDevice?.uId);
      setValue("phone", selectedDevice?.phoneNumber);
      setValue("macId", selectedDevice?.macId);
      setValue("email", selectedDevice?.email);
      setValue("jobRole", selectedDevice?.jobRole);
      setValue("shift", selectedDevice?.shift?._id);
      setValue("shiftRange", selectedDevice?.shiftDateRange?.value);
      setValue("age", selectedDevice?.age);
      setValue("category", selectedDevice?.category);
      setValue("salary", selectedDevice?.salary);
    } else {
      reset();
    }
  }, [setValue, reset, selectedDevice]);
  const handleClose = () => {
    setOpen(false);
    getEmployeeData();
    reset();
    setTrolley(null);
    setActiveStep(0);
  };
  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };
  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 10485760,
  });

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);
  const getEmpUid = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        "/employees/getEmployeeUid"
      );
      if (status === 200 || status === 201) {
        console.log("data", data);
        setEmpUid(data?.data);
      }
    } catch (error: any) {
      notifyError(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (!selectedDevice && open) {
      getEmpUid();
    }

    setValue("manpowerId", empUid);
  }, [open, empUid]);

  const getAllShifts = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`shifts/getAllShifts`);
      if (res?.status === 200 || res?.status === 201) {
        setSelectData(res?.data?.data?.data);
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    if (open && activeStep === 0) {
      getAllShifts();
    }
  }, [open]);

  const onSubmit = async () => {
    // if (trolley?.length === 0 && activeStep === 1) {
    //   notifyError("please select at least one trolley!");
    //   return;
    // }

    handleNext();
    try {
      const formData = getValues();
      const body = {
        uId: empUid,
        name: formData?.name,
        phoneNumber: `${formData?.phone}`,
        countryCode: "91",
        email: formData?.email,
        jobRole: formData?.jobRole,
        age: formData?.age,
        category: formData?.category,
        salary: formData?.salary,
        shiftId: formData?.shift,
        shiftDateRange: {
          value: formData?.shiftRange,
          unit: "days",
        },
        trolley: trolley,
      };
      let res;
      if (selectedDevice && activeStep > 0) {
        res = await axiosInstance.patch(
          `employees/updateEmployee/${selectedDevice?._id}?isTrolleyChange=true`,
          body
        );
      } else if (trolley.length > 0 && activeStep > 0) {
        res = await axiosInstance.post(`employees/addEmployee`, body);
      }
      if (res?.status === 200 || res?.status === 201) {
        console.log(res);
        notifySuccess(
          `Employee ${selectedDevice ? "Edit" : "created"} successfully`
        );
        getEmployeeData();
        handleClose();
      }
    } catch (error: any) {
      notifyError(error?.response?.data?.message);
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

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CommonDialog
          open={open}
          maxWidth={"lg"}
          fullWidth={true}
          title={` Manpower`}
          message={"Are you sure you want to cancel?"}
          titleConfirm={"Cancel"}
          onClose={handleClose}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
              <DialogContent sx={{ minHeight: "60vh" }}>
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
                            width: "120px",
                            height: "120px",
                            borderRadius: "10px",
                            overflow: "hidden",
                          }}
                        >
                          <input
                            {...getInputProps()}
                            style={{ display: "none" }}
                          />
                          {filePreview && (
                            <IconButton
                              onClick={clearFile}
                              sx={{
                                position: "absolute",
                                top: "0px",
                                right: "0px",
                                zIndex: 10,
                                borderRadius: "50%",
                                padding: "2px",
                              }}
                            >
                              <CloseIcon
                                fontSize="small"
                                sx={{ color: "red" }}
                              />
                            </IconButton>
                          )}

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
                    <Grid item md={5.8} mt={2}>
                      <Controller
                        name="manpowerId"
                        control={control}
                        rules={{
                          required: "Manpower Id is requiredd",
                          // pattern: {
                          //   value: /^[a-zA-Z0-9]{6}$/,
                          //   message:
                          //     "Manpower id must be 6 alphanumeric characters",
                          // },
                        }}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            name="manpowerId"
                            label="Manpower ID"
                            placeholder="Enter manpower id"
                            error={!!errors.manpowerId}
                            helperText={errors.manpowerId?.message}
                            onChange={handleInputChange}
                            disabled
                            defaultValue={
                              selectedDevice ? selectedDevice?.uId : empUid
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item md={5.8} mt={2}>
                      <Controller
                        name="name"
                        control={control}
                        rules={{
                          required: "Name is required",
                        }}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
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
                        )}
                      />
                    </Grid>
                    <Grid item md={5.8} mt={2}>
                      <Controller
                        name="phone"
                        control={control}
                        rules={{
                          required: "Phone is required",
                          validate: {
                            length: (value) =>
                              value.length === 10 ||
                              "Phone number must be exactly 10 digits without country code",
                          },
                        }}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
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
                        )}
                      />
                    </Grid>
                    <Grid item md={5.8} mt={2}>
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          required: "email is required",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Enter a valid email address",
                          },
                        }}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            name="email"
                            label="Email"
                            placeholder="Enter email address"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            onChange={handleInputChange}
                            defaultValue={
                              selectedDevice ? selectedDevice?.email : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item md={5.8} mt={2}>
                      <Controller
                        name="jobRole"
                        control={control}
                        rules={{
                          required: "Job role is required",
                        }}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
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
                        )}
                      />
                    </Grid>
                    <Grid item md={5.8} mt={2}>
                      <Controller
                        name="age"
                        control={control}
                        rules={{
                          required: "Age is required",
                          min: {
                            value: 18,
                            message: "Age must be at least 18",
                          },
                          max: {
                            value: 99,
                            message: "Age must be a two-digit number",
                          },
                          validate: {
                            isNotNegative: (value) =>
                              value >= 0 || "Age cannot be negative",
                            isTwoDigit: (value) =>
                              /^[1-9][0-9]$/.test(value) ||
                              "Age must be a two-digit number",
                          },
                        }}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            field="number"
                            name="age"
                            label="Age"
                            placeholder="Enter age"
                            error={!!errors.age}
                            helperText={errors.age?.message}
                            onChange={handleInputChange}
                            defaultValue={
                              selectedDevice ? selectedDevice?.age : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item md={5.8} mt={2}>
                      <Controller
                        name="salary"
                        control={control}
                        rules={{
                          required: "Salary is required",
                          validate: {
                            isNotNegative: (value) =>
                              value >= 0 || "Salary cannot be negative",
                          },
                        }}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
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
                        )}
                      />
                    </Grid>
                    <Grid item md={5.8} mt={2}>
                      <FormControl fullWidth error={!!errors?.category}>
                        <InputLabel>Category </InputLabel>
                        <Controller
                          name="category"
                          control={control}
                          rules={{
                            required: "category is required",
                          }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              label="Category"
                              placeholder="Enter category"
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              defaultValue={
                                selectedDevice ? selectedDevice?.category : ""
                              }
                            >
                              {employmentTypes &&
                                employmentTypes?.map(
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
                          {(errors as any) && errors?.category?.message}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item md={5.8} mt={2}>
                      <FormControl fullWidth error={!!errors?.shift}>
                        <InputLabel>Shift </InputLabel>
                        <Controller
                          name="shift"
                          control={control}
                          rules={{
                            required: "shift is required",
                          }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              label="shift"
                              placeholder="Enter shift"
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              defaultValue={selectedDevice?.shift?._id || ""}
                            >
                              {selectData &&
                                selectData?.map((item: any, index: number) => (
                                  <MenuItem key={index} value={item?._id}>
                                    {item?.shiftName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {(errors as any) && errors?.shift?.message}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item md={5.8} mt={2}>
                      <Controller
                        name="shiftRange"
                        control={control}
                        rules={{
                          required: "ShiftRange is required",
                          pattern: {
                            value: /^[1-7]$/,
                            message: "Shift must be a number between 1 and 7",
                          },
                        }}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            field="number"
                            name="shiftRange"
                            label="Shift range"
                            placeholder="Enter shift"
                            error={!!errors.shiftRange}
                            helperText={errors.shiftRange?.message}
                            onChange={handleInputChange}
                            defaultValue={
                              selectedDevice
                                ? selectedDevice?.shiftDateRange?.value
                                : ""
                            }
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
                      selectedDevice={selectedDevice}
                      url="trolleys/getAllTrolleys"
                      setOpen={setOpen}
                      title="Assign User"
                      trolley={trolley}
                      setTrolley={setTrolley}
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
                      type="submit"
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
                      sx={{ width: "150px" }}
                    >
                      Submit
                    </Button>
                  </>
                )}
              </DialogActions>
            </form>
          </FormProvider>
        </CommonDialog>
      </LocalizationProvider>
    </>
  );
};

export default AddManPower;
