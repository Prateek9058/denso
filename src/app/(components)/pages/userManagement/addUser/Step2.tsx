"use client";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Grid,
  Stack,
  Radio,
  Tooltip,
  Typography,
  Pagination,
  useRadioGroup,
  FormControlLabelProps,
  FormControlLabel,
} from "@mui/material";
import Image from "next/image";
import axiosInstance from "@/app/api/axiosInstance";
import NoDataImg from "@/app/(components)/assets/noDataFound.png";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import SkeletonCard from "../../../mui-components/Skeleton/assign-radio-card";
interface StyledFormControlLabelProps extends FormControlLabelProps {
  checked: boolean;
}

type DepartmentProps = {
  select: any;
  handleRadioChange: any;
  loading?: boolean;
};

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

const UserDepartment = ({ select, handleRadioChange }: DepartmentProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };
  const getFetchAllDetails = async () => {
    setLoading(true);
    try {
      const { data, status } = await axiosInstance.get(
        `department/getAllDepartments?page=${
          currentPage
        }&limit=${10}&search=${searchQuery}`
      );
      if (status === 200 || status === 201) {
        setData(data?.data);
      }
    } catch (err) {
      console.log("Check Error ", err);
    } finally {
      setLoading(false);
    }
  };
  const totalLength = data?.totalCount ?? 0;
  useEffect(() => {
    if (totalLength) {
      setTotalPages(Math.ceil(totalLength / 10));
    }
  }, [totalLength]);

  useEffect(() => {
    getFetchAllDetails();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(debouncedSearchQuery);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearchQuery, setSearchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedSearchQuery(event.target.value);
  };

  return (
    <>
      <Grid container justifyContent={"space-between"}>
        <Grid item>
          <Typography variant="h6">Select Department</Typography>
          <Typography variant="subtitle1">
            Showing {data?.data?.length ?? 0} of
            <span> {totalLength ?? 0}</span>
          </Typography>
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
      <Grid container columnGap={2}>
        {loading ? (
          <SkeletonCard width={250} arrayLength={5} />
        ) : (
          <>
            {data?.data?.map((item: any, index: number) => {
              return (
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
                >
                  <MyFormControlLabel
                    className="assign-formlable"
                    key={index}
                    value={item?._id}
                    label={
                      <Typography className="width100">
                        <Typography color="#000000">{item?.uId}</Typography>
                        <Tooltip
                          describeChild
                          title={item?.name ? item?.name : item?.deviceName}
                          arrow
                        >
                          <Typography variant="subtitle1">
                            {item?.name}
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
              );
            })}
          </>
        )}

        {data?.data?.length === 0 && (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Image width={220} height={160} alt="NoDataImg" src={NoDataImg} />
            <Typography variant="subtitle1">
              Looks like there is no Department added.
            </Typography>
          </Grid>
        )}
      </Grid>{" "}
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="flex-end"
      >
        {!loading && (
          <Stack
            spacing={2}
            direction="column"
            alignItems="center"
            justifyContent="flex-end"
            sx={{ position: "absolute", bottom: 60 }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, page) => handlePagination(page)}
              showFirstButton
              showLastButton
            />
          </Stack>
        )}
      </Grid>
    </>
  );
};
export default UserDepartment;
