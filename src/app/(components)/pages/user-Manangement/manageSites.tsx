import React, { useEffect, useState, ChangeEvent } from "react";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import axiosInstance from "@/app/api/axiosInstance";
import AddShift from "./addShift";
import { Grid, Card, Typography, Button, Box } from "@mui/material";
import noData from "../../../../../public/Img/nodata.png";
import Image from "next/image";

// Define the type for each shift
interface Shift {
  id: number;
  name: string;
  timeRange: string;
}

// const shifts: Shift[] = [
//   { id: 1, name: "Shift 1", timeRange: "09:00 AM - 12:00 PM" },
//   { id: 2, name: "Shift 2", timeRange: "12:00 PM - 03:00 PM" },
//   { id: 3, name: "Shift 3", timeRange: "03:00 PM - 06:00 PM" },
// ];

const ShiftCard: React.FC<{
  shift: Shift;
  handleClickOpen: (id: number) => void;
  cardData: any;
}> = ({ shift, handleClickOpen, cardData }) => {
  console.log("cardData11111", cardData);

  return (
    <Card
      variant="outlined"
      sx={{
        padding: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="body1">{shift.timeRange}</Typography>
      <Button
        sx={{ color: "red" }}
        size="small"
        onClick={() => handleClickOpen(shift.id)}
      >
        Edit
      </Button>
    </Card>
  );
};

function ManageSites() {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [allShifts, setAllShifts] = useState<any>([]);
  const [selectedShift, setSelectedShift] = useState<any>(null);

  // useEffect(() => {
  //   const storedSite = localStorage.getItem("selectedSite");
  //   if (storedSite) {
  //     setSelectedSite(JSON.parse(storedSite));
  //   }
  // }, []);
  useEffect(() => {
    getAllSites();
  }, []);
  const getAllSites = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("shifts/getAllShifts/");
      if (res?.status === 200 || res?.status === 201) {
        console.log("get all shift data", res);
        setAllShifts(res?.data?.data?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleClickOpenUpload = (shiftId: number) => {
    const selectedShiftData = allShifts.find(
      (shift: any) => shift._id === shiftId
    );
    setSelectedShift(selectedShiftData);
    setOpen(true);
  };
  const shifts: Shift[] = allShifts.map(
    (site: any): Shift => ({
      id: site._id,
      name: site.shiftName,
      timeRange: `${new Date(site.startTime).toLocaleTimeString()} - ${new Date(site.endTime).toLocaleTimeString()}`,
    })
  );
  const handleClickOpenAddShift = () => {
    setOpen(true);
  };
  return (
    <>
      <AddShift
        open={open}
        setOpen={setOpen}
        getDeviceData={getAllSites}
        selectedShift={selectedShift}
      />
      <ManagementGrid
        moduleName="Shifts:"
        button="Add Shift"
        handleClickOpen={handleClickOpenAddShift}
      />
      <Grid
        container
        spacing={3}
        mt={2}
        p={2}
        justifyContent="space-between"
        bgcolor={"white"}
      >
        {!loading && shifts.length === 0 ? (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Image src={noData} alt="no data found " />
          </Grid>
        ) : (
          shifts.slice(0, 4).map((shift) => (
            <Grid item xs={12} sm={4} key={shift.id}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {shift.name}
                </Typography>
                <ShiftCard
                  shift={shift}
                  handleClickOpen={handleClickOpenUpload}
                  cardData={shift.id}
                />
              </Box>
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
}

export default ManageSites;
