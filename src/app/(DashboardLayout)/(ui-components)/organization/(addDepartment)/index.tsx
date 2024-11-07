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
  getDeviceData: () => void;
  selectedDevice?: any;
  type?: any;
}
interface ErrorResponse {
  message?: string;
}
const AddDevice: React.FC<AddDeviceProps> = ({
  open,
  setOpen,
  getDeviceData,
  selectedDevice,
  type,
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
  const [loading, setLoading] = useState<boolean>(false);
  const [uid, setUid] = useState<any>("");
  const handleClose = () => {
    setOpen(false);
    reset();
    setUid("")
  };

  const onSubmit = async () => {
    if (!type) return;
    const formData = getValues();
    const body = {
      name: formData?.name,
      uId: uid,
      type: type,
    };
    try {
      const res = await axiosInstance.post(`organizations/add`, body);
      if (res?.status === 200 || res?.status === 201) {
        notifySuccess(
          `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`
        );
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
  const getUid = useCallback(async () => {
    if (!type) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `organizations/getUid?type=${type}`
      );
      if (res?.status === 200 || res?.status === 201) {
        setUid(res?.data?.data);
        console.log(res);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [type]);
  useEffect(() => {
    if (open) {
      getUid();
    }
  }, [open, type]);
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
        title={`Add a New ${type}`}
        message={"Are you sure you want to cancel?"}
        titleConfirm={"Cancel"}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container justifyContent={"space-between"}>
              <Grid item md={5.8}>
                <CustomTextField
                  name="Uid"
                  label="Uid"
                  placeholder="Enter Uid"
                  error={!!errors.Uid}
                  helperText={errors.Uid?.message}
                  onChange={handleInputChange}
                  disabled={true}
                  defaultValue={uid}
                />
              </Grid>
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
