import React from "react";
import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";

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
          <Box mt={3}>
            <SidebarItems />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
