"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Jan",
    sent: 4,
    opened: 3,
  },
  {
    name: "Feb",
    sent: 5,
    opened: 4,
  },
  {
    name: "Mar",
    sent: 7,
    opened: 5,
  },
  {
    name: "Apr",
    sent: 6,
    opened: 4,
  },
  {
    name: "May",
    sent: 8,
    opened: 6,
  },
  {
    name: "Jun",
    sent: 10,
    opened: 7,
  },
  {
    name: "Jul",
    sent: 12,
    opened: 8,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip />
        <Bar dataKey="sent" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="opened" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}