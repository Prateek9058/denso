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

const MultiLineChart: React.FC<TableProps> = ({ deviceData, multichart }) => {
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
        <LineChart data={deviceData}>
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

          <Line
            type="monotone"
            dataKey="Alerts"
            stroke="#DC0032"
            activeDot={{ r: 8 }}
          />

          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
          />
        </LineChart>
      </ResponsiveContainer>
    </Stack>
  );
};

export default MultiLineChart;
