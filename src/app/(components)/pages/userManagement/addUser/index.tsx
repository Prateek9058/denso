import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import {
  DialogActions,
  Button,
  DialogContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  LinearProgress,
  Avatar,
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
import UserDepartment from "./userDepartment";
import UserPermission from "./userPermission";

interface AddUserProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDevice?: any;
}
interface ErrorResponse {
  message?: string;
}

const AddUser: React.FC<AddUserProps> = ({ open, setOpen, selectedDevice }) => {
  const [activeStep, setActiveStep] = useState(0);

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

  const steps = ["Add User", "Department", "Permission"];

  const [selectDropDownData, setSelectDropDownData] = useState<any>(null);
  console.log("selectedDevice55", selectedDevice);

  //   useEffect(() => {
  //     if (selectedDevice) {

  //       setValue("trolleyId", selectedDevice?.uId);
  //       setValue("macId", selectedDevice?.macId);
  //       setValue("name", selectedDevice?.name);
  //       setValue("trolleyColor", selectedDevice?.trolleyColor);
  //       setValue("pathPointers", selectedDevice?.pathPointers);
  //       setValue("routeProcess", selectedDevice?.routeProcess);
  //       setValue("departmentId", selectedDevice?.departmentId);

  //     } else {
  //       reset();
  //     }

  //   }, [open, selectedDevice]);

  //   const getTrolleyCategoriesData = async () => {
  //     try {
  //       const res = await axiosInstance.get(
  //         "trolleyCategory/getAllTrolleyCategories"
  //       );
  //       if (res?.status === 200 || res?.status === 201) {
  //         const dropdownData = res?.data?.data?.data.map((value: any) => ({
  //           _id: value?._id,
  //           label: value?.name,
  //           value: value?.color,
  //         }));
  //         setSelectDropDownData(dropdownData);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching trolley categories:", err);
  //     }
  //   };

  //   const getFinalSectionDropdownData = async () => {
  //     try {
  //       const [departmentRes, sectionRes, lineRes] = await Promise.all([
  //         axiosInstance.get(`organizations/getAllData?type=department`),
  //         axiosInstance.get(`organizations/getAllData?type=section`),
  //         axiosInstance.get(`organizations/getAllData?type=line`),
  //       ]);

  //       const validResponses = [departmentRes, sectionRes, lineRes].filter(
  //         (res) => res?.status === 200 || res?.status === 201
  //       );

  //       if (validResponses.length > 0) {
  //         const allData = validResponses.flatMap(
  //           (res) => res?.data?.data?.data || []
  //         );
  //         setFinalSectionDropDownData(allData);
  //       } else {
  //         console.log("No data available for dropdown.");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching section dropdown data:", err);
  //     }
  //   };

  //   useEffect(() => {
  //     if (open) {
  //       getTrolleyCategoriesData();
  //       getFinalSectionDropdownData();
  //     }
  //   }, [open]);

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    reset();
  };
  const trolleyBoxLabel = () => {
    if (activeStep == 0) {
      return `${selectedDevice ? "Edit" : "Add"} User `;
    } else if (activeStep == 1) {
      return "Department";
    } else if (activeStep == 2) {
      return "Permission";
    }
  };

  // if (selectedDevice && (!selectedCategory || selectedCategory.length === 0)) {
  //   console.log("aaya")

  //     setValue("trolleyCategoryId", selectedDevice?.trolleyCategoryId?._id);
  //   }
  //   else{
  //   setValue("trolleyCategoryId", selectedCategory);

  //   }
  const onSubmit = async () => {
    // console.log("selectedCategory2",selectedCategory)
    // if (selectedDevice && (!selectedCategory || selectedCategory.length === 0)) {
    //   console.log("aaya")

    //     setValue("trolleyCategoryId", selectedDevice?.trolleyCategoryId?._id);
    //   }
    //   else{
    //   setValue("trolleyCategoryId", selectedCategory);

    //   }
    const values = getValues();
    // setValue("trolleyCategoryId", selectedCategory);
    // setValue("trolleyColor", color);
    // setValue("pathPointers", points);
    // setValue("routeProcess", rows);

    handleNext();

    const formData = getValues();
    console.log("valuuuuuu", formData);
    const body = {
      uId: formData?.trolleyId,
      macId: formData?.macId,
      name: formData?.name,
      trolleyCategoryId: formData?.trolleyCategoryId,
      trolleyColor: formData?.trolleyColor,
      pathPointers: formData?.pathPointers,
      routeProcess: formData?.routeProcess,
      departmentId: formData?.department,
      sectionId: formData?.section,
      lineId: formData?.line,
      distance: formData?.totalDistance
        ? {
            distanceValue: formData.totalDistance,
            unit: "meters",
          }
        : undefined,
      totalTime: formData?.totalTime
        ? {
            time: formData.totalTime,
            unit: "seconds",
          }
        : undefined,
      repetedCycles: formData?.repetedCycles,
    };
    console.log("bodyyyyy", body);

    try {
      let res;
      if (selectedDevice) {
        res = await axiosInstance.patch(
          `api/v1/trolleys/updateTrolley/${selectedDevice?._id}`,
          body
        );
      } else if (formData?.repetedCycles) {
        res = await axiosInstance.post(`trolleys/createTrolley`, body);
      }
      if (res?.status === 200 || res?.status === 201) {
        console.log(res);
        notifySuccess(
          `Trolley ${selectedDevice ? "Edit" : "created"} successfully`
        );
        handleClose();
        reset();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(
        axiosError?.response?.data?.message || "Error creating trolley"
      );
      console.log(error);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log("name add", value);

    setValue(name, value);
    if (errors[name]) {
      clearErrors(name);
    }
  };
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };
  console.log("selectDropDownData", selectDropDownData);
  return (
    <>
      <CommonDialog
        open={open}
        maxWidth={"lg"}
        fullWidth={true}
        // title={`${selectedDevice ? "Edit" : "Add"} Trolley `}
        title={`${trolleyBoxLabel()}`}
        message={"Are you sure you want to cancel?"}
        titleConfirm={"Cancel"}
        onClose={handleClose}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stepper
              sx={{ padding: "20px" }}
              activeStep={activeStep}
              alternativeLabel
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <DialogContent>
              {activeStep === 0 && (
                <Grid container justifyContent={"space-between"}>
                  <Grid item md={5.8}>
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{
                        required: "User first name is required",
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label="First Name"
                          placeholder="Enter First Name"
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                          onChange={handleInputChange}
                          defaultValue={
                            selectedDevice ? selectedDevice?.firstName : ""
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <Controller
                      name="secondName"
                      control={control}
                      rules={{
                        required: "User second name is required",
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label="Second name"
                          placeholder="Enter Second Name"
                          error={!!errors.secondName}
                          helperText={errors.secondName?.message}
                          onChange={handleInputChange}
                          defaultValue={
                            selectedDevice ? selectedDevice?.secondName : ""
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <Controller
                      name="phone"
                      control={control}
                      rules={{
                        required: "User phone number is required",
                        validate: {
                          length: (value) =>
                            value.length === 10 ||
                            "Phone number must be exactly 10 digits without country code",
                        },
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          field='number'
                          label="Phone number"
                          placeholder="Enter Phone number"
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                          onChange={handleInputChange}
                          defaultValue={
                            selectedDevice ? selectedDevice?.phone : ""
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: "User email address is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Enter a valid email address",
                        },
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label="Email Address"
                          placeholder="Enter Email Address"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          onChange={handleInputChange}
                          defaultValue={
                            selectedDevice ? selectedDevice?.email : ""
                          }
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              )}
              {activeStep === 1 && (
                <Grid container justifyContent={"space-between"}>
                  <UserDepartment />
                </Grid>
              )}
              {activeStep === 2 && (
                <Grid container justifyContent={"space-between"}>
                  <UserPermission />
                </Grid>
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
                    // onClick={handleNext}
                    sx={{ width: "150px" }}
                  >
                    Next
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ width: "150px" }}
                >
                  Submit
                </Button>
              )}
            </DialogActions>
          </form>
        </FormProvider>{" "}
      </CommonDialog>
    </>
  );
};

export default AddUser;