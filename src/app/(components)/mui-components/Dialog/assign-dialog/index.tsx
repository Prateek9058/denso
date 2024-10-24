"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import {
  IconButton,
  DialogActions,
  Button,
  DialogContent,
  Grid,
} from "@mui/material";
import FirstTab from "./SelectTab";
import ToastComponent, {
  notifyError,
  notifySuccess,
} from "@/app/(components)/mui-components/Snackbar";
import axiosInstance from "@/app/api/axiosInstance";
import { AxiosError } from "axios";
import Tabs from "@/app/(components)/mui-components/Tabs/CustomTab";

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
}
interface TabData {
  label: string;
}
const tabs: TabData[] = [{ label: "Not assigned" }, { label: "Assigned" }];
export default function AssignAssessment({
  url,
  open,
  setOpen,
  title,
  deviceAssign,
  role,
}: Props) {
  const { handleSubmit, reset } = useForm();
  const [select, setSelect] = useState<any[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [itemId, setItemId] = useState<string | undefined>("");
  const [getAllList, setGetAllList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setTabValue] = useState<number>(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const [zoneId, setZoneId] = useState<any>("");
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedZone = event.target.value;
    setZoneId(selectedZone);
  };
  /// api ti get datas  ///
  const getData = async () => {
    setLoading(true);
    try {
      let res = await axiosInstance.get(
        `${url}?page=${
          page + 1
        }&limit=${rowsPerPage}&searchQuery=${searchQuery}&role=${role}`
      );

      if (res?.status === 200 || res?.status === 201) {
        console.log(res);
        setGetAllList(res?.data?.data);
        // setLoading(false);
      }
    } catch (err) {
      // setLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      getData();
    }
  }, [open, page, rowsPerPage, searchQuery]);

  const handleRadioChange = (
    item: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (role === 0) {
      setSelect((prev: any) => {
        if (
          prev?.some(
            (selectedItem: { _id: any }) => selectedItem?._id === item?._id
          )
        ) {
          return prev?.filter(
            (selectedItem: { _id: any }) => selectedItem?._id !== item?._id
          );
        } else {
          return [...prev, item];
        }
      });
    } else {
      setSelect((prev: any) => (prev?._id === item._id ? null : item));
      setItemId(deviceAssign ? item?.macId : item?._id);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelect([]);
    setSearchQuery("");
    reset();
  };

  const handleAssessmentSubmit = async () => {
    if (!Boolean(select)) {
      notifyError("Please select at least one item!");
      return;
    }
    let body;
    if (role == 1) {
      body = { agent: itemId };
    } else if (role === 0) {
      body = { user: select?.map((item) => item?._id) };
    } else {
      body = { user: [itemId] };
    }
    try {
      const res = await axiosInstance.patch("api/user/assign-agent", body);
      if (res?.status === 200 || res?.status === 201) {
        notifySuccess("Assign Successful");
        handleClose();
      }
    } catch (error) {
      handleClose();
      const axiosError = error as AxiosError<ErrorResponse>;
      notifyError(axiosError?.response?.data?.error || "Error assigning agent");
    }
  };
  const TabPanelList = [
    {
      component: (
        <FirstTab
          select={select}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          setPage={setPage}
          getAllList={getAllList}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          handleRadioChange={handleRadioChange}
          loading={loading}
          handleInputChange={handleInputChange}
          setLoading={setLoading}
          role={role}
          zoneId={zoneId}
        />
      ),
    },
    {
      component: (
        <FirstTab
          select={select}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          setPage={setPage}
          getAllList={getAllList}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          handleRadioChange={handleRadioChange}
          loading={loading}
          handleInputChange={handleInputChange}
          setLoading={setLoading}
          role={role}
          zoneId={zoneId}
        />
      ),
    },
  ];

  return (
    <Grid item xs={12} md={12}>
      <Tabs
        value={value}
        handleChange={handleChange}
        tabs={tabs}
        TabPanelList={TabPanelList}
      />
    </Grid>
  );
}
