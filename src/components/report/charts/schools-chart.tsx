"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Cell } from "recharts"

const data = [
  { name: "St. Peter's Primary", ofsted: 4, type: 'Primary' },
  { name: "Oakwood Secondary", ofsted: 3, type: 'Secondary' },
  { name: "Riverside Academy", ofsted: 4, type: 'Secondary' },
  { name: "Little Sprouts Nursery", ofsted: 3, type: 'Primary' },
  { name: "Northwood College", ofsted: 2, type: 'Secondary' },
]

const ofstedRatings: { [key: number]: string } = {
  1: "Inadequate",
  2: "Requires Improvement",
  3: "Good",
  4: "Outstanding"
};

const ofstedColors: { [key: number]: string } = {
  1: "#e3342f", // red
  2: "#f59e42", // orange
  3: "#38c172", // green
  4: "#4dc0b5", // teal/blue
};

export default function SchoolsChart() {
  return (
    <div>
        <h4 className="font-semibold text-lg mb-2">Nearby School Ofsted Ratings</h4>
        <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[1, 4]}
                  ticks={[1, 2, 3, 4]}
                  tickFormatter={(tick) => ofstedRatings[tick]}
                  label={{ value: "Ofsted Rating", position: "insideBottom", offset: -5 }}
                />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip formatter={(value: number) => ofstedRatings[value] || 'N/A'} />
                <Legend />
                <Bar dataKey="ofsted" name="Ofsted Rating">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ofstedColors[entry.ofsted] || "hsl(var(--primary))"} />
                  ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
        </div>
    </div>
  )
}
