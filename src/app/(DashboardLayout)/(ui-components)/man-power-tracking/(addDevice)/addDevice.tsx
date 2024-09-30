"use client";
import React, { ChangeEvent, useEffect, useState, useCallback } from "react";
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
    reset,
  } = useForm();
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [selectData, setSelectData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
    <>
      <CommonDialog
        open={open}
        maxWidth={"md"}
        fullWidth={true}
        title={`${selectedDevice ? "Edit" : "Add"} Employee`}
        message={"Are you sure you want to cancel?"}
        titleConfirm={"Cancel"}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container justifyContent={"space-between"} mt={2}>
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
                  defaultValue={selectedDevice ? selectedDevice?.fullName : ""}
                />
              </Grid>
              <Grid item md={5.8}>
                <CustomTextField
                  {...register("manpowerId", {
                    required: "Manpower Id is required",
                    pattern: {
                      value: /^[a-zA-Z0-9]/,
                      message: "Manpower id must be 15 alphanumeric characters",
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
                  {...register("macId", {
                    required: "MacId is required",
                    pattern: {
                      value: /^[a-zA-Z0-9]/,
                      message: "MacId id must be alphanumeric characters",
                    },
                  })}
                  name="macId"
                  label="Mac ID"
                  placeholder="Enter macId"
                  error={!!errors.macId}
                  helperText={errors.macId?.message}
                  onChange={handleInputChange}
                  defaultValue={selectedDevice ? selectedDevice?.macId : ""}
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
                  defaultValue={selectedDevice ? selectedDevice?.jobRole : ""}
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
