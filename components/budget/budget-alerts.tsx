"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, DollarSign, Target, TrendingDown, CheckCircle, Clock, Zap } from "lucide-react"
import { sendBudgetAlert } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"

const alerts = [
  {
    id: 1,
    type: "over_budget",
    category: "Transportation",
    message: "You've exceeded your transportation budget by $80",
    severity: "high",
    budget: 300,
    spent: 380,
    exceededBy: 80,
    percentage: 126.7,
  },
  {
    id: 2,
    type: "approaching_limit",
    category: "Food & Dining",
    message: "You're approaching your food budget limit (81% used)",
    severity: "medium",
    budget: 800,
    spent: 650,
    exceededBy: 0,
    percentage: 81.3,
  },
  {
    id: 3,
    type: "over_budget",
    category: "Shopping",
    message: "Shopping budget exceeded by $120",
    severity: "high",
    budget: 400,
    spent: 520,
    exceededBy: 120,
    percentage: 130.0,
  },
]

const budgetInsights = [
  {
    title: "Budget Performance",
    value: "73%",
    description: "Average budget utilization",
    trend: "up",
    color: "text-green-600",
    bgColor: "bg-green-50",
    icon: Target,
  },
  {
    title: "Savings This Month",
    value: "$1,240",
    description: "Under budget across categories",
    trend: "up",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    icon: TrendingDown,
  },
  {
    title: "On Track Budgets",
    value: "8/12",
    description: "Budgets within limits",
    trend: "stable",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    icon: CheckCircle,
  },
]

export function BudgetAlerts() {
  const handleSendAlert = async (alert: (typeof alerts)[0]) => {
    if (alert.type === "over_budget") {
      sendBudgetAlert(alert.category, alert.exceededBy, alert.spent, alert.budget)
        .then((result) => {
          // Silent operation - no user feedback
          console.log("Budget alert sent silently:", result)
        })
        .catch((error) => {
          // Silent error handling - no user feedback
          console.error("Budget alert error:", error)
        })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {budgetInsights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <Card key={index} className="premium-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{insight.title}</p>
                    <p className={`text-2xl font-bold ${insight.color}`}>{insight.value}</p>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${insight.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${insight.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="premium-card border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Budget Alerts</CardTitle>
                <p className="text-sm text-muted-foreground">Monitor your spending limits</p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
            >
              {alerts.length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => alert.type === "over_budget" && handleSendAlert(alert)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                alert.severity === "high"
                  ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
                  : "border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20"
              } ${alert.type === "over_budget" ? "cursor-pointer" : ""}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      alert.type === "over_budget"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-yellow-100 dark:bg-yellow-900/30"
                    }`}
                  >
                    {alert.type === "over_budget" ? (
                      <DollarSign className="h-5 w-5 text-red-600 dark:text-red-400" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={alert.severity === "high" ? "destructive" : "secondary"}
                        className="text-xs font-semibold"
                      >
                        {alert.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          alert.type === "over_budget"
                            ? "border-red-300 text-red-700 dark:border-red-700 dark:text-red-300"
                            : "border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        {alert.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert.message}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget Progress</span>
                  <span className="font-medium">
                    {formatCurrency(alert.spent)} / {formatCurrency(alert.budget)}
                  </span>
                </div>
                <Progress
                  value={Math.min(alert.percentage, 100)}
                  className={`h-2 ${
                    alert.type === "over_budget"
                      ? "[&>div]:bg-red-500 bg-red-100 dark:bg-red-950"
                      : "[&>div]:bg-yellow-500 bg-yellow-100 dark:bg-yellow-950"
                  }`}
                />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">
                    {alert.exceededBy > 0
                      ? `Over by ${formatCurrency(alert.exceededBy)}`
                      : `${formatCurrency(alert.budget - alert.spent)} remaining`}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">This month</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Actions</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  Adjust Budgets
                </Button>
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  View Reports
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
