"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { Grid } from "@mui/material";
import FirstTab from "./SelectTab";

import axiosInstance from "@/app/api/axiosInstance";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  url: string;
  deviceAssign?: boolean;
  role?: any;
  setTrolley: React.Dispatch<React.SetStateAction<string[]>>;
  trolley: string;
  selectedDevice?: any;
}

export default function AssignAssessment({
  open,
  role,
  setTrolley,
  trolley,
  selectedDevice,
}: Props) {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [getAllList, setGetAllList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [value] = useState<number>(0);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<any>("");

  const [department, setDepartment] = useState<any>(null);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name == "department") {
      setSelectedDepartmentId(value); 
    }
  };

  const getDepartmentDropdown = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        `department/getAllDepartments?page=1&limit=1000`
      );
      if (status === 200 || status === 201) {
        setDepartment(data?.data?.data);
        if (department?.length > 0) {
          setDepartment(department[0]._id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllTrolleyByDepartmentId = async () => {
    try {
      setLoading(true);

      const { data, status } = await axiosInstance.post(
        `/trolleys/getAssignedNotAssingedTrolley?page=${page + 1}&limit=${rowsPerPage}&departmentId=${selectedDepartmentId}&search=${searchQuery}`
      );
      if (status === 200 || status === 201) {
        setGetAllList(data?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      getDepartmentDropdown();
    }
  }, [open]);

  useEffect(() => {
    if (selectedDepartmentId && department) {
      getAllTrolleyByDepartmentId();
    }
  }, [value, page, rowsPerPage, searchQuery, selectedDepartmentId]);
  useEffect(() => {
    setTrolley(
      selectedDevice?.trolley?.map((item: any) => {
        return item?._id;
      })
    );
  }, [selectedDevice]);

  return (
    <Grid item xs={12} md={12}>
      <FirstTab
        select={trolley}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        page={page}
        setPage={setPage}
        getAllList={getAllList}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        loading={loading}
        handleInputChange={handleInputChange}
        role={role}
        selectedDevice={selectedDevice}
        departments={department}
        departmentList={department}
        selectedDepartment={selectedDepartmentId}
        setTrolley={setTrolley}
      />
    </Grid>
  );
}
