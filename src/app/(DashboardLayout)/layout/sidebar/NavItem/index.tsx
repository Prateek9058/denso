import React from "react";
// mui imports
import {
  ListItemIcon,
  ListItem,
  List,
  styled,
  ListItemText,
  useTheme,
  ListItemButton,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
type NavGroup = {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: any;
  onClick?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
};
interface ItemType {
  item: NavGroup;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  hideMenu?: any;
  level?: number | any;
  pathDirect: string;
}
const NavItem = ({ item, level, pathDirect, onClick }: ItemType) => {
  const Icon = item.icon;
  const IconActive = item?.iconActive;
  const theme = useTheme();
  const ListItemStyled = styled(ListItem)(() => ({
    padding: 0,
    ".MuiButtonBase-root": {
      whiteSpace: "nowrap",
      marginBottom: "12px",
      padding: "8px 20px",
      borderRadius: "8px",
      backgroundColor: level > 1 ? "transparent !important" : "inherit",
      color: "#464255",
      paddingLeft: "20px",
      display: "flex", // Ensure the icon and text are in a row
      alignItems: "center", // Center them vertically
      "&:hover": {
        backgroundColor: "#FF9999",
        color: "#464255",
        padding: 10,
      },
      "&.Mui-selected": {
        color: "#FFFFFF",
        backgroundColor: "#DC0032",
        padding: 10,
        "&:hover": {
          backgroundColor: "#DC0032",
          color: "#FFFFFF",
          padding: 10,
        },
      },
    },
  }));
  const TextStyled = styled(ListItemText)(() => ({
    display: "inline-block", // Ensure text is inline with icon
    marginLeft: "10px", // Space between icon and text
    maxWidth: "calc(100% - 30px)", // Adjust based on icon size and padding
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap", // Prevent wrapping
    transition: "max-width 0.2s ease",
  }));
  return (
    <List component="div" disablePadding key={item?.id}>
      <ListItemStyled>
        <ListItemButton
          component={Link}
          href={item?.href}
          disabled={item?.disabled}
          selected={pathDirect.startsWith(item?.href)}
          target={item.external ? "_blank" : ""}
          onClick={onClick}
          sx={{
            justifyContent: "initial",
          }}
        >
          <Image
            src={pathDirect.startsWith(item?.href) ? IconActive : Icon}
            alt="man power track"
            width={24}
            height={24}
          />
          <TextStyled>
            {item?.title}
          </TextStyled>
        </ListItemButton>
      </ListItemStyled>
    </List>
  );
};
export default NavItem;