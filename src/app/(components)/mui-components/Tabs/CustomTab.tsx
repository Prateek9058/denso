// CommonTabs.tsx
import React from "react";
import { Tabs, Tab, Grid } from "@mui/material";

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
}

const CustomTab: React.FC<CommonTabsProps> = ({
  value,
  tabs,
  handleChange,
  TabPanelList,
  authRole,
}) => {
  return (
    <>
      <Grid container justifyContent="left" alignItems="center">
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
