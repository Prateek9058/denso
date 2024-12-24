"use client";
import React, { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { Box, Typography, Button, Stack } from "@mui/material";
import CustomTextField from "@/app/(components)/forms/theme-elements/CustomTextField";
import axiosInstance from "@/app/api/axiosInstance";
interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}
const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginData, setLoginData] = useState<any>(null);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    const body = {
      email: username,
      password: password,
    };
    setErrorMessage(null);
    if (!username || !password) {
      setErrorMessage("Please provide both email and password.");
      return;
    }
    try {
      const response = await axiosInstance.post("auth/login", body);
      if (response.status) {
        localStorage.setItem("token", response?.data?.data?.token);
        localStorage.setItem("profile", JSON.stringify(response?.data?.data));

        signIn("credentials", {
          email: username,
          password: password,
          role: response?.data?.data?.userRole,
          callbackUrl: `/`,
          redirect: true,
        });
      }
    } catch (error: any) {
      console.log("Catch Block Work", error);
      setErrorMessage(error?.response?.data?.message);
    }
  }

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}
      {subtext}
      <form onSubmit={handleLogin}>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="username"
            >
              Email
            </Typography>
            <CustomTextField
              variant="outlined"
              fullWidth
              id="username"
              name="username"
              placeholder="Enter email"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
            >
              Password
            </Typography>
            <CustomTextField
              type="password"
              variant="outlined"
              fullWidth
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </Box>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Box mb={0}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              type="submit"
              sx={{ color: "white" }}
            >
              Login
            </Button>
          </Box>{" "}
        </Stack>
      </form>

      {subtitle}
    </>
  );
};

export default AuthLogin;
