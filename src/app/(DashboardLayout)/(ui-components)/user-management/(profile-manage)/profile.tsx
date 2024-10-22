"use client";
import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import Image from "next/image";
import empImg from "../../../../../../public/Img/profile.png";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import DetailsListingSkeleton from "@/app/(components)/mui-components/Skeleton/detailsListingSkeleton";
import ManageSites from "./manageSites";
type Breadcrumb = {
  label: string;
  link: string;
};
const Profile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
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
  return (
    <Grid sx={{ padding: "12px 15px" }}>
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
            sx={{ border: "1px solid #E9E9EB", borderRadius: "10px" }}
          >
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              flexDirection={"column"}
              p={3}
            >
              <Grid item textAlign="center">
                <Image
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    display: "block",
                    margin: "0 auto",
                  }}
                  src={empImg}
                  alt="employee Img"
                />
              </Grid>
              <Grid
                item
                textAlign="center"
                p={1}
                mt={2}
                sx={{
                  border: "1px solid #E9E9EB",
                  borderRadius: "10px",
                  width: "100%",
                }}
              >
                <Typography variant="h5">Vishal Singh</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            md={9.3}
            xs={12}
            pt={1}
            px={3}
            sx={{ bgcolor: "white", borderRadius: "10px" }}
          >
            <Grid container justifyContent={"space-between"}>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Company name
                </Typography>
                <CustomTextField disabled defaultValue={profile?.companyName} />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Office ID
                </Typography>
                <CustomTextField disabled defaultValue={profile?.officeId} />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Phone Number
                </Typography>
                <CustomTextField disabled defaultValue={"+91 9876545432"} />
              </Grid>
              <Grid item md={5.8} xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  component="label"
                >
                  Email Address
                </Typography>
                <CustomTextField
                  disabled
                  defaultValue={profile?.companyEmail}
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
