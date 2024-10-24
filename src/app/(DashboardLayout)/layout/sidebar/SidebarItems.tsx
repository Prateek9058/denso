import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List, Divider } from "@mui/material";
import NavItem from "./NavItem";
import { uniqueId } from "lodash";
import { signOut } from "next-auth/react";
import logout from "../.../../../../.././../public/Img/Logout.png";
const Menuitems1: any = [
  {
    id: uniqueId(),
    title: "Logout",
    icon: logout,
    href: "/login",
  },
];
const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("loginId");
    localStorage.removeItem("selectedSite");
    signOut({ callbackUrl: "/login", redirect: true });
  };

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
      <Box
        sx={{
          justifyContent: "flex-end",
          alignSelf: "flex-end",
          width: "100%",
          position: "absolute",
          bottom: 0,
        }}
      >
        <Divider sx={{ marginBottom: "20px" }} />
        <List
          sx={{ pt: 0, pl: 1, width: "100%" }}
          className="sidebarNav"
          component="div"
        >
          {Menuitems1?.map((item: any) => {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={
                  item?.title === "Logout" ? handleLogOut : toggleMobileSidebar
                }
              />
            );
          })}
        </List>
      </Box>
    </>
  );
};
export default SidebarItems;
