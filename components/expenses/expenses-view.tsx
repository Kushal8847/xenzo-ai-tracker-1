"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  CreditCard,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  PieChart,
  Calendar,
  Target,
  ShoppingCart,
  Coffee,
  Car,
  Home,
  Gamepad2,
  Utensils,
  ArrowRight,
  BarChart3,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import React, { useState } from "react"
import { Brain, Sparkles } from "lucide-react"
import { useAppData } from "@/hooks/use-app-data"
import { AddTransactionModal } from "@/components/dashboard/add-transaction-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ExpenseAnalyticsModal } from "./expense-analytics-modal"

// Mock expense data
const categoryBudgets = [
  { name: "Groceries", spent: 850, budget: 1000, color: "bg-green-500", icon: ShoppingCart },
  { name: "Dining Out", spent: 620, budget: 600, color: "bg-red-500", icon: Utensils },
  { name: "Transport", spent: 320, budget: 400, color: "bg-blue-500", icon: Car },
  { name: "Entertainment", spent: 450, budget: 500, color: "bg-purple-500", icon: Gamepad2 },
  { name: "Utilities", spent: 280, budget: 300, color: "bg-yellow-500", icon: Home },
  { name: "Coffee", spent: 180, budget: 200, color: "bg-orange-500", icon: Coffee },
]

function ExpenseWelcomeHeader() {
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false)
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false)

  const handleAddExpenseClick = () => {
    setIsAddTransactionModalOpen(true)
  }

  const handleModalClose = () => {
    setIsAddTransactionModalOpen(false)
  }

  const handleAnalyticsClick = () => {
    setIsAnalyticsModalOpen(true)
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl blur-3xl" />
      <Card className="premium-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-yellow-500/20 to-red-500/20 rounded-full blur-3xl transform -translate-x-24 translate-y-24" />

        <CardContent className="p-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-red-400 animate-pulse" />
                  <span className="text-caption text-muted-foreground font-medium">Expense Management</span>
                </div>
                <h1 className="text-display gradient-text">Track Every Dollar</h1>
                <p className="text-body text-muted-foreground max-w-2xl">
                  Monitor your spending patterns and stay within budget. You've saved{" "}
                  <strong className="text-green-400">{formatCurrency(180)}</strong> compared to last month.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg"
                  onClick={handleAddExpenseClick}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Expense
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white/20 hover:bg-white/5"
                  onClick={handleAnalyticsClick}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Analytics
                </Button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-orange-600 animate-float" />
                <div
                  className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500 to-red-500 opacity-70 animate-pulse-glow"
                  style={{ animationDelay: "1s" }}
                />
                <div
                  className="absolute inset-4 w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 opacity-50 animate-float"
                  style={{ animationDelay: "2s" }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={handleModalClose}
        defaultType="expense"
        hideIncomeOption={true}
      />
      <ExpenseAnalyticsModal isOpen={isAnalyticsModalOpen} onClose={() => setIsAnalyticsModalOpen(false)} />
    </div>
  )
}

function ExpenseStatsCards() {
  const { financialSummary, transactions, isLoading } = useAppData()

  if (isLoading) {
    return (
      <div className="bento-stats">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="glass-card border-white/10 overflow-hidden group">
            <CardContent className="p-6 relative">
              <div className="animate-pulse">
                <div className="w-14 h-14 bg-white/10 rounded-2xl mb-6"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-8 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Calculate expense-specific stats from real data
  const expenseTransactions = transactions.filter((t) => t.type === "expense")
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const dailyAverage = totalExpenses / 30 // Approximate daily average
  const largestExpense = Math.max(...expenseTransactions.map((t) => Math.abs(t.amount)), 0)
  const expenseCategories = new Set(expenseTransactions.map((t) => t.category_id)).size

  const expenseStats = [
    {
      title: "Total Expenses",
      value: financialSummary.monthlyExpenses,
      change: "-5.1%",
      changeType: "positive" as const,
      icon: CreditCard,
      gradient: "expense-gradient",
      description: "This month",
    },
    {
      title: "Daily Average",
      value: dailyAverage,
      change: "+2.3%",
      changeType: "negative" as const,
      icon: TrendingDown,
      gradient: "balance-gradient",
      description: "Per day spending",
    },
    {
      title: "Largest Expense",
      value: largestExpense,
      change: "Dining Out",
      changeType: "neutral" as const,
      icon: Utensils,
      gradient: "investment-gradient",
      description: "Single transaction",
    },
    {
      title: "Categories Used",
      value: expenseCategories,
      change: "+1 new",
      changeType: "neutral" as const,
      icon: PieChart,
      gradient: "aussie-gradient",
      isNumber: true,
      description: "Active categories",
    },
  ]

  return (
    <div className="bento-stats">
      {expenseStats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.title}
            className="glass-card border-white/10 overflow-hidden group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                <div className={`w-full h-full rounded-full ${stat.gradient} blur-2xl`} />
              </div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div
                    className={`text-sm font-bold px-3 py-1.5 rounded-full backdrop-blur-sm ${
                      stat.changeType === "positive"
                        ? "text-green-400 bg-green-400/10 border border-green-400/20"
                        : stat.changeType === "negative"
                          ? "text-red-400 bg-red-400/10 border border-red-400/20"
                          : "text-blue-400 bg-blue-400/10 border border-blue-400/20"
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-caption text-muted-foreground font-medium">{stat.title}</p>
                  <p className="text-headline font-bold tracking-tight">
                    {stat.isNumber ? stat.value : formatCurrency(stat.value)}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function RecentExpensesCard() {
  const { transactions, categories, isLoading } = useAppData()
  const [isViewAllExpensesModalOpen, setIsViewAllExpensesModalOpen] = useState(false)

  if (isLoading) {
    return (
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Recent Expenses</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Latest transactions</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="h-16 bg-white/10 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const recentExpenses = transactions
    .filter((t) => t.type === "expense")
    .slice(0, 6)
    .map((transaction) => {
      const category = categories.find((c) => c.id === transaction.category_id)
      return {
        id: transaction.id,
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        category: category?.name || "Other",
        date: transaction.transaction_date,
        icon: ShoppingCart,
      }
    })

  const allExpenses = transactions
    .filter((t) => t.type === "expense")
    .slice(0, 12)
    .map((transaction) => {
      const category = categories.find((c) => c.id === transaction.category_id)
      return {
        id: transaction.id,
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        category: category?.name || "Other",
        date: transaction.transaction_date,
        icon: ShoppingCart,
      }
    })

  return (
    <>
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Recent Expenses</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Latest transactions</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-3">
            {recentExpenses.map((expense, index) => {
              const Icon = expense.icon
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          {expense.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(expense.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-red-400">-{formatCurrency(expense.amount)}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-transparent border-white/20 hover:bg-white/5 group"
              onClick={() => setIsViewAllExpensesModalOpen(true)}
            >
              View All Expenses
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View All Expenses Modal */}
      <Dialog open={isViewAllExpensesModalOpen} onOpenChange={setIsViewAllExpensesModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>All Recent Expenses</DialogTitle>
            <DialogDescription>Your latest expense transactions</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
            {allExpenses.map((expense, index) => {
              const Icon = expense.icon
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-base truncate">{expense.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          {expense.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{formatDate(expense.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg text-red-400">-{formatCurrency(expense.amount)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ExpenseInsightsCard() {
  const { financialSummary, transactions } = useAppData()

  const expenseInsights = [
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Monthly Spending",
      message: `You've spent ${formatCurrency(financialSummary.monthlyExpenses)} this month.`,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    {
      type: "tip",
      icon: TrendingDown,
      title: "Expense Tracking",
      message: `You have ${transactions.filter((t) => t.type === "expense").length} expense transactions recorded.`,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      type: "trend",
      icon: TrendingUp,
      title: "Savings Opportunity",
      message: `Your savings rate is ${financialSummary.savingsRate.toFixed(1)}%. Consider reducing discretionary spending.`,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
  ]

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Expense Insights</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Smart spending analysis</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {expenseInsights.map((insight, index) => {
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

function ExpenseTrendsCard() {
  const trendData = [
    { month: "Mar", amount: 3650 },
    { month: "Apr", amount: 3420 },
    { month: "May", amount: 3580 },
    { month: "Jun", amount: 3290 },
    { month: "Jul", amount: 3450 },
    { month: "Aug", amount: 2980 },
  ]

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Expense Trends</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">6-month spending pattern</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {trendData.map((item, index) => {
            const isCurrentMonth = index === trendData.length - 1
            const previousAmount = index > 0 ? trendData[index - 1].amount : item.amount
            const change = ((item.amount - previousAmount) / previousAmount) * 100

            return (
              <div
                key={item.month}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isCurrentMonth ? "bg-blue-500/10 border border-blue-500/20" : "bg-white/5 border border-white/10"
                } hover:bg-white/10 transition-all duration-300`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg ${isCurrentMonth ? "bg-blue-500/20" : "bg-white/10"} flex items-center justify-center`}
                  >
                    <Calendar className={`w-4 h-4 ${isCurrentMonth ? "text-blue-400" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.month}</p>
                    <p className="text-xs text-muted-foreground">
                      {index > 0 && (
                        <span className={change > 0 ? "text-red-400" : "text-green-400"}>
                          {change > 0 ? "+" : ""}
                          {change.toFixed(1)}%
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm">{formatCurrency(item.amount)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function TopCategoriesCard() {
  const { transactions, categories, isLoading } = useAppData()

  if (isLoading) {
    return (
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Top Categories</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Highest spending areas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="h-12 bg-white/10 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate top expense categories from real data
  const expenseTransactions = transactions.filter((t) => t.type === "expense")
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const categoryTotals = expenseTransactions.reduce(
    (acc, transaction) => {
      const categoryId = transaction.category_id
      const category = categories.find((c) => c.id === categoryId)
      const categoryName = category?.name || "Other"

      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          amount: 0,
          icon: ShoppingCart, // Default icon
          color: "text-red-400",
        }
      }
      acc[categoryName].amount += Math.abs(transaction.amount)
      return acc
    },
    {} as Record<string, any>,
  )

  const topCategories = Object.values(categoryTotals)
    .map((cat: any) => ({
      ...cat,
      percentage: totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0,
    }))
    .sort((a: any, b: any) => b.amount - a.amount)
    .slice(0, 5)

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Top Categories</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Highest spending areas</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          {topCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <div
                key={category.name}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${category.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}% of total</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm">{formatCurrency(category.amount)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function AIExpenseAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [hasAnalyzed, setHasAnalyzed] = React.useState(false)

  const handleQuickAnalyze = () => {
    setIsAnalyzing(true)
    const timer = setTimeout(() => {
      setIsAnalyzing(false)
      setHasAnalyzed(true)
    }, 2500)
    return () => clearTimeout(timer)
  }

  const analysisData = {
    totalAnalyzed: 3240.75,
    categoriesAnalyzed: 8,
    transactionsProcessed: 47,
    savingsOpportunity: 285,
    budgetEfficiency: 87,
    spendingPattern: "Weekend Heavy",
    topInsight: "Dining expenses 15% above optimal",
    recommendation: "Reduce dining out by 2 meals/week to save $120/month",
  }

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Brain className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <CardTitle className="text-lg font-bold">AI Expense Analyzer</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {isAnalyzing
                ? "Analyzing your spending patterns..."
                : hasAnalyzed
                  ? "Smart insights from your expense data"
                  : "Intelligent expense analysis powered by AI"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {!hasAnalyzed && !isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto">
                <Brain className="w-10 h-10 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">AI-Powered Expense Analysis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                  Get intelligent insights about your spending patterns, budget optimization recommendations, and
                  personalized savings opportunities.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>Pattern Recognition</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Budget Optimization</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Savings Opportunities</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span>Smart Recommendations</span>
              </div>
            </div>

            <Button
              onClick={handleQuickAnalyze}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Quick Analyze
            </Button>
          </div>
        ) : isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
              <div
                className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-pink-500 rounded-full animate-spin"
                style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
              />
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
              <p className="text-sm text-muted-foreground">
                Processing {analysisData.transactionsProcessed} transactions...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Analysis Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-lg font-bold text-purple-400">{formatCurrency(analysisData.totalAnalyzed)}</p>
                <p className="text-xs text-muted-foreground">Analyzed</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-lg font-bold text-blue-400">{analysisData.categoriesAnalyzed}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-lg font-bold text-green-400">{analysisData.budgetEfficiency}%</p>
                <p className="text-xs text-muted-foreground">Efficiency</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-lg font-bold text-orange-400">{formatCurrency(analysisData.savingsOpportunity)}</p>
                <p className="text-xs text-muted-foreground">Potential Savings</p>
              </div>
            </div>

            {/* Key Insights */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                AI Insights
              </h4>

              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">Spending Pattern: {analysisData.spendingPattern}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{analysisData.topInsight}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">💡 Smart Recommendation</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{analysisData.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-2">
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
              >
                <Brain className="w-4 h-4 mr-2" />
                Get Detailed Analysis
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ExpensesView() {
  return (
    <div className="space-y-8 p-8">
      {/* Welcome Header */}
      <ExpenseWelcomeHeader />

      {/* Stats Overview */}
      <ExpenseStatsCards />

      {/* Main Bento Grid Layout - 3 cards per row */}
      <div className="bento-grid">
        {/* Row 1: Expense Trends + Recent Expenses */}
        <div className="bento-item-4 bento-row-2">
          <ExpenseTrendsCard />
        </div>
        <div className="bento-item-4 bento-row-2">
          <RecentExpensesCard />
        </div>

        {/* Row 2: Top Categories */}
        <div className="bento-item-4 bento-row-2">
          <TopCategoriesCard />
        </div>

        {/* Row 3: AI Analyzer - Full Width */}
        <div className="bento-item-12 bento-row-1">
          <AIExpenseAnalyzer />
        </div>
      </div>
    </div>
  )
}
