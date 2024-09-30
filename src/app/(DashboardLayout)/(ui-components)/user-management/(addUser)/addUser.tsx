"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DialogActions, Button, DialogContent, Grid } from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import axiosInstance from "@/app/api/axiosInstance";
import { AxiosError } from "axios";

interface AddDeviceProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getDeviceData: () => void;
  selectedDevice?: any;
}
interface ErrorResponse {
  message?: string;
}
const AddDevice: React.FC<AddDeviceProps> = ({
  open,
  setOpen,
  getDeviceData,
  selectedDevice,
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

  const onSubmit = async () => {
    const formData = getValues();
    const body = {
      firstName: formData?.fname,
      secondName: formData?.sname,
      email: formData?.email,
      phoneNumber: formData?.phone,
      countryCode: "IN",
      password: formData?.password,
    };
    try {
      const res = await axiosInstance.post("/api/v1/users/createUser", body);
      if (res?.status === 200 || res?.status === 201) {
        notifySuccess("User added successfully");
        getDeviceData();
        handleClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(
        axiosError?.response?.data?.message || "Error creating device"
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
  return (
    <>
      <CommonDialog
        open={open}
        maxWidth={"md"}
        fullWidth={true}
        title="Add a New User"
        message={"Are you sure you want to cancel?"}
        titleConfirm={"Cancel"}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid
              container
              justifyContent={"space-between"}
              alignItems={"center"}
              mt={1}
            >
              <Grid item md={5.8}>
                <CustomTextField
                  {...register("fname", {
                    required: "First Name is required",
                  })}
                  name="fname"
                  label="First Name"
                  placeholder="Enter first name"
                  error={!!errors.fname}
                  helperText={errors.fname?.message}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item md={5.8}>
                <CustomTextField
                  {...register("sname", {
                    required: "Second Name is required",
                  })}
                  name="sname"
                  label="Second Name"
                  placeholder="Enter second name "
                  error={!!errors.sname}
                  helperText={errors.sname?.message}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item md={5.8}>
                <CustomTextField
                  {...register("phone", {
                    required: "Phone number is required",
                    validate: {
                      length: (value) =>
                        value.length === 10 ||
                        "Phone number must be exactly 10 digits without country code",
                    },
                  })}
                  name="phone"
                  field="number"
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item md={5.8}>
                <CustomTextField
                  {...register("email", {
                    required: "email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  name="email"
                  label="Email Address"
                  placeholder="Enter email address"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item md={5.8}>
                <CustomTextField
                  {...register("password", {
                    required: "Password is required",
                  })}
                  name="password"
                  label="Password"
                  placeholder="Enter password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="dialog-action-btn">
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

export default AddDevice;
