"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, Calendar, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAppData } from "@/hooks/use-app-data"
import { useMemo } from "react"

export function TransactionInsights() {
  const { transactions, categories, isLoading } = useAppData()

  const insights = useMemo(() => {
    if (isLoading || transactions.length === 0) {
      return {
        insights: [
          {
            type: "info",
            title: "Start Your Journey",
            description: "Add your first transaction to get personalized insights",
            icon: Brain,
            color: "text-blue-400",
            bgColor: "bg-blue-500/20",
          },
        ],
        spendingScore: 0,
        savingsRate: 0,
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

    const savingsRate = currentIncome > 0 ? ((currentIncome - currentExpenses) / currentIncome) * 100 : 0

    // Calculate top spending category
    const categorySpending = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          const category = categories.find((c) => c.id === t.category_id)
          const categoryName = category?.name || "Unknown"
          acc[categoryName] = (acc[categoryName] || 0) + Math.abs(t.amount)
          return acc
        },
        {} as Record<string, number>,
      )

    const topCategory = Object.entries(categorySpending).reduce(
      (max, [name, amount]) => (amount > max.amount ? { name, amount } : max),
      { name: "", amount: 0 },
    )

    const insights = []

    // Spending vs Income Analysis
    if (currentIncome > 0) {
      if (savingsRate > 20) {
        insights.push({
          type: "success",
          title: "Excellent Savings Rate",
          description: `You're saving ${savingsRate.toFixed(1)}% of your income this month`,
          icon: CheckCircle,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
        })
      } else if (savingsRate > 0) {
        insights.push({
          type: "warning",
          title: "Moderate Savings",
          description: `Saving ${savingsRate.toFixed(1)}% - consider increasing to 20%+`,
          icon: Target,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
        })
      } else {
        insights.push({
          type: "danger",
          title: "Spending Alert",
          description: "You're spending more than you earn this month",
          icon: AlertTriangle,
          color: "text-red-400",
          bgColor: "bg-red-500/20",
        })
      }
    }

    // Month-over-month comparison
    if (prevExpenses > 0) {
      const expenseChange = ((currentExpenses - prevExpenses) / prevExpenses) * 100
      if (expenseChange > 10) {
        insights.push({
          type: "warning",
          title: "Spending Increased",
          description: `Expenses up ${expenseChange.toFixed(1)}% from last month`,
          icon: TrendingUp,
          color: "text-orange-400",
          bgColor: "bg-orange-500/20",
        })
      } else if (expenseChange < -10) {
        insights.push({
          type: "success",
          title: "Spending Reduced",
          description: `Great job! Expenses down ${Math.abs(expenseChange).toFixed(1)}%`,
          icon: TrendingDown,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
        })
      }
    }

    // Top category insight
    if (topCategory.name && topCategory.amount > currentIncome * 0.3) {
      insights.push({
        type: "info",
        title: "Top Spending Category",
        description: `${topCategory.name}: ${formatCurrency(topCategory.amount)} (${((topCategory.amount / currentIncome) * 100).toFixed(1)}% of income)`,
        icon: DollarSign,
        color: "text-purple-400",
        bgColor: "bg-purple-500/20",
      })
    }

    // Transaction frequency
    const avgTransactionsPerWeek = transactions.length / Math.max(1, Math.ceil(transactions.length / 30) * 4)
    if (avgTransactionsPerWeek < 3) {
      insights.push({
        type: "info",
        title: "Low Activity",
        description: "Consider tracking more transactions for better insights",
        icon: Calendar,
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
      })
    }

    // If no specific insights, add a general one
    if (insights.length === 0) {
      insights.push({
        type: "info",
        title: "Financial Health Check",
        description: "Your spending patterns look stable this month",
        icon: CheckCircle,
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
      })
    }

    // Calculate spending score (0-100)
    let spendingScore = 50 // Base score
    if (savingsRate > 20) spendingScore += 30
    else if (savingsRate > 10) spendingScore += 20
    else if (savingsRate > 0) spendingScore += 10
    else spendingScore -= 20

    if (currentExpenses < prevExpenses) spendingScore += 10
    if (transactions.length > 10) spendingScore += 10

    spendingScore = Math.max(0, Math.min(100, spendingScore))

    return {
      insights: insights.slice(0, 3), // Show max 3 insights
      spendingScore,
      savingsRate,
    }
  }, [transactions, categories, isLoading])

  if (isLoading) {
    return (
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">AI Insights</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Analyzing your data...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-white/5 rounded-lg"></div>
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">AI Insights</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Smart analysis of your spending
              </CardDescription>
            </div>
          </div>
          <Badge
            className={`${
              insights.spendingScore >= 70
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : insights.spendingScore >= 40
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
            }`}
          >
            {insights.spendingScore}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {/* Spending Score */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Financial Health Score</span>
              <span className="text-sm text-muted-foreground">{insights.spendingScore}/100</span>
            </div>
            <Progress
              value={insights.spendingScore}
              className="h-2"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {insights.spendingScore >= 70
                ? "Excellent financial habits!"
                : insights.spendingScore >= 40
                  ? "Good progress, room for improvement"
                  : "Consider reviewing your spending patterns"}
            </p>
          </div>

          {/* Insights */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {insights.insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${insight.bgColor} border border-white/10 transition-all duration-200 hover:scale-105`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${insight.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm ${insight.color} mb-1`}>{insight.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Savings Rate Display */}
          {insights.savingsRate !== 0 && (
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Savings Rate</span>
                <span className={`text-sm font-bold ${insights.savingsRate > 0 ? "text-green-400" : "text-red-400"}`}>
                  {insights.savingsRate.toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
