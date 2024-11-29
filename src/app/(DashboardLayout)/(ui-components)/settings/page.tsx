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
  } = useForm();
  const [adminData, setAdminData] = useState<any>(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [Forget, setForget] = useState<boolean>(false);
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
  console.log("forget", Forget);
  const onSubmit = async () => {
    try {
      if (Forget) {
        const formdata = getValues();
        const body = {
          oldPassword: formdata?.oldPassword,
          newPassword: formdata?.newPassword,
          cnfimPassword: formdata?.cnfimPassword,
        };
        const { status } = await axiosInstance.patch(
          `/auth/updatePassword/${adminData?._id}`,
          body
        );
        if (status === 200 || status === 201) {
          notifySuccess("password changed successfully!");
          setIsEditable(false);
          setForget(false);
          fetchData();
        }
      } else {
        const formdata = getValues();
        const body = {
          fullName: formdata?.name,
          phoneNumber: formdata?.phone,
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
      notifyError(error?.response?.data?.message);
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
                  {!Forget && (
                    <Grid item xs={6}>
                      <Typography variant="h6" mb={1}>
                        Name
                      </Typography>
                      <CustomTextField
                        {...register("name", {
                          required: "Name is required",
                        })}
                        name="name"
                        placeholder="Enter name"
                        disabled={!isEditable}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        onChange={handleInputChange}
                        defaultValue={adminData ? adminData?.fullName : ""}
                      />
                    </Grid>
                  )}
                  {!Forget && (
                    <Grid item xs={6}>
                      <Typography variant="h6" mb={1}>
                        Phone Number
                      </Typography>
                      <CustomTextField
                        {...register("phone", {
                          required: "Phone is required",
                          validate: {
                            length: (value) =>
                              value.length === 10 ||
                              "Phone number must be exactly 10 digits without country code",
                          },
                        })}
                        field="number"
                        name="phone"
                        placeholder="Enter Phone Number"
                        error={!!errors.phone}
                        disabled={!isEditable}
                        helperText={errors.phone?.message}
                        onChange={handleInputChange}
                        defaultValue={adminData ? adminData?.phoneNumber : ""}
                      />
                    </Grid>
                  )}
                  {!Forget && (
                    <Grid item xs={6}>
                      <Typography variant="h6" mb={1}>
                        Email Address
                      </Typography>
                      <CustomTextField
                        {...register("email")}
                        name="email"
                        placeholder="Enter email address"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        onChange={handleInputChange}
                        defaultValue={adminData?.email || ""}
                        disabled={true}
                      />
                    </Grid>
                  )}
                  {Forget && (
                    <Grid item xs={6}>
                      <Typography variant="h6" mb={1}>
                        Password
                      </Typography>
                      <CustomTextField
                        {...register("oldPassword", {
                          required: "oldPassword is required",
                        })}
                        field="password"
                        name="oldPassword"
                        placeholder="Enter Password"
                        error={!!errors.oldPassword}
                        helperText={errors.oldPassword?.message}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                      />
                    </Grid>
                  )}
                  {Forget && (
                    <Grid item xs={6}>
                      <Typography variant="h6" mb={1}>
                        New Password
                      </Typography>
                      <CustomTextField
                        {...register("newPassword", {
                          required: "newPassword is required",
                        })}
                        field="password"
                        name="newPassword"
                        placeholder="Enter new Password"
                        error={!!errors.newPassword}
                        helperText={errors.newPassword?.message}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                      />
                    </Grid>
                  )}
                  {Forget && (
                    <Grid item xs={6}>
                      <Typography variant="h6" mb={1}>
                        Confirm Password
                      </Typography>
                      <CustomTextField
                        {...register("cnfimPassword", {
                          required: "cnfimPassword is required",
                          validate: (value) =>
                            value === watch("newPassword") ||
                            "Passwords do not match",
                        })}
                        field="password"
                        name="cnfimPassword"
                        type="password"
                        placeholder="Enter confirm Password"
                        error={!!errors.cnfimPassword}
                        onChange={handleInputChange}
                        helperText={errors.cnfimPassword?.message}
                        disabled={!isEditable}
                      />
                    </Grid>
                  )}
                  <Grid
                    item
                    xs={12}
                    display={"flex"}
                    justifyContent={"flex-end"}
                  >
                    {!Forget && (
                      <Typography
                        color={"primary"}
                        onClick={() => {
                          setForget(true);
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        Change/Forgot Password
                      </Typography>
                    )}
                    {Forget && (
                      <Grid item>
                        <Button
                          onClick={() => {
                            setForget(false);
                          }}
                          variant="outlined"
                          startIcon={<IoIosArrowRoundBack size={"25px"} />}
                        >
                          {" "}
                          Back
                        </Button>
                      </Grid>
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
