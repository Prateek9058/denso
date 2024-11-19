"use client";
import React, { useState, useEffect } from "react";
import { Button, Grid, Typography, Box } from "@mui/material";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import Image from "next/image";
import empImg from "../../../../../public/Img/profile.png";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import DetailsListingSkeleton from "@/app/(components)/mui-components/Skeleton/detailsListingSkeleton";
import ManageSites from "./manageSites";
import EditProfile from "./EditProfile";
import { IoLogOut } from "react-icons/io5";
import { signOut } from "next-auth/react";
import Link from "next/link";
import axiosInstance from "@/app/api/axiosInstance";


type Breadcrumb = {
  label: string;
  link: string;
};
const Profile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<any>();


  const breadcrumbItems: Breadcrumb[] = [
    { label: "Dashboard", link: "/" },
    { label: "Profile ", link: "" },
  ];
  useEffect(() => {
    setLoading(true);
    const profileData = localStorage.getItem("profile");
    if (profileData) {
      setProfile(JSON.parse(profileData));
      setLoading(false);
    }
  }, []);
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("auth/getAdminData");
      setAdminData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleClickOpen = (shiftId: number) => {
    setOpen(true);
  };
  console.log("profile data", profile)


  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("loginId");
    signOut({ callbackUrl: "/login", redirect: true });
  };
  console.log('admine data', adminData?.fullName);

  return (

    <Grid sx={{ padding: "12px 15px" }}   >
      <ManagementGrid
        moduleName="Profile Details"
        subHeading="Manage details"
        // button="Edit profile"
        breadcrumbItems={breadcrumbItems}
        edit={true}
      />
      {loading ? (
        <DetailsListingSkeleton listingHead={new Array(3).fill(0)} />
      ) : (
        <Grid container justifyContent={"space-between"} gap={2} mt={3}>
          <Grid
            item
            md={2.5}
            p={1}
            sx={{ border: "1px solid #E9E9EB", borderRadius: "10px" }}
          >
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              flexDirection={"column"}
            >
              <Grid item textAlign="center"  >
                <Image
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    display: "block",
                    margin: "0 auto",
                    marginTop: "2rem"
                  }}
                  src={empImg}
                  alt="employee Img"
                />
              </Grid>
              <Grid
                item
                textAlign="center"
                p={2}
                mt={2}
                sx={{
                  border: "1px solid #E9E9EB",
                  borderRadius: "10px",
                  width: "100%",
                }}
              >
                <Grid
                  container
                  justifyContent={"center"}
                  alignItems={"center"}
                  mt={1}

                // spacing={3}
                >
                  <Grid item md={6} >
                    <Typography variant="h5" textAlign="start" mb={2}>{adminData ? adminData?.fullName : 'Admin'}</Typography>
                    <Typography variant="h6" textAlign="start">Super Admin</Typography>

                  </Grid>
                  <Grid item md={6}>
                    <Button
                      href="/login"
                      color="primary"
                      variant="outlined"
                      size="medium"
                      component={Link}
                      onClick={handleLogOut}
                      // fullWidth
                      sx={{
                        border: "1px solid #DC0032",
                        color: "#ffff",
                        backgroundColor: "#DC0032",
                        "&:hover": {
                          backgroundColor: "#DC0032",
                          borderColor: "#DC0032",
                        },
                      }}
                    >
                      {'Logout'}
                      <IoLogOut style={{ marginLeft: '8px' }} />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            md={9.3}
            xs={12}
            px={1.5}
            mb={2}
            mt={-1}
          >
            <EditProfile open={open} setOpen={setOpen} getDeviceData={fetchData} selectedShift={adminData} />
            <ManagementGrid
              button={"Edit"}
              handleClickOpen={handleClickOpen}
              edit={true}
            />
            <Grid container justifyContent={"space-between"} bgcolor={"white"} borderRadius={"10px"} px={3} pt={3} mt={2} >
              <Grid item md={5.8} xs={12} >
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Name
                </Typography>
                <CustomTextField disabled defaultValue={adminData?.fullName} />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Phone Number
                </Typography>
                <CustomTextField disabled defaultValue={adminData?.phoneNumber} />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Email Address
                </Typography>
                <CustomTextField disabled defaultValue={adminData?.email} />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Password
                </Typography>
                <CustomTextField
                  disabled
                  type="password"
                  defaultValue={'************'}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      <ManageSites />
    </Grid>
  );
};
export default Profile;