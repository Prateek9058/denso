"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  DialogActions,
  Button,
  DialogContent,
  Grid,
  Box,
  Typography,
  LinearProgress,
  Stack,
} from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import axiosInstance from "@/app/api/axiosInstance";
import { AxiosError } from "axios";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import EditIcon from "@mui/icons-material/Edit";

const selectData = ["A", "B"];
interface AddDeviceProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getDeviceData: () => void;
  selectedDevice?: any;
  selectedSite?: any;
  selectedShift?: any;
}
interface ErrorResponse {
  message?: string;
}
const EditProfile: React.FC<AddDeviceProps> = ({
  open,
  setOpen,
  getDeviceData,
  selectedDevice,
  selectedSite,
  selectedShift,

}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
    reset,
  } = useForm();
 


  const handleClose = () => {
    setOpen(false);
    reset();
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue(name, value);
    if (errors[name]) {
      clearErrors(name);
    }
  };
  const onSubmit = async () => {
    
    const formData = getValues();
    const shiftId = selectedShift?._id;
    const body = {
    fullName: formData?.name,
    phoneNumber: formData?.phone,
    password: formData?.password,
    };
    try {
      
        const res = await axiosInstance.patch(
          `auth/updateAdminProfile`,
          body
        );
       
      if (res?.status === 200 || res?.status === 201) {
        notifySuccess("Profile updated successfully");
        getDeviceData();
        handleClose();
      }
    } catch (error) {
      console.log("error data",error)

      const axiosError = error as AxiosError<ErrorResponse>;
    //   console.log("error data",axiosError?.response?.data?.message)

      notifyError(
        axiosError?.response?.data?.message || "Error creating shift"
      );
    //   console.log(error);
      // handleClose();
    }
  };

console.log('selectedShift',selectedShift)

  return (
    <>
      <CommonDialog
        open={open}
        maxWidth={"md"}
        fullWidth={true}
        title="Update Profile Detials"
        message={"Are you sure you want to cancel?"}
        titleConfirm={"Cancel"}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid
              container
              justifyContent={"center"}
              alignItems={"center"}
              mt={1}
              spacing={3}
            >
              <Grid item md={6} >
                <Stack >
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
                      selectedShift ? selectedShift?.fullName : ""
                    }
                  />
                </Stack>
              </Grid>
              <Grid item md={6}>
                <Stack >
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
                    placeholder="Enter Phone Number"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    onChange={handleInputChange}
                    defaultValue={
                      selectedShift ? selectedShift?.phoneNumber : ""
                    }
                  />
                </Stack>
              </Grid>
              <Grid item md={6}>
              <Stack >
                  <CustomTextField
                   {...register("email")}
                    name="email"
                    label="Email Address"
                    placeholder="Enter email address"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    onChange={handleInputChange}
                    defaultValue={selectedShift?.email || ""}
                    disabled={true}
                  />
                </Stack>
              </Grid>
              <Grid item md={6} >
              <Stack >
                  <CustomTextField
                    {...register("password", {
                      required: "Password is required",
                    })}
                    field='password'
                    name="password"
                    label="Password"
                    placeholder="Enter Password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    onChange={handleInputChange}
                    defaultValue={
                      ''
                    }
                  />
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="dialog-action-btn"   >
            <ConfirmationDialog
              title={"Cancel"}
              handleCloseFirst={handleClose}
              message={"Are you sure you want to cancel?"}
            />
            <Button
              variant="contained"
              type="submit"
              sx={{ width: "150px", color: "white" }}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </CommonDialog>
    </>
  );
};

export default EditProfile;
