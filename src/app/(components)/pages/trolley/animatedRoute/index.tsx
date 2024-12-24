"use client";
import React from "react";
import { Button, DialogActions, DialogContent } from "@mui/material";
import dynamic from "next/dynamic";

import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";

const TrolleyTrack = dynamic(
  () =>
    import(
      "@/app/(DashboardLayout)/(ui-components)/trolley/[trolleyId]/trolleyTrack"
    ),
  { ssr: false }
);
interface PointWithMarker {
  x: number;
  y: number;
  showMarker: boolean;
  _id: string;
}

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  trolleyId?: string;
  trolleyPath: PointWithMarker[];
}

export default function AssignAssessment({
  open,
  setOpen,
  trolleyId,
  trolleyPath = [],
}: Props) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <CommonDialog
      open={open}
      maxWidth={"lg"}
      fullWidth={true}
      title={"Animated Trolley"}
      message={"Are you sure you want to cancel?"}
      titleConfirm={"Cancel"}
      onClose={handleClose}
    >
      <DialogContent>
        <TrolleyTrack trolleyPath={trolleyPath} trolleyId={trolleyId} />
      </DialogContent>

      <DialogActions className="dialog-action-btn">
        <Button
          variant="outlined"
          sx={{ width: "150px" }}
          onClick={handleClose}
        >
          close
        </Button>
      </DialogActions>
    </CommonDialog>
  );
}
