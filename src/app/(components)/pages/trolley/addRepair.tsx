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
  const [dropDownData, setDropDownData] = useState<any[]>([]);
  const handleClose = () => {
    setOpen(false);
    getTrolleyData();
    reset();
  };

  // const dropDownData = [
  //   {
  //     _id: "671645b6740b31a416f231c1",
  //     label: "break",
  //   },
  //   {
  //     _id: "67177d3bb5491ed7dad99c75",
  //     label: "short",
  //   },
  //   {
  //     _id: "671f552da5ec829121b895de",
  //     label: "1stK",
  //   },
  //   {
  //     _id: "672870361e4a8366fba338e7",
  //     label: "TEST5",
  //   },
  //   {
  //     _id: "672892d91e4a8366fba33a1f",
  //     label: "rohit",
  //   },
  //   {
  //     _id: "67358445ee949f08984414e1",
  //     label: "test",
  //   },
  // ];
  const getAllIssues = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        `/trolleyMaintenance/getTrolleyIssues`
      );
      if (status === 200 || status === 201) {
        const issuesArray = Object.entries(data?.data).map(
          ([value], index) => ({
            label: value,
            _id: index,
          })
        );
        setDropDownData(issuesArray);
        console.log(issuesArray);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (open) getAllIssues();
  }, [open]);

  const onSubmit = async () => {
    if (!selectedDevice?._id) return;
    let body;
    const formdata = getValues();
    const matchingItem = dropDownData?.find(
      (item) => item?._id === formdata?.issue
    );
    if (matchingItem) {
      body = {
        issue: matchingItem?.label,
      };
    }
    try {
      const res = await axiosInstance.post(
        `trolleyMaintenance/addTrolleyRepairing/${selectedDevice?._id}`,
        body
      );
      if (res?.status === 200 || res?.status === 201) {
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
          title="Trolley issue"
          message={"Are you sure you want to cancel?"}
          titleConfirm={"Cancel"}
          onClose={handleClose}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Grid container justifyContent={"center"} mt={1}>
                <Grid item md={12}>
                  <CustomTextField
                    {...register("issue", {
                      required: "Trolley issue is required",
                    })}
                    select
                    selectData={dropDownData}
                    name="issue"
                    label="Select Issue"
                    placeholder="Enter issue"
                    error={!!errors.issue}
                    helperText={errors.issue?.message}
                    onChange={handleInputChange}
                    defaultValue={""}
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
