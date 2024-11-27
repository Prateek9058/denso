"use client";
import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import Table from "@/app/(components)/pages/organization";
import axiosInstance from "@/app/api/axiosInstance";
import AddDepartment from "@/app/(components)/pages/organization/Action/add";
import ToastComponent from "@/app/(components)/mui-components/Snackbar";
import Breadcrumb from "@/app/(components)/mui-components/Breadcrumbs";
const Page: React.FC = () => {
  type Breadcrumb = {
    label: string;
    link: string;
  };
  const breadcrumbItems: Breadcrumb[] = [
    { label: "Dashboard", link: "/" },
    { label: "Department ", link: "" },
  ];
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<any>(10);
  const [data, setData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");

  const getFetchAllDetails = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `department/getAllDepartments?page=${
          page + 1
        }&limit=${rowsPerPage}&search=${searchQuery}`
      );
      if (res?.status === 200 || res?.status === 201) {
        setData(res?.data?.data);
      }
    } catch (err) {
      console.log("Check Error ", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getFetchAllDetails();
  }, [page, rowsPerPage, searchQuery]);

  return (
    <>
      <ToastComponent />
      <Grid container justifyContent={"space-between"}>
        <Grid item>
          <Breadcrumb breadcrumbItems={breadcrumbItems} />
        </Grid>
        <Grid item>
          <AddDepartment
            type={"department"}
            open={open}
            setOpen={setOpen}
            getFetchAllDetails={getFetchAllDetails}
          />
        </Grid>
      </Grid>

      <Table
        type={"department"}
        link={"department/"}
        data={data}
        page={page}
        setPage={setPage}
        loading={loading}
        rowsPerPage={rowsPerPage}
        searchQuery={searchQuery}
        setRowsPerPage={setRowsPerPage}
        setSearchQuery={setSearchQuery}
        getFetchAllDetails={getFetchAllDetails}
      />
    </>
  );
};
export default Page;
