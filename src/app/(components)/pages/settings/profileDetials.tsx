"use client";
import { Button, Card, Grid, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import empImg from "../../../../../public/Img/profile.png";
import { IoLogOut } from "react-icons/io5";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Link from "next/link";
import CustomTextField from "../../mui-components/Text-Field's";
import { useForm } from "react-hook-form";
import ManageSites from "./manageSites";
import axiosInstance from "@/app/api/axiosInstance";

const ProfileDetails = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();
  const [adminData, setAdminData] = useState<any>();
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
  const onSubmit = () => {};
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowGap={2}>
          <Grid
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h5">Manage Profile</Typography>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<MdModeEdit />}
                type="submit"
              >
                Edit
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

                          display: "block",
                          margin: "0 auto",
                          marginTop: "2rem",
                        }}
                        height={100}
                        width={100}
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
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      onChange={handleInputChange}
                      defaultValue={adminData ? adminData?.fullName : ""}
                    />
                  </Grid>
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
                      helperText={errors.phone?.message}
                      onChange={handleInputChange}
                      defaultValue={adminData ? adminData?.phoneNumber : ""}
                    />
                  </Grid>
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
                  <Grid item xs={6}>
                    <Typography variant="h6" mb={1}>
                      Password
                    </Typography>
                    <CustomTextField
                      {...register("password", {
                        required: "Password is required",
                      })}
                      field="password"
                      name="password"
                      placeholder="Enter Password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      onChange={handleInputChange}
                      defaultValue={"**********"}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    display={"flex"}
                    justifyContent={"flex-end"}
                  >
                    <Typography>Change/Forgot Password</Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>

          <Grid container>
            <ManageSites />
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default ProfileDetails;
