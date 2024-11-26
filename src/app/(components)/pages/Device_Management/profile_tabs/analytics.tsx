"use client";

import React from "react";
import { Typography, Grid, Button } from "@mui/material";
import CommonDatePicker from "@/app/(components)/mui-components/Text-Field's/Date-range-Picker";
import CustomPrimaryBtn from "@/app/(components)/mui-components/CustomButton";
import CustomGraph from "@/app/(components)/mui-components/CustomGraph";
type GetDataHandler = () => void;
interface ViewCountData {
  _id: string;
  views: number;
}

const AnalyticsTab: React.FC = () => {
  const getDataFromChildHandler: GetDataHandler = () => {};

  const viewCount: ViewCountData[] = [
    {
      _id: "20/03/2023",
      views: 45,
    },
    {
      _id: "24/03/2023",
      views: 23,
    },
    {
      _id: "25/03/2023",
      views: 5,
    },
    {
      _id: "27/03/2023",
      views: 16,
    },
    {
      _id: "29/03/2023",
      views: 35,
    },
    {
      _id: "30/03/2023",
      views: 30,
    },
  ];
  return (
    <Grid p={2}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography
          sx={{ backgroundColor: "#fff" }}
          component={"h3"}
          variant="h4"
          color="info"
        >
          Device Usage
        </Typography>
        <Grid>
          <Grid container justifyContent="space-between" gap={1}>
            <CommonDatePicker
              getDataFromChildHandler={getDataFromChildHandler}
            />
            <Button variant="contained" color="primary" size="small">
              Export
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid pt={2}>
        <CustomGraph viewCount={viewCount} />
      </Grid>
    </Grid>
  );
};

export default AnalyticsTab;
