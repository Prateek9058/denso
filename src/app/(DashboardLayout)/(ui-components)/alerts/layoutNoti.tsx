import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Grid,
  TablePagination,
} from "@mui/material";
import { red } from "@mui/material/colors";
import noData from "../../../../../public/Img/nodata.png";
import Image from "next/image";
import axiosInstance from "@/app/api/axiosInstance";
import moment from "moment";
import { useRouter } from "next/navigation";
import CommonDatePicker from "@/app/(components)/mui-components/Text-Field's/Date-range-Picker";
interface NotifyContextType {
  value: any;
}
function NotificationCard({
  notification,
  onReadNotification,
}: {
  notification: {
    id: number;
    macId: string;
    alert: string;
    createdAt: any;
    readNotification: any;
  };
  onReadNotification: (notification: any) => void;
}) {
  return (
    <Card
      style={{
        display: "flex",
        marginBottom: "10px",
      }}
    >
      <Avatar
        sx={{ bgcolor: red[500], margin: "10px" }}
        alt={notification.macId}
        src={"Img/empImg.png"}
      />
      <CardContent style={{ flex: "1 0 auto" }}>
        <Typography variant="h6" mb={1}>
          {notification?.macId}
        </Typography>
        <Typography variant="h6" color="grey">
          {notification?.alert}
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => onReadNotification(notification)}
          sx={{
            color: "#FFFFFF",
            backgroundColor: "#4C4C4C",
            marginTop: "8px",
          }}
        >
          View Location
        </Button>
      </CardContent>

      <Typography
        variant="body2"
        color="textSecondary"
        style={{ margin: "auto 10px auto auto" }}
      >
        {moment(notification.createdAt).format("lll")}
      </Typography>
    </Card>
  );
}
const NotificationsList: React.FC<NotifyContextType> = ({ value }) => {
  const router = useRouter();
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [date, setDate] = React.useState<any>(null);
  const [notification, setNotification] = useState<any>(null);
  const getDataFromChildHandler = (date: any, dataArr: any) => {
    setDate(date);
  };
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage?.(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = +event.target.value;
    setRowsPerPage?.(value);
    if (value === 10000) {
      setPage?.(0);
    }
  };
  const getnotification = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `api/v1/alerts/getAllAlerts?page=${
          page + 1
        }&limit=${rowsPerPage}&startDate=${moment(date?.[0]?.startDate).format(
          "YYYY-MM-DD"
        )}&endDate=${moment(date?.[0]?.endDate).format(
          "YYYY-MM-DD"
        )}&readStatus=${value == 0 ? "false" : "true"}`
      );
      if (res?.status === 200 || res?.status === 201) {
        const notifications = res?.data?.data;
        setNotification(notifications);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      getnotification();
    }
  }, [page, date, value, rowsPerPage]);

  const readNotification = async (data: any) => {
    try {
      setLoading(true);
      const res = await axiosInstance.patch(
        `api/v1/alerts/updateNotificationsToRead`,
        { ids: [data?._id] }
      );
      if (res?.status === 200 || res?.status === 201) {
        getnotification();
        {
          data?.employee
            ? router.push(`/man-power-tracking/${data?.employee}`)
            : router.push(`/trolley/${data?.trolley}`);
        }
      }
    } catch (err) {}
  };
  return (
    <>
      <Grid
        container
        p={2}
        mb={1}
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Grid item>
          <Typography variant="h5">Manage Alerts</Typography>
          <Typography variant="body1">
            Showing {notification?.alerts ? notification?.alerts?.length : 0}{" "}
            out of {notification?.totalCount ?? 0} Alerts
          </Typography>
        </Grid>
        <Grid item>
          <CommonDatePicker getDataFromChildHandler={getDataFromChildHandler} />
        </Grid>
      </Grid>
      {notification?.alerts?.length > 0 ? (
        <Grid container direction="column" alignItems="stretch">
          {notification?.alerts?.map((notification: any) => (
            <NotificationCard
              key={notification?._id}
              notification={notification}
              onReadNotification={readNotification}
            />
          ))}
          <TablePagination
            page={page ? page : 0}
            count={notification?.totalCount}
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: 10000 }]}
            rowsPerPage={rowsPerPage ? rowsPerPage : 0}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
      ) : (
        <Grid container justifyContent={"center"} alignItems={"center"}>
          <Image src={noData} alt="no data" />
        </Grid>
      )}
    </>
  );
};

export default NotificationsList;
