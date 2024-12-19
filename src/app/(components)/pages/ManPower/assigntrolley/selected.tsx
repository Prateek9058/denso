"use client";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Grid,
  Typography,
  useRadioGroup,
  FormControlLabel,
  FormControlLabelProps,
  Stack,
  Box,
  TablePagination,
  MenuItem,
  Select,
  FormControl,
  Checkbox,
  InputLabel,
  TextField,
} from "@mui/material";

import noData from "../../../../../../public/Img/nodata.png";
import SkeletonCard from "../../../../(components)/mui-components/Skeleton/assign-radio-card";
import SkeletonLoader from "../../../../(components)/mui-components/Skeleton/skeleton-loader";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import Autocomplete from "@/app/(components)/mui-components/Text-Field's/Autocomplete";
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
  select: any;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getAllList: any;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  handleInputChange?: any;
  departments?: any;
  sections?: any;
  lines?: any;
  selectedDepartment?: string;
  departmentList?: any;
  selectedSection?: string;
  selectedLine?: string;
  setTrolley: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDevice?: any;
  methods: ReturnType<typeof useForm>;
  setSelectedIds: React.Dispatch<React.SetStateAction<any>>;
  selectIDs?: any;
  lineIds?: any;
  setLineIds: React.Dispatch<React.SetStateAction<any>>;
  selectedDepartmentId?: any;
}
export default function AssignAssessmentTabSelected({
  select,
  rowsPerPage,
  getAllList,
  setRowsPerPage,
  page,
  setPage,
  setSearchQuery,
  searchQuery,
  loading,
  handleInputChange,
  selectedDepartment,
  departmentList,
  setTrolley,
  selectIDs,
  setSelectedIds,
  setLineIds,
  selectedDepartmentId,
  selectedDevice,
}: AssignProps) {
  useEffect(() => {
    if (selectedDevice) {
      const sectionIds = selectedDevice?.trolley
        ?.flatMap((item: any) => item?.sectionId || [])
        .map((section: any) => section?._id);

      const lineIds = selectedDevice?.trolley
        ?.flatMap((item: any) => item?.lineId || [])
        .map((line: any) => line?._id);

      setValue("section", sectionIds || []);
      setValue("line", lineIds || []);
      setSelectedIds(sectionIds || []);
      setLineIds(lineIds || []);
    }
  }, [selectedDevice]);
  const [site, setSite] = useState<any>(null);
  const [Line, setLine] = useState<any>(null);
  const [selectedSections, setSelectedSections] = React.useState<any[]>([]);
  const [selectedLines, setSelectedLines] = React.useState<any[]>([]);

  const handleChangeAutocompleteSIte = (event: any, value: any[]) => {
    const selectedIds = value.map((item) => item?._id);
    setSelectedSections(value);
    setSelectedIds(selectedIds);
  };
  const handleChangeAutocompleteLine = (event: any, value: any[]) => {
    const selectedIds = value.map((item) => item?._id);
    setSelectedLines(value);
    setLineIds(selectedIds);
  };
  const methods = useForm<any>();
  const {
    formState: { errors },
    setValue,
    clearErrors,
    control,
    watch,
    getValues,
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
    setSelectedSections([]);
    setSelectedLines([]);
  }, [selectedDepartmentId]);
  useEffect(() => {
    if (selectIDs) {
      handleLine();
    } else {
      setSelectedLines([]);
    }
  }, [selectIDs]);

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

  return (
    <div style={{ height: "450px" }}>
      <form>
        <Grid container justifyContent="space-between" spacing={2}>
          <Grid item xs={10}>
            <Grid container columnGap={2}>
              <Grid item xs={3.9}>
                <FormControl fullWidth sx={{ minWidth: "20px" }}>
                  <InputLabel>Departments</InputLabel>
                  <Select
                    value={selectedDepartment}
                    size="medium"
                    onChange={(event) => {
                      const modifiedEvent = {
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
                    {departmentList &&
                      departmentList?.map((item: any, index: any) => (
                        <MenuItem key={index} value={item?._id}>
                          {item?.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={3.9}>
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
                      options={site?.length > 0 ? site : []}
                      // disabled={!departmentId}
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
              <Grid item xs={3.8}>
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
          <Grid item xs={2}>
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
          {!departmentList ? (
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
                            checked={select?.includes(item?._id)}
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
          <Grid container mt={1} justifyContent="end">
            <Stack spacing={2}>
              <TablePagination
                page={page}
                count={getAllList?.length}
                rowsPerPageOptions={[5, 10, 25]}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Stack>
          </Grid>
        )}
      </form>
    </div>
  );
}
