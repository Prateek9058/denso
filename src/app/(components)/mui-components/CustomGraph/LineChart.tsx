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
  analyticsDate?: any;
}
const LineChartCom: React.FC<TableProps> = ({ deviceData, analyticsDate }) => {
  const colors = {
    steps: {
      stroke: "#FFA11F",
      fill: "#FFA11F",
    },
    text: "#697077",
    background: "#fff",
  };
  return (
    <Stack sx={{ overflowX: "auto", overflowY: "hidden" }}>
      <ResponsiveContainer
        style={{ padding: "10px 0px" }}
        height={400}
        width="100%"
      >
        <BarChart data={deviceData}>
          <XAxis
            dataKey="label"
            tickSize={1}
            tickMargin={35}
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
            dataKey="present"
            fill="#28C87E"
            barSize={20}
            activeBar={<Rectangle fill="#28C87E" stroke="blue" />}
          />
          {analyticsDate?.length > 31 && (
            <Bar
              dataKey="absent"
              fill="#FF3B30"
              barSize={24}
              activeBar={<Rectangle fill="#FF3B30" stroke="purple" />}
            />
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
export default LineChartCom;
