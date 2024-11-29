import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  DialogActions,
  Button,
  DialogContent,
  Grid,
  IconButton,
} from "@mui/material";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import axiosInstance from "@/app/api/axiosInstance";
import { AxiosError } from "axios";
import { MdOutlineEdit } from "react-icons/md";

interface EditEntityProps {
  getFetchAllDetails: () => void;
  item: any;
  type: "department" | "section" | "line"; 
}

interface ErrorResponse {
  message?: string;
}

const EditEntity: React.FC<EditEntityProps> = ({
  type,
  getFetchAllDetails,
  item,
}) => {
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
  } = useForm();
  const [uid, setUid] = useState<any>("");

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async () => {
    const formData = getValues();
    let body: any = {
      name: formData?.name,
      uId: uid,
    };

    if (type === "department") {
      body = {
        ...body,
      };
    } else if (type === "section") {
      body = {
        ...body,
      };
    } else if (type === "line") {
      body = {
        ...body,
      };
    }

    try {
      let apiPath = "";
      if (type === "department") {
        apiPath = `department/updateDepartment/${item?._id}`;
      } else if (type === "section") {
        apiPath = `section/updateSection/${item?._id}`;
      } else if (type === "line") {
        apiPath = `line/updateLine/${item?._id}`;
      }
      const res = await axiosInstance.patch(apiPath, body);
      if (res?.status === 200 || res?.status === 201) {
        notifySuccess(
          `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`
        );
        getFetchAllDetails();
        handleClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(
        axiosError?.response?.data?.message || `Error updating ${type}`
      );
      console.log(error);
    }
  };

  useEffect(() => {
    if (open && item) {
      setValue("name", item?.name);
      setUid(item?.uId);
    }
  }, [open, item, setValue]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue(name, value);
    if (errors[name]) {
      clearErrors(name);
    }
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <MdOutlineEdit />
      </IconButton>
      <CommonDialog
        open={open}
        maxWidth={"sm"}
        fullWidth={true}
        title={`Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        message="Are you sure you want to cancel?"
        titleConfirm="Cancel"
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
                  defaultValue={uid || item?.uId}
                />
              </Grid>
              <Grid item md={5.8}>
                <CustomTextField
                  {...register("name", { required: "Name is required" })}
                  name="name"
                  label="Name"
                  placeholder={`Enter ${type} name`}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  onChange={handleInputChange}
                  defaultValue={item?.name}
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
              Edit
            </Button>
          </DialogActions>
        </form>
      </CommonDialog>
    </>
  );
};

export default EditEntity;
