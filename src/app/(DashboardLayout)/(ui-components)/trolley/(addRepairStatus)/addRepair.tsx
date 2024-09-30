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
interface AddDeviceProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getTrolleyData: () => void;
  selectedDevice?: any;
}
interface ErrorResponse {
  message?: string;
}
const AddRepair: React.FC<AddDeviceProps> = ({
  open,
  setOpen,
  getTrolleyData,
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
    control,
  } = useForm();
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const handleClose = () => {
    setOpen(false);
    getTrolleyData();
    reset();
  };
  useEffect(() => {
    const storedSite = localStorage.getItem("selectedSite");
    if (storedSite) {
      setSelectedSite(JSON.parse(storedSite));
    }
  }, []);
  const onSubmit = async () => {
    if (!selectedSite?._id) return;
    try {
      const formData = getValues();
      const body = {
        issue: formData?.issue,
        status: formData?.status,
        repairingStatus: true,
        repairDate: dayjs(formData?.repairDate).format("YYYY-MM-DD"),
      };
      const res = await axiosInstance.post(
        `/api/v1/trolleyRepairing/addTrolleyRepairing/${selectedSite?._id}/${selectedDevice?._id}`,
        body
      );
      if (res?.status === 200 || res?.status === 201) {
        console.log(res);
        notifySuccess("Trolley repair info added successfully");
        getTrolleyData();
        handleClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(
        axiosError?.response?.data?.message ||
          "Error updating trolley repair info"
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
          title="Add a repair information"
          message={"Are you sure you want to cancel?"}
          titleConfirm={"Cancel"}
          onClose={handleClose}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Grid container justifyContent={"space-between"} mt={1}>
                <Grid item md={5.8}>
                  <CustomTextField
                    {...register("issue", {
                      required: "Trolley issue is required",
                    })}
                    name="issue"
                    label="Issue"
                    placeholder="Enter issue"
                    error={!!errors.issue}
                    helperText={errors.issue?.message}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item md={5.8}>
                  <CustomTextField
                    {...register("status", {
                      required: "Status is required",
                    })}
                    name="status"
                    label="Status"
                    placeholder="Enter status"
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item md={5.8}>
                  <Controller
                    name="repairDate"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <DatePicker
                        sx={{ width: "100%", color: "#ACACAC" }}
                        label="Date of repair"
                        {...field}
                      />
                    )}
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
      </LocalizationProvider>
    </>
  );
};

export default AddRepair;
