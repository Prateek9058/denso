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

    // backgroundColor:'lime',
    ".MuiButtonBase-root": {
      whiteSpace: "nowrap",
      marginBottom: "12px",
      padding: "8px 20px",
      borderRadius: "8px",
      backgroundColor: level > 1 ? "transparent !important" : "inherit",
      color: "#464255",
      paddingLeft: "20px",
      "&:hover": {
        backgroundColor: "#ff9999",
        color: "#464255",
        // paddingLeft:15,
        padding:10,

      },
      "&.Mui-selected": {
        color: "#FFFFFF",
        backgroundColor: "#DC0032",
        // paddingHorizontal:15,
        padding:10,
        // margin:10,
        "&:hover": {
          backgroundColor: "#DC0032",
          color: "#FFFFFF",
          // padding:15,
        padding:10,
        },
      },
    },
  }));
  

  return (
    <List component="div" disablePadding key={item?.id}  >
      <ListItemStyled>
        <ListItemButton
          component={Link}
          href={item?.href}
          disabled={item?.disabled}
          selected={pathDirect.startsWith(item?.href)}
          target={item.external ? "_blank" : ""}
          onClick={onClick}
          sx={[
            {
              justifyContent: "initial",
            },
          ]}
        >
          <Image
            src={pathDirect.startsWith(item?.href) ? IconActive : Icon}
            alt="man power track"
          />
          <ListItemText sx={{ px:2.7 }}>
            <>{item?.title}</>
          </ListItemText>
        </ListItemButton>
      </ListItemStyled>
    </List>
  );
};

export default NavItem;
