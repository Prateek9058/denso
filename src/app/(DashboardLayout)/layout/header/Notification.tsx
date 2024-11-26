import React, {
  useState,
  Fragment,
  ReactNode,
  MouseEvent,
  useEffect,
} from "react";
import Box from "@mui/material/Box";
import { Button, Typography, Badge, Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { styled, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MuiAvatar from "@mui/material/Avatar";
import MuiMenuItem from "@mui/material/MenuItem";
import MuiMenu from "@mui/material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import notificationImg from "../../../../../public/Img/notification.gif";
import Image from "next/image";
import Link from "next/link";
import { useNotification } from "@/app/(context)/NotificationContext";
import moment from "moment";

const theme = createTheme();

const Menu = styled(MuiMenu)(({ theme }) => ({
  "& .MuiMenu-paper": {
    width: 380,
    overflow: "hidden",
    marginTop: theme.spacing(4),
    [theme?.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  "& .MuiMenu-list": {
    padding: 0,
  },
}));

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const styles = {
  maxHeight: 349,
  overflowY: "scroll",
  "& .MuiMenuItem-root:last-of-type": {
    border: 0,
  },
};

const Avatar = styled(MuiAvatar)`
  width: 2.375rem;
  height: 2.375rem;
  font-size: 1.125rem;
`;

const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  flex: "1 1 100%",
  overflow: "hidden",
  fontSize: "0.875rem",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  marginBottom: theme.spacing(0.75),
}));

const MenuItemSubtitle = styled(Typography)`
  flex: "1 1 100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
`;

interface ScrollWrapperProps {
  children: ReactNode;
}

const ScrollWrapper = ({ children }: ScrollWrapperProps) => {
  const hidden = useMediaQuery(theme.breakpoints.down("lg"));
  return (
    <Box
      sx={{
        ...styles,
        overflowY: hidden ? "auto" : "scroll",
        overflowX: "hidden",
      }}
    >
      {children}
    </Box>
  );
};

const Notification: React.FC = () => {
  const { notification, getnotification, readCount } = useNotification();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleDropdownOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    getnotification();
  };
  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <IconButton
        aria-haspopup="true"
        onClick={handleDropdownOpen}
        aria-controls="customized-menu"
        sx={{ marginRight: "10px" }}
      >
        <Badge
          color="primary"
          max={5}
          badgeContent={readCount ? readCount : 0}
        >
          <NotificationsNoneIcon color="primary" sx={{ fontSize: "30px" }} />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disableRipple>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography align="center" sx={{ fontWeight: 600, width: "100%" }}>
              Notifications
            </Typography>
          </Box>
        </MenuItem>
        <ScrollWrapper>
          {notification?.alerts?.length > 0 ? (
            <>
              {notification?.alerts
                ?.slice(0, 5)
                ?.map((notification: any, index: any) => (
                  <MenuItem key={index}>
                    <Box
                      sx={{
                        width: "100%",
                        alignItems: "center",
                      }}
                      href="/alerts"
                      component={Link}
                      onClick={handleDropdownClose}
                    >
                      <MenuItemTitle className="tablecrow-cell-bg">
                        {notification?.alert}
                      </MenuItemTitle>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.disabled", alignSelf: "end" }}
                      >
                        {moment(notification?.createdAt).format("lll")}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
            </>
          ) : (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ width: "100%", height: "40vh" }}
              direction="column"
            >
              <Grid container justifyContent="center">
                <Image
                  src={notificationImg}
                  alt="notification"
                  width={150}
                  height={150}
                />
              </Grid>
              <Typography className="fs20px">
                No notifications to show yet
              </Typography>
              <Typography
                align="center"
                className="fs16px"
                sx={{ color: "#6D787D", width: "90%" }}
              >
                You’ll see useful information here soon. Stay tuned!
              </Typography>
            </Grid>
          )}
        </ScrollWrapper>
        <MenuItem
          disableRipple
          sx={{
            padding: "16px 16px",
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button
            fullWidth
            href="/alerts"
            component={Link}
            variant="contained"
            style={{
              color: "#fff",
              border: `1px solid #fff`,
            }}
            onClick={handleDropdownClose}
          >
            View All Notifications
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default Notification;
