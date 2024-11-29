"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  FormControlLabel,
  Radio,
  Stack,
  Box,
  Pagination,
} from "@mui/material";

import noData from "../../../../../../public/Img/nodata.png";
import SkeletonCard from "../../../../(components)/mui-components/Skeleton/assign-radio-card";
import SkeletonLoader from "../../../../(components)/mui-components/Skeleton/skeleton-loader";
import Image from "next/image";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import axiosInstance from "@/app/api/axiosInstance";

interface Department {
  _id: string;
  name: string;
  uId: string;
}
interface SelectedItems {
  department: string | null;
}
interface AssignProps {
  selectedItems: {
    department: string | null;
  };
  handleSelectionChange: (key: keyof SelectedItems, id: string) => void;
}

export default function AssignAssessmentTabSelected({
  selectedItems,
  handleSelectionChange,
}: AssignProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const getDepartment = async () => {
    setLoading(true);
    try {
      const { data, status } = await axiosInstance.get(
        `department/getAllDepartments?page=${page + 1}&limit=${10}&search=${debouncedSearchQuery}`
      );
      if (status === 200 || status === 201) {
        const totalLength = data?.data?.totalCount ?? 0;
        setDepartments(data?.data?.data);
        setTotalPages(Math.ceil(totalLength / 10));
        setTotalCount(totalLength);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDepartment();
  }, [page, debouncedSearchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(debouncedSearchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedSearchQuery(event.target.value);
  };

  const handlePagination = (page: number) => {
    setPage(page);
  };

  return (
    <div>
      <Grid container justifyContent="space-between" alignItems={"center"}>
        <Grid item>
          <Typography variant="h6">Select Department</Typography>
          <Typography variant="body2">
            Showing {departments?.length} of {totalCount} Departments
          </Typography>
        </Grid>
        <Grid item>
          <CustomTextField
            type="search"
            placeholder="Search by ID / Name"
            value={debouncedSearchQuery}
            onChange={handleSearchChange}
          />
        </Grid>{" "}
      </Grid>

      <Grid container direction="row" mt={3}>
        {loading ? (
          <SkeletonCard width={250} arrayLength={8} />
        ) : (
          <>
            {departments?.length > 0 &&
              departments?.map((item) => (
                <Grid
                  item
                  key={item._id}
                  sm={2.8}
                  sx={{
                    backgroundColor: "#F7F8F9",
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    marginLeft: "20px",
                  }}
                >
                  <FormControlLabel
                    value={item._id}
                    control={
                      <Radio
                        checked={selectedItems.department === item._id}
                        onChange={() =>
                          handleSelectionChange("department", item._id)
                        }
                      />
                    }
                    label={
                      <Typography className="width100">
                        <Typography color="#000000">
                          {`# ${item.uId}`}
                        </Typography>
                        <Typography color="#000000">{item.name}</Typography>
                      </Typography>
                    }
                  />
                </Grid>
              ))}
          </>
        )}
        {departments?.length === 0 && !loading && (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h5">No Department Added</Typography>
            <Image src={noData} alt="No Data Found" />
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
    </div>
  );
}
