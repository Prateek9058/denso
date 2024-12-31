"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { styled } from "@mui/material/styles";
import {
  Grid,
  Typography,
  useRadioGroup,
  FormControlLabel,
  FormControlLabelProps,
  Stack,
  Box,
  MenuItem,
  Select,
  FormControl,
  Checkbox,
  InputLabel,
  TextField,
  Pagination,
} from "@mui/material";

import noData from "../../../../../../public/Img/nodata.png";
import SkeletonCard from "../../../../(components)/mui-components/Skeleton/assign-radio-card";
import SkeletonLoader from "../../../../(components)/mui-components/Skeleton/skeleton-loader";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import axiosInstance from "@/app/api/axiosInstance";
import Autocomplete1 from "@mui/material/Autocomplete";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
  trolley: any;

  setTrolley: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function AssignAssessmentTabSelected({
  trolley,
  setTrolley,
}: AssignProps) {
  const [department, setDepartment] = useState<any>(null);
  const [selectIDs, setSelectedIds] = useState<any>(null);
  const [lineIds, setLineIds] = useState<any>(null);
  const [site, setSite] = useState<any>(null);
  const [Line, setLine] = useState<any>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<any>("");
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [getAllList, setGetAllList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name == "department") {
      setSelectedDepartmentId(value);
    }
  };
  const handleChangeAutocompleteSIte = (event: any, value: any[]) => {
    const selectedIds = value.map((item) => item?._id);
    setSelectedIds(selectedIds);
  };
  const handleChangeAutocompleteLine = (event: any, value: any[]) => {
    const selectedIds = value.map((item) => item?._id);
    setLineIds(selectedIds);
  };
  const methods = useForm<any>();
  const {
    formState: { errors },
    setValue,
    control,
  } = methods;
  const handleSection = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        `/section/departmentBaseSections/${selectedDepartmentId}`
      );
      if (status === 200 || status === 201) {
        setSite(data?.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleLine = async () => {
    try {
      const { data, status } = await axiosInstance.post(`/line/getAllLines/`, {
        sectionIds: selectIDs,
      });
      if (status === 200 || status === 201) {
        setLine(data?.data?.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleSection();
  }, [selectedDepartmentId]);
  useEffect(() => {
    if (selectIDs) {
      handleLine();
    }
  }, [selectIDs]);
  const getDepartmentDropdown = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        `department/getAllDepartments?page=1&limit=1000`
      );
      if (status === 200 || status === 201) {
        setDepartment(data?.data?.data);
        if (department?.length > 0) {
          setDepartment(department[0]?._id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllTrolleyByDepartmentId = async () => {
    try {
      setLoading(true);
      const data1 = {
        sectionId: selectIDs,
        lineId: lineIds,
      };
      const { data, status } = await axiosInstance.post(
        `/trolleys/getAssignedNotAssingedTrolley?page=${page + 1}&limit=${rowsPerPage}&departmentId=${selectedDepartmentId}&search=${searchQuery}`,
        data1
      );
      if (status === 200 || status === 201) {
        const totalLength = data?.data?.totalCount ?? 0;
        setGetAllList(data?.data?.data);
        setTotalPages(Math.ceil(totalLength / 10));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDepartmentDropdown();
  }, []);
  useEffect(() => {
    if (selectedDepartmentId) {
      getAllTrolleyByDepartmentId();
    }
  }, [
    page,
    rowsPerPage,
    searchQuery,
    selectedDepartmentId,
    lineIds,
    selectIDs,
  ]);

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

  const getAllAssignAssessments: any = getAllList;

  const toggleTrolley = (id: string) => {
    setTrolley((prev = []) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  const handlePagination = (page: number) => {
    setPage(page);
  };

  return (
    <div style={{ width: "100%" }}>
      <form>
        <Grid container justifyContent="space-between">
          <Grid item xs={9} mb={2}>
            <Grid container xs={12} spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Departments</InputLabel>
                  <Select
                    value={selectedDepartmentId}
                    onChange={(event) => {
                      const modifiedEvent: any = {
                        ...event,
                        target: {
                          ...event.target,
                          name: "department",
                        },
                      };
                      handleInputChange(modifiedEvent);
                    }}
                    label="Departments"
                  >
                    <MenuItem disabled value="">
                      <em>Select Department</em>
                    </MenuItem>
                    {department &&
                      department?.map((item: any, index: any) => (
                        <MenuItem key={index} value={item?._id}>
                          {item?.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="section"
                  control={control}
                  rules={{
                    required: "Section is required",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete1
                      id="section"
                      multiple
                      size="small"
                      options={site?.length > 0 ? site : []}
                      getOptionLabel={(option: any) => option?.name}
                      onChange={(event, value) => {
                        handleChangeAutocompleteSIte(event, value);
                        field.onChange(
                          value?.map((option: any) => option?._id)
                        );
                      }}
                      value={
                        site?.filter((section: any) =>
                          field.value?.includes(section?._id)
                        ) || []
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Section"
                          placeholder="Select section"
                          variant="outlined"
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option?.name}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="line"
                  control={control}
                  rules={{
                    required: "line is required",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete1
                      id="line"
                      multiple
                      size="small"
                      options={Line || []}
                      // disabled={!selectIDs}
                      getOptionLabel={(option: any) => option?.name}
                      onChange={(event, value) => {
                        handleChangeAutocompleteLine(event, value);
                        field.onChange(
                          value?.map((option: any) => option?._id)
                        );
                      }}
                      value={
                        Line?.filter((section: any) =>
                          field?.value?.includes(section?._id)
                        ) || []
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select line"
                          placeholder="Select line"
                          variant="outlined"
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option?.name}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <TextField
              size="small"
              type="search"
              placeholder="Search "
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
              fontSize: "15px",
            }}
          >
            Showing
            {loading && getAllAssignAssessments?.length > 0 ? (
              <SkeletonLoader
                width={36}
                height={25}
                sx={{ marginLeft: 1, marginRight: 1 }}
              />
            ) : (
              <Box sx={{ paddingLeft: 1, paddingRight: 1 }}>
                {getAllAssignAssessments?.length ?? 0}
              </Box>
            )}
            of
            {loading && getAllAssignAssessments?.length > 0 ? (
              <SkeletonLoader
                width={36}
                height={25}
                sx={{ marginLeft: 1, marginRight: 1 }}
              />
            ) : (
              <Box sx={{ paddingLeft: 1, paddingRight: 1 }}>
                {getAllAssignAssessments?.length ?? 0}
              </Box>
            )}
            Trolleys
          </Box>
        </Typography>

        <Grid container direction="row" mt={3}>
          {!department ? (
            loading && <SkeletonCard width={250} arrayLength={8} />
          ) : (
            <>
              {getAllAssignAssessments?.map((item: any, index: number) => {
                return (
                  <>
                    <Grid
                      item
                      key={item._id}
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
                        value={item?._id}
                        label={
                          <Typography className="width100">
                            <Typography color="#000000">
                              {`# ${item?.uId}`}
                            </Typography>
                            <Typography color="#000000">
                              {item?.name}
                            </Typography>
                          </Typography>
                        }
                        control={
                          <Checkbox
                            checked={trolley?.includes(item?._id)}
                            onChange={() => toggleTrolley(item?._id)}
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
          {getAllAssignAssessments?.length === 0 && (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h5">First Select department</Typography>
              <Image src={noData} alt="no dg found " />
            </Grid>
          )}
        </Grid>
        {!loading && (
          <Grid container mt={4} justifyContent="center">
            <Stack
              spacing={2}
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ position: "absolute", bottom: 60 }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, page) => handlePagination(page)}
                showFirstButton
                showLastButton
              />
            </Stack>
          </Grid>
        )}
      </form>
    </div>
  );
}
