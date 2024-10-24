import React from "react";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { styled, Theme } from "@mui/material/styles";
import Zoom from "@mui/material/Zoom";

interface BootstrapTooltipProps extends TooltipProps {
  theme?: Theme;
}

const BootstrapTooltip = styled(
  ({ className, ...props }: BootstrapTooltipProps) => (
    <Tooltip
      describeChild
      {...props}
      TransitionComponent={Zoom}
      arrow
      classes={{ popper: className }}
    />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.primary.main,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default BootstrapTooltip;
