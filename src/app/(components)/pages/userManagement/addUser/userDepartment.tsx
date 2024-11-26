"use client";
import React, { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Grid,
  Typography,
  Radio,
  Box,
  FormControlLabelProps,
  useRadioGroup,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import axiosInstance from "@/app/api/axiosInstance";
import SkeletonCard from "../../../mui-components/Skeleton/assign-radio-card";
interface StyledFormControlLabelProps extends FormControlLabelProps {
  checked: boolean;
}

type DepartmentProps={
  select:any,
  setSelect:any
  handleRadioChange:any
  loading?: boolean;
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
  console.log("radioGroup", radioGroup);
  let checked = false;

  if (radioGroup) {
    checked = radioGroup?.value === props?.value;
  }

  return <StyledFormControlLabel checked={checked} {...props} />;
}

const UserDepartment= ({select,setSelect,handleRadioChange,loading}:DepartmentProps) => {
  const [departmentData, setDepartmentData] = useState<any>(null);
  const [page, setPage] = useState<number>(0);
  // const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<any>(10);
  const [deviceData, setDeviceData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  
 

  const getDepartmentData = async () => {
    try {
      const res = await axiosInstance.get(
        `organizations/getAllData?type=${"department"}&page=${
          page + 1
        }&limit=${rowsPerPage}&search=${searchQuery}`
      );

      if (res?.status === 200 || res?.status === 201) {
        console.log("responsess", res);
        setDepartmentData(res?.data?.data);
      }
    } catch (err) {
      console.error("Error fetching departmentData:", err);
    }
  };
  useEffect(() => {
    getDepartmentData();
  }, []);

 
  const departmentId = (id: string) => {
    
  };


  return (
    <Grid container spacing={2}>
      <Grid container direction="row" mt={3}>
        {loading ? (
          <SkeletonCard width={250} arrayLength={5} />
        ) : (
          <>
            {departmentData?.data?.map((item: any, index: number) => {
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
                  <Grid item sm={0.2}></Grid>
                </>
              );
            })}
          </>
        )}
        {/* {!loading && getAllList?.length === 0 && (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Image src={noData} alt="no data found " />
          </Grid>
        )} */}
      </Grid>
    </Grid>
  );
};
export default UserDepartment;
