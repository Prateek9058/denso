import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Rectangle,
  Bar,
} from "recharts";
import { Stack } from "@mui/material";

interface TableProps {
  deviceData: any;
  multichart?: boolean;
}

const MultiBarChart: React.FC<TableProps> = ({ deviceData, multichart }) => {
  const colors = {
    steps: {
      stroke: "#DC0032",
      fill: "#DC0032",
    },
    text: "#697077",
    background: "#fff",
  };

  return (
    <Stack sx={{ overflowX: "auto", overflowY: "hidden" }}>
      <ResponsiveContainer
        style={{ padding: "10px 0px" }}
        height={350}
        width="100%"
      >
        <BarChart data={deviceData}>
          <defs>
            <linearGradient id="workTimeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(220, 0, 50, 0.5)" />
              <stop offset="100%" stopColor="#DC0032" />
            </linearGradient>
            <linearGradient id="waitTimeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(76, 76, 76, 0.5)" />
              <stop offset="74.7%" stopColor="rgba(76, 76, 76, 0.873495)" />
              <stop offset="100%" stopColor="#4C4C4C" />
            </linearGradient>
            <linearGradient id="requiredTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(34, 123, 82, 0.5)" />
              <stop offset="100%" stopColor="#227B52" />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="date"
            tickSize={1}
            tickMargin={30}
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
            height={80}
            width={500}
            unit={""}
            angle={-45}
            textAnchor="middle"
          />
          <YAxis
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip />
          <Bar
            dataKey="workTime"
            fill="url(#workTimeGradient)"
            barSize={18}
            activeBar={
              <Rectangle fill="url(#workTimeGradient)" stroke="blue" />
            }
          />
          {multichart && (
            <>
              <Bar
                dataKey="waitTime"
                fill="url(#waitTimeGradient)"
                barSize={18}
                activeBar={
                  <Rectangle fill="url(#waitTimeGradient)" stroke="purple" />
                }
              />
              <Bar
                dataKey="requiredTime"
                fill="url(#requiredTime)"
                barSize={18}
                activeBar={
                  <Rectangle fill="url(#requiredTime)" stroke="purple" />
                }
              />
            </>
          )}

          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
          />
        </BarChart>
      </ResponsiveContainer>
    </Stack>
  );
};

export default MultiBarChart;
