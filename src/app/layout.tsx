import "./globals.css";
import "./overrideCss.scss";
import { ThemeProvider } from "@mui/material/styles";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import CssBaseline from "@mui/material/CssBaseline";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = baselightTheme;
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
