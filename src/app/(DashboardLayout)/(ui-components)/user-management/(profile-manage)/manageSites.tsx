import React, { useEffect, useState, ChangeEvent } from "react";
import { Grid, Button, Stack, TextField, MenuItem } from "@mui/material";
import { IoMdAddCircleOutline } from "react-icons/io";
import Image from "next/image";
import axiosInstance from "@/app/api/axiosInstance";
import AddSite from "../(addSites)/addSite";
import Site from "../../../../../../public/Img/layoutPsiborg.jpg";

function ManageSites() {
  const [openUpload, setOpenUpload] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [allSites, setAllSites] = useState<any>([]);
  const [selectedSite, setSelectedSite] = useState<any>(null);

  useEffect(() => {
    const storedSite = localStorage.getItem("selectedSite");
    if (storedSite) {
      setSelectedSite(JSON.parse(storedSite));
    }
  }, []);
  useEffect(() => {
    getAllSites();
  }, []);
  const getAllSites = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/v1/site/getAllSites");
      if (res?.status === 200 || res?.status === 201) {
        setAllSites(res?.data?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedSiteName = event.target.value;
    const site = allSites?.data?.find(
      (item: any) => item?.siteName === selectedSiteName
    );
    if (site) {
      setSelectedSite(site);
    }
  };
  const handleClickOpenUpload = () => {
    setOpenUpload(true);
  };
  return (
    <>
      <AddSite
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        getDeviceData={getAllSites}
      />
      <Grid
        container
        mt={3}
        p={2}
        sx={{ backgroundColor: "#FFFFFF", borderRadius: "8px" }}
      >
        <Grid
          container
          alignItems={"center"}
          justifyContent={"end"}
          spacing={2}
          mb={2}
        >
          <Grid item md={2}>
            <Stack sx={{ marginTop: "5px" }}>
              <TextField
                value={selectedSite?.siteName || ""}
                select
                label="Select Site"
                placeholder="Select Site"
                InputLabelProps={{ shrink: true }}
                onChange={handleInputChange}
              >
                {allSites?.data?.map((item: any) => (
                  <MenuItem key={item?.id} value={item?.siteName}>
                    {item?.siteName}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Grid>
          <Grid item>
            <Button
              onClick={handleClickOpenUpload}
              startIcon={<IoMdAddCircleOutline />}
              variant="contained"
              size="large"
              sx={{
                color: "#FFFFFF",
                backgroundColor: "#4C4C4C",
              }}
            >
              Add Site
            </Button>
          </Grid>
        </Grid>
        <Grid
          item
          md={12}
          sx={{ height: "600px", width: "100%", position: "relative" }}
        >
          <Image
            src={Site}
            alt="site img"
            style={{ width: "100%", height: "100%", position: "relative" }}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default ManageSites;
