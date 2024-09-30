"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

const selectData = ["A", "B"];
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
      // setValue(
      //   "purchaseDate",
      //   dayjs(selectedDevice?.purchaseDate).format("YYYY-MM-DD")
      // );
    } else {
      reset();
    }
  }, [setValue, reset, selectedDevice]);
  const handleClose = () => {
    setOpen(false);
    getTrolleyData();
    reset();
  };
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CommonDialog
          open={open}
          maxWidth={"sm"}
          fullWidth={true}
          title={`${selectedDevice ? "Edit" : "Add"} Trolley`}
          message={"Are you sure you want to cancel?"}
          titleConfirm={"Cancel"}
          onClose={handleClose}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Grid container justifyContent={"space-between"} mt={3}>
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
      </LocalizationProvider>
    </>
  );
};

export default AddDevice;
