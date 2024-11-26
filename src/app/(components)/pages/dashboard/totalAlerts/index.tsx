import React, { useState, useEffect } from "react";
import { Grid, Typography, Button } from "@mui/material";
import MultiLineChart from "@/app/(components)/mui-components/CustomGraph/Line";
import CommonDatePicker from "@/app/(components)/mui-components/Text-Field's/Date-range-Picker";

const Page = () => {
  const [date, setDate] = useState<any>(null);
  const [analyticsDate, setAnalyticsDate] = useState<any>(null);
  const getDataFromChildHandler = (date: any, dataArr: any) => {
    setDate(date);
    setAnalyticsDate(dataArr);
  };
  const deviceData = [
    {
      date: "12/08",
      Alerts: 20,
    },
    {
      date: "13/08",
      Alerts: 30,
    },
    {
      date: "14/08",
      Alerts: 26,
    },
    {
      date: "15/08",
      Alerts: 27,
    },
    {
      date: "16/08",
      Alerts: 40,
    },
  ];
  return (
    <Grid mt={2} item md={6} sm={12} xs={12}>
      <Grid sx={{ backgroundColor: "white", borderRadius: "10px" }} p={2}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5">Average trolley repair time</Typography>
          </Grid>
          <Grid item>
            <CommonDatePicker
              getDataFromChildHandler={getDataFromChildHandler}
            />
          </Grid>
        </Grid>
        <Grid pt={2}>
          <MultiLineChart deviceData={deviceData} multichart={false} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Page;
