"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, Clock } from "lucide-react"

const heatmapData = [
  { day: "Mon", hours: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 3, 2, 1, 2, 3, 4, 2, 1, 0, 0, 0, 0, 0] },
  { day: "Tue", hours: [0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 3, 2, 1, 2, 3, 1, 2, 1, 0, 0, 0, 0] },
  { day: "Wed", hours: [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 2, 4, 3, 2, 3, 4, 2, 3, 1, 0, 0, 0, 0, 0] },
  { day: "Thu", hours: [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 4, 3, 2, 3, 5, 2, 1, 1, 0, 0, 0, 0] },
  { day: "Fri", hours: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 2, 4, 3, 4, 3, 4, 3, 2, 1, 0, 0, 0] },
  { day: "Sat", hours: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 4, 3, 4, 3, 2, 1, 1, 0, 0, 0] },
  { day: "Sun", hours: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 4, 3, 2, 3, 2, 1, 1, 0, 0, 0, 0] },
]

const getIntensityColor = (value: number) => {
  if (value === 0) return "bg-white/5"
  if (value === 1) return "bg-green-500/20"
  if (value === 2) return "bg-green-500/40"
  if (value === 3) return "bg-green-500/60"
  if (value === 4) return "bg-green-500/80"
  return "bg-green-500"
}

const insights = [
  { time: "Lunch Hours", peak: "12-2 PM", activity: "High dining expenses", icon: Clock },
  { time: "Evening", peak: "5-7 PM", activity: "Shopping & entertainment", icon: TrendingUp },
  { time: "Weekends", peak: "Sat-Sun", activity: "Leisure spending peaks", icon: Activity },
]

export function ExpenseHeatmap() {
  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Spending Patterns</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                When you spend money throughout the week
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">Weekly View</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
          {/* Heatmap */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {heatmapData.map((day, dayIndex) => (
                <div key={day.day} className="flex items-center gap-6">
                  <div className="w-12 text-sm text-muted-foreground font-bold flex-shrink-0">{day.day}</div>
                  <div className="flex gap-2" style={{ width: "calc(100% - 48px - 24px)" }}>
                    {day.hours.map((value, hourIndex) => (
                      <div
                        key={hourIndex}
                        className={`w-4 h-4 rounded-sm ${getIntensityColor(value)} transition-all duration-200 hover:scale-125 cursor-pointer`}
                        title={`${day.day} ${hourIndex}:00 - ${value} transactions`}
                        style={{ animationDelay: `${(dayIndex * 24 + hourIndex) * 5}ms` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Labels */}
            <div className="flex items-center mt-6 text-sm text-muted-foreground px-12">
              <div className="flex justify-between w-full" style={{ paddingRight: "8px" }}>
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>11 PM</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="text-sm text-muted-foreground">Less</span>
              {[0, 1, 2, 3, 4, 5].map((value) => (
                <div key={value} className={`w-4 h-4 rounded-sm ${getIntensityColor(value)}`} />
              ))}
              <span className="text-sm text-muted-foreground">More</span>
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Key Insights
            </h3>
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-sm">{insight.time}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {insight.peak}
                    </Badge>
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.activity}</p>
                  </div>
                </div>
              )
            })}

            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <p className="text-xs text-blue-400 font-medium leading-relaxed">
                💡 Tip: Your highest spending occurs during lunch hours. Consider meal prepping to save money!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
