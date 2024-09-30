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
  TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import axiosInstanceImg from "@/app/api/axiosInstanceImg";
import axiosInstance from "@/app/api/axiosInstance";
import { AxiosError } from "axios";
import { useSitesData } from "@/app/(context)/SitesContext";

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
  const { getSites } = useSitesData();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [siteName, setSiteName] = useState<string>("");

  const handleCloseUpload = () => {
    setOpenUpload(false);
    setFile(null);
    setSiteName("");
  };

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setProgress(0);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".png",
        ".jpg",
        ".jpeg",
      ],
    },
    maxSize: 10485760,
  });

  const createSite = async (): Promise<string | null> => {
    try {
      const response = await axiosInstance.post("/api/v1/site/addSite", {
        siteName,
      });
      console.log(response);
      if (response.status === 200 || response.status === 201) {
        getSites();
        return response.data.data._id;
      } else {
        notifyError("Failed to create site");
        return null;
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(
        axiosError?.response?.data?.message?.error || "Error creating site"
      );
      console.log(error);
      return null;
    }
  };

  const upLoadFile = async () => {
    if (!file) {
      notifyError("No file selected");
      return;
    }
    if (!siteName) {
      notifyError("Site name is required");
      return;
    }

    const siteId = await createSite();
    if (!siteId) return;

    const formData = new FormData();
    formData.append("siteImage", file);

    try {
      const response = await axiosInstanceImg.post(
        `/api/v1/site/uploadSiteImage/${siteId}`,
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
        getSites();
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

  return (
    <CommonDialog
      open={openUpload}
      maxWidth={"sm"}
      fullWidth={true}
      title="Upload Site"
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
            Upload Site
          </Typography>
          <TextField
            label="Site Name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            placeholder="Enter site name"
            sx={{ marginBottom: "16px" }}
          />

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
          </Box>
          {file && (
            <Box sx={{ marginBottom: "16px" }}>
              <InsertDriveFileIcon sx={{ fontSize: 48, color: "#4caf50" }} />
              <Typography>{file?.name}</Typography>
              <Typography variant="body2">{`${(file?.size / 1024).toFixed(
                2
              )} KB`}</Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ marginTop: "8px" }}
              />
              <Typography variant="body2" sx={{ marginTop: "8px" }}>
                {progress?.toFixed(2)}% uploaded
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent={"flex-end"}>
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
