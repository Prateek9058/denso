import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import Switch from "@mui/material/Switch";

// Icons Import
import { IoMdCloseCircleOutline } from "react-icons/io";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

interface AssignProps {
  data?: any;
  onClose?: () => void;
}
export default function CustomizedDialogs({ data, onClose }: AssignProps) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState<DialogProps["maxWidth"]>("sm");
  const [switchValue, setSwitchValue] = useState<boolean | undefined>(
    data?.disable === false && true
  );
  const [classState, setClassName] = useState<string>("");
  const [btnColor, setBtnColor] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    setSwitchValue(data?.disable === false && true);
  }, [data]);

  useEffect(() => {
    setTimeout(() => {
      if (switchValue === false) {
        setClassName("#34A853");
        setTitle("Enable Device");
        setSubTitle("Are you sure you want to Enable this Device?");
        setContent("Enabling this device  will allow user to uses device");
        setBtnColor("#34A853");
      } else {
        setClassName("#ff6905");
        setTitle("Disable Device");
        setSubTitle("Are you sure you want to Disable this Device?");
        setContent(
          "Disabling this device will temporarily prevent user from using this device"
        );
        setBtnColor("#ff6905");
      }
    }, 1000);
  }, [switchValue]);
  // Function Calling
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSwitchChange = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const Data = { id: data?._id };
    try {
      const value: boolean | undefined = switchValue ? false : true;
      if (setSwitchValue) {
        setSwitchValue(value);
      }
      handleClose();
    } catch (eroor) {
      console.log("error");
    }
  };

  return (
    <div>
      <IconButton className="mt-5">
        <AntSwitch
          checked={switchValue}
          onChange={handleClickOpen}
          inputProps={{ "aria-label": "ant design" }}
        />
      </IconButton>

      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ backgroundColor: classState }}>
          {handleClose ? (
            <IconButton
              aria-label="close"
              onClick={handleClose}
              size="small"
              sx={{
                color: (theme) => theme.palette.common.white,
                backgroundColor: "transparent",
                position: "absolute",
                right: 10,
                top: 10,
              }}
            >
              <IoMdCloseCircleOutline />
            </IconButton>
          ) : null}
          <Typography variant="h6" color="primary.contrastText">
            {title}
          </Typography>
        </DialogTitle>
        <DialogContent dividers className="dialog-content">
          <Typography variant="h6">{subTitle}</Typography>
          <Typography variant="subtitle1" className="mt-10">
            {content}
          </Typography>
        </DialogContent>
        <DialogActions className="mt-5">
          <Button
            sx={{
              color: btnColor,
              border: `1px solid ${btnColor}`,
              hover: btnColor,
            }}
            onClick={(event) => handleSwitchChange(event)}
          >
            YES
          </Button>
          <Button onClick={handleClose} color="info" variant="outlined">
            NO
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
