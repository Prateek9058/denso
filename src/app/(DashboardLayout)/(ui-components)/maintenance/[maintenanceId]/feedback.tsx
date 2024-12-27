"use client";
import React, { ChangeEvent } from "react";
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

interface AddDeviceProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getAllTrolleyRepairings: () => void;
  getTrolleyDetails: () => void;
  id: string;
}

const AddCategory: React.FC<AddDeviceProps> = ({
  open,
  setOpen,
  getAllTrolleyRepairings,
  getTrolleyDetails,
  id,
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

  const onSubmit = async (data: any) => {
    try {
      const { status } = await axiosInstance.post(
        `trolleyRepairing/updateTrolleyToRepair/${id}`,
        { data }
      );
      if (status === 200 || status === 201) {
        getTrolleyDetails();
        getAllTrolleyRepairings();
        notifySuccess("Trolley marked as repaired successfully");
        handleClose();
      }
    } catch (error: any) {
      notifyError(error?.response?.data?.message);
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
        title={`Trolley feedback`}
        message={"Are you sure you want to cancel?"}
        titleConfirm={"Cancel"}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container justifyContent={"space-between"}>
              <Grid item md={12}>
                <CustomTextField
                  {...register("issue")}
                  name="issue"
                  label="Trolley issue "
                  placeholder="Enter trolley issue"
                  error={!!errors.issue}
                  helperText={errors.issue?.message}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item md={12}>
                <CustomTextField
                  {...register("cost")}
                  name="cost"
                  field="number"
                  label="Trolley repair cost"
                  placeholder="Enter trolley repair cost"
                  error={!!errors.cost}
                  helperText={errors.cost?.message}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item md={12}>
                <CustomTextField
                  {...register("decriprion")}
                  multiline
                  label="Decriprion"
                  placeholder="Enter trolley issue description"
                  error={!!errors.decriprion}
                  helperText={errors.decriprion?.message}
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
