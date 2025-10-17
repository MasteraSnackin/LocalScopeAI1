"use client"

import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts"

const data = [
  { name: "Anti-social behaviour", value: 40 },
  { name: "Violence and sexual offences", value: 25 },
  { name: "Vehicle crime", value: 15 },
  { name: "Burglary", value: 10 },
  { name: "Other theft", value: 10 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function CrimeChart() {
  return (
    <div>
       <h4 className="font-semibold text-lg mb-2">Crime Breakdown (Last 12 Months)</h4>
      <div className="aspect-video">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip formatter={(value: number) => `${value}%`}/>
            <Legend />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
