import React from "react";
import { Box, AppBar, Grid, styled, Stack, IconButton } from "@mui/material";
import PropTypes from "prop-types";
// components
import Profile from "./Profile";
import { LuMenu } from "react-icons/lu";
import Notification from "./Notification";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
  open: any;
}

const Header = ({ toggleMobileSidebar, open }: ItemType) => {
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    // transition: "none",
    padding: "18px 35px 18px 35px",
    color: theme.palette.text.primary,
    backgroundColor: "white",
    zIndex: "10",
    // borderBottom: "0.5px solid #C8CBD9 ",
  }));

  return (
    // <AppBarStyled position="sticky" open={open} color="default">
    //   <Grid container justifyContent={"space-between"}>
    //     <Grid item>
    //       <IconButton
    //         color="inherit"
    //         aria-label="open drawer"
    //         onClick={toggleMobileSidebar}
    //         edge="start"
    //         sx={[
    //           {
    //             marginRight: 5,
    //           },
    //           open && { display: "none" },
    //         ]}
    //       >
    //         <LuMenu width="22" height="22" />
    //       </IconButton>
    //     </Grid>

    //     <Grid item>
    //       <Grid container>
    //         <Notification />
    //         <Profile />
    //       </Grid>
    //     </Grid>
    //   </Grid>
    // </AppBarStyled>
    {
      /* <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar> */
    }
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
