"use client";
import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Grid } from "@mui/material";
import FirstTab from "./SelectTab";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import axiosInstance from "@/app/api/axiosInstance";
import { AxiosError } from "axios";

interface ErrorResponse {
  error?: string;
}
interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  url: string;
  deviceAssign?: boolean;
  role?: any;
  setTrolley: React.Dispatch<React.SetStateAction<string[]>>;
  trolley: string;
}
interface TabData {
  label: string;
}
interface FinalSectionDropDownDataProps {
  createdAt: string;
  createdBy: string;
  name: string;
  type: string;
  uId: string;
  updatedAt: string;
  _id: string;
}
export default function AssignAssessment({
  open,
  setOpen,
  title,
  deviceAssign,
  role,
  setTrolley,
  trolley,
}: Props) {
  const { reset } = useForm();
  const [select, setSelect] = useState<any[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [getAllList, setGetAllList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setTabValue] = useState<number>(0);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<any>("");

  // my state
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
        if (department.length > 0) {
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
      const { data, status } = await axiosInstance.get(
        `/trolleys/getAssignedNotAssingedTrolley?page=${page + 1}&limit=${rowsPerPage}&status=${false}&departmentId=${selectedDepartmentId}&sectionId=&lineId=&search=${searchQuery}`
      );
      if (status === 200 || status === 201) {
        console.log("all trollley", data?.data?.data);
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

  const handleClose = () => {
    setOpen(false);
    setTrolley([]);
    reset();
  };
  // const handleAssessmentSubmit = async () => {
  //   if (!Boolean(select)) {
  //     notifyError("Please select at least one item!");
  //     return;
  //   }
  //   let body;
  //   if (role == 1) {
  //     body = { agent: itemId };
  //   } else if (role === 0) {
  //     body = { user: select?.map((item) => item?._id) };
  //   } else {
  //     body = { user: [itemId] };
  //   }
  //   try {
  //     const res = await axiosInstance.patch("api/user/assign-agent", body);
  //     if (res?.status === 200 || res?.status === 201) {
  //       notifySuccess("Assign Successful");
  //       handleClose();
  //     }
  //   } catch (error) {
  //     handleClose();
  //     const axiosError = error as AxiosError<ErrorResponse>;
  //     notifyError(axiosError?.response?.data?.error || "Error assigning agent");
  //   }
  // };

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
        departments={department}
        departmentList={department}
        selectedDepartment={selectedDepartmentId}
        setTrolley={setTrolley}
      />
    </Grid>
  );
}
