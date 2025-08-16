"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Brain,
  Zap,
  Target,
  DollarSign,
} from "lucide-react"
import { useState } from "react"

const keyInsights = [
  {
    type: "opportunity",
    icon: DollarSign,
    title: "Save $180/month",
    message: "Reduce dining out by 30% to boost your emergency fund",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    priority: "high",
    action: "View Details",
    savings: 180,
  },
  {
    type: "alert",
    icon: AlertTriangle,
    title: "Budget Alert",
    message: "85% through entertainment budget with 10 days left",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    priority: "high",
    action: "Adjust Budget",
    percentage: 85,
  },
  {
    type: "achievement",
    icon: Target,
    title: "Goal Progress",
    message: "Emergency fund ahead by 2 months - excellent work!",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    priority: "medium",
    action: "View Goals",
    progress: "+2 months",
  },
]

const aiStats = [
  { label: "Accuracy", value: "94%", color: "text-green-400", trend: "+2%" },
  { label: "Insights Used", value: "12", color: "text-blue-400", trend: "+5" },
  { label: "Money Saved", value: "$340", color: "text-purple-400", trend: "+$45" },
]

export function AIInsights() {
  const [activeInsight, setActiveInsight] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="premium-card h-full overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                AI Financial Coach
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Smart insights • Real-time analysis
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">
            <Zap className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground">Key Insights</h3>
            <div className="flex gap-1">
              {keyInsights.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeInsight ? "bg-purple-400 w-6" : "bg-white/20"
                  }`}
                  onClick={() => setActiveInsight(index)}
                />
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeInsight * 100}%)` }}
            >
              {keyInsights.map((insight, index) => {
                const Icon = insight.icon
                return (
                  <div
                    key={index}
                    className={`w-full flex-shrink-0 p-6 ${insight.bgColor} border ${insight.borderColor} backdrop-blur-sm rounded-2xl`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${insight.bgColor} border ${insight.borderColor} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className={`w-6 h-6 ${insight.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg">{insight.title}</h3>
                          {insight.priority === "high" && (
                            <Badge variant="destructive" className="text-xs px-2 py-0">
                              High
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{insight.message}</p>
                        <div className="flex items-center justify-between">
                          <Button
                            size="sm"
                            className={`${insight.bgColor} ${insight.borderColor} border hover:scale-105 transition-all duration-300`}
                          >
                            {insight.action}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                          {insight.savings && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Potential Savings</p>
                              <p className="font-bold text-green-400">${insight.savings}/mo</p>
                            </div>
                          )}
                          {insight.percentage && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Budget Used</p>
                              <p className="font-bold text-amber-400">{insight.percentage}%</p>
                            </div>
                          )}
                          {insight.progress && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Ahead of Schedule</p>
                              <p className="font-bold text-blue-400">{insight.progress}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground">AI Performance</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-muted-foreground hover:text-white"
            >
              {isExpanded ? "Less" : "More"}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {aiStats.map((stat, index) => (
              <div
                key={stat.label}
                className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <p
                    className={`text-2xl font-bold ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  <p className="text-xs text-green-400 mt-1 font-medium">{stat.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-sm">AI Learning Progress</span>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">Level 3</Badge>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: "68%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Analyzing your spending patterns and learning your preferences...
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white/20 hover:bg-white/5 justify-start gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Get Tips
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white/20 hover:bg-white/5 justify-start gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                View Trends
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2 border-t border-white/10">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>AI actively monitoring • Updated 2 min ago</span>
        </div>
      </CardContent>
    </Card>
  )
}
