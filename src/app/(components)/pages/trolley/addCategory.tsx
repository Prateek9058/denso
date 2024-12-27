"use client";
import React, { ChangeEvent, useEffect, useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  DialogActions,
  Button,
  DialogContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
} from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import axiosInstance from "@/app/api/axiosInstance";
import { BlockPicker, SketchPicker } from "react-color";

type selectDropDownData = {
  label: string;
  value: string;
};
const selectColor: selectDropDownData[] = [
  { label: "Pink", value: "pink" },
  { label: "Red", value: "Red" },
];
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
    control,
  } = useForm();
  const handleClose = () => {
    setOpen(false);
    setColor("");
    reset();
  };
  const [color, setColor] = useState("");
  useEffect(() => {
    if (selectedDevice) {
      setValue("macId", setcategoryUid(selectedDevice?.uId));
      setValue("name", selectedDevice?.name);
      setValue("color", selectedDevice?.color);
    }
  }, [selectedDevice]);

  const [categoryUid, setcategoryUid] = useState<string>("");
  const handleCategoryUid = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        "/trolleyCategory/getUid"
      );
      if (status === 200 || status === 201) {
        setcategoryUid(data?.data);
        console.log("data", data?.data);
      }
    } catch (error) {
      notifyError((error as any)?.response?.data?.message);
    }
  };
  useEffect(() => {
    if (open) {
      handleCategoryUid();
    }
    setValue("macId", categoryUid);
  }, [categoryUid, open]);

  const onSubmit = async () => {
    const formData = getValues();
    const body = {
      name: formData?.name,
      uId: formData?.macId,
      color: color,
    };
    try {
      let res;
      if (selectedDevice) {
        res = await axiosInstance.patch(
          `/trolleyCategory/updateTrolleyCategory/${selectedDevice?._id}`,
          body
        );
      } else {
        res = await axiosInstance.post(
          `trolleyCategory/addTrolleyCategory`,
          body
        );
      }

      if (res?.status === 200 || res?.status === 201) {
        notifySuccess(
          selectedDevice
            ? `Category updated successfully`
            : `Category added successfully`
        );
        getCategoryData();
        handleClose();
      }
    } catch (error: any) {
      notifyError(error?.response?.data?.message);
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

  const handleChange = (color: any) => {
    setColor(color?.hex);
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
              <Grid item xs={5.8}>
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
                    label="Trolley category Uid "
                    placeholder="Enter trolley uid"
                    error={!!errors.macId}
                    disabled={selectedDevice}
                    helperText={errors.macId?.message}
                    onChange={handleInputChange}
                    defaultValue={
                      categoryUid ? categoryUid : selectedDevice?.uId
                    }
                  />
                </Grid>
                <Grid item md={12}>
                  <CustomTextField
                    {...register("name", {
                      required: "Trolley type is required",
                    })}
                    name="name"
                    label="Trolley type"
                    placeholder="Enter type category"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    onChange={handleInputChange}
                    defaultValue={selectedDevice ? selectedDevice?.name : ""}
                  />
                </Grid>
                <Grid item md={12}>
                  <CustomTextField
                    disabled
                    label="Trolley color"
                    placeholder="Enter trolley color"
                    defaultValue={
                      selectedDevice ? selectedDevice?.color : color
                    }
                  />
                </Grid>
              </Grid>
              <Grid item md={5.8}>
                <Typography variant="subtitle2" gutterBottom mb={2}>
                  Trolley Color
                </Typography>
                <BlockPicker
                  color={color}
                  onChange={handleChange}
                  colors={[
                    "#FF6900",
                    "#FCB900",
                    "#00D084",
                    "#8ED1FC",
                    "#0693E3",
                    "#0693E3",
                    "#0693E3",
                    "#ABB8C3",
                  ]}
                  styles={{
                    default: {
                      card: {
                        width: "100%",
                      },
                      head: {
                        display: "none",
                      },
                      input: {
                        display: "none",
                      },
                    },
                  }}
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
