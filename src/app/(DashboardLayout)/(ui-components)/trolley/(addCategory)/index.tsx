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

const selectData = ["A", "B"];
interface AddDeviceProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getCategoryData: () => void;
  selectedDevice?: any;
}
interface ErrorResponse {
  message?: string;
}
const AddCategory: React.FC<AddDeviceProps> = ({
  open,
  setOpen,
  getCategoryData,
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
      name: formData?.name,
      uId: formData?.macId,
      color: formData?.color,
    };
    try {
      const res = await axiosInstance.post(
        `/api/v1/trolleyCategory/addTrolleyCategory`,
        body
      );
      if (res?.status === 200 || res?.status === 201) {
        notifySuccess(`Category added successfully`);
        getCategoryData();
        handleClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(
        axiosError?.response?.data?.message || "Error creating category"
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
        maxWidth={"sm"}
        fullWidth={true}
        title={`Add a New category`}
        message={"Are you sure you want to cancel?"}
        titleConfirm={"Cancel"}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container justifyContent={"space-between"}>
              <Grid item md={12}>
                <CustomTextField
                  {...register("macId", {
                    required: "Trolley Uid is required",
                    pattern: {
                      value: /^[a-zA-Z0-9]/,
                      message: "Trolley Uid must be alphanumeric characters",
                    },
                  })}
                  name="macId"
                  label="Trolley Uid "
                  placeholder="Enter trolley uid"
                  error={!!errors.macId}
                  helperText={errors.macId?.message}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item md={5.8}>
                <CustomTextField
                  {...register("name", {
                    required: "Trolley name is required",
                  })}
                  name="name"
                  label="Trolley Name"
                  placeholder="Enter trolley name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item md={5.8}>
                <CustomTextField
                  {...register("color", {
                    required: "Trolley color is required",
                  })}
                  name="color"
                  label="Trolley Color"
                  placeholder="Enter trolley color"
                  error={!!errors.color}
                  helperText={errors.color?.message}
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

export default AddCategory;
