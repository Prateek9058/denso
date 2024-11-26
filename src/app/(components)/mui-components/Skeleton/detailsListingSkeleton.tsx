import React from "react";
import { Grid, Typography, Skeleton } from "@mui/material";

interface Props {
  listingHead: string[];
}

const DetailsListingSkeleton: React.FC<Props> = ({ listingHead }) => {
  return (
    <Grid container direction="column" rowGap="20px">
      <Grid container justifyContent="space-between" rowGap="30px">
        {listingHead.map((head, index) => (
          <Grid item md={2.8} key={index}>
            <Typography mb={1} variant="body1" color="info">
              <Skeleton width="60%" />
            </Typography>
            <Typography variant="h4">
              <Skeleton width="80%" />
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default DetailsListingSkeleton;
