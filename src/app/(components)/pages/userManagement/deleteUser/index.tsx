import React, { useState } from "react";
import CommonDialog from "@/app/(components)/mui-components/Dialog";
import { IconButton } from "@mui/material";
import {
  notifySuccess,
  notifyError,
} from "@/app/(components)/mui-components/Snackbar";
import axiosInstance from "@/app/api/axiosInstance";
import { AiOutlineDelete } from "react-icons/ai";

interface ParentComponentProps {
  getFetchAllDetails: any;
  id: string;
}

const DeleteComponent: React.FC<ParentComponentProps> = ({
  id,
  getFetchAllDetails,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleDelete = async () => {
    try {
      const apiPath = `/users/deletedUser/${id}`;
      const { data, status } = await axiosInstance.delete(apiPath);
      if (status === 200 || status === 201) {
        notifySuccess(data?.message);
        getFetchAllDetails();
      }
    } catch (error) {
      notifyError(
        (error as any)?.response?.data?.message || "Error deleting user"
      );
    }
  };

  const handleConfirm = () => {
    handleDelete();
    handleCancel();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const getDeleteMessage = () => {
    return (
      <>
        Are you sure you want to delete this user ? <br />
        <strong>Warning:</strong> Deleting this user will revoke their access to
        the assigned department, section, and line.
      </>
    );
  };

  return (
    <div>
      <IconButton onClick={() => setOpen(true)}>
        <AiOutlineDelete />
      </IconButton>
      <CommonDialog
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
        title="Confirmation"
        message={getDeleteMessage()}
        color="error"
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default DeleteComponent;
