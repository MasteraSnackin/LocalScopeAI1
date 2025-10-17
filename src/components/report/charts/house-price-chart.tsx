"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Jan '23", price: 350000 },
  { month: "Mar '23", price: 355000 },
  { month: "May '23", price: 360000 },
  { month: "Jul '23", price: 358000 },
  { month: "Sep '23", price: 362000 },
  { month: "Nov '23", price: 370000 },
  { month: "Jan '24", price: 375000 },
  { month: "Mar '24", price: 380000 },
  { month: "May '24", price: 382000 },
]

export default function HousePriceChart() {
  return (
    <div>
      <h4 className="font-semibold text-lg mb-2">Average House Price Trend</h4>
      <div className="aspect-video">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis 
                tickFormatter={(value) => `£${(value / 1000)}k`} 
                domain={['dataMin - 10000', 'dataMax + 10000']}
            />
            <Tooltip
              formatter={(value: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(value)}
            />
            <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
