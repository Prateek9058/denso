"use client";
import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  IconButton,
  DialogActions,
  Button,
  DialogContent,
  Grid,
} from "@mui/material";
import FirstTab from "./SelectTab";
import SecondTab from "./NotSelectTab";
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
  // setTrolley:React.Dispatch<React.SetStateAction<[]>>;
  setTrolley: React.Dispatch<React.SetStateAction<string[]>>;
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
const tabs: TabData[] = [{ label: "Not assigned" }, { label: "Assigned" }];
export default function AssignAssessment({
  url,
  open,
  setOpen,
  title,
  deviceAssign,
  role,
  setTrolley,
}: Props) {
  const { handleSubmit, reset } = useForm();
  const [select, setSelect] = useState<any[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<any>(10);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [itemId, setItemId] = useState<string | undefined>("");
  const [getAllList, setGetAllList] = useState<any>([]);
  // const [getTabDtata, setGetTabDtata] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setTabValue] = useState<number>(0);
  const [finalSectionDropDownData, setFinalSectionDropDownData] = useState<FinalSectionDropDownDataProps[]>([]);
  const [zoneId, setZoneId] = useState<any>("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<any>("");
  const [selectedSectionId, setSelectedSectionId] = useState<any>("");
  const [selectedLineId, setSelectedLineId] = useState<any>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedLine, setSelectedLine] = useState<string>("");
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("valueeee",newValue)
    setTabValue(newValue);
  };
  const departments = useMemo(() => 
    finalSectionDropDownData
      .filter(item => item.type === "department")
      .map(item => ({ label: item.name, _id: item._id })),
    [finalSectionDropDownData]
  );

  const sections = useMemo(() => 
    finalSectionDropDownData
      .filter(item => item.type === "section")
      .map(item => ({ label: item.name, _id: item._id })),
    [finalSectionDropDownData]
  );

  const lines = useMemo(() => 
    finalSectionDropDownData
      .filter(item => item.type === "line")
      .map(item => ({ label: item.name, _id: item._id })),
    [finalSectionDropDownData]
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name == 'department') {
      setSelectedDepartmentId(value);
      const selectDepartment = departments.find((department) => department?._id === value);
      if (selectDepartment) {
        setSelectedDepartment(selectDepartment?.label);
      }
    }else if(name == 'section'){
      setSelectedSectionId(value);
      const selectSection = sections.find((section) => section?._id === value);
      if (selectSection) {
        setSelectedSection(selectSection?.label);
      }
    }else if(name == 'line'){
      setSelectedLineId(value);
      const selectLine = lines.find((line) => line?._id === value);
      if (selectLine) {
        setSelectedLine(selectLine?.label);
      }
    }
    const selectedZone = event.target.value;
    console.log("eventevent",event.target.name)
    setZoneId(selectedZone);
  };

  const getData = async () => {
    setLoading(true);
    try {
      let res = await axiosInstance.get(
        `${url}?page=${
          page + 1
        }&limit=${rowsPerPage}&searchQuery=${searchQuery}`
      );

      if (res?.status === 200 || res?.status === 201) {
        setGetAllList(res?.data?.data?.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }finally {
      setLoading(false);
    }
  };
  const getTableData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `trolleys/getAllTrolleys`, 
        {
          params: {
            page: page + 1,
            limit: rowsPerPage,
            searchQuery: searchQuery || "", 
            status: value === 0 ? "false" : "false",
            departmentId: selectedDepartmentId || "", 
            sectionId: selectedSectionId || "",
            lineId: selectedLineId || "",
          }
        }
      );
      if (res?.status === 200 || res?.status === 201) {
        setGetAllList(res?.data?.data?.data);
      }
    } catch (err) {
      console.error("Error fetching table data:", err);
    } finally {
      setLoading(false);
    }
  };
  const getFinalSectionDropdownData = async () => {
    setLoading(true);
    try {
      const [departmentRes, sectionRes, lineRes] = await Promise.all([
        axiosInstance.get(`organizations/getAllData?type=department`),
        axiosInstance.get(`organizations/getAllData?type=section`),
        axiosInstance.get(`organizations/getAllData?type=line`),
      ]);

      const validResponses = [departmentRes, sectionRes, lineRes].filter(
        (res) => res?.status === 200 || res?.status === 201
      );

      if (validResponses.length > 0) {
        const allData = validResponses.flatMap(
          (res) => res?.data?.data?.data || []
        );
        setFinalSectionDropDownData(allData);
      } else {
        console.log("No data available for dropdown.");
      }
    } catch (err) {
      console.error("Error fetching section dropdown data:", err);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      getData();
      getFinalSectionDropdownData();
    }
  }, [open, page, rowsPerPage, searchQuery]);

  useEffect(() => {
      getTableData();
  }, [value,zoneId, page, rowsPerPage, searchQuery]);

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
console.log("getAllList123",getAllList)
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
          departments={departments}
          sections={sections}
          lines={lines}
          selectedDepartment={selectedDepartment}
          selectedSection={selectedSection}
          selectedLine={selectedLine}
          setTrolley={setTrolley}
        />
      ),
    },
    {
      component: (
        <SecondTab
          select={select}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          setPage={setPage}
          getAllList={getAllList}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          loading={loading}
          handleInputChange={handleInputChange}
          setLoading={setLoading}
          role={role}
          departments={departments}
          sections={sections}
          lines={lines}
          selectedDepartment={selectedDepartment}
          selectedSection={selectedSection}
          selectedLine={selectedLine}
        />
      ),
    },
  ];
  console.log("zoneId",zoneId)

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
