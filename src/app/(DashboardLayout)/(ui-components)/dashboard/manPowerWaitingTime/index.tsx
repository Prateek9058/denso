import React, { useState, useEffect } from "react";
import { Grid, Typography, Button } from "@mui/material";
import MultiBarChart from "@/app/(components)/mui-components/CustomGraph/MultiBarChart";
import CommonDatePicker from "@/app/(components)/mui-components/Text-Field's/Date-range-Picker";

const page = () => {
  const [date, setDate] = useState<any>(null);
  const [analyticsDate, setAnalyticsDate] = useState<any>(null);
  const getDataFromChildHandler = (date: any, dataArr: any) => {
    setDate(date);
    setAnalyticsDate(dataArr);
  };
  const deviceData = [
    {
      date: "12/08",
      workTime: 20,
      waitTime: 24,
      requiredTime: 34,
    },
    {
      date: "13/08",
      workTime: 30,
      waitTime: 20,
      requiredTime: 44,
    },
    {
      date: "14/08",
      workTime: 26,
      waitTime: 14,
      requiredTime: 12,
    },
    {
      date: "15/08",
      workTime: 27,
      waitTime: 36,
      requiredTime: 4,
    },
    {
      date: "16/08",
      workTime: 40,
      waitTime: 14,
      requiredTime: 24,
    },
  ];
  return (
    <Grid mt={2} item md={6} sm={12} xs={12}>
      <Grid sx={{ backgroundColor: "white", borderRadius: "10px" }} p={2}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5">
              Manpower working and waiting time
            </Typography>
          </Grid>
          <Grid item>
            <CommonDatePicker
              getDataFromChildHandler={getDataFromChildHandler}
            />
          </Grid>
        </Grid>
        <Grid pt={2}>
          <MultiBarChart deviceData={deviceData} multichart={true} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default page;
