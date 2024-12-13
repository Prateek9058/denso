"use client";
import React, { useEffect, useState } from "react";
import {
  Step,
  Button,
  Stepper,
  StepLabel,
  DialogActions,
  DialogContent,
} from "@mui/material";
import Step1 from "./assignMen";

import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import { useForm, FormProvider } from "react-hook-form";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import axiosInstance from "@/app/api/axiosInstance";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
  getTrolleyData?: any;
}

interface SelectedItems {
  sections: string[];
}

export default function AssignAssessment({
  open,
  setOpen,
  data,
  getTrolleyData,
}: Props) {
  const methods = useForm<any>();
  const {
    setValue,
    handleSubmit,
    clearErrors,
    getValues,
    watch,
    reset,
    formState: { errors },
    control,
  } = methods;
  const [activeStep, setActiveStep] = useState(0);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    sections: [],
  });

  useEffect(() => {
    if (data) {
      setSelectedItems({
        sections: data?.assingedTo?.map((item: any) => item?._id) || [],
      });
    }
  }, [data]);

  const handleSelectionChange = (key: keyof SelectedItems, id: string) => {
    setSelectedItems((prevState) => {
      if (key === "sections") {
        const updatedValues = prevState[key].includes(id)
          ? prevState[key].filter((itemId) => itemId !== id)
          : [...prevState[key], id];

        return { ...prevState, [key]: updatedValues };
      }

      return prevState;
    });
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async () => {
    try {
      const data1 = {
        employeeIds: selectedItems?.sections,
        trolleyId: data?._id,
      };
      const { status } = await axiosInstance.post(
        `trolleys/assingeEmployee?isEmployeeChange=true`,
        data1
      );
      if (status === 201 || status === 200) {
        notifySuccess("Men assign successfully");
        getTrolleyData();
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CommonDialog
      open={open}
      maxWidth={"md"}
      fullWidth={true}
      title={"Assign Mens"}
      message={"Are you sure you want to cancel?"}
      titleConfirm={"Cancel"}
      onClose={handleClose}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ height: "300px" }}>
            <Step1
              selectedItems={selectedItems}
              handleSelectionChange={handleSelectionChange}
            />
          </DialogContent>

          <DialogActions className="dialog-action-btn">
            {activeStep == 0 && (
              <ConfirmationDialog
                title={"Cancel"}
                handleCloseFirst={handleClose}
                message={"Are you sure you want to cancel?"}
              />
            )}
            {activeStep !== 0 && (
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{ width: "150px" }}
              >
                Back
              </Button>
            )}

            <Button variant="contained" type="submit" sx={{ width: "150px" }}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </CommonDialog>
  );
}
