"use client";
import "./globals.css";
import "./overrideCss.scss";
import { ThemeProvider } from "@mui/material/styles";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect } from "react";
import { io } from "socket.io-client";
import SocketServices from "./api/socketService";
const SOCKET_URL = `http://103.127.30.171:8080`;
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = baselightTheme;

  // useEffect(() => {
  //   const initialiseSocket = async () => {
  //     await SocketServices.initialiseWS();
  //   };

  //   initialiseSocket();
  // }, []);

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
