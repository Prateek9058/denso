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
      style={{ width: "100%" }}
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
  label: string;
}

interface CommonTabsProps {
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
  TabPanelList: any;
  tabs: TabData[];
}

const CommonTabs: React.FC<CommonTabsProps> = ({
  value,
  tabs,
  handleChange,
  TabPanelList,
}) => {
  return (
    <>
      <Grid container sx={{ backgroundColor: "#fff", pl: "12px", pr: "12px" }}>
        <Tabs value={value} onChange={handleChange} centered>
          {tabs.map((tab: TabData, index: number) => (
            <Tab key={index} label={tab.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Grid>
      <Grid container sx={{ backgroundColor: "#fff", mt: 2 }}>
        {TabPanelList.map((panel: any, index: number) => (
          <TabPanel key={index} value={value} index={index}>
            {panel.component}
          </TabPanel>
        ))}{" "}
      </Grid>
    </>
  );
};

export default CommonTabs;
