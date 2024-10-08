import React from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import { DialogTitle } from "@mui/material";
import Typography from "@mui/material/Typography";
import CancelAlertDialog from "./confirmation-dialog";

interface BootstrapDialogProps extends DialogProps {
  title: string;
  message: string;
  titleConfirm?: string;
  onClose: (event: any, reason: any) => void;
  disableBackdropClick?: boolean;
}

const CommonDialog: React.FC<BootstrapDialogProps> = ({
  message,
  title,
  onClose,
  children,
  titleConfirm,
  disableBackdropClick = true,
  ...otherProps
}) => {
  return (
    <Dialog onClose={onClose} {...otherProps}>
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
        }}
      >
        {onClose ? (
          <CancelAlertDialog
            icon={true}
            message={message}
            title={titleConfirm}
            handleCloseFirst={(event, reason) => onClose(event, reason)} // Pass onClose directly
          />
        ) : null}
        <Typography variant="subtitle1" color="primary.contrastText">
          {title}
        </Typography>
      </DialogTitle>
      {children}
    </Dialog>
  );
};

export default CommonDialog;
