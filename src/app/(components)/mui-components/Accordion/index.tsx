import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Grid,
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
} from "@mui/material";
import styled from "styled-components";

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
  accordianIndex: number;
}

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none",
}));

export default function AccordionUsage({
  rows,
  setRows,
  pointCounter,
  accordianIndex,
  subStandard,
  setSubStandard,
}: empProps) {
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
  const handleAddRow1 = (index: number) => {
    const newRow = {
      process: "",
      activityName: "",
      jobRole: "Permanent",
      jobNature: "regular",
      startTime: "",
      endTime: "",
      totalTime: {
        time: 0,
        unit: "min",
      },
      remarks: "Neutral",
    };
    const newRowsSubstandard: ProcessFormRow[] = [...subStandard];
    newRowsSubstandard.splice(index, 0, newRow);
    setSubStandard(newRowsSubstandard);
  };
  const handleRemoveRow = (index: number) => {
    const newRows = subStandard.filter((_, idx) => idx !== index);
    setSubStandard(newRows);
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
  const handleChangeSubstandard = (
    index: number,
    field: keyof ProcessFormRow,
    value: string | number | { time: number; unit: string },
    nestedField?: keyof ProcessFormRow["totalTime"]
  ) => {
    const newRows = [...subStandard];

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

    setSubStandard(newRows);
  };

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" variant="h6">
            Point {accordianIndex + 1}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Array?.from({ length: pointCounter }).map((_, processIndex) => (
            <>
              <Grid
                item
                xs={12}
                md={12}
                sx={{
                  width: "100%",
                  position: "relative",
                  bgcolor: "white",
                }}
                key={processIndex}
              >
                <Typography fontWeight={500}>
                  {processIndex === 0
                    ? "Process 1 :"
                    : `Process ${processIndex} to ${processIndex + 1} :`}
                </Typography>
                <Table sx={{ minWidth: "100%" }} key={processIndex}>
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
                    {rows?.map((row, index) => (
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
                              handleChange(
                                index,
                                "activityName",
                                e.target.value
                              )
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
                              <MenuItem value="Contractual">
                                Contractual
                              </MenuItem>
                              <MenuItem value="Temperory">Temperory</MenuItem>
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
                            {/* <InputLabel>Remarks</InputLabel> */}
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
            </>
          ))}

          <Grid
            item
            xs={12}
            md={12}
            sx={{
              width: "100%",
              position: "relative",
              bgcolor: "white",
            }}
            key={accordianIndex}
          >
            <Typography mt={1} fontWeight={500}>
              SubStandard
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
                  <CustomTableCell>Action</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subStandard?.map((row, index) => (
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
                          handleChangeSubstandard(
                            index,
                            "process",
                            e.target.value
                          )
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
                          handleChangeSubstandard(
                            index,
                            "activityName",
                            e.target.value
                          )
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
                            handleChangeSubstandard(
                              index,
                              "jobRole",
                              e.target.value
                            )
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
                      <TextField
                        placeholder="Enter job nature"
                        //   label="Job Nature"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{ minWidth: "100px" }}
                        value={row.jobNature || ""}
                        onChange={(e) =>
                          handleChangeSubstandard(
                            index,
                            "jobNature",
                            e.target.value
                          )
                        }
                        size="small"
                        fullWidth
                      />
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
                          handleChangeSubstandard(
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
                          handleChangeSubstandard(
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
                          handleChangeSubstandard(
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
                        {/* <InputLabel>Remarks</InputLabel> */}
                        <Select
                          value={row.remarks}
                          onChange={(e) =>
                            handleChangeSubstandard(
                              index,
                              "remarks",
                              e.target.value
                            )
                          }
                          // label="Remarks"
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
                          disabled={index === 0 || subStandard?.length === 1}
                          size="small"
                        >
                          <RemoveIcon />
                        </IconButton>
                        {subStandard?.length < pointCounter && (
                          <IconButton
                            color="primary"
                            onClick={() => {
                              handleAddRow1(accordianIndex);
                            }}
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
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
