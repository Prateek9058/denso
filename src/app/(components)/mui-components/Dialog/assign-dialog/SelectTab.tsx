"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { styled } from "@mui/material/styles";
import {
  Grid,
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
  TablePagination,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
// Icons Import
import noData from "../../../../../../public/Img/nodata.png";
import SkeletonCard from "../../Skeleton/assign-radio-card";
import SkeletonLoader from "../../Skeleton/skeleton-loader";
import Image from "next/image";
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
    checked = radioGroup?.value === props?.value;
  }

  return <StyledFormControlLabel checked={checked} {...props} />;
}

interface AssignProps {
  select: any;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getAllList: any;
  searchQuery: string;
  handleRadioChange: any;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  role?: any;
  handleInputChange?: any;
  zoneId?: any;
}
export default function AssignAssessmentTab({
  select,
  rowsPerPage,
  getAllList,
  setRowsPerPage,
  handleRadioChange,
  page,
  setPage,
  setSearchQuery,
  searchQuery,
  loading,
  setLoading,
  handleInputChange,
  role,
  zoneId,
}: AssignProps) {
  const getAllAssignAssessments: any = getAllList?.users
    ? getAllList?.users
    : getAllList?.device;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
  };

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(debouncedSearchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearchQuery, setSearchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedSearchQuery(event?.target?.value);
  };

  return (
    <div>
      <Grid container justifyContent="space-between" alignItems={"center"}>
        <Grid item>
          <Grid
            container
            justifyContent="space-between"
            gap={1}
            alignItems={"center"}
          >
            <Grid item>
              <FormControl fullWidth>
                <Select
                  sx={{
                    "& .MuiInputBase-input": {
                      border: "none",
                    },
                    "& .MuiSvgIcon-root": {
                      border: "none",
                    },
                  }}
                  value={zoneId || ""}
                  onChange={handleInputChange}
                  displayEmpty
                  renderValue={(selected) => {
                    return selected ? `Zone ${selected}` : "Department";
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Select Zone</em>
                  </MenuItem>
                  <MenuItem value={""}>All</MenuItem>
                  {[1, 2, 3].map((item: any, index: any) => (
                    <MenuItem key={index} value={item?.zone}>
                      Zone {item?.zone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <Select
                  sx={{
                    "& .MuiInputBase-input": {
                      border: "none",
                    },
                    "& .MuiSvgIcon-root": {
                      border: "none",
                    },
                  }}
                  value={zoneId || ""}
                  onChange={handleInputChange}
                  displayEmpty
                  renderValue={(selected) => {
                    return selected ? `Zone ${selected}` : "Section";
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Select Zone</em>
                  </MenuItem>
                  <MenuItem value={""}>All</MenuItem>
                  {[1, 2, 3].map((item: any, index: any) => (
                    <MenuItem key={index} value={item?.zone}>
                      Zone {item?.zone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <Select
                  sx={{
                    "& .MuiInputBase-input": {
                      border: "none",
                    },
                    "& .MuiSvgIcon-root": {
                      border: "none",
                    },
                  }}
                  value={zoneId || ""}
                  onChange={handleInputChange}
                  displayEmpty
                  renderValue={(selected) => {
                    return selected ? `Zone ${selected}` : "Line";
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Select Zone</em>
                  </MenuItem>
                  <MenuItem value={""}>All</MenuItem>
                  {[1, 2, 3].map((item: any, index: any) => (
                    <MenuItem key={index} value={item?.zone}>
                      Zone {item?.zone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <CustomTextField
            type="search"
            placeholder="Search ID / Name"
            value={debouncedSearchQuery}
            onChange={handleSearchChange}
          />
        </Grid>
      </Grid>
      <Typography variant="h6">
        <Box
          sx={{
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
            <Box sx={{ paddingLeft: 1, paddingRight: 1 }}>
              {getAllAssignAssessments?.length}
            </Box>
          )}
          of
          {loading ? (
            <SkeletonLoader
              width={36}
              height={25}
              sx={{ marginLeft: 1, marginRight: 1 }}
            />
          ) : (
            <Box sx={{ paddingLeft: 1, paddingRight: 1 }}>
              {getAllList?.count}
            </Box>
          )}
          Users
        </Box>
      </Typography>
      <Grid container direction="row" mt={3}>
        {loading ? (
          <SkeletonCard width={250} arrayLength={5} />
        ) : (
          <>
            {getAllAssignAssessments?.map((item: any, index: number) => {
              return (
                <>
                  <Grid
                    item
                    sm={2.8}
                    sx={{
                      backgroundColor: "##F7F8F9",
                      border: "1px solid #ddd",
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "15px",
                    }}
                    className="mt-20 assign-radio-grid"
                  >
                    <MyFormControlLabel
                      className="assign-formlable"
                      key={index}
                      value={select}
                      label={
                        <Typography className="width100">
                          <Typography color="secondary">
                            {item?.macId}
                          </Typography>
                          <Tooltip
                            describeChild
                            title={item?.name ? item?.name : item?.deviceName}
                            arrow
                          >
                            <Typography variant="subtitle1">
                              {item?.user?.firstName
                                ? item?.user?.firstName +
                                  " " +
                                  item?.user?.lastName
                                : item?.deviceName}
                            </Typography>
                          </Tooltip>
                        </Typography>
                      }
                      control={
                        <Radio
                          onClick={(event: any) => {
                            handleRadioChange(
                              getAllList?.users ? item?.user : item,
                              event
                            );
                          }}
                          checked={
                            role === 0
                              ? select?.some(
                                  (selectedItem: { _id: any }) =>
                                    selectedItem?._id === item?.user?._id
                                )
                              : select?._id === item?.user?._id
                          }
                        />
                      }
                    />
                  </Grid>
                  <Grid item sm={0.2}></Grid>
                </>
              );
            })}
          </>
        )}
        {!loading && getAllList?.count === 0 && (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Image src={noData} alt="no data found " />
          </Grid>
        )}
      </Grid>
      {!loading && getAllList?.count > 10 && (
        <Grid container mt={1} justifyContent="end">
          <Stack spacing={2}>
            <TablePagination
              page={page}
              count={getAllList?.count}
              rowsPerPageOptions={[5, 10, 25]}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Stack>
        </Grid>
      )}
    </div>
  );
}
