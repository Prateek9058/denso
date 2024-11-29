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
} from "@mui/material";

import noData from "../../../../../../public/Img/nodata.png";
import SkeletonCard from "../../../../(components)/mui-components/Skeleton/assign-radio-card";
import SkeletonLoader from "../../../../(components)/mui-components/Skeleton/skeleton-loader";
import Image from "next/image";
import { useForm } from "react-hook-form";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import Autocomplete from "@/app/(components)/mui-components/Text-Field's/Autocomplete";
import axiosInstance from "@/app/api/axiosInstance";

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
  console.log("radioGroup", radioGroup);
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
  role?: any;
  handleInputChange?: any;
  zoneId?: any;
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
  selectedDevice,
  setTrolley,
  methods,
  selectIDs,
  setSelectedIds,
  setLineIds,
  lineIds,
  selectedDepartmentId,
}: AssignProps) {
  const {
    formState: { errors },
    setValue,
    clearErrors,
    control,
    watch,
  } = methods;
  const [site, setSite] = useState<any>(null);
  const [Line, setLine] = useState<any>(null);
  const [selectedSections, setSelectedSections] = React.useState<any[]>([]);
  const [selectedLines, setSelectedLines] = React.useState<any[]>([]);
  const handleChangeAutocompleteSIte = (event: any, value: any[]) => {
    const selectedIds = value.map((item) => item._id);
    setSelectedSections(value);
    setSelectedIds(selectedIds);
  };
  const handleChangeAutocompleteLine = (event: any, value: any[]) => {
    const selectedIds = value.map((item) => item._id);
    setSelectedLines(value);
    setLineIds(selectedIds);
  };
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
    }

    setSelectedLines([]);
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
    <div>
      <form>
        <Grid container justifyContent="space-between" alignItems={"center"}>
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
