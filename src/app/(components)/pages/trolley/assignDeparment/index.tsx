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
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
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
  trolleyId: any;
  getTrolleyData:any
}

interface SelectedItems {
  department: string | null;
  sections: string[];
  lines: string[];
}

export default function AssignAssessment({ open, setOpen, trolleyId,getTrolleyData }: Props) {
  const methods = useForm<any>();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = methods;
  const steps = [" Department", " Section", " Line"];
  const [activeStep, setActiveStep] = useState(0);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    department: null,
    sections: [],
    lines: [],
  });
  useEffect(() => {
    if (trolleyId) {
      setSelectedItems({
        department: trolleyId?.departmentId,
        sections: trolleyId?.sectionId || [],
        lines: trolleyId?.lineId || [],
      });
    }
  }, [trolleyId]);

  const handleSelectionChange = (key: keyof SelectedItems, id: string) => {
    setSelectedItems((prevState) => {
      if (key === "department") {
        return { ...prevState, department: id };
      }

      if (key === "sections" || key === "lines") {
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

  const handleNext = () => {
    if (activeStep === 0 && !Boolean(selectedItems?.department)) {
      notifyError("please select atleast one item !");
      return;
    } else if (activeStep === 1 && selectedItems?.sections?.length <= 0) {
      notifyError("please select atleast one item !");
      return;
    } else if (activeStep === 2 && selectedItems?.lines.length <= 0) {
      notifyError("please select atleast one item !");
      return;
    }
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const onSubmit = async () => {
    handleNext();
    try {
      const data1 = {
        departmentId: selectedItems?.department,
        sectionId: selectedItems?.sections,
        lineId: selectedItems?.lines,
      };
      if (activeStep === 2) {
        const { status } = await axiosInstance.post(
          `/trolleys/assignDepartmentSectionLineToTrolley/${trolleyId?._id}`,
          data1
        );
        if (status === 201 || status === 200) {
          notifySuccess("department assign successfully");
          getTrolleyData()
          handleClose();

        }
      }
    } catch (error: any) {
      console.log(error);
      notifyError(error?.response?.data?.message);
    }
  };

  return (
    <CommonDialog
      open={open}
      maxWidth={"md"}
      fullWidth={true}
      title={"Assign Department"}
      message={"Are you sure you want to cancel?"}
      titleConfirm={"Cancel"}
      onClose={handleClose}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stepper activeStep={activeStep} sx={{ mt: 2 }} alternativeLabel>
            {steps?.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <DialogContent sx={{ height: "300px" }}>
            {activeStep === 0 && (
              <Step1
                selectedItems={selectedItems}
                handleSelectionChange={handleSelectionChange}
              />
            )}

            {activeStep === 1 && (
              <Step2
                deptId={selectedItems?.department}
                selectedItems={selectedItems}
                handleSelectionChange={handleSelectionChange}
              />
            )}

            {activeStep === 2 && (
              <Step3
                sectionIds={selectedItems?.sections}
                selectedItems={selectedItems}
                handleSelectionChange={handleSelectionChange}
              />
            )}
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
            {activeStep < steps.length - 1 ? (
              <>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ width: "150px" }}
                >
                  Next
                </Button>
              </>
            ) : (
              <Button variant="contained" type="submit" sx={{ width: "150px" }}>
                Submit
              </Button>
            )}
          </DialogActions>
        </form>
      </FormProvider>
    </CommonDialog>
  );
}
