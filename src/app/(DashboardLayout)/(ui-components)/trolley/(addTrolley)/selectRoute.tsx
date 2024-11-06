import React, { useState } from "react";
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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import Site from "../../../../../../public/Img/Layoutdenso.png";
import "leaflet/dist/leaflet.css";
import trolleyIconSrc from "../../../../../../public/Img/trolleyLive.png";

interface ProcessFormRow {
  process: string;
  activity: string;
  jobType: string;
  jobNature: string;
  timeFrom: string;
  timeTo: string;
  totalTime: string;
  remarks: string;
}

interface empProps {
  points: any;
  setPoints: any;
}

const SelectRoute: React.FC<empProps> = ({ points, setPoints }) => {
  const [rows, setRows] = useState<ProcessFormRow[]>([{
    process: "",
    activity: "",
    jobType: "Regular",
    jobNature: "",
    timeFrom: "",
    timeTo: "",
    totalTime: "",
    remarks: ""
  }]);

  const handleAddRow = () => {
    setRows([...rows, {
      process: "",
      activity: "",
      jobType: "Regular",
      jobNature: "",
      timeFrom: "",
      timeTo: "",
      totalTime: "",
      remarks: ""
    }]);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = rows.filter((_, idx) => idx !== index);
    setRows(newRows);
  };

  const handleChange = (index: number, field: keyof ProcessFormRow, value: string) => {
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      [field]: value
    };
    setRows(newRows);
  };

  return (
    <Grid
      item
      xs={12}
      md={12}
      sx={{ height: "550px", width: "200%", position: "relative", bgcolor: 'white', p: 2 }}
    >
      <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          startIcon={<FileDownloadIcon />}
          onClick={() => window.location.href='/sample.csv'}
        >
          Download sample csv
        </Button>
        <Button 
          variant="contained" 
          startIcon={<FileUploadIcon />}
        >
          Upload standard's
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
            <TableCell>Total Time (Minutes)</TableCell>
            <TableCell>Remarks</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  value={row.process}
                  onChange={(e) => handleChange(index, 'process', e.target.value)}
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={row.activity}
                  onChange={(e) => handleChange(index, 'activity', e.target.value)}
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <FormControl size="small" fullWidth>
                  <Select
                    value={row.jobType}
                    onChange={(e) => handleChange(index, 'jobType', e.target.value)}
                  >
                    <MenuItem value="Regular">Regular</MenuItem>
                    <MenuItem value="Irregular">Irregular</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <TextField
                  value={row.jobNature}
                  onChange={(e) => handleChange(index, 'jobNature', e.target.value)}
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="time"
                  value={row.timeFrom}
                  onChange={(e) => handleChange(index, 'timeFrom', e.target.value)}
                  size="small"
                  fullWidth
                  inputProps={{ step: 300 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="time"
                  value={row.timeTo}
                  onChange={(e) => handleChange(index, 'timeTo', e.target.value)}
                  size="small"
                  fullWidth
                  inputProps={{ step: 300 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={row.totalTime}
                  onChange={(e) => handleChange(index, 'totalTime', e.target.value)}
                  size="small"
                  type="number"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={row.remarks}
                  onChange={(e) => handleChange(index, 'remarks', e.target.value)}
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
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