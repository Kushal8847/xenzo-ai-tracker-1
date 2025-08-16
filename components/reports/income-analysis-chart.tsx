"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { DollarSign } from "lucide-react"

interface IncomeAnalysisChartProps {
  period: string
}

export function IncomeAnalysisChart({ period }: IncomeAnalysisChartProps) {
  const data = [
    { month: "Jan", salary: 4500, freelance: 500, investments: 200 },
    { month: "Feb", salary: 4500, freelance: 700, investments: 200 },
    { month: "Mar", salary: 4500, freelance: 400, investments: 200 },
    { month: "Apr", salary: 4500, freelance: 900, investments: 200 },
    { month: "May", salary: 4500, freelance: 600, investments: 200 },
    { month: "Jun", salary: 4500, freelance: 800, investments: 200 },
  ]

  return (
    <Card className="premium-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Income Analysis</CardTitle>
            <p className="text-sm text-muted-foreground">Income sources breakdown and trends</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <Legend />
            <Area
              type="monotone"
              dataKey="salary"
              stackId="1"
              stroke="#10b981"
              fill="url(#salaryGradient)"
              name="Salary"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="freelance"
              stackId="1"
              stroke="#3b82f6"
              fill="url(#freelanceGradient)"
              name="Freelance"
              animationDuration={1500}
              animationDelay={200}
            />
            <Area
              type="monotone"
              dataKey="investments"
              stackId="1"
              stroke="#8b5cf6"
              fill="url(#investmentGradient)"
              name="Investments"
              animationDuration={1500}
              animationDelay={400}
            />
            <defs>
              <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="freelanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="investmentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
