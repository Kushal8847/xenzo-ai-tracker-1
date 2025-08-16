"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { PiggyBank } from "lucide-react"

interface SavingsProgressChartProps {
  period: string
}

export function SavingsProgressChart({ period }: SavingsProgressChartProps) {
  const data = [
    { month: "Jan", actual: 1400, target: 1500, emergency: 1000 },
    { month: "Feb", actual: 2700, target: 3000, emergency: 2000 },
    { month: "Mar", actual: 3900, target: 4500, emergency: 3000 },
    { month: "Apr", actual: 5300, target: 6000, emergency: 4000 },
    { month: "May", actual: 6900, target: 7500, emergency: 5000 },
    { month: "Jun", actual: 8400, target: 9000, emergency: 6000 },
  ]

  return (
    <Card className="premium-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Savings Progress</CardTitle>
            <p className="text-sm text-muted-foreground">Track your savings goals and emergency fund</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <ReferenceLine y={10000} stroke="#f59e0b" strokeDasharray="5 5" label="Goal: $10,000" />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10b981"
              strokeWidth={4}
              name="Actual Savings"
              dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
              animationDuration={2000}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Target"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              animationDuration={2000}
              animationDelay={300}
            />
            <Line
              type="monotone"
              dataKey="emergency"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Emergency Fund"
              dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
              animationDuration={2000}
              animationDelay={600}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
