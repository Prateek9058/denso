"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Stack,
  Box,
  TablePagination,
} from "@mui/material";

import noData from "../../../../../../public/Img/nodata.png";
import SkeletonCard from "../../../../(components)/mui-components/Skeleton/assign-radio-card";
import SkeletonLoader from "../../../../(components)/mui-components/Skeleton/skeleton-loader";
import Image from "next/image";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";
import axiosInstance from "@/app/api/axiosInstance";

interface Section {
  _id: string;
  name: string;
  uId: string;
}

interface SelectedItems {
  sections: string[]; // Allowing multiple sections to be selected
}

interface AssignProps {
  selectedItems: SelectedItems;
  handleSelectionChange: (key: keyof SelectedItems, id: string) => void;
  deptId: any;
}

export default function AssignAssessmentTabSelected({
  selectedItems,
  handleSelectionChange,
  deptId,
}: AssignProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0);

  const getSections = async () => {
    setLoading(true);
    try {
      const { data, status } = await axiosInstance.get(
        `section/getAllSections/${deptId}?page=${page + 1}&limit=${rowsPerPage}&search=${debouncedSearchQuery}`
      );
      if (status === 200 || status === 201) {
        setSections(data?.data?.data);
        setTotalCount(data?.data?.totalCount);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deptId) {
      getSections();
    }
  }, [page, rowsPerPage, debouncedSearchQuery, deptId]);

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
    setPage(0); // Reset page when rows per page is changed
  };

  return (
    <div>
      <Grid container justifyContent="space-between" alignItems={"center"}>
        <Grid item>
          <CustomTextField
            type="search"
            placeholder="Search by ID / Name"
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
          Showing {sections?.length} of {totalCount} Sections
        </Box>
      </Typography>

      <Grid container direction="row" mt={3}>
        {loading ? (
          <SkeletonCard width={250} arrayLength={8} />
        ) : (
          <>
            {sections?.map((item) => (
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
                  mr: 2,
                }}
                className="mt-20 assign-radio-grid"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedItems.sections.includes(item._id)}
                      onChange={() =>
                        handleSelectionChange("sections", item._id)
                      }
                    />
                  }
                  label={
                    <Typography className="width100">
                      <Typography color="#000000">{`# ${item.uId}`}</Typography>
                      <Typography color="#000000">{item.name}</Typography>
                    </Typography>
                  }
                />
              </Grid>
            ))}
          </>
        )}
        {sections?.length === 0 && !loading && (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h5">No Section Added</Typography>
            <Image src={noData} alt="No Data Found" />
          </Grid>
        )}
      </Grid>

      {!loading && (
        <Grid container mt={1} justifyContent="end">
          <Stack spacing={2}>
            <TablePagination
              page={page}
              count={totalCount}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Stack>
        </Grid>
      )}
    </div>
  );
}
