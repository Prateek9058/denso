// CommonTabs.tsx
import React from "react";
import { Tabs, Tab, Grid, Box } from "@mui/material";

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
  label: string;
  color?: string;
}

interface CommonTabsProps {
  value: number;
  handleChange?: (event: React.SyntheticEvent, newValue: number) => void;
  TabPanelList?: any;
  tabs?: TabData[];
  zone?: any;
}

const ZoneTab: React.FC<CommonTabsProps> = ({
  value,
  tabs,
  handleChange,
  TabPanelList,
  zone,
}) => {
  return (
    <>
      <Grid
        container
        mt={1}
        justifyContent="center"
        alignItems="center"
        sx={{
          position: "absolute",
          bottom: 2,
          right: 2,
          zIndex: "9",
          width: "auto",
        }}
      >
        <Tabs
          value={value}
          className="TabStyleAddDeviceZone"
          onChange={handleChange}
          centered
        >
          {tabs?.map((tab: TabData, index: number) => (
            <Tab
              key={index}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {(index > 0 || zone) && (
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: tab.color,
                        marginRight: 1,
                      }}
                    />
                  )}
                  {tab.label}
                </Box>
              }
              {...a11yProps(index)}
              sx={{
                borderRadius: "50px ",
                margin: "0px",
              }}
              className="TabChangesDeviceLiveZone"
            />
          ))}
        </Tabs>
      </Grid>
    </>
  );
};

export default ZoneTab;
