"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, ArrowUpRight, ArrowDownRight, Calendar, Activity } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAppData } from "@/hooks/use-app-data"
import { useMemo } from "react"

export function TransactionTrends() {
  const { transactions, isLoading } = useAppData()

  const trends = useMemo(() => {
    if (isLoading || transactions.length === 0) {
      return {
        monthlyComparison: null,
        weeklyAverage: 0,
        trendDirection: "neutral" as const,
        insights: [],
      }
    }

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    // Current month transactions
    const currentMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.transaction_date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    // Previous month transactions
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const prevMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.transaction_date)
      return date.getMonth() === prevMonth && date.getFullYear() === prevYear
    })

    const currentTotal = currentMonthTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const prevTotal = prevMonthTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const currentIncome = currentMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const currentExpenses = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const prevIncome = prevMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const prevExpenses = prevMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    // Calculate percentage changes
    const totalChange = prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : 0
    const incomeChange = prevIncome > 0 ? ((currentIncome - prevIncome) / prevIncome) * 100 : 0
    const expenseChange = prevExpenses > 0 ? ((currentExpenses - prevExpenses) / prevExpenses) * 100 : 0

    // Weekly average
    const weeklyAverage = currentTotal / Math.max(1, Math.ceil(new Date().getDate() / 7))

    // Determine trend direction
    let trendDirection: "up" | "down" | "neutral" = "neutral"
    if (Math.abs(totalChange) > 5) {
      trendDirection = totalChange > 0 ? "up" : "down"
    }

    // Generate insights
    const insights = []

    if (currentMonthTransactions.length > prevMonthTransactions.length) {
      insights.push({
        title: "Increased Activity",
        description: `${currentMonthTransactions.length - prevMonthTransactions.length} more transactions this month`,
        type: "info",
        icon: Activity,
      })
    }

    if (Math.abs(incomeChange) > 10) {
      insights.push({
        title: incomeChange > 0 ? "Income Growth" : "Income Decline",
        description: `Income ${incomeChange > 0 ? "increased" : "decreased"} by ${Math.abs(incomeChange).toFixed(1)}%`,
        type: incomeChange > 0 ? "positive" : "negative",
        icon: incomeChange > 0 ? TrendingUp : TrendingDown,
      })
    }

    if (Math.abs(expenseChange) > 10) {
      insights.push({
        title: expenseChange > 0 ? "Spending Up" : "Spending Down",
        description: `Expenses ${expenseChange > 0 ? "increased" : "decreased"} by ${Math.abs(expenseChange).toFixed(1)}%`,
        type: expenseChange > 0 ? "negative" : "positive",
        icon: expenseChange > 0 ? TrendingUp : TrendingDown,
      })
    }

    return {
      monthlyComparison: {
        current: currentTotal,
        previous: prevTotal,
        change: totalChange,
        currentIncome,
        currentExpenses,
        prevIncome,
        prevExpenses,
        incomeChange,
        expenseChange,
      },
      weeklyAverage,
      trendDirection,
      insights: insights.slice(0, 3),
    }
  }, [transactions, isLoading])

  if (isLoading) {
    return (
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Transaction Trends</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Analyzing patterns...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-white/5 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Transaction Trends</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Monthly comparison & patterns</CardDescription>
            </div>
          </div>
          <Badge
            className={`${
              trends.trendDirection === "up"
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : trends.trendDirection === "down"
                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                  : "bg-blue-500/20 text-blue-400 border-blue-500/30"
            }`}
          >
            {trends.trendDirection === "up" ? (
              <ArrowUpRight className="w-3 h-3 mr-1" />
            ) : trends.trendDirection === "down" ? (
              <ArrowDownRight className="w-3 h-3 mr-1" />
            ) : (
              <Activity className="w-3 h-3 mr-1" />
            )}
            {trends.trendDirection === "up"
              ? "Trending Up"
              : trends.trendDirection === "down"
                ? "Trending Down"
                : "Stable"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {trends.monthlyComparison ? (
          <div className="space-y-4">
            {/* Monthly Comparison */}
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">This Month vs Last Month</span>
                <span
                  className={`text-sm font-bold ${
                    trends.monthlyComparison.change > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {trends.monthlyComparison.change > 0 ? "+" : ""}
                  {trends.monthlyComparison.change.toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Current: </span>
                  <span className="text-white font-medium">{formatCurrency(trends.monthlyComparison.current)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Previous: </span>
                  <span className="text-white font-medium">{formatCurrency(trends.monthlyComparison.previous)}</span>
                </div>
              </div>
            </div>

            {/* Income vs Expenses Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-medium text-green-400">Income</span>
                </div>
                <p className="text-sm font-bold text-white">{formatCurrency(trends.monthlyComparison.currentIncome)}</p>
                {trends.monthlyComparison.incomeChange !== 0 && (
                  <p
                    className={`text-xs ${
                      trends.monthlyComparison.incomeChange > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {trends.monthlyComparison.incomeChange > 0 ? "+" : ""}
                    {trends.monthlyComparison.incomeChange.toFixed(1)}%
                  </p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-medium text-red-400">Expenses</span>
                </div>
                <p className="text-sm font-bold text-white">
                  {formatCurrency(trends.monthlyComparison.currentExpenses)}
                </p>
                {trends.monthlyComparison.expenseChange !== 0 && (
                  <p
                    className={`text-xs ${
                      trends.monthlyComparison.expenseChange > 0 ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {trends.monthlyComparison.expenseChange > 0 ? "+" : ""}
                    {trends.monthlyComparison.expenseChange.toFixed(1)}%
                  </p>
                )}
              </div>
            </div>

            {/* Weekly Average */}
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Weekly Average</span>
              </div>
              <p className="text-lg font-bold text-blue-400">{formatCurrency(trends.weeklyAverage)}</p>
              <p className="text-xs text-muted-foreground">Based on current month activity</p>
            </div>

            {/* Insights */}
            {trends.insights.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Key Insights</h4>
                {trends.insights.map((insight, index) => {
                  const Icon = insight.icon
                  return (
                    <div
                      key={index}
                      className={`p-2 rounded-lg border ${
                        insight.type === "positive"
                          ? "bg-green-500/10 border-green-500/20"
                          : insight.type === "negative"
                            ? "bg-red-500/10 border-red-500/20"
                            : "bg-blue-500/10 border-blue-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`w-4 h-4 ${
                            insight.type === "positive"
                              ? "text-green-400"
                              : insight.type === "negative"
                                ? "text-red-400"
                                : "text-blue-400"
                          }`}
                        />
                        <div>
                          <p className="text-xs font-medium text-white">{insight.title}</p>
                          <p className="text-xs text-muted-foreground">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold mb-1">No trend data yet</h3>
            <p className="text-xs text-muted-foreground">Add more transactions to see trends and patterns.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
