import React, { ChangeEvent,useState } from "react";
import { Grid, Typography, Box, DialogContent , DialogTitle} from "@mui/material";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import Site from "../../../../../../public/Img/Layoutdenso.jpg";
import "leaflet/dist/leaflet.css";
import trolleyIconSrc from "../../../../../../public/Img/trolleyLive.png";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";

interface empProps {
  points: any;
  setPoints: any;
}
const FinalDetails: React.FC<empProps> = ({ points, setPoints }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
    reset,
    control,
  } = useForm();
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue(name, value);
    if (errors[name]) {
      clearErrors(name);
    }
  };
  return (
    <Grid
      item
      xs={12}
      md={12}
      sx={{ height: "550px", width: "200%", position: "relative", padding: 2 }}
    >
<DialogTitle
        sx={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: 0,
          borderStyle: "solid",
          mx: "auto",
          borderWidth: 1,
          borderColor: "#E6E6E6",
          boxShadow: 3,
          position: "relative",
          height: "400px",
          overflow: "hidden",
        }}
      >
           <Image
          src={Site.src}
          alt="Uploaded file"
          layout="fill"
          objectFit="cover"
        />
      </DialogTitle>
      <DialogContent>
      <Grid container justifyContent={"space-between"} marginTop={2}>

      <Grid item md={5.8}>
                    <CustomTextField
                      {...register("trolleyId", {
                        required: "Trolley ID is required",
                      })}
                      name="trolleyId"
                      label="Trolley ID"
                      placeholder="Enter Trolley ID"
                      error={!!errors.trolleyId}
                      helperText={errors.trolleyId?.message}
                      onChange={handleInputChange}
                      // defaultValue={
                        // selectedDevice ? selectedDevice?.trolleyUid : ""
                      // }
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <CustomTextField
                      {...register("trolleyId", {
                        required: "Trolley ID is required",
                      })}
                      name="trolleyId"
                      label="Trolley ID"
                      placeholder="Enter Trolley ID"
                      error={!!errors.trolleyId}
                      helperText={errors.trolleyId?.message}
                      onChange={handleInputChange}
                      // defaultValue={
                        // selectedDevice ? selectedDevice?.trolleyUid : ""
                      // }
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <CustomTextField
                      {...register("trolleyId", {
                        required: "Trolley ID is required",
                      })}
                      name="trolleyId"
                      label="Trolley ID"
                      placeholder="Enter Trolley ID"
                      error={!!errors.trolleyId}
                      helperText={errors.trolleyId?.message}
                      onChange={handleInputChange}
                      // defaultValue={
                        // selectedDevice ? selectedDevice?.trolleyUid : ""
                      // }
                    />
                  </Grid>
                  <Grid item md={2.7}>
                    <CustomTextField
                      {...register("trolleyId", {
                        required: "Trolley ID is required",
                      })}
                      name="trolleyId"
                      label="Trolley ID"
                      placeholder="Enter Trolley ID"
                      error={!!errors.trolleyId}
                      helperText={errors.trolleyId?.message}
                      onChange={handleInputChange}
                      // defaultValue={
                        // selectedDevice ? selectedDevice?.trolleyUid : ""
                      // }
                    />
                  </Grid>
                  <Grid item md={2.7}>
                    <CustomTextField
                      {...register("trolleyId", {
                        required: "Trolley ID is required",
                      })}
                      name="trolleyId"
                      label="Trolley ID"
                      placeholder="Enter Trolley ID"
                      error={!!errors.trolleyId}
                      helperText={errors.trolleyId?.message}
                      onChange={handleInputChange}
                      // defaultValue={
                        // selectedDevice ? selectedDevice?.trolleyUid : ""
                      // }
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <CustomTextField
                      {...register("trolleyId", {
                        required: "Trolley ID is required",
                      })}
                      name="trolleyId"
                      label="Trolley ID"
                      placeholder="Enter Trolley ID"
                      error={!!errors.trolleyId}
                      helperText={errors.trolleyId?.message}
                      onChange={handleInputChange}
                      // defaultValue={
                        // selectedDevice ? selectedDevice?.trolleyUid : ""
                      // }
                    />
                  </Grid>
                  </Grid>

      </DialogContent>

      {/* <Box
        sx={{
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: 0,
          borderStyle: "solid",
          mx: "auto",
          borderWidth: 1,
          borderColor: "#E6E6E6",
          boxShadow: 3,
          position: "relative",
          height: "400px",
          overflow: "hidden",
        }}
      >
        <Image
          src={Site.src}
          alt="Uploaded file"
          layout="fill"
          objectFit="cover"
        />
      </Box>
      <Box
        sx={{
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: 0,
          borderStyle: "solid",
          mx: "auto",
          borderWidth: 1,
          borderColor: "#E6E6E6",
          boxShadow: 3,
          position: "relative",
          height: "400px",
          overflow: "hidden",
        }}
      >

      </Box> */}



    </Grid>
  );
};

export default FinalDetails;
