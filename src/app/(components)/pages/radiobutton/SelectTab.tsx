"use client";
import React from "react";

import { styled } from "@mui/material/styles";
import {
  DialogContentText,
  Typography,
  Radio,
  useRadioGroup,
  FormControlLabel,
  FormControlLabelProps,
  Pagination,
  Stack,
  Tooltip,
  Box,
  Grid,
} from "@mui/material";
// Icons Import
import SkeletonCard from "../../../(components)/mui-components/Skeleton/assign-radio-card";
import SkeletonLoader from "../../../(components)/mui-components/Skeleton/skeleton-loader";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";

interface StyledFormControlLabelProps extends FormControlLabelProps {
  checked: boolean;
}
const StyledFormControlLabel = styled((props: StyledFormControlLabelProps) => (
  <FormControlLabel {...props} />
))(({ theme, checked }) => ({
  ".MuiFormControlLabel-label": checked && {
    color: theme.palette.primary.main,
  },
}));

function MyFormControlLabel(props: FormControlLabelProps) {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <StyledFormControlLabel checked={checked} {...props} />;
}

interface AssignProps {
  select: any;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  setSeacrhTerm: any;
  getAllList: any;
  handlePagination: (page: number) => void;
  handleRadioChange: any;
  loading?: boolean;
}
export default function AssignAssessmentTab({
  select,
  totalPages,
  searchTerm,
  currentPage,
  setSeacrhTerm,
  getAllList,
  handlePagination,
  handleRadioChange,
  loading,
}: AssignProps) {
  const getAllAssingAssessments: any = getAllList?.user?.data;

  const dataLength = getAllList?.user?.data?.length;
  const totalLength = getAllList?.user?.totalLength;

  return (
    <Grid container width={"100%"} border={"1px solid black"}>
      <Grid container  className="mt-10" justifyContent="space-between">
        <CustomTextField
          type="search"
          placeholder="Search ID / Name"
          value={searchTerm}
          onChange={(event: any) => setSeacrhTerm(event.target.value)}
        />
        <Typography variant="h6">
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            Showing
            {loading ? (
              <SkeletonLoader
                width={36}
                height={25}
                sx={{ marginLeft: 1, marginRight: 1 }}
              />
            ) : (
              <Box sx={{ paddingLeft: 1, paddingRight: 1 }}>{dataLength}</Box>
            )}
            of
            {loading ? (
              <SkeletonLoader
                width={36}
                height={25}
                sx={{ marginLeft: 1, marginRight: 1 }}
              />
            ) : (
              <Box sx={{ paddingLeft: 1, paddingRight: 1 }}>{totalLength}</Box>
            )}
            Items
          </Box>
        </Typography>
      </Grid>

      <Grid container direction="row" mt={2}>
        {loading ? (
          <SkeletonCard width={250} arrayLength={5} />
        ) : (
          <>
            {getAllAssingAssessments?.map((item: any, index: number) => {
              return (
                <>
                  <Grid
                    xs={3.5}
                    sx={{
                      backgroundColor: "##F7F8F9",
                      border: "1px solid #ddd",
                      padding: "10px",
                      borderRadius: "8px",
                      justifyContent: "center",
                      mt: 2,
                      alignItems: "center",
                    }}
                    className="mt-20 assign-radio-grid"
                  >
                    <MyFormControlLabel
                      className="assign-formlable"
                      key={index}
                      value={select}
                      label={
                        <Typography className="width100">
                          <Typography color="primary" variant="h6">
                            {item.uId}
                          </Typography>
                          <Tooltip
                            describeChild
                            title={item.assessmentName}
                            arrow
                          >
                            <Typography variant="subtitle2">
                              {item.assessmentName}
                            </Typography>
                          </Tooltip>
                        </Typography>
                      }
                      control={
                        <Radio
                          onClick={(event: any) => {
                            handleRadioChange(item, event);
                          }}
                          checked={select?._id === item._id}
                        />
                      }
                    />
                  </Grid>
                  <Grid xs={0.2}></Grid>
                </>
              );
            })}
          </>
        )}
        {!loading && totalLength < 0 && (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              Looks like there is no items added.
            </Typography>
          </Grid>
        )}
      </Grid>
      {!loading && totalLength > 12 && (
        <Grid container mt={2} justifyContent="center">
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, page) => handlePagination(page)}
              showFirstButton
              showLastButton
            />
          </Stack>
        </Grid>
      )}
    </Grid>
  );
}
