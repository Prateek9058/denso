"use client";
import React from "react";
import {
  Grid,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Breadcrumbs from "@/app/(components)/mui-components/Breadcrumbs";
import { Tabs, Tab, Button, Tooltip, IconButton } from "@mui/material";
import { IoChevronBackOutline } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
interface Breadcrumb {
  label: string;
  link: string;
}
interface ManagementGridProps {
  moduleName?: string;
  button?: any;
  subHeading?: string;
  handleClickOpen?: any;
  buttonUpload?: string;
  handleClickOpenUpload?: any;
  assignedData?: string | undefined;
  assigned?: boolean;
  deleteFunction?: () => void;
  breadcrumbItems?: Breadcrumb[];
  userId?: any;
  buttonAgent?: any;
  handleClickOpenAgent?: any;
  deleteBtn?: any;
  edit?: boolean;
  select?: boolean;
  zone?: any;
  zoneId?: any;
  handleInputChange?: any;
  back?: string;
  handleBack?: any;
}
const ManagementGrid: React.FC<ManagementGridProps> = ({
  moduleName,
  button,
  handleClickOpen,
  subHeading,
  buttonUpload,
  handleClickOpenUpload,
  assignedData,
  assigned,
  deleteFunction,
  breadcrumbItems,
  userId,
  buttonAgent,
  handleClickOpenAgent,
  deleteBtn,
  edit,
  select,
  zone,
  handleInputChange,
  zoneId,
  back,
  handleBack,
}) => {
  return (
    <Grid container justifyContent="space-between" alignItems="center" mt={1}>
      {/* {breadcrumbItems && <Breadcrumbs breadcrumbItems={breadcrumbItems} />} */}
      <Grid item>
        <Typography component={"h5"} variant="h4" mb={1}>
          {moduleName}
        </Typography>
        {/* <Typography component={"h6"} variant="body2" color="grey">
          {subHeading}
        </Typography> */}
        {back && (
          <Button
            variant="outlined"
            size="large"
            color="inherit"
            onClick={handleBack}
            startIcon={<IoChevronBackOutline />}
          >
            {back}
          </Button>
        )}
      </Grid>
      <Grid item>
        <Grid container gap={2}>
          {buttonUpload && (
            <Button
              onClick={handleClickOpenUpload}
              startIcon={<CloudUploadIcon />}
              variant="outlined"
              size="large"
              sx={{
                border: "1px solid #4C4C4C",
                color: "#4C4C4C",
                backgroundColor: "#F6FAF3",
              }}
            >
              {buttonUpload}
            </Button>
          )}
          {buttonAgent && (
            <Button
              onClick={handleClickOpenAgent}
              startIcon={<IoMdAddCircleOutline />}
              variant="outlined"
              size="large"
              sx={{
                border: "1px solid #4C4C4C",
                color: "#4C4C4C",
                backgroundColor: "#F6FAF3",
              }}
            >
              {buttonAgent}
            </Button>
          )}
          {button && (
            <Button
              onClick={handleClickOpen}
              startIcon={edit ? <EditIcon /> : <IoMdAddCircleOutline />}
              variant="contained"
              size="large"
              sx={{
                color: "#FFFFFF",
                backgroundColor: "#4C4C4C",
              }}
            >
              {button}
            </Button>
          )}
          {deleteBtn && (
            <ConfirmationDialog
              title={"Cancel"}
              deleteBtn={deleteBtn}
              message={"Are you sure you want to delete ?"}
              deleteFunction={deleteFunction}
            />
          )}
          {select && (
            <Stack
              sx={{
                width: "100px",
                bgcolor: "#4C4C4C",
                borderRadius: "8px",
                color: "white",
                border: "none",
              }}
            >
              <FormControl fullWidth>
                <Select
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "white",
                      border: "none",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "white",
                      border: "none",
                    },
                  }}
                  value={zoneId || ""}
                  onChange={handleInputChange}
                  displayEmpty
                  renderValue={(selected) => {
                    return selected ? `Zone ${selected}` : "Zone";
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Select Zone</em>
                  </MenuItem>
                  <MenuItem value={""}>All</MenuItem>
                  {zone?.map((item: any, index: any) => (
                    <MenuItem key={index} value={item?.zone}>
                      Zone {item?.zone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ManagementGrid;
