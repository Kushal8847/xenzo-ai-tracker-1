"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { useMemo } from "react"

export function SpendingChart() {
  const chartData = useMemo(() => {
    const now = new Date()
    const data = []

    console.log("[v0] Generating chart data...")

    // Generate realistic data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString("en-US", { month: "short" })

      // Generate more realistic financial data
      const income = Math.floor(Math.random() * 2000) + 4000 // $4000-$6000
      const expenses = Math.floor(Math.random() * 1500) + 2500 // $2500-$4000
      const savings = income - expenses

      data.push({
        month: monthName,
        income,
        expenses,
        savings,
      })
    }

    console.log("[v0] Chart data generated:", data)
    return data
  }, [])

  const CustomChart = () => {
    const width = 600
    const height = 280
    const padding = { top: 30, right: 40, bottom: 50, left: 80 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Find min and max values for scaling
    const allValues = chartData.flatMap((d) => [d.income, d.expenses, d.savings])
    const minValue = Math.min(...allValues)
    const maxValue = Math.max(...allValues)
    const valueRange = maxValue - minValue

    // Create scale functions
    const xScale = (index: number) => (index / (chartData.length - 1)) * chartWidth
    const yScale = (value: number) => chartHeight - ((value - minValue) / valueRange) * chartHeight

    // Generate path strings for each line
    const createPath = (dataKey: keyof (typeof chartData)[0]) => {
      return chartData
        .map((d, i) => {
          const x = xScale(i)
          const y = yScale(d[dataKey] as number)
          return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
        })
        .join(" ")
    }

    return (
      <div className="h-72 w-full flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-lg border border-slate-700/50">
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            <pattern id="grid" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 30" fill="none" stroke="#475569" strokeWidth="0.5" opacity="0.4" />
            </pattern>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <rect
            width={chartWidth}
            height={chartHeight}
            x={padding.left}
            y={padding.top}
            fill="url(#chartGradient)"
            rx="8"
          />
          <rect width={chartWidth} height={chartHeight} x={padding.left} y={padding.top} fill="url(#grid)" />

          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const value = minValue + valueRange * ratio
            const y = padding.top + chartHeight - ratio * chartHeight
            return (
              <g key={i}>
                <line
                  x1={padding.left - 8}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="#475569"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
                <text x={padding.left - 15} y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8" fontWeight="500">
                  {formatCurrency(value)}
                </text>
              </g>
            )
          })}

          {chartData.map((d, i) => {
            const x = padding.left + xScale(i)
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + chartHeight}
                  stroke="#475569"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <text
                  x={x}
                  y={padding.top + chartHeight + 25}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#94a3b8"
                  fontWeight="600"
                >
                  {d.month}
                </text>
              </g>
            )
          })}

          {/* Chart area */}
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            <path
              d={createPath("income")}
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="drop-shadow(0 0 6px rgba(34, 197, 94, 0.4))"
            />
            {/* Income dots with enhanced styling */}
            {chartData.map((d, i) => (
              <circle
                key={`income-${i}`}
                cx={xScale(i)}
                cy={yScale(d.income)}
                r="6"
                fill="#22c55e"
                stroke="#1f2937"
                strokeWidth="2"
                filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))"
              />
            ))}

            <path
              d={createPath("expenses")}
              fill="none"
              stroke="#f87171"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="drop-shadow(0 0 6px rgba(248, 113, 113, 0.4))"
            />
            {/* Expenses dots with enhanced styling */}
            {chartData.map((d, i) => (
              <circle
                key={`expenses-${i}`}
                cx={xScale(i)}
                cy={yScale(d.expenses)}
                r="6"
                fill="#f87171"
                stroke="#1f2937"
                strokeWidth="2"
                filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))"
              />
            ))}

            <path
              d={createPath("savings")}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="drop-shadow(0 0 6px rgba(96, 165, 250, 0.4))"
            />
            {/* Savings dots with enhanced styling */}
            {chartData.map((d, i) => (
              <circle
                key={`savings-${i}`}
                cx={xScale(i)}
                cy={yScale(d.savings)}
                r="6"
                fill="#60a5fa"
                stroke="#1f2937"
                strokeWidth="2"
                filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))"
              />
            ))}
          </g>
        </svg>
      </div>
    )
  }

  return (
    <Card className="premium-card h-full border-slate-700/50 bg-gradient-to-br from-slate-900/90 to-slate-800/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-100">Financial Overview</CardTitle>
            <CardDescription className="text-slate-400 mt-1">
              Income, expenses, and savings trends over 6 months
            </CardDescription>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30" />
              <span className="text-sm text-slate-300 font-medium">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400 shadow-lg shadow-red-400/30" />
              <span className="text-sm text-slate-300 font-medium">Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/30" />
              <span className="text-sm text-slate-300 font-medium">Savings</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CustomChart />
      </CardContent>
    </Card>
  )
}
