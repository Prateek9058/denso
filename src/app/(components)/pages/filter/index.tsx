"use client";
import React, { useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Step1 from "../trolley/assignDeparment/Step1";
import Step2 from "../trolley/assignDeparment/Step2";
import Step3 from "../trolley/assignDeparment/Step3";

interface SelectedItems {
  department: string | null;
  sections: string[];
  lines: string[];
}
interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getTrolleyData?: any;
  selectedDept?: string | null;
  selectedMen?: string | null;
  setSelectedMen: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedDept: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedItems>>;
  selectedItems: SelectedItems;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const TabItem = styled(Tab)(({ theme }) => ({
  borderRadius: "8px",
  color: "grey",
  minHeight: 35,
  minWidth: "120px",
  padding: "8px",
  marginBottom: "25px",

  "&.Mui-selected": {
    color: "#DC0032",
  },
}));

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: "75%" }}
    >
      {value === index && (
        <Box sx={{ pl: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function AssignAssessment({
  open,
  setOpen,
  getTrolleyData,
  selectedDept,
  selectedMen,
  setSelectedDept,
  setSelectedMen,
  selectedItems,
  setSelectedItems,
}: Props) {
  const methods = useForm<any>();
  const [activeStep, setValue] = React.useState(0);

  const handleSelectionChange = (key: keyof SelectedItems, id: string) => {
    setSelectedItems((prevState: any) => {
      if (key === "department") {
        return { ...prevState, department: id };
      }

      if (key === "sections" || key === "lines") {
        const updatedValues = prevState[key].includes(id)
          ? prevState[key].filter((itemId: any) => itemId !== id)
          : [...prevState[key], id];

        return { ...prevState, [key]: updatedValues };
      }

      return prevState;
    });
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const {
    formState: { errors },
  } = methods;

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectionChangeMen = (selection: string) => {
    setSelectedMen(selection);
  };
  const handleSelectionChangeDept = (selection: string) => {
    setSelectedDept(selection);
  };

  const handleSubmit = () => {
    getTrolleyData(selectedMen, selectedDept);
    handleClose();
  };
  const handleClear = () => {
    setSelectedDept(null);
    setSelectedMen(null);
    setSelectedItems({ department: null, sections: [], lines: [] });
    // getTrolleyData();
    handleClose();
  };
  return (
    <CommonDialog
      open={open}
      maxWidth={"md"}
      fullWidth={true}
      title={"Filter"}
      message={"Are you sure you want to cancel?"}
      titleConfirm={"Cancel"}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container sx={{ height: "300px" }}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={activeStep}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: "divider", height: "100%" }}
            >
              <TabItem label="Department" {...a11yProps(0)} />
              <TabItem label="Manpower" {...a11yProps(1)} />
              <TabItem label="Department" {...a11yProps(2)} />
              <TabItem
                label="Section"
                {...a11yProps(3)}
                disabled={selectedItems?.department == null && true}
              />
              <TabItem
                label="Line"
                {...a11yProps(4)}
                disabled={selectedItems?.sections?.length === 0 && true}
              />
            </Tabs>
            <TabPanel value={activeStep} index={0}>
              <Grid container rowGap={2}>
                <Typography variant="h5">Department</Typography>
                <Grid container columnGap={2}>
                  <Button
                    variant={selectedDept === "all" ? "contained" : "outlined"}
                    onClick={() => handleSelectionChangeDept("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={
                      selectedDept === "assigned" ? "contained" : "outlined"
                    }
                    onClick={() => handleSelectionChangeDept("assigned")}
                  >
                    Assigned
                  </Button>
                  <Button
                    variant={
                      selectedDept === "not_assigned" ? "contained" : "outlined"
                    }
                    onClick={() => handleSelectionChangeDept("not_assigned")}
                  >
                    Not Assigned
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={activeStep} index={1}>
              <Grid container rowGap={2}>
                <Typography variant="h5">Manpower</Typography>
                <Grid container columnGap={2}>
                  <Button
                    variant={selectedMen === "all" ? "contained" : "outlined"}
                    onClick={() => handleSelectionChangeMen("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={
                      selectedMen === "assigned" ? "contained" : "outlined"
                    }
                    onClick={() => handleSelectionChangeMen("assigned")}
                  >
                    Assigned
                  </Button>
                  <Button
                    variant={
                      selectedMen === "not_assigned" ? "contained" : "outlined"
                    }
                    onClick={() => handleSelectionChangeMen("not_assigned")}
                  >
                    Not Assigned
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={activeStep} index={2}>
              {activeStep === 2 && (
                <Step1
                  selectedItems={selectedItems}
                  handleSelectionChange={handleSelectionChange}
                />
              )}
            </TabPanel>
            <TabPanel value={activeStep} index={3}>
              {activeStep === 3 && (
                <Step2
                  deptId={selectedItems?.department}
                  selectedItems={selectedItems}
                  handleSelectionChange={handleSelectionChange}
                />
              )}
            </TabPanel>
            <TabPanel value={activeStep} index={4}>
              {activeStep === 4 && (
                <Step3
                  sectionIds={selectedItems?.sections}
                  selectedItems={selectedItems}
                  handleSelectionChange={handleSelectionChange}
                />
              )}
            </TabPanel>
          </Grid>
        </DialogContent>

        <DialogActions className="dialog-action-btn">
          <Button
            variant="outlined"
            sx={{ width: "150px" }}
            onClick={handleClear}
          >
            Clear All
          </Button>

          <Button variant="contained" type="submit" sx={{ width: "150px" }}>
            Apply
          </Button>
        </DialogActions>
      </form>
    </CommonDialog>
  );
}
