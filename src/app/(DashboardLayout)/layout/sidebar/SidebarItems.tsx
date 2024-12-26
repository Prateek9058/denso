import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import PermissionUtils from "@/app/(components)/hooks/permissionUtils";

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const [allowedPermissions] = PermissionUtils();
  const profile = localStorage.getItem("profile")
    ? JSON.parse(localStorage.getItem("profile") as string)
    : null;

  const filteredMenuItems = Menuitems.filter((item: any) => {
    return allowedPermissions?.some((permission: any) => permission[item?.key]);
  });

  return (
    <>
      <Box sx={{ px: 0 }}>
        <List sx={{ pt: 0 }} className="sidebarNav" component="div">
          {(profile?.role === 1 ? Menuitems : filteredMenuItems).map((item) => {
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
