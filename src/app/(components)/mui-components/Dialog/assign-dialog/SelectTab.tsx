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
console.log("radioGroup",radioGroup)
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
  departments?:any,
  sections?:any,
  lines?:any,
  selectedDepartment?:string,
  selectedSection?:string,
  selectedLine?:string,
  setTrolley: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function AssignAssessmentTabSelected({
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
  departments,
  sections,
  lines,
  selectedDepartment,
  selectedSection,
  selectedLine,
  setTrolley,
}: AssignProps) {
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
  const getAllAssignAssessments: any = getAllList 
    // ? getAllList?.users
    // : getAllList?.device;
console.log("getAllListllll22",getAllList)


  const toggleTrolley = (id: string) => {
    setTrolley((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

console.log("getAllList123",getAllList)
console.log("getAllList456",getAllAssignAssessments)
console.log("loading123456789",select)

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
                  value={selectedDepartment}
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
                  displayEmpty
                  renderValue={(selected) => {
                    return selected ? `${selected}` : "Department";
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Select Department</em>
                  </MenuItem>
                  {departments.map((item: any, index: any) => (
                    <MenuItem key={index} value={item?._id}>
                       {item?.label}
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
                  value={selectedSection}
                  onChange={(event) => {
                    const modifiedEvent = {
                      ...event,
                      target: {
                        ...event.target,
                        name: "section", 
                      },
                    };
                    handleInputChange(modifiedEvent); 
                  }}
                  displayEmpty
                  renderValue={(selected) => {
                    return selected ? `${selected}` : "Section";
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Select Section</em>
                  </MenuItem>
                  {sections.map((item: any, index: any) => (
                    <MenuItem key={index} value={item?._id}>
                      {item?.label}
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
                  value={selectedLine}
                  onChange={(event) => {
                    const modifiedEvent = {
                      ...event,
                      target: {
                        ...event.target,
                        name: "line", 
                      },
                    };
                    handleInputChange(modifiedEvent); 
                  }}
                  displayEmpty
                  renderValue={(selected) => {
                    return selected ? `${selected}` : "Line";
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Select Line</em>
                  </MenuItem>
                  {lines.map((item: any, index: any) => (
                    <MenuItem key={index} value={item?._id}>
                      {item?.label}
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
              {getAllAssignAssessments?.length}
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
                          {`# ${item?.macId}`}
                          </Typography>
                          <Typography color="#000000">
                          {item?.uId}
                          </Typography>
                          {/* <Tooltip
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
                          </Tooltip> */}
                        </Typography>
                      }
                      control={
                        <Radio
                          checked={
                            select?.includes(item?._id)}
                          onClick={() => toggleTrolley(item?._id)}
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
        {!loading && getAllList?.length === 0 && (
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
      {!loading && getAllList?.length > 10 && (
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
    </div>
  );
}
