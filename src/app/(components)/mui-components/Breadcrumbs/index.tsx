"use client";
import React from "react";
import {
  Grid,
  Breadcrumbs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  link: string;
}

interface CustomBreadcrumbsProps {
  breadcrumbItems: BreadcrumbItem[];
}

const CustomBreadcrumbs: React.FC<CustomBreadcrumbsProps> = ({
  breadcrumbItems,
}) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  if (isMobile) {
    return null;
  }

  return (
    <Grid
      sx={{
        pr: "12px",
        pt: "12px",
        position: "fixed",
        top: "20px",
        zIndex: "99",
        width: "auto",
      }}
      container
      direction="row"
      justifyContent="start"
    >
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbItems.map((item, index) => (
          <Link href={item?.link} key={index}>
            <Typography
              color={
                pathname === item?.link || item?.link === ""
                  ? "primary"
                  : "grey"
              }
              variant={pathname === item?.link ? "h6" : "h6"}
              style={{
                cursor:
                  pathname !== item?.link && item?.link !== ""
                    ? "pointer"
                    : "initial",
              }}
            >
              {item?.label}
            </Typography>
          </Link>
        ))}
      </Breadcrumbs>
    </Grid>
  );
};

export default CustomBreadcrumbs;
