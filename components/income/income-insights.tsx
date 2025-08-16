"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Target, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react'

interface IncomeInsightsProps {
  period: string
}

const insights = [
  {
    type: "success",
    icon: CheckCircle,
    title: "Great Performance",
    message: "Your freelance income increased by 15.8% this month!",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    type: "tip",
    icon: Lightbulb,
    title: "Optimization Tip",
    message: "Consider increasing your freelance rates based on recent performance.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    type: "warning",
    icon: AlertCircle,
    title: "Goal Alert",
    message: "Side business income is 60% below target. Focus on growth strategies.",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  {
    type: "trend",
    icon: TrendingUp,
    title: "Income Pattern",
    message: "Your highest earning days are typically mid-month. Plan accordingly.",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
]

export function IncomeInsights({ period }: IncomeInsightsProps) {
  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Income Insights</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Smart earning analysis</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <div
                key={index}
                className={`p-4 rounded-xl ${insight.bgColor} border ${insight.borderColor} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg ${insight.bgColor} border ${insight.borderColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-4 h-4 ${insight.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm mb-1">{insight.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.message}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
