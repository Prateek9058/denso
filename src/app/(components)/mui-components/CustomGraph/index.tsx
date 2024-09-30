import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
interface ViewCountData {
  _id: string;
  views: number;
}

interface CustomBarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

const CustomRoundedBar: React.FC<CustomBarProps> = ({
  x,
  y,
  width,
  height,
  fill,
}) => {
  // Define the arc radius for rounding the top corners
  const radius = 10;

  return (
    <path
      d={`
        M${x},${y + height} 
        v${-height + radius} 
        a${radius},${radius} 0 0,1 ${radius},-${radius} 
        h${width - 2 * radius} 
        a${radius},${radius} 0 0,1 ${radius},${radius} 
        v${height - radius} 
        z
      `}
      fill={fill}
    />
  );
};

// Define the props for CustomGraph
interface CustomGraphProps {
  viewCount: ViewCountData[];
}

const CustomGraph = ({ viewCount }: any) => {
  const colors = {
    steps: {
      stroke: "#FFA11F",
      fill: "#FFA11F",
    },
    text: "#697077",
    background: "#fff",
  };

  return (
    <ResponsiveContainer height={410} width="100%">
      <BarChart data={viewCount}>
        <XAxis
          dataKey="_id"
          tickSize={8}
          tickMargin={15}
          tick={{ fill: colors.text }}
          tickLine={{ stroke: colors.text }}
          height={50}
        />
        <YAxis
          tick={{ fill: colors.text }}
          tickLine={{ stroke: colors.text }}
        />
        <CartesianGrid strokeDasharray="1" />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.background,
            color: "#222",
          }}
          itemStyle={{ color: colors.steps.stroke }}
        />
        <Bar
          dataKey="views"
          stroke={colors.steps.stroke}
          fill={colors.steps.fill}
          strokeWidth={6}
          barSize={18}
          //   shape={CustomRoundedBar}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomGraph;
