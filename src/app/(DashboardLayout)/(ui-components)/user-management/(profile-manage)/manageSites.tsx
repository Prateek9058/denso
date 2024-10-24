import React, { useEffect, useState, ChangeEvent } from "react";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import axiosInstance from "@/app/api/axiosInstance";
import AddSite from "../(addShift)/addShift";
import { Grid, Card, Typography, Button, Box } from "@mui/material";

// Define the type for each shift
interface Shift {
  id: number;
  name: string;
  timeRange: string;
}

const shifts: Shift[] = [
  { id: 1, name: "Shift 1", timeRange: "09:00 AM - 12:00 PM" },
  { id: 2, name: "Shift 2", timeRange: "12:00 PM - 03:00 PM" },
  { id: 3, name: "Shift 3", timeRange: "03:00 PM - 06:00 PM" },
];
const ShiftCard: React.FC<{ shift: Shift }> = ({ shift }) => {
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
      <Button sx={{ color: "red" }} size="small">
        Edit
      </Button>
    </Card>
  );
};

function ManageSites() {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [allSites, setAllSites] = useState<any>([]);
  const [selectedSite, setSelectedSite] = useState<any>(null);

  useEffect(() => {
    const storedSite = localStorage.getItem("selectedSite");
    if (storedSite) {
      setSelectedSite(JSON.parse(storedSite));
    }
  }, []);
  useEffect(() => {
    getAllSites();
  }, []);
  const getAllSites = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/v1/site/getAllSites");
      if (res?.status === 200 || res?.status === 201) {
        setAllSites(res?.data?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleClickOpenUpload = () => {
    setOpen(true);
  };
  return (
    <>
      <AddSite open={open} setOpen={setOpen} getDeviceData={getAllSites} />
      <ManagementGrid
        moduleName="Shifts"
        button="Add Shift"
        handleClickOpen={handleClickOpenUpload}
      />
      <Grid
        container
        spacing={3}
        mt={2}
        p={2}
        justifyContent="space-between"
        bgcolor={"white"}
      >
        {shifts.map((shift) => (
          <Grid item xs={12} sm={4} key={shift.id}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {shift.name}
              </Typography>
              <ShiftCard shift={shift} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ManageSites;
