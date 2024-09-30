import * as React from "react";
import {
  Grid,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Tooltip,
  Divider,
} from "@mui/material";
import { useSitesData } from "@/app/(context)/SitesContext";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Loading from "../../loading";
export default function AccountMenu() {
  const { sites, selectedSite, setSelectedSite } = useSitesData();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (site: any) => {
    setSelectedSite(site);
    handleClose();
  };
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Sites">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{
              ml: 2,
              padding: "6px",
              border: "1px solid #E8E8EA",
              borderRadius: "8px",
            }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{
                borderRadius: "4px",
                width: "42px",
                height: "40px",
                marginRight: "3px",
              }}
              alt="Remy Sharp"
              src="/Img/logo2.png"
            />
            <Grid>
              <Typography variant="body1">Lets connect</Typography>
              <Typography variant="body2" color="#FFA11F">
                {selectedSite ? selectedSite?.siteName : "Select Sites"}
              </Typography>
            </Grid>
            <Grid>
              <ArrowDropDownIcon />
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
        {sites && sites?.length > 0 ? (
          sites?.map((item: any) => (
            <React.Fragment key={item?._id}>
              <MenuItem
                value={item?._id}
                onClick={() => handleMenuItemClick(item)}
              >
                {item?.siteName}
              </MenuItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <MenuItem disabled value="">
            <Typography>No sites available</Typography>
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
}
