"use client";
import React, { useEffect, useState } from "react";
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

import { addDays, subDays, differenceInDays } from "date-fns";
import CommonDatePicker from "@/app/(components)/mui-components/Text-Field's/Date-range-Picker";
import { DateRangePicker } from "react-date-range";
import axiosInstance from "@/app/api/axiosInstance";
import MensFilter from "./mensfilter";

interface SelectedItems {
  department: string | null;
  sections: string[];
  lines: string[];
}
interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
      style={{ width: "87%" }}
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

export default function AssignAssessment({ open, setOpen }: Props) {
  const methods = useForm<any>();
  const [activeStep, setValue] = React.useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [men, setMen] = useState<any>([]);
  const [allShifts, setAllShifts] = useState<any>([]);
  const [date, setDate] = useState<any>(null);

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
    handleClose();
  };
  const handleClear = () => {
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

    setState([selection]);
  };

  useEffect(() => {
    if (activeStep === 2) getAllShifts();
  }, [activeStep]);

  const getAllShifts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("shifts/getAllShifts/");
      if (res?.status === 200 || res?.status === 201) {
        setAllShifts(res?.data?.data?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const [selectedShift, setSelectedShift] = useState<number | null>(null);

  const handleShiftClick = (index: number) => {
    setSelectedShift(index);
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
              <TabItem label="Manpower" {...a11yProps(0)} />
              <TabItem label="Date" {...a11yProps(1)} />
              <TabItem label="Shift" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={activeStep} index={0}>
              <Grid container>
                <MensFilter setTrolley={setMen} trolley={men} />
              </Grid>
            </TabPanel>
            <TabPanel value={activeStep} index={1}>
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
            <TabPanel value={activeStep} index={2}>
              <Grid container>
                {allShifts &&
                  allShifts.map((item: any, index: number) => {
                    return (
                      <Button
                        variant={
                          selectedShift === index ? "contained" : "outlined"
                        }
                        size="large"
                        key={index}
                        sx={{ ml: 2 }}
                        onClick={() => handleShiftClick(index)}
                      >
                        {item?.shiftName}
                      </Button>
                    );
                  })}
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
