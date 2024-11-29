import React, { useEffect, useState } from "react";
import ManagementGrid from "@/app/(components)/mui-components/Card";
import axiosInstance from "@/app/api/axiosInstance";
import AddShift from "./addShift";
import { Grid, Card, Typography, Button, Box, IconButton } from "@mui/material";
import { MdOutlineDeleteOutline } from "react-icons/md";
import noData from "../../../../../public/Img/nodata.png";
import Image from "next/image";
import CommonDialog from "../../mui-components/Dialog";
import { notifySuccess } from "../../mui-components/Snackbar";

interface Shift {
  id: number;
  name: string;
  timeRange: string;
}

const ShiftCard: React.FC<{
  shift: Shift;
  handleClickOpen: (id: number) => void;
  cardData: any;
  handleOpenDelete?: any;
}> = ({ shift, handleClickOpen, handleOpenDelete }) => {
  return (
    <Card
      sx={{
        padding: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="body1">{shift.timeRange}</Typography>
      <Grid>
        <Button size="small" onClick={() => handleClickOpen(shift.id)}>
          Edit
        </Button>
        <IconButton
          onClick={() => {
            handleOpenDelete(shift?.id);
          }}
        >
          <MdOutlineDeleteOutline />
        </IconButton>
      </Grid>
    </Card>
  );
};

function ManageSites() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [allShifts, setAllShifts] = useState<any>([]);
  const [id, setId] = React.useState<any>(null);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [deleteId, setDeleteID] = useState<string>("");

  useEffect(() => {
    getAllShifts();
  }, []);

  const getAllShifts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("shifts/getAllShifts/");
      if (res?.status === 200 || res?.status === 201) {
        setAllShifts(res?.data?.data?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleClickOpenUpload = (shiftId?: number) => {
    setId(shiftId);
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
  const handleOpenDelete = (id: string) => {
    setOpenDelete(true);
    setDeleteID(id);
  };
  const handleCancel = () => {
    setOpenDelete(false);
  };
  const handleConfirm = async () => {
    try {
      const { status } = await axiosInstance.delete(
        `/shifts/deleteShift/${deleteId}`
      );
      if (status === 200 || status === 201) {
        notifySuccess("shift deleted successfully!");
        getAllShifts();
        handleCancel();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <CommonDialog
        open={openDelete}
        fullWidth={true}
        maxWidth={"sm"}
        title="Confirmation"
        message={"are you sure want to delete this shift?"}
        color="error"
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
      <AddShift
        title={selectedShift ? "Edit Shift" : "Add Shift"}
        open={open}
        setOpen={setOpen}
        getDeviceData={getAllShifts}
        selectedShift={selectedShift}
        setSelectedShift={setSelectedShift}
      />
      <ManagementGrid
        moduleName="Shifts"
        button="Add Shift"
        handleClickOpen={handleClickOpenAddShift}
      />

      <Card sx={{ p: 2, mt: 2, width: "100%" }}>
        <Grid container spacing={2}>
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
                    {shift?.name}
                  </Typography>
                  <ShiftCard
                    shift={shift}
                    handleClickOpen={handleClickOpenUpload}
                    cardData={shift?.id}
                    handleOpenDelete={handleOpenDelete}
                  />
                </Box>
              </Grid>
            ))
          )}
        </Grid>
      </Card>
    </>
  );
}

export default ManageSites;
