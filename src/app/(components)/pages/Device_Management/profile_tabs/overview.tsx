"use client";
import React from "react";
import { Typography, Grid, Box } from "@mui/material";
import Image from "next/image";
import deviceOverview from "../../../../../../public/deviceOverview.svg";
import { styled } from "@mui/system";

const OuterGrid = styled(Grid)({
  height: "400px",
}); 

const InnerBox = styled(Box)({
  height: "100%",
  width: "100%",
  backgroundColor: "#ffffff", // Inner background color
  borderTopRightRadius: "50% 100%",
  borderBottomRightRadius: "50% 100%",
  borderTopLeftRadius: "50% 100%",
  borderBottomLeftRadius: "50% 100%",
});

export default function overviewTab() {
  return (
    <Grid container p={2} className="device_child">
      <Grid md={12} lg={12} sm={12} className="overview_deviceDetail_card">
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item md={2}>
            <Grid container ml={1} flexDirection="column" gap={10}>
              <Grid item>
                <Typography mb={1} className="font16 fweight400 fcolorBlack">
                  Status
                </Typography>
                <Typography className="font20 fweight700 fcolorRed">
                  Offline
                </Typography>
              </Grid>
              <Grid item>
                <Typography mb={1} className="font16 fweight400 fcolorBlack">
                  Wifi Strength
                </Typography>
                <Typography className="font20 fweight700 fcolorGreen">
                  Strong
                </Typography>
              </Grid>
              <Grid item>
                <Typography mb={1} className="font16 fweight400 fcolorBlack">
                  Firmware version
                </Typography>
                <Typography className="font20 fweight700 fcolorBlack">
                  PMA 3.2
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid md={7}>
            <OuterGrid container justifyContent="center" alignItems="center">
              <InnerBox>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  style={{ height: "100%" }}
                >
                  <Image src={deviceOverview} alt="Picture of device" />
                </Grid>
              </InnerBox>
            </OuterGrid>
          </Grid>
          <Grid item md={2}>
            <Grid container flexDirection="column" gap={10}>
              <Grid item>
                <Typography mb={1} className="font16 fweight400 fcolorBlack">
                  Sold Status
                </Typography>
                <Typography className="font20 fweight700 fcolorBlack">
                  Yes
                </Typography>
              </Grid>
              <Grid item>
                <Typography mb={1} className="font16 fweight400 fcolorBlack">
                  Last Active TIme
                </Typography>
                <Typography className="font20 fweight700 fcolorBlack">
                  10:12 PM 20/12/2023
                </Typography>
              </Grid>
              <Grid item>
                <Typography mb={1} className="font16 fweight400 fcolorBlack">
                  Device Usage
                </Typography>
                <Typography className="font20 fweight700 fcolorBlack">
                  12 times
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        mt={2}
        md={12}
        lg={12}
        sm={12}
        p={1}
        className="overview_deviceDetail_card"
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item md={4}>
            <Grid container flexDirection="column" gap={10}>
              <Grid item>
                <Typography mb={1} className="font16 fweight400 fcolorBlack">
                  Device ID
                </Typography>
                <Typography className="font20 fweight700 fcolorBlack">
                  Heal_XXXX_ndia
                </Typography>
              </Grid>
              <Grid item>
                <Typography mb={1} className="font16 fweight400 fcolorBlack">
                  Added by
                </Typography>
                <Typography className="font20 fweight700 fcolorBlack">
                  Superadmin
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid md={4}>
            <Grid container flexDirection="column" gap={10}>
              <Grid item>
                <Typography mb={1} className="font16 fweight400 fcolorBlack">
                  Device Name
                </Typography>
                <Typography className="font20 fweight700 fcolorBlack">
                  DEVICE 1
                </Typography>
              </Grid>
              <Grid item>
                <Typography mb={1} className="font16 fweight400 fcolorBlack">
                  Added on
                </Typography>
                <Typography className="font20 fweight700 fcolorBlack">
                  02:45PM, 24/02/2023
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={2}>
            <Grid container flexDirection="column" gap={10}>
              <Grid item>
                <Typography mb={1} className="font16 fweight400 fcolorBlack">
                  MAC ID
                </Typography>
                <Typography className="font20 fweight700 fcolorBlack">
                  MAC ID
                </Typography>
              </Grid>
              <Grid item>
                <Typography mb={1} className="font16 fweight400 fcolorBlack">
                  User Assigned
                </Typography>
                <Typography className="font20 fweight700 fcolorBlack">
                  User Assigned
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
