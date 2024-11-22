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

interface AddDeviceProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getDeviceData: () => void;
  title?: string;
  selectedShift?: any;
  setSelectedShift: any;
}
interface ErrorResponse {
  message?: string;
}
const AddDevice: React.FC<AddDeviceProps> = ({
  open,
  setOpen,
  getDeviceData,
  title,
  selectedShift,
  setSelectedShift,
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
  const [startTime, setStartTime] = React.useState<Dayjs | null>(dayjs());
  const [endTime, setEndTime] = React.useState<Dayjs | null>(dayjs());

  useEffect(() => {
    if (title === "Edit Shift" && open) {
      setValue("shiftName", selectedShift?.shiftName);
      setStartTime(
        dayjs(dayjs(selectedShift?.startTime ?? null).format("lll"))
      );
      setEndTime(dayjs(dayjs(selectedShift?.endTime ?? null).format("lll")));
    } else {
      console.log(title, "title");
      setStartTime(dayjs());
      setEndTime(dayjs());
    }
  }, [open, selectedShift]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue(name, value);
    if (errors[name]) {
      clearErrors(name);
    }
  };
  const onSubmit = async () => {
    const formData = getValues();
    const body = {
      shiftName: formData?.shiftName,
      startTime: dayjs(startTime).format("lll"),
      endTime: dayjs(endTime).format("lll"),
    };
    try {
      if (selectedShift) {
        const { data, status } = await axiosInstance.patch(
          `shifts/updateShiftTime/${selectedShift?._id}`,
          body
        );
        if (status === 200 || status === 201) {
          notifySuccess("Shift Edit successfully");
          getDeviceData();
          handleClose();
        }
      } else {
        const { data, status } = await axiosInstance.post(
          "shifts/addShift",
          body
        );
        if (status === 200 || status === 201) {
          notifySuccess("Shift Added successfully");
          getDeviceData();
          handleClose();
        }
      }
    } catch (error: any) {
      notifyError(error?.response?.data?.message);
    }
  };
  const handleClose = () => {
    setOpen(false);
    reset();
    setSelectedShift(null);
  };
  return (
    <>
      <CommonDialog
        open={open}
        maxWidth={"sm"}
        fullWidth={true}
        title={`${title}`}
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
