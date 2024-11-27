import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import { uniqueId } from "lodash";
import logout from "../.../../../../.././../public/Img/Logout.png";

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    <>
      <Box sx={{ px: 0 }}>
        <List sx={{ pt: 0 }} className="sidebarNav" component="div">
          {Menuitems.map((item) => {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
              />
            );
          })}
        </List>
      </Box>
    </>
  );
};
export default SidebarItems;
