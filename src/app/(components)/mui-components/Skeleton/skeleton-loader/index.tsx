import React from "react";
import Skeleton from "@mui/material/Skeleton";

type SkeletonLoaderProps = {
  width?: string | number;
  height?: string | number;
  sx?: any;
  variant?: string;
};

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = "100%",
  height = 200,
  sx,
}) => {
  return (
    <Skeleton
      width={width}
      variant="text"
      animation="wave"
      height={height}
      sx={sx}
    />
  );
};

export default SkeletonLoader;
