"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingDown,
  TrendingUp,
  Calendar,
  PieChart,
  BarChart3,
  Target,
  AlertTriangle,
  Lightbulb,
  CreditCard,
  ShoppingCart,
  X,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useAppData } from "@/hooks/use-app-data"

interface ExpenseAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExpenseAnalyticsModal({ isOpen, onClose }: ExpenseAnalyticsModalProps) {
  const { transactions, categories, accounts } = useAppData()
  const [selectedPeriod, setSelectedPeriod] = useState("30")

  const expenseAnalytics = useMemo(() => {
    const now = new Date()
    const periodDays = Number.parseInt(selectedPeriod)
    const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000)

    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense" && new Date(t.transaction_date) >= startDate,
    )

    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const transactionCount = expenseTransactions.length
    const averageExpense = transactionCount > 0 ? totalExpenses / transactionCount : 0
    const dailyAverage = totalExpenses / periodDays

    // Category breakdown
    const categoryBreakdown = expenseTransactions.reduce(
      (acc, transaction) => {
        const category = categories.find((c) => c.id === transaction.category_id)
        const categoryName = category?.name || "Other"

        if (!acc[categoryName]) {
          acc[categoryName] = { amount: 0, count: 0, percentage: 0 }
        }
        acc[categoryName].amount += Math.abs(transaction.amount)
        acc[categoryName].count += 1
        return acc
      },
      {} as Record<string, { amount: number; count: number; percentage: number }>,
    )

    // Calculate percentages
    Object.keys(categoryBreakdown).forEach((category) => {
      categoryBreakdown[category].percentage =
        totalExpenses > 0 ? (categoryBreakdown[category].amount / totalExpenses) * 100 : 0
    })

    // Account breakdown
    const accountBreakdown = expenseTransactions.reduce(
      (acc, transaction) => {
        const account = accounts.find((a) => a.id === transaction.account_id)
        const accountName = account?.name || "Unknown Account"

        if (!acc[accountName]) {
          acc[accountName] = { amount: 0, count: 0 }
        }
        acc[accountName].amount += Math.abs(transaction.amount)
        acc[accountName].count += 1
        return acc
      },
      {} as Record<string, { amount: number; count: number }>,
    )

    // 7-day trend
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayExpenses = expenseTransactions
        .filter((t) => new Date(t.transaction_date).toDateString() === date.toDateString())
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)

      return {
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        amount: dayExpenses,
      }
    }).reverse()

    // Growth calculation (compare with previous period)
    const previousPeriodStart = new Date(startDate.getTime() - periodDays * 24 * 60 * 60 * 1000)
    const previousExpenses = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          new Date(t.transaction_date) >= previousPeriodStart &&
          new Date(t.transaction_date) < startDate,
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const growthRate = previousExpenses > 0 ? ((totalExpenses - previousExpenses) / previousExpenses) * 100 : 0

    return {
      totalExpenses,
      transactionCount,
      averageExpense,
      dailyAverage,
      growthRate,
      categoryBreakdown,
      accountBreakdown,
      last7Days,
      topExpenses: expenseTransactions
        .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
        .slice(0, 5)
        .map((t) => ({
          ...t,
          categoryName: categories.find((c) => c.id === t.category_id)?.name || "Other",
        })),
    }
  }, [transactions, categories, accounts, selectedPeriod])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[1200px] h-[800px] max-w-[95vw] max-h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Expense Analytics</DialogTitle>
                <p className="text-sm text-muted-foreground">Detailed insights into your spending patterns</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-b border-white/10 px-6 py-3 shadow-lg">
              <TabsList className="grid w-full grid-cols-4 bg-white/5 h-12">
                <TabsTrigger value="overview" className="text-sm font-medium">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="trends" className="text-sm font-medium">
                  Trends
                </TabsTrigger>
                <TabsTrigger value="categories" className="text-sm font-medium">
                  Categories
                </TabsTrigger>
                <TabsTrigger value="insights" className="text-sm font-medium">
                  Insights
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-auto px-6 pb-6 pt-20">
              <TabsContent value="overview" className="mt-6 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="glass-card border-red-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Expenses</p>
                          <p className="text-xl font-bold">{formatCurrency(expenseAnalytics.totalExpenses)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-orange-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Transactions</p>
                          <p className="text-xl font-bold">{expenseAnalytics.transactionCount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-yellow-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                          <Target className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Daily Average</p>
                          <p className="text-xl font-bold">{formatCurrency(expenseAnalytics.dailyAverage)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-purple-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          {expenseAnalytics.growthRate > 0 ? (
                            <TrendingUp className="w-5 h-5 text-red-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Growth Rate</p>
                          <p
                            className={`text-xl font-bold ${expenseAnalytics.growthRate > 0 ? "text-red-400" : "text-green-400"}`}
                          >
                            {expenseAnalytics.growthRate > 0 ? "+" : ""}
                            {expenseAnalytics.growthRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Expenses */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-red-400" />
                      Top Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {expenseAnalytics.topExpenses.map((expense, index) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                              <span className="text-sm font-bold text-red-400">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{expense.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {expense.categoryName}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(expense.transaction_date)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="font-bold text-red-400">{formatCurrency(Math.abs(expense.amount))}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="mt-6 space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      7-Day Spending Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {expenseAnalytics.last7Days.map((day, index) => {
                        const maxAmount = Math.max(...expenseAnalytics.last7Days.map((d) => d.amount))
                        const percentage = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0

                        return (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-12 text-sm font-medium">{day.date}</div>
                            <div className="flex-1">
                              <div className="w-full bg-white/10 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                            <div className="w-20 text-right text-sm font-medium">{formatCurrency(day.amount)}</div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                      Account Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(expenseAnalytics.accountBreakdown)
                        .sort(([, a], [, b]) => b.amount - a.amount)
                        .map(([accountName, data]) => (
                          <div
                            key={accountName}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-purple-400" />
                              </div>
                              <div>
                                <p className="font-medium">{accountName}</p>
                                <p className="text-xs text-muted-foreground">{data.count} transactions</p>
                              </div>
                            </div>
                            <span className="font-bold">{formatCurrency(data.amount)}</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="mt-6 space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-green-400" />
                      Category Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(expenseAnalytics.categoryBreakdown)
                        .sort(([, a], [, b]) => b.amount - a.amount)
                        .map(([categoryName, data]) => (
                          <div
                            key={categoryName}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <ShoppingCart className="w-4 h-4 text-green-400" />
                              </div>
                              <div>
                                <p className="font-medium">{categoryName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">{data.count} transactions</span>
                                  <Badge variant="outline" className="text-xs">
                                    {data.percentage.toFixed(1)}%
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <span className="font-bold">{formatCurrency(data.amount)}</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass-card border-yellow-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-400">
                        <Lightbulb className="w-5 h-5" />
                        Smart Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <p className="text-sm font-medium mb-1">Spending Pattern</p>
                        <p className="text-xs text-muted-foreground">
                          Your average expense is {formatCurrency(expenseAnalytics.averageExpense)} per transaction.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-sm font-medium mb-1">Daily Spending</p>
                        <p className="text-xs text-muted-foreground">
                          You spend an average of {formatCurrency(expenseAnalytics.dailyAverage)} per day.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <p className="text-sm font-medium mb-1">Transaction Frequency</p>
                        <p className="text-xs text-muted-foreground">
                          You make {expenseAnalytics.transactionCount} expense transactions in the selected period.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-red-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {expenseAnalytics.growthRate > 10 && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <p className="text-sm font-medium mb-1">High Growth Alert</p>
                          <p className="text-xs text-muted-foreground">
                            Your expenses increased by {expenseAnalytics.growthRate.toFixed(1)}%. Consider reviewing
                            your spending habits.
                          </p>
                        </div>
                      )}
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <p className="text-sm font-medium mb-1">Budget Optimization</p>
                        <p className="text-xs text-muted-foreground">
                          Track your largest expense categories to identify potential savings opportunities.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-sm font-medium mb-1">Spending Consistency</p>
                        <p className="text-xs text-muted-foreground">
                          Monitor your daily spending patterns to maintain better financial control.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
