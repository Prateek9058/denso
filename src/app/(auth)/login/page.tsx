"use client";
import Link from "next/link";
import type { ReactElement } from "react";
import { Grid, Box, Card, Stack, Typography, IconButton } from "@mui/material";
import BlankLayout from "@/app/(DashboardLayout)/layout/blank/BlankLayout";
import Image from "next/image";
import Logo from "../../../../public/Img/logo2.png";
import banner from "../../../../public/Img/manppowerBanner.png";

// components
import PageContainer from "@/app/(components)/container/PageContainer";
import AuthLogin from "@/app/(components)/authentication/AuthLogin";

const Login2 = () => {
  return (
    <>
      <PageContainer title="Login" description="this is Login page">
        <Box
          sx={{
            position: "relative",
            "&:before": {
              content: '""',
              backgroundSize: "400% 400%",
              animation: "gradient 15s ease infinite",
              position: "absolute",
              height: "100%",
              width: "100%",
              opacity: "0.3",
            },
          }}
        >
          <Grid
            container
            spacing={0}
            justifyContent="center"
            sx={{ height: "100vh", backgroundColor: "white" }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              lg={6}
              xl={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Card
                sx={{
                  p: 4,
                  zIndex: 1,
                  width: "100%",
                  maxWidth: "500px",
                  boxShadow: "none",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={4}
                >
                  <Image src={Logo} alt="Logo" />
                </Box>
                <AuthLogin
                  subtext={
                    <>
                      <Typography
                        variant="h3"
                        textAlign="center"
                        color="textSecondary"
                        mb={1}
                      >
                        Login
                      </Typography>
                      <Typography
                        variant="body2"
                        textAlign="center"
                        color="grey"
                        mb={2}
                      >
                        Login to access your Manpower Tracking account.
                      </Typography>
                    </>
                  }
                  subtitle={
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      mt={3}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="200"
                      >
                        © 2024 ALL RIGHTS RESERVED
                      </Typography>
                    </Stack>
                  }
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} lg={6} xl={6} md={6}>
              <Grid
                container
                sx={{ width: "100%", height: "100vh" }}
                justifyContent="flex-end"
                alignItems="center"
              >
                <Image
                  src={banner}
                  alt="banner man power"
                  style={{
                    height: "100%",
                    width: "100%",
                    // objectFit:""
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </PageContainer>
    </>
  );
};
export default Login2;

Login2.getLayout = function getLayout(page: ReactElement) {
  return <BlankLayout>{page}</BlankLayout>;
};
