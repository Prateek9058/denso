"use client";
import React, { ChangeEvent, useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { DialogActions, Button, DialogContent, Grid } from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import axiosInstance from "@/app/api/axiosInstance";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";

interface AddDeviceProps {
  type: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getFetchAllDetails: () => void;
}
interface ErrorResponse {
  message?: string;
}

const AddDepartment: React.FC<AddDeviceProps> = ({
  type,
  open,
  setOpen,
  getFetchAllDetails,
}) => {
  const { section, line } = useParams<{ section: string; line: string }>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
    reset,
  } = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [uid, setUid] = useState<any>("");

  const handleClose = () => {
    setOpen(false);
    reset();
    setUid("");
  };

  const onSubmit = async () => {
    const formData = getValues();
    const body: any = {
      name: formData?.name,
      uId: uid,
    };

    let apiPath = "";
    const params = new URLSearchParams();

    if (type === "department") {
      apiPath = "department/addDepartment";
    } else if (type === "section") {
      apiPath = "section/addSection";
      params.append("departmentId", section);
    } else if (type === "line") {
      apiPath = "line/addLine";
      params.append("departmentId", section);
      params.append("sectionId", line);
    }
    try {
      const url = `${apiPath}?${params.toString()}`;
      const res = await axiosInstance.post(url, body);
      if (res?.status === 200 || res?.status === 201) {
        notifySuccess(
          `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`
        );
        getFetchAllDetails();
        handleClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(
        axiosError?.response?.data?.message || `Error creating ${type}`
      );
      console.log(error);
    }
  };
  const getUid = useCallback(async () => {
    setLoading(true);
    try {
      let apiPath = "";
      if (type === "department") {
        apiPath = "department/getUid";
      } else if (type === "section") {
        apiPath = "section/getUid";
      } else if (type === "line") {
        apiPath = "line/getUid";
      } else {
        return;
      }
      const res = await axiosInstance.get(apiPath);
      if (res?.status === 200 || res?.status === 201) {
        setUid(res?.data?.data);
        console.log(res?.data?.data);
      }
    } catch (err) {
      console.log("Error fetching UID:", err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (open) {
      getUid();
    }
    setValue("Uid", uid);
  }, [open, uid]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue(name, value);
    if (errors[name]) {
      clearErrors(name);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add {type}
      </Button>
      <CommonDialog
        open={open}
        maxWidth={"sm"}
        fullWidth={true}
        title={`Add New Department`}
        message={"Are you sure you want to cancel?"}
        titleConfirm={"Cancel"}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container justifyContent={"space-between"}>
              <Grid item md={5.8}>
                <CustomTextField
                  {...register("Uid")}
                  name="Uid"
                  label="Uid"
                  placeholder="Enter Uid"
                  error={!!errors.Uid}
                  helperText={errors.Uid?.message}
                  onChange={handleInputChange}
                  disabled={true}
                  defaultValue={uid ? uid : ""}
                />
              </Grid>
              <Grid item md={5.8}>
                <CustomTextField
                  {...register("name", {
                    required: "Name is required",
                  })}
                  name="name"
                  label="Name"
                  placeholder="Enter name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="dialog-action-btn">
            <ConfirmationDialog
              title={"Cancel"}
              handleCloseFirst={handleClose}
              message={"Are you sure you want to cancel?"}
            />
            <Button
              variant="contained"
              type="submit"
              sx={{ width: "150px", color: "white" }}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </CommonDialog>
    </>
  );
};

export default AddDepartment;
