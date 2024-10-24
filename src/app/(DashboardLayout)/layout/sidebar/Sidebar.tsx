import React from "react";
import Image from "next/image";
import { useMediaQuery, Box, Drawer, Grid } from "@mui/material";
import brandMark from "@/app/(components)/assets/brand-mark.png";
import SidebarItems from "./SidebarItems";
import logo from "../../../../../public/Img/logo2.png";

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
}

const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: ItemType) => {
  const [sidebarVariant, setSidebarVariant] = React.useState<
    "permanent" | "temporary"
  >("permanent");
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const sidebarWidth = "270px";
  React.useEffect(() => {
    setSidebarVariant(lgUp ? "permanent" : "temporary");
  }, [lgUp]);
  return (
    <Box
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        zIndex: 100,
      }}
    >
      <Drawer
        anchor="left"
        open={lgUp ? isSidebarOpen : isMobileSidebarOpen}
        onClose={!lgUp ? onSidebarClose : undefined}
        variant={sidebarVariant}
        PaperProps={{
          sx: {
            width: sidebarWidth,
            boxSizing: "border-box",
            border: "0",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            overflow: lgUp ? "auto" : "hidden",
          }}
        >
          <Grid pt={3} container justifyContent={"center"}>
            <Image
              height={100}
              style={{
                objectFit: "contain",
              }}
              alt="logo"
              src={logo}
            />
          </Grid>{" "}
          <Box mt={3}>
            <SidebarItems />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
