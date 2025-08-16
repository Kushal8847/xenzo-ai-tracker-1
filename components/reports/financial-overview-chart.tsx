"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface FinancialOverviewChartProps {
  period: string
}

export function FinancialOverviewChart({ period }: FinancialOverviewChartProps) {
  const data = [
    { month: "Jan", income: 5200, expenses: 3800, savings: 1400, netWorth: 12000 },
    { month: "Feb", income: 5400, expenses: 4100, savings: 1300, netWorth: 13300 },
    { month: "Mar", income: 5100, expenses: 3900, savings: 1200, netWorth: 14500 },
    { month: "Apr", income: 5600, expenses: 4200, savings: 1400, netWorth: 15900 },
    { month: "May", income: 5300, expenses: 3700, savings: 1600, netWorth: 17500 },
    { month: "Jun", income: 5500, expenses: 4000, savings: 1500, netWorth: 19000 },
  ]

  const incomeGrowth = (((data[data.length - 1].income - data[0].income) / data[0].income) * 100).toFixed(1)
  const expenseGrowth = (((data[data.length - 1].expenses - data[0].expenses) / data[0].expenses) * 100).toFixed(1)
  const netWorthGrowth = (((data[data.length - 1].netWorth - data[0].netWorth) / data[0].netWorth) * 100).toFixed(1)

  const maxValue = Math.max(...data.flatMap((d) => [d.income, d.expenses, d.savings, d.netWorth]))
  const minValue = Math.min(...data.flatMap((d) => [d.income, d.expenses, d.savings, d.netWorth]))
  const chartWidth = 600
  const chartHeight = 250
  const padding = 40

  const getX = (index: number) => padding + (index * (chartWidth - 2 * padding)) / (data.length - 1)
  const getY = (value: number) =>
    chartHeight - padding - ((value - minValue) / (maxValue - minValue)) * (chartHeight - 2 * padding)

  const createPath = (dataKey: keyof (typeof data)[0]) => {
    return data.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d[dataKey] as number)}`).join(" ")
  }

  return (
    <Card className="premium-card border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <TrendingUp className="w-5 h-5 text-white drop-shadow-glow" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Financial Overview
              </CardTitle>
              <p className="text-sm text-gray-400">Trend analysis and financial trajectory</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 shadow-lg shadow-green-500/5">
            <TrendingUp className="w-4 h-4 text-green-400 drop-shadow-glow" />
            <div>
              <p className="text-xs text-gray-400">Income Growth</p>
              <p className="text-sm font-semibold text-green-400">+{incomeGrowth}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/5">
            <TrendingDown className="w-4 h-4 text-red-400 drop-shadow-glow" />
            <div>
              <p className="text-xs text-gray-400">Expense Growth</p>
              <p className="text-sm font-semibold text-red-400">+{expenseGrowth}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 shadow-lg shadow-purple-500/5">
            <DollarSign className="w-4 h-4 text-purple-400 drop-shadow-glow" />
            <div>
              <p className="text-xs text-gray-400">Net Worth Growth</p>
              <p className="text-sm font-semibold text-purple-400">+{netWorthGrowth}%</p>
            </div>
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
              <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="savingsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="netWorthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
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

            {/* Lines */}
            <path d={createPath("income")} fill="none" stroke="#10b981" strokeWidth="3" className="drop-shadow-glow" />
            <path
              d={createPath("expenses")}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              className="drop-shadow-glow"
            />
            <path d={createPath("savings")} fill="none" stroke="#3b82f6" strokeWidth="3" className="drop-shadow-glow" />
            <path
              d={createPath("netWorth")}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="4"
              strokeDasharray="8,4"
              className="drop-shadow-glow"
            />

            {/* Data points */}
            {data.map((d, i) => (
              <g key={i}>
                <circle cx={getX(i)} cy={getY(d.income)} r="4" fill="#10b981" className="drop-shadow-glow" />
                <circle cx={getX(i)} cy={getY(d.expenses)} r="4" fill="#ef4444" className="drop-shadow-glow" />
                <circle cx={getX(i)} cy={getY(d.savings)} r="4" fill="#3b82f6" className="drop-shadow-glow" />
                <circle cx={getX(i)} cy={getY(d.netWorth)} r="5" fill="#8b5cf6" className="drop-shadow-glow" />
              </g>
            ))}

            {/* Month labels */}
            {data.map((d, i) => (
              <text key={i} x={getX(i)} y={chartHeight - 10} textAnchor="middle" className="text-xs fill-gray-400">
                {d.month}
              </text>
            ))}
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
              <span className="text-xs font-medium text-green-400">Income</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
              <span className="text-xs font-medium text-red-400">Expenses</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
              <span className="text-xs font-medium text-blue-400">Savings</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              <div
                className="w-3 h-[2px] bg-purple-500 shadow-lg shadow-purple-500/50"
                style={{ borderStyle: "dashed" }}
              ></div>
              <span className="text-xs font-medium text-purple-400">Net Worth</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
