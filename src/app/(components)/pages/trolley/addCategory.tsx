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
} from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import axiosInstance from "@/app/api/axiosInstance";

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
    reset();
  };

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
      color: formData?.color,
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
        console.log("sdfkjsd");
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
                  label="Trolley category Uid "
                  placeholder="Enter trolley uid"
                  error={!!errors.macId}
                  disabled={selectedDevice}
                  helperText={errors.macId?.message}
                  onChange={handleInputChange}
                  defaultValue={categoryUid ? categoryUid : selectedDevice?.uId}
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
                  defaultValue={selectedDevice ? selectedDevice?.name : ""}
                />
              </Grid>
              <Grid item md={5.8}>
                <FormControl fullWidth error={!!errors?.color}>
                  <InputLabel>Trolley Color </InputLabel>
                  <Controller
                    name="color"
                    control={control}
                    rules={{
                      required: "Trolley color is required",
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select Trolley type"
                        label={"Trolley type"}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        defaultValue={
                          selectedDevice
                            ? selectedDevice?.trolleyCategoryId?.name
                            : selectedDevice?.color
                        }
                      >
                        {selectColor &&
                          selectColor?.map((item: any, index: number) => (
                            <MenuItem key={index} value={item?.value}>
                              {item?.label}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>
                    {(errors as any) && errors?.color?.message}
                  </FormHelperText>
                </FormControl>
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
