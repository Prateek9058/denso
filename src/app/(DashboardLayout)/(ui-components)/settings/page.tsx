"use client";
import { Button, Card, Grid, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import empImg from "../../../../../public/Img/profile.png";
import { IoLogOut } from "react-icons/io5";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import ManageSites from "@/app/(components)/pages/settings/manageSites";
import axiosInstance from "@/app/api/axiosInstance";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import { IoIosClose } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";
import Breadcrumb from "@/app/(components)/mui-components/Breadcrumbs";
import ToastComponent, {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";

type Breadcrumb = {
  label: string;
  link: string;
};

const ProfileDetails = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
    watch,
    reset,
  } = useForm();
  const [adminData, setAdminData] = useState<any>(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isPasswordChange, setIsPasswordChange] = useState(false);

  useEffect(() => {
    setValue("name", adminData?.fullName);
    setValue("phone", adminData?.phoneNumber);
    setValue("email", adminData?.email);
  }, [setValue, adminData]);
  const handleEditClick = () => {
    setIsEditable(true);
  };
  const breadcrumbItems: Breadcrumb[] = [
    { label: "Dashboard", link: "/" },
    { label: "Admin Profile ", link: "/settings" },
  ];

  const fetchData = async () => {
    try {
      const { data, status } = await axiosInstance.get("auth/getAdminData");
      if (status === 200 || status === 201) {
        setAdminData(data?.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue(name, value);
    if (errors[name]) {
      clearErrors(name);
    }
  };
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("loginId");
    signOut({ callbackUrl: "/login", redirect: true });
  };
  console.log(errors, "errors");
  console.log(getValues(), "vaue");

  const handleBackToProfile = () => {
    setIsPasswordChange(false);
    clearErrors();
    reset({
      name: adminData?.fullName,
      phone: adminData?.phoneNumber,
      email: adminData?.email,
    });
  };
  const onSubmit = async () => {
    try {
      if (isPasswordChange) {
        const formData = getValues();
        const body = {
          oldPassword: formData?.oldPassword,
          newPassword: formData?.newPassword,
          cnfimPassword: formData?.cnfimPassword,
        };

        const { status } = await axiosInstance.patch(
          `/auth/updatePassword/${adminData?._id}`,
          body
        );

        if (status === 200 || status === 201) {
          notifySuccess("Password changed successfully!");
          setIsEditable(false);
          setIsPasswordChange(false);
          fetchData();
        }
      } else {
        const formData = getValues();
        const body = {
          fullName: formData?.name,
          phoneNumber: formData?.phone,
        };

        const { status } = await axiosInstance.patch(
          "/auth/updateAdminProfile",
          body
        );

        if (status === 200 || status === 201) {
          notifySuccess("Profile updated successfully!");
          setIsEditable(false);
          fetchData();
        }
      }
    } catch (error: any) {
      notifyError(error?.response?.data?.message || "Something went wrong");
    }
  };
  const handleButtonClick = () => {
    if (isEditable) {
      handleSubmit(onSubmit)();
    } else {
      handleEditClick();
    }
  };
  const handleCancel = () => {
    setIsEditable(false);
  };
  return (
    <>
      <ToastComponent />
      <form>
        <Grid container rowGap={2}>
          <Grid
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item>
              <Breadcrumb breadcrumbItems={breadcrumbItems} />
            </Grid>
            <Grid item>
              {isEditable && (
                <Button
                  variant="outlined"
                  sx={{ mr: 2 }}
                  startIcon={<IoIosClose size={"25px"} />}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<MdModeEdit />}
                onClick={handleButtonClick}
              >
                {isEditable ? "Save Changes" : "Edit"}
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Grid container height={"100%"}>
                <Card sx={{ p: 1, width: "100%" }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Image
                        style={{
                          objectFit: "cover",

                          borderRadius: "50%",
                          display: "block",
                          margin: "0 auto",
                          marginTop: "2rem",
                        }}
                        height={130}
                        width={130}
                        src={empImg}
                        alt="employee Img"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        border: "1px solid #e5e5e5",
                        p: 2,
                        mt: 6,
                        borderRadius: "16px",
                      }}
                    >
                      <Grid
                        container
                        justifyContent={"center"}
                        spacing={4}
                        alignItems={"center"}
                      >
                        <Grid item>
                          <Typography variant="h6">
                            {adminData?.fullName}
                          </Typography>
                          <Typography variant="subtitle1" color={"grey"}>
                            Super admin
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            href="/login"
                            size="medium"
                            component={Link}
                            endIcon={<IoLogOut />}
                            onClick={handleLogOut}
                          >
                            Logout
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>

            <Grid item xs={9}>
              <Card
                sx={{
                  p: 2,
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                  justifyItems: "center",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Grid container spacing={2}>
                  {/* Profile Details */}
                  {!isPasswordChange ? (
                    <>
                      {/* Name */}
                      <Grid item xs={6}>
                        <Typography variant="h6" mb={1}>
                          Name
                        </Typography>
                        <CustomTextField
                          {...register("name", {
                            required: "Name is required",
                          })}
                          placeholder="Enter name"
                          disabled={!isEditable}
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          onChange={handleInputChange}
                          defaultValue={adminData?.fullName}
                        />
                      </Grid>
                      {/* Phone */}
                      <Grid item xs={6}>
                        <Typography variant="h6" mb={1}>
                          Phone Number
                        </Typography>
                        <CustomTextField
                          {...register("phone", {
                            required: "Phone is required",
                            validate: (value) =>
                              value.length === 10 ||
                              "Phone number must be exactly 10 digits",
                          })}
                          placeholder="Enter phone number"
                          disabled={!isEditable}
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                          onChange={handleInputChange}
                          defaultValue={adminData?.phoneNumber}
                        />
                      </Grid>
                      {/* Email */}
                      <Grid item xs={6}>
                        <Typography variant="h6" mb={1}>
                          Email
                        </Typography>
                        <CustomTextField
                          {...register("email")}
                          placeholder="Enter email"
                          disabled
                          defaultValue={adminData?.email}
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      {/* Password Change Fields */}
                      <Grid item xs={6}>
                        <Typography variant="h6" mb={1}>
                          Current Password
                        </Typography>
                        <CustomTextField
                          {...register("oldPassword", {
                            required: "Current password is required",
                          })}
                          placeholder="Enter current password"
                          type="password"
                          error={!!errors.oldPassword}
                          disabled={!isEditable}
                          helperText={errors.oldPassword?.message}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6" mb={1}>
                          New Password
                        </Typography>
                        <CustomTextField
                          {...register("newPassword", {
                            required: "New password is required",
                          })}
                          placeholder="Enter new password"
                          type="password"
                          error={!!errors.newPassword}
                          disabled={!isEditable}
                          helperText={errors.newPassword?.message}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6" mb={1}>
                          Confirm Password
                        </Typography>
                        <CustomTextField
                          {...register("cnfimPassword", {
                            required: "Confirm password is required",
                            validate: (value) =>
                              value === watch("newPassword") ||
                              "Passwords do not match",
                          })}
                          placeholder="Confirm password"
                          type="password"
                          error={!!errors.cnfimPassword}
                          disabled={!isEditable}
                          helperText={errors.cnfimPassword?.message}
                        />
                      </Grid>
                    </>
                  )}

                  {/* Footer Action */}
                  <Grid item xs={12} display="flex" justifyContent="flex-end">
                    {!isPasswordChange ? (
                      <Typography
                        color="primary"
                        sx={{ cursor: "pointer" }}
                        onClick={() => setIsPasswordChange(true)}
                      >
                        Change/Forgot Password?
                      </Typography>
                    ) : (
                      <Button
                        variant="outlined"
                        startIcon={<IoIosArrowRoundBack />}
                        onClick={handleBackToProfile}
                      >
                        Back
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
          <Grid container mb={2}>
            <ManageSites />
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default ProfileDetails;
