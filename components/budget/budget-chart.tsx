"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChartIcon } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

const data = [
  { name: "Housing", value: 2000, color: "#3B82F6" },
  { name: "Groceries", value: 680, color: "#8B5CF6" },
  { name: "Transportation", value: 320, color: "#10B981" },
  { name: "Dining Out", value: 280, color: "#F59E0B" },
  { name: "Entertainment", value: 275, color: "#EF4444" },
  { name: "Healthcare", value: 125, color: "#6B7280" },
]

export function BudgetChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  const CustomPieChart = () => {
    const size = 280
    const radius = 100
    const centerX = size / 2
    const centerY = size / 2

    let cumulativeAngle = 0

    const slices = data.map((item, index) => {
      const percentage = item.value / total
      const angle = percentage * 2 * Math.PI
      const startAngle = cumulativeAngle
      const endAngle = cumulativeAngle + angle

      // Calculate path for pie slice
      const x1 = centerX + radius * Math.cos(startAngle)
      const y1 = centerY + radius * Math.sin(startAngle)
      const x2 = centerX + radius * Math.cos(endAngle)
      const y2 = centerY + radius * Math.sin(endAngle)

      const largeArcFlag = angle > Math.PI ? 1 : 0

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ")

      // Calculate label position
      const labelAngle = startAngle + angle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + labelRadius * Math.cos(labelAngle)
      const labelY = centerY + labelRadius * Math.sin(labelAngle)

      cumulativeAngle += angle

      return {
        pathData,
        color: item.color,
        percentage: (percentage * 100).toFixed(0),
        labelX,
        labelY,
        name: item.name,
        value: item.value,
      }
    })

    return (
      <div className="h-80 w-full flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-lg border border-slate-700/50">
        <div className="flex items-center gap-8">
          <svg width={size} height={size} className="overflow-visible">
            <defs>
              {slices.map((slice, index) => (
                <filter key={index} id={`shadow-${index}`}>
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                </filter>
              ))}
            </defs>

            {slices.map((slice, index) => (
              <g key={index}>
                <path
                  d={slice.pathData}
                  fill={slice.color}
                  stroke="#1f2937"
                  strokeWidth="2"
                  filter={`url(#shadow-${index})`}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
                {/* Percentage labels */}
                {Number.parseFloat(slice.percentage) > 5 && (
                  <text
                    x={slice.labelX}
                    y={slice.labelY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="12"
                    fontWeight="bold"
                    fill="white"
                    filter="drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))"
                  >
                    {slice.percentage}%
                  </text>
                )}
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full shadow-lg"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 8px ${item.color}40`,
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-200">{item.name}</span>
                  <span className="text-xs text-slate-400">{formatCurrency(item.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="premium-card h-full border-slate-700/50 bg-gradient-to-br from-slate-900/90 to-slate-800/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <PieChartIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-slate-100">Spending Distribution</CardTitle>
            <p className="text-sm text-slate-400">Budget allocation breakdown</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CustomPieChart />
      </CardContent>
    </Card>
  )
}
