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
import { addDays, subDays } from "date-fns";
import { DateRangePicker } from "react-date-range";
import moment from "moment";
import { start } from "repl";

interface SelectedItems {
  department: string | null;
  sections: string[];
  lines: string[];
}
interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getTrolleyData?: any;
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
  selectedItems,
  setSelectedItems,
}: Props) {
  const methods = useForm<any>();
  const [activeStep, setValue] = React.useState(0);
  const [startDate, setStartDate] = React.useState<any>(moment());
  const [endDate, setEndDate] = React.useState<any>(moment());

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

  const handleSubmit = () => {
    getTrolleyData(selectedItems, startDate, endDate);
    handleClose();
  };
  const handleClear = () => {
    setSelectedItems({ department: null, sections: [], lines: [] });
    getTrolleyData();
    handleClose();
  };
  const defaultDateRange: any = {
    startDate: subDays(new Date(), 0),
    endDate: addDays(new Date(), 0),
    key: "selection",
  };
  const [state, setState] = useState<any>([defaultDateRange]);
  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };
  const handleOnChange = (ranges: any) => {
    const selection = ranges.selection;
    const startDate = new Date(selection.startDate);
    const endDate = new Date(selection.endDate);
    setStartDate(startDate);
    setEndDate(endDate);

    setState([selection]);
  };

  return (
    <CommonDialog
      open={open}
      maxWidth={"lg"}
      fullWidth={true}
      title={"Filter"}
      message={"Are you sure you want to cancel?"}
      titleConfirm={"Cancel"}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container sx={{ height: "380px" }}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={activeStep}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: "divider", height: "100%" }}
            >
              <TabItem label="Department" {...a11yProps(0)} />
              <TabItem
                label="Section"
                {...a11yProps(1)}
                disabled={selectedItems?.department == null && true}
              />
              <TabItem
                label="Line"
                {...a11yProps(2)}
                disabled={selectedItems?.sections?.length === 0 && true}
              />
              <TabItem label="Date" {...a11yProps(0)} />
            </Tabs>

            <TabPanel value={activeStep} index={0}>
              {activeStep === 0 && (
                <Step1
                  selectedItems={selectedItems}
                  handleSelectionChange={handleSelectionChange}
                />
              )}
            </TabPanel>
            <TabPanel value={activeStep} index={1}>
              {activeStep === 1 && (
                <Step2
                  deptId={selectedItems?.department}
                  selectedItems={selectedItems}
                  handleSelectionChange={handleSelectionChange}
                />
              )}
            </TabPanel>
            <TabPanel value={activeStep} index={2}>
              {activeStep === 2 && (
                <Step3
                  sectionIds={selectedItems?.sections}
                  selectedItems={selectedItems}
                  handleSelectionChange={handleSelectionChange}
                />
              )}
            </TabPanel>
            <TabPanel value={activeStep} index={3}>
              <Grid container width={"100px"}>
                <DateRangePicker
                  onChange={handleOnChange}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  ranges={state}
                  direction="horizontal"
                  disabledDay={(date: Date) => isFutureDate(date)}
                />
              </Grid>
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
