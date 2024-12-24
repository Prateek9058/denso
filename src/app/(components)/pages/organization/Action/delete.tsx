import React from "react";
import CommonDialog from "@/app/(components)/mui-components/Dialog";
import { IconButton } from "@mui/material";
import {
  notifySuccess,
  notifyError,
} from "@/app/(components)/mui-components/Snackbar";
import axiosInstance from "@/app/api/axiosInstance";
import { AiOutlineDelete } from "react-icons/ai";

interface ParentComponentProps {
  type: "Department" | "Section" | "line";
  getFetchAllDetails: any;
  id: string;
}

const ParentComponent: React.FC<ParentComponentProps> = ({
  type,
  id,
  getFetchAllDetails,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleDelete = async () => {
    try {
      let apiPath = "";

      if (type === "Department") {
        apiPath = `department/deleteDepartment/${id}`;
      } else if (type === "Section") {
        apiPath = `section/deleteSection/${id}`;
      } else if (type === "line") {
        apiPath = `line/deleteLine/${id}`;
      }

      // Make the DELETE request with the ID as part of the URL
      const { status } = await axiosInstance.delete(apiPath);

      if (status === 200 || status === 201) {
        notifySuccess(
          `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`
        );
        getFetchAllDetails();
      }
    } catch (error) {
      notifyError(
        (error as any)?.response?.data?.message || "Error deleting entity"
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

  const getDeleteMessage = (type: string) => {
    if (type === "department") {
      return `
        Are you sure you want to delete this department? 
        Warning: Deleting this department will also delete any sections and lines allocated to it.
      `;
    }
    if (type === "section") {
      return `
        Are you sure you want to delete this section? 
        Warning: Deleting this section will also delete any allocated lines and unassign the trolley.
      `;
    }
    if (type === "line") {
      return `
        Are you sure you want to delete this line? 
        Warning: Deleting this line will unassign the trolley.
      `;
    }
    return "Are you sure you want to delete this item?";
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
        message={getDeleteMessage(type)}
        color="error"
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default ParentComponent;
