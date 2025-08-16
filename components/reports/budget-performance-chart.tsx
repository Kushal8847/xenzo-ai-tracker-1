"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

interface BudgetPerformanceChartProps {
  period: string
}

export function BudgetPerformanceChart({ period }: BudgetPerformanceChartProps) {
  const data = [
    { category: "Groceries", budget: 1000, actual: 1200, variance: 200 },
    { category: "Dining", budget: 600, actual: 800, variance: 200 },
    { category: "Transport", budget: 700, actual: 600, variance: -100 },
    { category: "Entertainment", budget: 500, actual: 400, variance: -100 },
    { category: "Utilities", budget: 350, actual: 300, variance: -50 },
    { category: "Shopping", budget: 400, actual: 500, variance: 100 },
  ]

  const maxValue = Math.max(...data.flatMap((d) => [d.budget, d.actual]))
  const chartWidth = 600
  const chartHeight = 400
  const padding = 60
  const barWidth = 30
  const groupWidth = 80

  const getX = (index: number, barIndex: number) => padding + index * groupWidth + barIndex * (barWidth + 5)

  const getY = (value: number) => chartHeight - padding - (value / maxValue) * (chartHeight - 2 * padding)

  const getHeight = (value: number) => (value / maxValue) * (chartHeight - 2 * padding)

  return (
    <Card className="premium-card border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
            <Target className="w-5 h-5 text-white drop-shadow-glow" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Budget Performance
            </CardTitle>
            <p className="text-sm text-gray-400">Budget vs actual spending comparison</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gradient-to-br from-slate-900/30 to-slate-800/20 rounded-xl p-4 border border-white/5">
          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="overflow-visible"
          >
            <defs>
              <linearGradient id="budgetBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="actualBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1={padding}
                y1={padding + (i * (chartHeight - 2 * padding)) / 4}
                x2={chartWidth - padding}
                y2={padding + (i * (chartHeight - 2 * padding)) / 4}
                stroke="rgba(255,255,255,0.1)"
                strokeDasharray="2,2"
              />
            ))}

            {/* Bars */}
            {data.map((d, i) => (
              <g key={i}>
                {/* Budget bar */}
                <rect
                  x={getX(i, 0)}
                  y={getY(d.budget)}
                  width={barWidth}
                  height={getHeight(d.budget)}
                  fill="url(#budgetBarGradient)"
                  stroke="rgba(59, 130, 246, 0.5)"
                  strokeWidth="1"
                  rx="4"
                  className="drop-shadow-glow"
                />
                {/* Actual bar */}
                <rect
                  x={getX(i, 1)}
                  y={getY(d.actual)}
                  width={barWidth}
                  height={getHeight(d.actual)}
                  fill="url(#actualBarGradient)"
                  stroke="rgba(239, 68, 68, 0.5)"
                  strokeWidth="1"
                  rx="4"
                  className="drop-shadow-glow"
                />
                {/* Category label */}
                <text
                  x={getX(i, 0) + barWidth}
                  y={chartHeight - 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-400"
                  transform={`rotate(-45 ${getX(i, 0) + barWidth} ${chartHeight - 20})`}
                >
                  {d.category}
                </text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="flex gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <div className="w-3 h-3 rounded bg-blue-500 shadow-lg shadow-blue-500/50"></div>
              <span className="text-xs font-medium text-blue-400">Budget</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              <div className="w-3 h-3 rounded bg-red-500 shadow-lg shadow-red-500/50"></div>
              <span className="text-xs font-medium text-red-400">Actual</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
