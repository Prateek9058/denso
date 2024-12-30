import React from "react";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "leaflet/dist/leaflet.css";
import CustomAccordian from "@/app/(components)/mui-components/Accordion";

import {
  Grid,
  Box,
  TextField,
  Select,
  MenuItem,

  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import styled from "styled-components";

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none",
}));

interface ProcessFormRow {
  process: string;
  activityName: string;
  jobRole: string;
  jobNature: string;
  startTime: string;
  endTime: string;
  totalTime: {
    time: number;
    unit: string;
  };
  remarks: string;
}

interface empProps {
  rows: ProcessFormRow[];
  setRows: React.Dispatch<React.SetStateAction<ProcessFormRow[]>>;
  subStandard: ProcessFormRow[];
  setSubStandard: React.Dispatch<React.SetStateAction<ProcessFormRow[]>>;
  pointCounter: number;
}

const SelectRoute: React.FC<empProps> = ({
  rows,
  setRows,
  pointCounter,
  subStandard,
  setSubStandard,
}) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const binaryStr = event.target.result;
        const wb = XLSX.read(binaryStr, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const processedData = data.slice(1).map((row: any) => ({
          process: row[0] || "",
          activityName: row[1] || "",
          jobRole: row[2] || "",
          jobNature: row[3] || "",
          startTime: row[4] || "",
          endTime: row[5] || "",
          totalTime: { time: row[6] || 0, unit: "min" },
          remarks: row[7] || "",
        }));
        setRows(processedData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelFile]), "download.xlsx");
  };

  const CurrDate = new Date();
  const formatTimeForTextField = (time: string | null) => {
    if (!time) return "";
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatTimeToISO = (time: string) => {
    const date = new Date(CurrDate);
    const [hours, minutes] = time.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
  };

  const handleChange = (
    index: number,
    field: keyof ProcessFormRow,
    value: string | number | { time: number; unit: string },
    nestedField?: keyof ProcessFormRow["totalTime"]
  ) => {
    const newRows = [...rows];

    if (field === "totalTime" && nestedField) {
      newRows[index] = {
        ...newRows[index],
        totalTime: {
          ...newRows[index].totalTime,
          [nestedField]: value,
        },
      };
    } else {
      newRows[index] = {
        ...newRows[index],
        [field]: value,
      };
    }

    if (field === "startTime" || field === "endTime") {
      const startTime = new Date(newRows[index].startTime).getTime();
      const endTime = new Date(newRows[index].endTime).getTime();

      if (!isNaN(startTime) && !isNaN(endTime) && endTime > startTime) {
        const totalMinutes = Math.floor((endTime - startTime) / (1000 * 60));

        newRows[index].totalTime.time = totalMinutes;
      } else {
        newRows[index].totalTime.time = 0;
      }
    }

    setRows(newRows);
  };
  return (
    <Grid
      item
      xs={12}
      md={12}
      sx={{
        height: "380px",
        width: "200%",
        position: "relative",
        bgcolor: "white",
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 2, mb: 4, justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={handleDownload}
        >
          Download Excel
        </Button>
        <Button
          variant="outlined"
          startIcon={<FileUploadIcon />}
          component="label"
        >
          Upload Excel
          <input
            type="file"
            hidden
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
          />
        </Button>
      </Box>

      {Array.from({ length: pointCounter }).map((_, index) => (
        <Grid container key={index} mb={2}>
          <CustomAccordian
            rows={rows}
            accordianIndex={index}
            setRows={setRows}
            subStandard={subStandard}
            setSubStandard={setSubStandard}
            pointCounter={pointCounter}
          />
        </Grid>
      ))}
      {/* <CustomAccordian
        rows={rows}
        index={1}
        setRows={setRows}
        pointCounter={pointCounter}
      /> */}
      <Grid
        item
        xs={12}
        md={12}
        sx={{
          width: "100%",
          position: "relative",
          bgcolor: "white",
          border: "1px solid #e5e5e5",
          padding: 1,
          borderRadius: 1,
          boxShadow: 1,
          marginBottom: 1,
        }}
      >
        <Typography mt={1} fontWeight={500}>
          Ideal waiting time :
        </Typography>
        <Table sx={{ minWidth: "100%" }}>
          <TableHead>
            <TableRow>
              <CustomTableCell>Process</CustomTableCell>
              <CustomTableCell>Activity</CustomTableCell>
              <CustomTableCell>Job Type</CustomTableCell>
              <CustomTableCell>Job Nature</CustomTableCell>
              <CustomTableCell>Time (From)</CustomTableCell>
              <CustomTableCell>Time (To)</CustomTableCell>
              <CustomTableCell>Total Time</CustomTableCell>
              <CustomTableCell>Remarks</CustomTableCell>
              {/* <CustomTableCell>Action</CustomTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "& .MuiTableCell-root": { py: 0.5 },
                }}
              >
                <TableCell>
                  <TextField
                    placeholder="Enter process"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    //   label="Process"
                    sx={{ minWidth: "100px" }}
                    value={row.process}
                    onChange={(e) =>
                      handleChange(index, "process", e.target.value)
                    }
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    placeholder="Enter activity name"
                    //   label="Activity Name"
                    sx={{ minWidth: "100px" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={row.activityName}
                    onChange={(e) =>
                      handleChange(index, "activityName", e.target.value)
                    }
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <FormControl size="small" fullWidth>
                    {/* <InputLabel>Job Role</InputLabel> */}
                    <Select
                      value={row.jobRole}
                      onChange={(e) =>
                        handleChange(index, "jobRole", e.target.value)
                      }
                      // label="Job Role"
                    >
                      <MenuItem value="Permanent">Permanent</MenuItem>
                      <MenuItem value="Contractual">Contractual</MenuItem>
                      <MenuItem value="Internship">Internship</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl size="small" fullWidth>
                    {/* <InputLabel>Job Role</InputLabel> */}
                    <Select
                      value={row.jobNature}
                      onChange={(e) =>
                        handleChange(index, "jobNature", e.target.value)
                      }
                      // label="Job Role"
                    >
                      <MenuItem value="regular">regular</MenuItem>
                      <MenuItem value="nonRegular">nonRegular</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    type="time"
                    //   label="Start Time"

                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formatTimeForTextField(row.startTime)}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "startTime",
                        formatTimeToISO(e.target.value)
                      )
                    }
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="time"
                    //   label="End Time"
                    value={formatTimeForTextField(row.endTime)}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "endTime",
                        formatTimeToISO(e.target.value)
                      )
                    }
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    sx={{ minWidth: "100px" }}
                    //   label="Total Time "
                    value={row.totalTime.time}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "totalTime",
                        Number(e.target.value),
                        "time"
                      )
                    }
                    size="small"
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
                <TableCell>
                  <FormControl size="small" fullWidth>
                    <Select
                      value={row.remarks}
                      onChange={(e) =>
                        handleChange(index, "remarks", e.target.value)
                      }
                      // label="Remarks"
                    >
                      <MenuItem value="Positive">Positive</MenuItem>
                      <MenuItem value="Neutral">Neutral</MenuItem>
                      <MenuItem value="Negative">Negative</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
};

export default SelectRoute;
