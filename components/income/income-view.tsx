"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Calendar, Target, Briefcase, ArrowRight, BarChart3 } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Brain, Sparkles } from "lucide-react"
import { IncomeWelcomeHeader } from "./income-welcome-header"
import { useAppData } from "@/hooks/use-app-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function IncomeStatsCards() {
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

  // Calculate income-specific stats from real data
  const incomeTransactions = transactions.filter((t) => t.type === "income")
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const dailyAverage = totalIncome / 30 // Approximate daily average
  const largestIncome = Math.max(...incomeTransactions.map((t) => Math.abs(t.amount)), 0)
  const incomeSources = new Set(incomeTransactions.map((t) => t.category_id)).size

  const incomeStats = [
    {
      title: "Total Income",
      value: financialSummary.monthlyIncome,
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      gradient: "income-gradient",
      description: "This month",
    },
    {
      title: "Daily Average",
      value: dailyAverage,
      change: "+8.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
      gradient: "balance-gradient",
      description: "Per day earnings",
    },
    {
      title: "Largest Income",
      value: largestIncome,
      change: "Salary",
      changeType: "neutral" as const,
      icon: Briefcase,
      gradient: "investment-gradient",
      description: "Single transaction",
    },
    {
      title: "Income Sources",
      value: incomeSources,
      change: "+1 new",
      changeType: "neutral" as const,
      icon: Target,
      gradient: "aussie-gradient",
      isNumber: true,
      description: "Active sources",
    },
  ]

  return (
    <div className="bento-stats">
      {incomeStats.map((stat, index) => {
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

function IncomeCategoriesCard() {
  const { transactions, categories, isLoading } = useAppData()

  if (isLoading) {
    return (
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Income Categories</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Income by source</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="h-12 bg-white/10 rounded-xl"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate income categories from real data
  const incomeTransactions = transactions.filter((t) => t.type === "income")
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const categoryTotals = incomeTransactions.reduce(
    (acc, transaction) => {
      const categoryId = transaction.category_id
      const category = categories.find((c) => c.id === categoryId)
      const categoryName = category?.name || "Other"

      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          amount: 0,
          icon: Briefcase, // Default icon
          color: "bg-green-500",
        }
      }
      acc[categoryName].amount += Math.abs(transaction.amount)
      return acc
    },
    {} as Record<string, any>,
  )

  const incomeCategories = Object.values(categoryTotals)
    .map((cat: any) => ({
      ...cat,
      percentage: totalIncome > 0 ? (cat.amount / totalIncome) * 100 : 0,
    }))
    .sort((a: any, b: any) => b.amount - a.amount)
    .slice(0, 5)

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Income Categories</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Income by source</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {incomeCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <div
                key={category.name}
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${category.color}/20 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 text-white`} />
                    </div>
                    <span className="font-semibold text-sm">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-green-400">{formatCurrency(category.amount)}</p>
                    <p className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}% of total</p>
                  </div>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function RecentIncomeCard() {
  const { transactions, categories, isLoading } = useAppData()
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false)

  if (isLoading) {
    return (
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Recent Income</CardTitle>
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

  const recentIncome = transactions
    .filter((t) => t.type === "income")
    .slice(0, 6)
    .map((transaction) => {
      const category = categories.find((c) => c.id === transaction.category_id)
      return {
        id: transaction.id,
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        category: category?.name || "Other",
        date: transaction.transaction_date,
        icon: Briefcase,
      }
    })

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Recent Income</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Latest transactions</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          {recentIncome.map((income, index) => {
            const Icon = income.icon
            return (
              <div
                key={income.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{income.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {income.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(income.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-green-400">+{formatCurrency(income.amount)}</span>
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
            onClick={() => setIsViewAllModalOpen(true)}
          >
            View All Income
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        {/* View All Income Modal */}
        <Dialog open={isViewAllModalOpen} onOpenChange={setIsViewAllModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">All Income Transactions</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[60vh] pr-2">
              <div className="space-y-3">
                {transactions
                  .filter((t) => t.type === "income")
                  .map((transaction, index) => {
                    const category = categories.find((c) => c.id === transaction.category_id)
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-base truncate">{transaction.description}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <Badge variant="outline" className="text-xs px-2 py-1">
                                {category?.name || "Other"}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(transaction.transaction_date)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lg text-green-400">
                            +{formatCurrency(Math.abs(transaction.amount))}
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
              {transactions.filter((t) => t.type === "income").length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No income transactions found.</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

function IncomeInsightsCard() {
  const { financialSummary, transactions } = useAppData()

  const incomeInsights = [
    {
      type: "success",
      icon: TrendingUp,
      title: "Great Progress",
      message: `Your income is ${formatCurrency(financialSummary.monthlyIncome)} this month!`,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      type: "tip",
      icon: Target,
      title: "Income Growth",
      message: `You have ${transactions.filter((t) => t.type === "income").length} income transactions recorded.`,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      type: "trend",
      icon: Sparkles,
      title: "Savings Rate",
      message: `Your current savings rate is ${financialSummary.savingsRate.toFixed(1)}% of total income.`,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ]

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Income Insights</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Smart income analysis</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {incomeInsights.map((insight, index) => {
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

export function IncomeView() {
  return (
    <div className="space-y-8 p-8">
      {/* Welcome Header */}
      <IncomeWelcomeHeader />

      {/* Stats Overview */}
      <IncomeStatsCards />

      {/* Main Bento Grid Layout - 3 cards per row */}
      <div className="bento-grid">
        {/* Row 1: Income Categories + Recent Income + Income Insights */}
        <div className="bento-item-4 bento-row-2">
          <IncomeCategoriesCard />
        </div>
        <div className="bento-item-4 bento-row-2">
          <RecentIncomeCard />
        </div>
        <div className="bento-item-4 bento-row-2">
          <IncomeInsightsCard />
        </div>
      </div>
    </div>
  )
}
