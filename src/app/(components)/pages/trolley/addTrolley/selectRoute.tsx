import React from "react";
import {
  Grid,
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import "leaflet/dist/leaflet.css";
import moment from "moment";

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
}

const SelectRoute: React.FC<empProps> = ({ rows, setRows }) => {
  const [start, setStartTime] = React.useState<any>(null);
  const [end, setEndTime] = React.useState<any>(null);
  const CurrDate = new Date();
  const formatTimeForTextField = (time: any) => {
    if (!time) return "";
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        process: "",
        activityName: "",
        jobRole: "",
        jobNature: "",
        startTime: start,
        endTime: end,
        totalTime: {
          time: 0,
          unit: "min",
        },
        remarks: "",
      },
    ]);
  };
  const handleRemoveRow = (index: number) => {
    const newRows = rows.filter((_, idx) => idx !== index);
    setRows(newRows);
  };
  const formatTimeToISO = (time: any, title: string) => {
    if (title === "startTime") {
      setStartTime(time);
    }
    if (title === "endTime") {
      setEndTime(time);
    }
    const date = new Date(CurrDate);
    const [hours, minutes] = time?.split(":")?.map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
  };
  const formatTimeToISO1 = (time: any) => {
    setStartTime(time);

    const date = new Date(CurrDate);
    const [hours, minutes] = time?.split(":")?.map(Number);
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
    setRows(newRows);
  };

  return (
    <Grid
      item
      xs={12}
      md={12}
      sx={{
        height: "550px",
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
          onClick={() => (window.location.href = "/sample.csv")}
        >
          Download sample csv
        </Button>
        <Button variant="outlined" startIcon={<FileUploadIcon />}>
          Upload standard
        </Button>
      </Box>

      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Process</TableCell>
            <TableCell>Activity</TableCell>
            <TableCell>Job Type</TableCell>
            <TableCell>Job Nature</TableCell>
            <TableCell>Time (From)</TableCell>
            <TableCell>Time (To)</TableCell>
            <TableCell>Total Time</TableCell>
            <TableCell>Remarks</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  label="process"
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
                  label="activityName"
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
                  <InputLabel>jobRole</InputLabel>
                  <Select
                    value={row.jobRole}
                    label="jobRole"
                    onChange={(e) =>
                      handleChange(index, "jobRole", e.target.value)
                    }
                  >
                    <MenuItem value="Permanent">Permanent</MenuItem>
                    <MenuItem value="Contractual">Contractual</MenuItem>
                    <MenuItem value="Internship">Internship</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <TextField
                  label={"jobNature"}
                  value={row.jobNature}
                  onChange={(e) =>
                    handleChange(index, "jobNature", e.target.value)
                  }
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="time"
                  label="StartTime"
                  value={formatTimeForTextField(row?.startTime)}
                  onChange={(e) => {
                    handleChange(
                      index,
                      "startTime",
                      formatTimeToISO(e.target.value, "startTime")
                    );
                  }}
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="time"
                  label="endTime"
                  value={formatTimeForTextField(row?.endTime)}
                  onChange={(e) => {
                    handleChange(
                      index,
                      "endTime",
                      formatTimeToISO(e.target.value, "endtime")
                    );
                  }}
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={row.totalTime.time}
                  label={"totalTime"}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "totalTime",
                      Number(e.target.value),
                      "time"
                    )
                  }
                  size="small"
                  type="number"
                  fullWidth
                  placeholder="Min"
                  inputProps={{ min: 0 }}
                />
              </TableCell>
              <TableCell>
                <FormControl size="small" fullWidth>
                  <InputLabel>Remarks</InputLabel>
                  <Select
                    value={row.remarks}
                    label="Remarks"
                    onChange={(e) =>
                      handleChange(index, "remarks", e.target.value)
                    }
                  >
                    <MenuItem value="Positive">Positive</MenuItem>
                    <MenuItem value="Neutral">Neutral</MenuItem>
                    <MenuItem value="Negative">Negative</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveRow(index)}
                    disabled={rows.length === 1}
                    size="small"
                  >
                    <RemoveIcon />
                  </IconButton>
                  {index === rows.length - 1 && (
                    <IconButton
                      color="primary"
                      onClick={handleAddRow}
                      size="small"
                    >
                      <AddIcon />
                    </IconButton>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Grid>
  );
};

export default SelectRoute;
