"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  LinearProgress,
  Typography,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import axiosInstanceImg from "@/app/api/axiosInstanceImg";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { BsEye } from "react-icons/bs";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { AxiosError } from "axios";
interface ErrorResponse {
  error?: string;
  message?: any;
}
interface AddUserProps {
  openUpload: boolean;
  setOpenUpload: React.Dispatch<React.SetStateAction<boolean>>;
  getDeviceData: () => void;
}
const UploadFile: React.FC<AddUserProps> = ({
  openUpload,
  getDeviceData,
  setOpenUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const handleCloseUpload = () => {
    setOpenUpload(false);
    setFile(null);
  };
  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setProgress(0);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xls",
        ".xlsx",
        ".csv",
      ],
    },
    maxSize: 10485760,
  });
  const upLoadFile = async () => {
    if (!file) {
      notifyError("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstanceImg.post(
        "/api/device/bulk-add",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            }
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        notifySuccess("File uploaded successfully");
        getDeviceData();
        handleCloseUpload();
      } else {
        notifyError("Failed to upload file");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(
        axiosError?.response?.data?.message?.error || "Error uploading file"
      );
      console.log(error);
    }
  };
  console.log(file);
  //// export csv ////
  const handleExport = () => {
    const csvData: (string | string[])[][] = [];
    const headerRow = [
      "macId",
      "deviceName",
      "simNumber",
      "imsiNumber",
      "modelNumber",
    ];
    csvData.push(headerRow);
    const csvString = Papa.unparse(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "DevicesSample.csv");
  };

  return (
    <CommonDialog
      open={openUpload}
      maxWidth={"sm"}
      fullWidth={true}
      title="Upload files"
      message={"Are you sure you want to cancel?"}
      titleConfirm={"Cancel"}
      onClose={handleCloseUpload}
    >
      <DialogContent>
        <Box
          sx={{
            border: "2px dashed #e0e0e0",
            borderRadius: "8px",
            padding: "16px",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "16px" }}>
            Upload files
          </Typography>
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed #ccc",
              borderRadius: "8px",
              padding: "32px",
              cursor: "pointer",
              marginBottom: "16px",
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 48, color: "#90caf9" }} />
            <Typography>Choose a file or drag & drop it here</Typography>
            <Typography variant="body2">(XLSX format, up to 10MB)</Typography>
          </Box>
          {file && (
            <Box sx={{ marginBottom: "16px" }}>
              <InsertDriveFileIcon sx={{ fontSize: 48, color: "#4caf50" }} />
              <Typography>{file.name}</Typography>
              <Typography variant="body2">{`${(file.size / 1024).toFixed(
                2
              )} KB`}</Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ marginTop: "8px" }}
              />
              <Typography variant="body2" sx={{ marginTop: "8px" }}>
                {progress.toFixed(2)}% uploaded
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent={"space-between"}>
          <Grid item>
            <Button
              onClick={() => handleExport()}
              startIcon={<CloudDownloadIcon />}
              variant="outlined"
              size="large"
              sx={{
                border: "0.1px solid #DC0032",
                color: "#DC0032",
                backgroundColor: "#F6FAF3",
                height: "34px",
              }}
            >
              sample file
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={handleCloseUpload}
              variant="outlined"
              color="primary"
              sx={{ marginRight: "10px" }}
            >
              Cancel
            </Button>
            <Button
              onClick={upLoadFile}
              color="primary"
              variant="contained"
              disabled={!file}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </CommonDialog>
  );
};

export default UploadFile;
