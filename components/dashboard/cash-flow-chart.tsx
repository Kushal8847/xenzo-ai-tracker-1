"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { useAppData } from "@/hooks/use-app-data"
import { useMemo } from "react"

export function CashFlowChart() {
  const { transactions, isLoading } = useAppData()

  const chartData = useMemo(() => {
    if (!transactions.length) {
      // Generate dummy data if no transactions
      const now = new Date()
      const data = []

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthName = date.toLocaleDateString("en-US", { month: "short" })

        // Generate realistic cash flow data
        const income = Math.floor(Math.random() * 2000) + 4000
        const expenses = Math.floor(Math.random() * 1500) + 2500
        const cashFlow = income - expenses

        data.push({
          month: monthName,
          income,
          expenses,
          cashFlow,
        })
      }
      return data
    }

    // Group transactions by month and calculate net cash flow
    const monthlyData = new Map()
    const now = new Date()

    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toISOString().slice(0, 7) // YYYY-MM format
      const monthName = date.toLocaleDateString("en-US", { month: "short" })

      monthlyData.set(monthKey, {
        month: monthName,
        income: 0,
        expenses: 0,
        cashFlow: 0,
      })
    }

    // Process transactions
    transactions.forEach((transaction) => {
      if (!transaction.date) return

      const transactionDate = new Date(transaction.date)

      // Check if date is valid
      if (isNaN(transactionDate.getTime())) return

      const monthKey = transactionDate.toISOString().slice(0, 7)

      if (monthlyData.has(monthKey)) {
        const monthData = monthlyData.get(monthKey)

        if (transaction.type === "income") {
          monthData.income += Math.abs(transaction.amount)
        } else {
          monthData.expenses += Math.abs(transaction.amount)
        }

        // Calculate net cash flow
        monthData.cashFlow = monthData.income - monthData.expenses
      }
    })

    return Array.from(monthlyData.values())
  }, [transactions])

  const CustomCashFlowChart = () => {
    const width = 600
    const height = 280
    const padding = { top: 30, right: 40, bottom: 50, left: 80 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Find min and max values for scaling
    const allValues = chartData.map((d) => d.cashFlow)
    const minValue = Math.min(...allValues)
    const maxValue = Math.max(...allValues)
    const valueRange = maxValue - minValue || 1

    // Create scale functions
    const xScale = (index: number) => (index / (chartData.length - 1)) * chartWidth
    const yScale = (value: number) => chartHeight - ((value - minValue) / valueRange) * chartHeight

    // Generate path string for cash flow line
    const createPath = () => {
      return chartData
        .map((d, i) => {
          const x = xScale(i)
          const y = yScale(d.cashFlow)
          return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
        })
        .join(" ")
    }

    return (
      <div className="h-72 w-full flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-lg border border-slate-700/50">
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            <pattern id="cashFlowGrid" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 30" fill="none" stroke="#475569" strokeWidth="0.5" opacity="0.4" />
            </pattern>
            <linearGradient id="cashFlowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <rect
            width={chartWidth}
            height={chartHeight}
            x={padding.left}
            y={padding.top}
            fill="url(#cashFlowGradient)"
            rx="8"
          />
          <rect width={chartWidth} height={chartHeight} x={padding.left} y={padding.top} fill="url(#cashFlowGrid)" />

          {/* Y-axis labels */}
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

          {/* X-axis labels */}
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
            {/* Cash flow line */}
            <path
              d={createPath()}
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="drop-shadow(0 0 6px rgba(34, 197, 94, 0.4))"
            />
            {/* Cash flow dots */}
            {chartData.map((d, i) => (
              <circle
                key={`cashflow-${i}`}
                cx={xScale(i)}
                cy={yScale(d.cashFlow)}
                r="6"
                fill="#22c55e"
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

  if (isLoading) {
    return (
      <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900/90 to-slate-800/50 h-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-100">Cash Flow Trend</CardTitle>
          <CardDescription className="text-slate-400">Loading cash flow data...</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900/90 to-slate-800/50 h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-100">Cash Flow Trend</CardTitle>
        <CardDescription className="text-slate-400">Net income over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <CustomCashFlowChart />
      </CardContent>
    </Card>
  )
}
