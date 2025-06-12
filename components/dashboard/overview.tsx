"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  name: string;
  sent: number;
  opened: number;
}

interface OverviewProps {
  data: ChartData[];
}

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

export function Overview({ data }: OverviewProps) {
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
          allowDecimals={false}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border rounded-lg shadow-lg p-2">
                  <p className="font-medium">{payload[0].payload.name}</p>
                  <p className="text-sm">Sent: {payload[0].value}</p>
                  <p className="text-sm">Opened: {payload[1].value}</p>
                  <p className="text-sm text-muted-foreground">
                    Open Rate:{" "}
                    {(() => {
                      const sent = payload?.[0]?.value;
                      const opened = payload?.[1]?.value;
                      if (
                        typeof sent === "number" &&
                        sent > 0 &&
                        typeof opened === "number"
                      ) {
                        return Math.round((opened / sent) * 100);
                      }
                      return 0;
                    })()}
                    %
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          name="Sent"
          dataKey="sent"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          name="Opened"
          dataKey="opened"
          fill="hsl(var(--chart-2))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
