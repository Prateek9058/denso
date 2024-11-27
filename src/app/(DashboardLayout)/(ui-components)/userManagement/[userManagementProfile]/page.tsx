"use client";
import { Button, Checkbox, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { MdDeleteSweep } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/api/axiosInstance";
import ToastComponent, {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import CommonDialog from "@/app/(components)/mui-components/Dialog";
import Breadcrumb from "@/app/(components)/mui-components/Breadcrumbs";
type Breadcrumb = {
  label: string;
  link: string;
};
type cardProps = {
  value: string;
};

const RolesData: cardProps[] = [
  { value: "Manpower tracking" },
  { value: "Trolley tracking" },
  { value: "Trolley  Maintenance" },
  { value: "User Management" },
  { value: "Department" },
  { value: "Alerts" },
  { value: "Setting" },
];
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const Page = ({ params }: { params: { userManagementProfile: string } }) => {
  const router = useRouter();
  const [userData, setUserData] = React.useState<any>(null);
  const [open, setOpenDialog] = React.useState(false);

  const breadcrumbItems: Breadcrumb[] = [
    { label: "Dashboard", link: "/" },
    { label: "User Management ", link: "/userManagement" },
    {
      label: userData?.fullName ?? "--",
      link: "",
    },
  ];
  console.log("Check userData", userData);

  const getUser = async () => {
    const { data, status } = await axiosInstance.get(
      `/users/getSingleUser/${params.userManagementProfile}`
    );
    if (status === 200 || status === 201) {
      setUserData(data?.data);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    handleDelete();
    handleCancel();
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      const { data, status } = await axiosInstance.delete(
        `/users/deletedUser/${params.userManagementProfile}`
      );
      if (status === 200 || status === 201) {
        notifySuccess("user Deleted successfully");
        router.push("/userManagement");
      }
    } catch (error) {
      notifyError((error as any)?.response?.data?.message);
    }
  };
  const formattedDate = dayjs(userData?.createdAt).format(
    "YYYY-MM-DD HH:mm:ss"
  );

  return (
    <>
      <ToastComponent />
      <CommonDialog
        open={open}
        fullWidth={true}
        maxWidth={"xs"}
        title="Confirmation"
        message="Are you sure you want to delete this user?"
        color="error"
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Grid item>
          <Breadcrumb breadcrumbItems={breadcrumbItems} />
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            size="large"
            startIcon={<MdModeEdit />}
            color="inherit"
          >
            Edit
          </Button>
          <Button
            size="large"
            sx={{ ml: 2 }}
            variant="contained"
            onClick={handleOpenDialog}
            startIcon={<MdDeleteSweep />}
          >
            Delete Profile
          </Button>
        </Grid>
      </Grid>
      <Grid container mt={4} justifyContent={"space-between"}>
        <Grid
          xs={5.9}
          item
          sx={{
            border: "1px solid red",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h5">User Details</Typography>
          <Grid container mt={4} justifyContent={"space-between"}>
            <Typography variant="h6">UID</Typography>
            <Typography variant="h6" color={"primary"}>
              {userData?.uId}
            </Typography>
          </Grid>
          <Grid container mt={4} justifyContent={"space-between"}>
            <Typography variant="h6">UserName</Typography>
            <Typography variant="h6" color={"primary"}>
              {userData?.fullName}
            </Typography>
          </Grid>
          <Grid container mt={4} justifyContent={"space-between"}>
            <Typography variant="h6">Department</Typography>
            <Typography variant="h6" color={"primary"}>
              {userData?.departmentId?.name}
            </Typography>
          </Grid>
          <Grid container mt={4} justifyContent={"space-between"}>
            <Typography variant="h6">Email</Typography>
            <Typography variant="h6" color={"primary"}>
              {userData?.email}
            </Typography>
          </Grid>
          <Grid container mt={4} justifyContent={"space-between"}>
            <Typography variant="h6">Phone Number </Typography>
            <Typography variant="h6" color={"primary"}>
              {userData?.phoneNumber}
            </Typography>
          </Grid>
          <Grid container mt={4} justifyContent={"space-between"}>
            <Typography variant="h6">CreatedAt </Typography>
            <Typography variant="h6" color={"primary"}>
              {formattedDate}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          xs={5.9}
          item
          sx={{
            border: "1px solid red",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h5">Access Permission</Typography>
          {userData?.permissions?.map((item: any, index: number) => (
            <Grid container mt={2} key={index} alignItems={"center"}>
              <Checkbox {...label} defaultChecked disabled />
              <Typography variant="body1">{Object.keys(item)[0]}</Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default Page;
