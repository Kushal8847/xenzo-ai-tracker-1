"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChartIcon } from "lucide-react"

interface CategorySpendingChartProps {
  category: string
}

export function CategorySpendingChart({ category }: CategorySpendingChartProps) {
  const data = [
    { name: "Groceries", value: 1200, color: "#10b981" },
    { name: "Dining Out", value: 800, color: "#f59e0b" },
    { name: "Transport", value: 600, color: "#3b82f6" },
    { name: "Entertainment", value: 400, color: "#8b5cf6" },
    { name: "Utilities", value: 300, color: "#ef4444" },
    { name: "Shopping", value: 500, color: "#06b6d4" },
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const centerX = 150
  const centerY = 150
  const radius = 100

  let currentAngle = -90 // Start from top

  const createArcPath = (startAngle: number, endAngle: number, outerRadius: number) => {
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180

    const x1 = centerX + outerRadius * Math.cos(startAngleRad)
    const y1 = centerY + outerRadius * Math.sin(startAngleRad)
    const x2 = centerX + outerRadius * Math.cos(endAngleRad)
    const y2 = centerY + outerRadius * Math.sin(endAngleRad)

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
  }

  return (
    <Card className="premium-card border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <PieChartIcon className="w-5 h-5 text-white drop-shadow-glow" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Category Spending
            </CardTitle>
            <p className="text-sm text-gray-400">Breakdown by expense categories</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gradient-to-br from-slate-900/30 to-slate-800/20 rounded-xl p-4 border border-white/5">
          <svg width="300" height="300" viewBox="0 0 300 300" className="mx-auto">
            <defs>
              {data.map((item, index) => (
                <filter key={index} id={`glow-${index}`}>
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>

            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const angle = (percentage / 100) * 360
              const startAngle = currentAngle
              const endAngle = currentAngle + angle

              const path = createArcPath(startAngle, endAngle, radius)
              currentAngle += angle

              return (
                <path
                  key={index}
                  d={path}
                  fill={item.color}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                  filter={`url(#glow-${index})`}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              )
            })}

            {/* Center circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r="40"
              fill="rgba(0,0,0,0.8)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
            <text x={centerX} y={centerY - 5} textAnchor="middle" className="text-sm font-bold fill-white">
              Total
            </text>
            <text x={centerX} y={centerY + 10} textAnchor="middle" className="text-xs fill-gray-400">
              ${total.toLocaleString()}
            </text>
          </svg>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1)
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                >
                  <div
                    className="w-3 h-3 rounded-full shadow-lg"
                    style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}50` }}
                  ></div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-white">{item.name}</div>
                    <div className="text-xs text-gray-400">
                      ${item.value.toLocaleString()} ({percentage}%)
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
