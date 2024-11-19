import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
} from "@mui/material";
import Image from "next/image";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import users from "../../../../../../public/Img/trolleydash.png";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/system";
const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  backgroundColor: "#E8E8EA",
  color: "#000",
  fontWeight: "700",
  padding: "0px",
}));
interface CardProps {
  cardDetails: any;
  progress?: boolean;
}
const CountCard: React.FC<CardProps> = ({ cardDetails, progress }) => {
  console.log("cardDetails",cardDetails)
  return (
    <Grid container spacing={2}>
      {cardDetails?.map((stat: any, index: any) => (
        <Grid item md={4} mt={2} mb={1} sm={5.8} xs={12} key={index}>
          <StatCard>
            <CardContent>
              <Grid
                container
                alignItems="center"
                justifyContent={"space-between"}
                gap={1}
                width={"100%"}
              >
                <Grid>
                  <Typography variant="h5" color={"#767676"}>
                    {stat?.title}
                  </Typography>
                  <Typography variant="h3">{stat?.value}</Typography>
                </Grid>
                <Grid>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#E8E8EA",
                      border: "1px solid  #24AE6E1A",
                    }}
                  >
                    <Image src={stat?.icon} alt="icon" />
                  </Avatar>
                </Grid>
              </Grid>
              {!progress && (
                <Box>
                  <Box mt={1}>
                    <LinearProgress
                      variant="determinate"
                      value={72}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        backgroundColor: "#CCCCCC",
                        color: "#DC0032",
                      }}
                    />
                  </Box>

                  {stat?.title == 'Trolleys' && <Grid container justifyContent="space-between" mt={1}>
                    <Typography variant="body2" style={{ color: "#DC0032" }}>
                      <span style={{ color: "#DC0032", fontSize: "18px" }}>
                        ●
                      </span>{" "}
                       Active - {stat?.active ?? 0}
                    </Typography>
                    <Typography variant="body2">
                      <span style={{ color: "#b0bec5", fontSize: "18px" }}>
                        ●
                      </span>{" "}
                      Non-active - {stat?.nonActive ?? 0}
                    </Typography>
                  </Grid>}
                  {stat?.title == 'Assign status' && <Grid container justifyContent="space-between" mt={1}>
                    <Typography variant="body2" style={{ color: "#DC0032" }}>
                      <span style={{ color: "#DC0032", fontSize: "18px" }}>
                        ●
                      </span>{" "}
                       Not assigned- {stat?.notAssigned ?? 0}
                    </Typography>
                    <Typography variant="body2">
                      <span style={{ color: "#b0bec5", fontSize: "18px" }}>
                        ●
                      </span>{" "}
                      Assigned - {stat?.assigned ?? 0}
                    </Typography>
                  </Grid>}
                  {stat?.title == 'Under maintenance' && <Grid container justifyContent="space-between" mt={1}>
                    <Typography variant="body2" style={{ color: "#DC0032" }}>
                      <span style={{ color: "#DC0032", fontSize: "18px" }}>
                        ●
                      </span>{" "}
                       Repaired - {stat?.repair ?? 0}
                    </Typography>
                    <Typography variant="body2">
                      <span style={{ color: "#b0bec5", fontSize: "18px" }}>
                        ●
                      </span>{" "}
                      Not-repaired - {stat?.notRepaired ?? 0}
                    </Typography>
                  </Grid>}

                </Box>
              )}
            </CardContent>
          </StatCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default CountCard;
