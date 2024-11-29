import React, { ChangeEvent, useState, useCallback, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import {
  DialogActions,
  Button,
  DialogContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
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
import Step2 from "./Step2";
import Step3 from "./Step3";

interface AddUserProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUserDetails: React.Dispatch<React.SetStateAction<any>>;
  selectedDevice?: any;
  FetchUserDetails: any;
}
interface ErrorResponse {
  message?: string;
}

const AddUser: React.FC<AddUserProps> = ({
  open,
  setOpen,
  FetchUserDetails,
  selectedDevice,
  setUserDetails,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [uid, setUid] = useState<any>(
    selectedDevice ? selectedDevice?.uId : ""
  );
  const [select, setSelect] = useState<null | any>();
  const [itemId, setItemId] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<any>(null);
  const methods = useForm<any>();

  const handleRadioChange = (
    item: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelect((prev: any) => (prev?._id === item._id ? null : item));
    setItemId(item._id);
  };

  useEffect(() => {
    if (selectedDevice?.departmentId?._id) {
      setSelect({ _id: selectedDevice.departmentId._id });
    }
  }, [selectedDevice]);
  const {
    setValue,
    handleSubmit,
    clearErrors,
    getValues,
    reset,
    formState: { errors },
    control,
  } = methods;
  useEffect(() => {
    setSelectedPermissions(selectedDevice?.permissions);
  }, [selectedDevice]);
  const steps = ["Add User", "Department", "Permission"];

  useEffect(() => {
    if (selectedDevice) {
      setValue("uId", selectedDevice?.uId);
      if (selectedDevice?.fullName) {
        const [first, second] = selectedDevice.fullName.split(" ", 2);
        setValue("firstName", first);
        setValue("secondName", second || "");
      }
      setValue("email", selectedDevice?.email);
      setValue("phone", selectedDevice?.phoneNumber);
    }
  }, [selectedDevice, open]);

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    reset();
    setSelect(null);
    setSelectedPermissions([]);
    setUserDetails(null);
  };
  const trolleyBoxLabel = () => {
    if (activeStep == 0) {
      return `Add User `;
    } else if (activeStep == 1) {
      return "Department";
    } else if (activeStep == 2) {
      return "Permission";
    }
  };

  const handleCheckboxChange = (permission: { [key: string]: boolean }) => {
    setSelectedPermissions((prev = []) => {
      const existingPermissionIndex = prev?.findIndex((item: any) =>
        Object.keys(permission)?.every((key) => item[key] === permission[key])
      );
      if (existingPermissionIndex !== -1) {
        const updatedPermissions = [...prev];
        updatedPermissions.splice(existingPermissionIndex, 1);
        return updatedPermissions;
      } else {
        return [...prev, permission];
      }
    });
  };

  const getUid = useCallback(async () => {
    try {
      let apiPath = "users/getUserUid";
      const res = await axiosInstance.get(apiPath);
      if (res?.status === 200 || res?.status === 201) {
        setUid(res?.data?.data);
      }
    } catch (err) {
      console.log("Error fetching UID:", err);
    }
  }, []);
  useEffect(() => {
    if (!selectedDevice && open) {
      getUid();
    }
    setValue("uId", uid);
  }, [open, uid]);
  const onSubmit = async () => {
    if (activeStep === 1) {
      if (!Boolean(select)) {
        notifyError("please select atleast one item !");
        return;
      } else {
        handleNext();
      }
    } else {
      handleNext();
    }
    const values = getValues();

    const payload = {
      uId: values?.uId,
      firstName: values?.firstName,
      secondName: values?.secondName,
      email: values?.email,
      phoneNumber: values?.phone,
      countryCode: "91",
      departmentId: itemId ? itemId : selectedDevice?.departmentId._id,
      permissions: selectedPermissions,
    };

    try {
      if (activeStep >= 2) {
        if (selectedDevice) {
          const { data, status } = await axiosInstance.patch(
            `/users/updateUser/${selectedDevice?._id}`,
            payload
          );
          if (status === 201 || status === 200) {
            notifySuccess("user added successfully");
            FetchUserDetails();
            handleClose();
          }
        } else {
          const { data, status } = await axiosInstance.post(
            "/users/createUser",
            payload
          );
          if (status === 201 || status === 200) {
            notifySuccess("user added successfully");
            FetchUserDetails();
            handleClose();
          }
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(axiosError?.response?.data?.message || "Error creating user");
      console.log(error);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

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

  return (
    <>
      <CommonDialog
        open={open}
        maxWidth={"md"}
        fullWidth={true}
        title={selectedDevice?"Edit User":"Add User"}
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

            <DialogContent sx={{ minHeight: "55vh" }}>
              {activeStep === 0 && (
                <Grid container spacing={2} rowSpacing={3}>
                  <Grid item md={6}>
                    <Controller
                      name="uId"
                      control={control}
                      rules={{
                        required: "uId is required",
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label="UID"
                          placeholder="Enter uId, eg:USER0003"
                          error={!!errors.uId}
                          helperText={errors.uId?.message}
                          onChange={handleInputChange}
                          defaultValue={
                            selectedDevice ? selectedDevice?.uId : ""
                          }
                          disabled
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={6}>
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
                          disabled={selectedDevice}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={6}>
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
                    <Grid item mt={3}>
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
                            field="number"
                            label="Phone number"
                            placeholder="Enter Phone number"
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                            onChange={handleInputChange}
                            defaultValue={
                              selectedDevice ? selectedDevice?.phoneNumber : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid item md={6}>
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
                </Grid>
              )}
              {activeStep === 1 && (
                <Step2 select={select} handleRadioChange={handleRadioChange} />
              )}
              {activeStep === 2 && (
                <Step3
                  selectedPermissions={selectedPermissions}
                  handleCheckboxChange={handleCheckboxChange}
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
