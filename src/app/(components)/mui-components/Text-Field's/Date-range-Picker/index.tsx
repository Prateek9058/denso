"use client";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { addDays, subDays, differenceInDays } from "date-fns";
import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DateRangePicker, DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface CalendarProps {
  getDataFromChildHandler: Function;
  height?: any;
  empJoinedDate?: any;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(),
  },
}));



const Calendar: React.FC<CalendarProps> = ({
  getDataFromChildHandler,
  height,
  empJoinedDate,
}) => {
  const defaultDateRange: any = {
    startDate: subDays(new Date(),0),
    endDate: addDays(new Date(),0),
    key: "selection",
  };
  const [open, setOpen] = useState<boolean>(false);
  const [fullWidth] = useState<boolean>(true);
  const [maxWidth] = useState<any>("md");
  const [state, setState] = useState<any>([defaultDateRange]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnChange = (ranges: any) => {
    const selection = ranges.selection;
    const startDate = new Date(selection.startDate);
    const endDate = new Date(selection.endDate);
    setState([selection]);
  };

  function getDates(startDate: Date, endDate: Date): string[] {
    const dates: string[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
      dates.push(dateString);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  useEffect(() => {
    const dates = getDates(state?.[0].startDate, state?.[0].endDate);

    var resultArray;

    if (dates.length == 1) {
      resultArray = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ];
    } else if (dates.length > 31) {
      resultArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
    } else {
      resultArray = dates;
    }

    getDataFromChildHandler(state, resultArray);
  }, [state]);

  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const isBeforeEmpJoinedDate = (date: Date) => {
    if (!empJoinedDate) return false;
    const joinedDate = new Date(empJoinedDate);
    joinedDate.setHours(0, 0, 0, 0);
    return date < joinedDate;
  };
  return (
    <>
      <>
        <input
          onClick={handleClickOpen}
          value={`${
            state?.[0].startDate
              ? dayjs(state?.[0].startDate).format("DD/MM/YYYY")
              : "dd/mm/yyyy"
          } - ${
            state?.[0].endDate
              ? dayjs(state?.[0].endDate).format("DD/MM/YYYY")
              : "dd/mm/yyyy"
          }`}
          style={{
            borderRadius: "5px",
            padding: "9px 10px",
            width: "176px",
            fontWeight: "bold",
            fontSize: "14px",
            background: "#4C4C4C",
            color: "#FFFFFF",
            border: "1px solid #ddd",
            cursor: "pointer",
            ...(height && { height: "43px" }),
          }}
        />
      </>
      <BootstrapDialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: "SmallDialog",
        }}
      >
        <DateRangePicker
          onChange={handleOnChange}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={state}
          direction="horizontal"
          disabledDay={(date: Date) =>
            isFutureDate(date) || isBeforeEmpJoinedDate(date)
          }
        />
      </BootstrapDialog>
    </>
  );
};

Calendar.propTypes = {
  getDataFromChildHandler: PropTypes.func.isRequired,
};

export default Calendar;
