"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { Button, DialogActions, Grid } from "@mui/material";
import FirstTab from "./selected";
import axiosInstance from "@/app/api/axiosInstance";
import CommonDialog from "@/app/(components)/mui-components/Dialog/common-dialog";
import ConfirmationDialog from "@/app/(components)/mui-components/Dialog/confirmation-dialog";
import {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  url?: string;
  deviceAssign?: boolean;
  role?: any;
  setTrolley: React.Dispatch<React.SetStateAction<any>>;
  trolley: string;
  selectedDevice?: any;
}

export default function AssignAssessment({
  open,
  setOpen,
  role,
  setTrolley,
  trolley,
  selectedDevice,
}: Props) {
  const methods = useForm<any>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
    reset,
  } = methods;

  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [getAllList, setGetAllList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setTabValue] = useState<number>(0);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<any>("");
  const [selectIDs, setSelectedIds] = useState<any>(null);
  const [lineIds, setLineIds] = useState<any>(null);

  // my state
  const [department, setDepartment] = useState<any>(null);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name == "department") {
      setSelectedDepartmentId(value);
    }
  };

  console.log("sele", selectIDs, lineIds);
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
      const data1 = {
        sectionId: selectIDs,
        lineId: lineIds,
      };
      const { data, status } = await axiosInstance.post(
        `/trolleys/getAssignedNotAssingedTrolley?page=${page + 1}&limit=${rowsPerPage}&status=${false}&departmentId=${selectedDepartmentId}&search=${searchQuery}`,
        data1
      );
      if (status === 200 || status === 201) {
        console.log("all trollley", data?.data?.data);
        if (selectIDs && lineIds) {
          setGetAllList(data?.data?.data);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  console.log("fdghjk", selectIDs, lineIds);
  useEffect(() => {
    if (open) {
      getDepartmentDropdown();
    }
  }, [open]);

  useEffect(() => {
    if (selectedDepartmentId && department) {
      getAllTrolleyByDepartmentId();
    }
  }, [
    value,
    page,
    rowsPerPage,
    searchQuery,
    selectedDepartmentId,
    lineIds,
    selectIDs,
  ]);
  const handleClose = () => {
    setOpen(false);

    reset();
    setTrolley(null);
  };
  useEffect(() => {
    setTrolley(
      selectedDevice?.trolley?.map((item: any) => {
        return item;
      })
    );
  }, [selectedDevice]);
  const onSubmit = async () => {
    console.log("values,values", trolley);
    if (trolley?.length === 0) {
      notifyError("please ");
    }
    const body = {
      employeeId: selectedDevice?._id,
      trolleyIds: trolley,
    };
    try {
      const { data, status } = await axiosInstance.post(
        `/employees/assingendTrolley?isTrolleyChange=true`,
        body
      );
      if (status === 200 || status === 201) {
        notifySuccess("trolley assigned successfully !");
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <CommonDialog
      open={open}
      maxWidth={"lg"}
      fullWidth={true}
      title={` Assign trolley`}
      message={"Are you sure you want to cancel?"}
      titleConfirm={"Cancel"}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid p={2}>
          <FirstTab
            methods={methods}
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
            setSelectedIds={setSelectedIds}
            selectIDs={selectIDs}
            lineIds={lineIds}
            setLineIds={setLineIds}
            selectedDepartmentId={selectedDepartmentId}
          />
        </Grid>
        <DialogActions className="dialog-action-btn">
          <ConfirmationDialog
            title={"Cancel"}
            handleCloseFirst={handleClose}
            message={"Are you sure you want to cancel?"}
          />
          <Button variant="contained" type="submit" sx={{ width: "150px" }}>
            Submit
          </Button>
        </DialogActions>
      </form>
    </CommonDialog>
  );
}
