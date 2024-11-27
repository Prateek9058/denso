// CommonTabs.tsx
import React from "react";
import { Tabs, Tab, Grid, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { CgAddR } from "react-icons/cg";
import { IoMdAddCircleOutline } from "react-icons/io";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
interface TabData {
  label?: string;
  id?: any;
}

interface CommonTabsProps {
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
  TabPanelList: any;
  tabs: TabData[];
  authRole?: string;
  button?: any;
  handleClickOpen?: any;
}

const CustomTab: React.FC<CommonTabsProps> = ({
  value,
  tabs,
  handleChange,
  TabPanelList,
  button,
  handleClickOpen,
}) => {
  return (
    <>
      <Grid container justifyContent="left" alignItems="center">
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Tabs
            value={value}
            className="TabStyleAddDevice"
            onChange={handleChange}
            centered
          >
            {tabs?.map((tab: TabData, index: number) => (
              <Tab
                key={index}
                label={tab.label}
                {...a11yProps(index)}
                sx={{
                  borderRadius: "5px",
                  bgcolor: "#CACACA",
                  color: "white",
                }}
                className="TabChangesDeviceLive"
              />
            ))}
          </Tabs>
          {button && (
            <Button
              variant={"contained"}
              onClick={handleClickOpen}
              startIcon={<IoMdAddCircleOutline />}
            >
              {button}
            </Button>
          )}
        </Grid>
      </Grid>
      {TabPanelList?.map((panel: any, index: number) => (
        <TabPanel key={index} value={value} index={index}>
          {panel.component}
        </TabPanel>
      ))}{" "}
    </>
  );
};

export default CustomTab;
