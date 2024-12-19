"use client";
import React, { useEffect, useState } from "react";
import { Button, DialogActions, DialogContent } from "@mui/material";
import Step1 from "./assignMen";
import { notifySuccess } from "@/app/(components)/mui-components/Snackbar";
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
  department: string | null;
}

export default function AssignAssessment({
  open,
  setOpen,
  data,
  getTrolleyData,
}: Props) {
  const methods = useForm<any>();

  console.log("gettrolle");
  const { handleSubmit } = methods;
  const [activeStep, setActiveStep] = useState(0);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    department: null,
  });
  console.log("data", data?.assignedTo);
  useEffect(() => {
    if (data?.assignedTo?.length > 0) {
      setSelectedItems({
        department: data?.assignedTo[0]?._id || null,
      });
    }
  }, [data]);

  const handleSelectionChange = (key: keyof SelectedItems, id: string) => {
    setSelectedItems((prevState) => {
      if (key === "department") {
        return { ...prevState, department: id };
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
        employeeIds: [selectedItems?.department],
        trolleyId: data?._id,
      };
      const { status } = await axiosInstance.post(
        `trolleys/assingeEmployee?isEmployeeChange=true`,
        data1
      );
      if (status === 201 || status === 200) {
        notifySuccess("Menpower assign successfully");
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
      title={"Assign Menpower"}
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
