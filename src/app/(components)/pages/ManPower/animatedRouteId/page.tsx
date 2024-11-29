// "use client";
// import React from "react";
// import { Grid } from "@mui/material";
// import ManagementGrid from "@/app/(components)/mui-components/Card";
// import { useParams } from "next/navigation";
// import EmpTrack from "./emp";
// type Breadcrumb = {
//   label: string;
//   link: string;
// };
// const Page: React.FC = () => {
//   const { deviceId, animatedRouteId } = useParams<{
//     deviceId: string;
//     animatedRouteId: string;
//   }>();
//   const breadcrumbItems: Breadcrumb[] = [
//     { label: "Dashboard", link: "/" },
//     { label: "Manpower Tracking ", link: "/man-power-tracking"},
//     {
//       label: deviceId,
//       link: `/man-power-tracking/${deviceId}`,
//     },
//     {
//       label: animatedRouteId,
//       link: "",
//     },
//   ];
//   return (
//     <Grid sx={{ padding: "12px 15px" }}>
//       <ManagementGrid
//         moduleName="Manpower Details"
//         subHeading="Animated route"
//         breadcrumbItems={breadcrumbItems}
//       />
//       <EmpTrack userDetails={deviceId} name={animatedRouteId} />
//     </Grid>
//   );
// };

// export default Page;
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page