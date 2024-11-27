"use client";
import {
  Button,
  Card,
  Checkbox,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect } from "react";
import { MdDeleteSweep } from "react-icons/md";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/api/axiosInstance";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import { useForm } from "react-hook-form";
import ToastComponent, {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import CommonDialog from "@/app/(components)/mui-components/Dialog";

type cardProps = {
  label: string;
  value: string;
};

const RolesData: cardProps[] = [
  { label: "Username", value: "Manpower tracking" },
  { label: "Email Address", value: "Trolley tracking" },
  { label: "Phone Number", value: "Attandence details" },
  { label: "Department", value: "User Management" },
];
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const Page = ({ params }: { params: { userManagementProfile: string } }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
  } = useForm();
  const [userData, setUserData] = React.useState<any>(null);
  const [open, setOpenDialog] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isEditable, setIsEditable] = React.useState(false);
  React.useEffect(() => {
    if (userData) {
      setValue("name", userData?.fullName || "");
      setValue("email", userData?.email || "");
      setValue("phoneNumber", userData?.phoneNumber || "");
      setValue("uId", userData?.uId || "");
    }
  }, [userData, setValue]);
  const getUser = async () => {
    setLoading(true);
    const { data, status } = await axiosInstance.get(
      `/users/getSingleUser/${params.userManagementProfile}`
    );
    if (status === 200 || status === 201) {
      setUserData(data?.data);
      setLoading(false);
    }
  };
  const handleBack = () => {
    router.push("/userManagement");
  };
  useEffect(() => {
    getUser();
    handlePermissions();
  }, []);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue(name, value);
    if (errors[name]) {
      clearErrors(name);
    }
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    handleDelete();
    handleCancel();
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };
  const onSubmit = async () => {
    const values = getValues();
    console.log("values", values);

    const payload = {
      firstName: values?.name.trim().split(" ")[0],
      secondName: values?.name.trim().split(" ")[1],
      email: values?.email,
      uId: values?.uId,
      phoneNumber: values?.phoneNumber,
      countryCode: "91",
      departmentId: userData?.departmentId?._id,
    };
    try {
      const { data, status } = await axiosInstance.patch(
        `users/updateUser/${params.userManagementProfile}`,
        payload
      );
      if (status === 201 || status === 200) {
        notifySuccess("user details updated successfully");
        setIsEditable(false);
      }
    } catch (error) {
      notifyError((error as any)?.response?.data?.message);
    }
  };
  const handleEditClick = () => {
    setIsEditable(true);
  };
  const handleButtonClick = () => {
    if (isEditable) {
      handleSubmit(onSubmit)();
    } else {
      handleEditClick();
    }
  };
  const handleDelete = async () => {
    try {
      const { data, status } = await axiosInstance.delete(
        `/users/deletedUser/${params.userManagementProfile}`
      );
      if (status === 200 || status === 201) {
        notifySuccess("user Deleted successfully");
        router.push("/userManagement");
      }
    } catch (error) {
      notifyError((error as any)?.response?.data?.message);
    }
  };
  const handlePermissions = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        `/permissions/getUserPermissions/${params.userManagementProfile}`
      );
    } catch (error) {
      notifyError((error as any)?.response?.data?.message);
    }
  };
  return (
    <form>
      <ToastComponent />
      <CommonDialog
        open={open}
        fullWidth={true}
        maxWidth={"xs"}
        title="Confirmation"
        message="Are you sure you want to delete this user?"
        color="error"
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
      <Grid container sx={{ padding: "12px 15px" }} rowGap={2}>
        <Grid
          container
          mt={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item>
            <Button
              variant="outlined"
              size="large"
              color="inherit"
              onClick={handleBack}
              startIcon={<IoChevronBackOutline />}
            >
              Back
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="large"
              startIcon={<MdModeEdit />}
              color="inherit"
              onClick={handleButtonClick}
            >
              {isEditable ? "Save Changes" : "Edit"}
            </Button>
            <Button
              size="large"
              sx={{ ml: 2 }}
              variant="contained"
              onClick={handleOpenDialog}
              startIcon={<MdDeleteSweep />}
            >
              Delete Profile
            </Button>
          </Grid>
        </Grid>
        <Grid container>
          <Card sx={{ width: "100%", p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="h6" mb={2}>
                  Username
                </Typography>
                <CustomTextField
                  {...register("name", {
                    required: "Name is required",
                  })}
                  name="name"
                  placeholder="Enter name"
                  error={!!errors.name}
                  disabled={!isEditable}
                  helperText={errors.name?.message}
                  onChange={handleInputChange}
                  defaultValue={userData ? userData?.fullName : ""}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" mb={2}>
                  Email
                </Typography>
                <CustomTextField
                  {...register("email", {
                    required: "email is required",
                  })}
                  name="email"
                  placeholder="Enter email"
                  disabled={!isEditable}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  onChange={handleInputChange}
                  defaultValue={userData ? userData?.email : ""}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" mb={2}>
                  Phone Number
                </Typography>
                <CustomTextField
                  {...register("phoneNumber", {
                    required: "PhoneNumber is required",
                  })}
                  name="phoneNumber"
                  placeholder="Enter PhoneNumber"
                  disabled={!isEditable}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  onChange={handleInputChange}
                  defaultValue={userData ? userData?.phoneNumber : ""}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" mb={2}>
                  UID
                </Typography>
                <CustomTextField
                  {...register("uId", {
                    required: "uId is required",
                  })}
                  name="uId"
                  placeholder="Enter uId"
                  disabled={!isEditable}
                  error={!!errors.uId}
                  helperText={errors.uId?.message}
                  onChange={handleInputChange}
                  defaultValue={userData ? userData?.uId : ""}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" mb={2}>
                  Department
                </Typography>
                <CustomTextField
                  disabled
                  defaultValue={userData?.departmentId?.name}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid container>
          <Card sx={{ width: "100%", p: 3 }}>
            <Typography variant="h5">Roles</Typography>
            <Grid container spacing={2} mt={1.5}>
              {RolesData?.map((item, index) => (
                <Grid item xs={4} key={index} display={"flex"}>
                  <Checkbox {...label} defaultChecked />
                  <TextField disabled defaultValue={item?.value} fullWidth />
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
};

export default Page;
