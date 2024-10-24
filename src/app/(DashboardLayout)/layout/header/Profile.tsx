import * as React from "react";
import { Button, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { IoMdLogOut } from "react-icons/io";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ImProfile } from "react-icons/im";
import profile from "../../../../../public/Img/profile.png";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function AccountMenu() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("loginId");
    signOut({ callbackUrl: "/login", redirect: true });
  };
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Profile">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{
              padding: "6px",
              border: "1px solid #E8E8EA",
              borderRadius: "8px",
            }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Grid
              width={40}
              height={40}
              style={{
                borderRadius: "50%",
                overflow: "hidden",
                marginRight: "5px",
              }}
            >
              <Image
                src={profile}
                alt="logo"
                width={40}
                height={40}
                style={{
                  objectFit: "cover",
                }}
              />
            </Grid>
            <Grid>
              <Typography variant="body1">Vishal Singh</Typography>
              <Typography variant="body2" color="#DC0032">
                {"Admin"}
              </Typography>
            </Grid>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Grid
            width={40}
            height={40}
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              marginRight: "5px",
            }}
          >
            <Image
              src={profile}
              alt="logo"
              width={40}
              height={40}
              style={{
                objectFit: "cover",
              }}
            />
          </Grid>
          <Grid>
            <Typography variant="body1">Vishal Singh</Typography>
            <Typography variant="body2" color="#DC0032">
              {"Admin"}
            </Typography>
          </Grid>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose(), router.push("/");
          }}
        >
          <ListItemIcon>
            <ImProfile fontSize="medium" />
          </ListItemIcon>
          View Profile
        </MenuItem>
        <Divider />

        <MenuItem onClick={handleClose}>
          <Button
            href="/login"
            variant="outlined"
            color="primary"
            component={Link}
            onClick={handleLogOut}
            fullWidth
          >
            Logout
          </Button>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
