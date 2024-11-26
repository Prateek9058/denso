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
      padding: "10px 10px",
      borderRadius: "8px",
      backgroundColor: level > 1 ? "transparent !important" : "inherit",
      color: "#464255",
      "&:hover": {
        backgroundColor: "#FF9999",
        color: "#464255",
      },
      "&.Mui-selected": {
        color: "#FFFFFF",
        backgroundColor: "#DC0032",

        "&:hover": {
          backgroundColor: "#DC0032",
          color: "#FFFFFF",
        },
      },
    },
  }));
  const TextStyled = styled(ListItemText)(() => ({
    display: "inline-block",
    marginLeft: "10px",
    maxWidth: "calc(100% - 30px)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
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
          <TextStyled>{item?.title}</TextStyled>
        </ListItemButton>
      </ListItemStyled>
    </List>
  );
};
export default NavItem;
