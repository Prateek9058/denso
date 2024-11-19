"use client";
import React, { ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  DialogActions,
  Button,
  DialogContent,
  Grid,
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
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
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
const AddDevice: React.FC<AddDeviceProps> = ({
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
  const [startTime, setStartTime] = React.useState<Dayjs | null>(dayjs(""));
  const [endTime, setEndTime] = React.useState<Dayjs | null>(dayjs(""));
  useEffect(() => {
    setValue("shiftName", selectedShift?.shiftName);
    setStartTime(dayjs(dayjs(selectedShift?.startTime).format("lll")));
    setEndTime(dayjs(dayjs(selectedShift?.endTime).format("lll")));
  }, [selectedShift, open]);

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
    let res;
    const formData = getValues();

    const shiftId = selectedShift?._id;
    const body = {
      shiftName: formData?.shiftName,
      startTime: dayjs(startTime).format("lll"),
      endTime: dayjs(endTime).format("lll"),
    };
    try {
      if (selectedShift) {
        res = await axiosInstance.patch(
          `shifts/updateShiftTime/${shiftId}`,
          body
        );
      } else {
        res = await axiosInstance.post(`shifts/addShift/`, body);
      }
      if (res?.status === 200 || res?.status === 201) {
        {selectedShift?notifySuccess("Shift updated successfully"):notifySuccess("Shift added successfully")}
        getDeviceData();
        handleClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(
        axiosError?.response?.data?.message || "Error creating shift"
      );
      console.log(error);
      // handleClose();
    }
  };

  return (
    <>
      <CommonDialog
        open={open}
        maxWidth={"sm"}
        fullWidth={true}
        title="Add a New Shift"
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
            >
              <Grid item md={12}>
                <Stack>
                  <CustomTextField
                    {...register("shiftName", {
                      required: "Shift Name is required",
                    })}
                    name="shiftName"
                    label="Shift Name"
                    placeholder="Enter Shift Name"
                    error={!!errors.shiftName}
                    helperText={errors.shiftName?.message}
                    onChange={handleInputChange}
                    defaultValue={selectedShift ? selectedShift?.shiftName : ""}
                  />
                </Stack>
              </Grid>
              <Grid item md={6}>
                <Stack alignItems={"center"}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["TimePicker"]}>
                      <TimePicker
                        label="Shift Start Time"
                        value={startTime}
                        onChange={(newValue) => setStartTime(newValue)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>{" "}
                </Stack>
              </Grid>
              <Grid item md={6}>
                <Stack alignItems={"center"}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["TimePicker"]}>
                      <TimePicker
                        label="Shift End Time"
                        value={endTime}
                        onChange={(newValue) => setEndTime(newValue)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>{" "}
                </Stack>
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
