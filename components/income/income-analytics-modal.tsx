"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Briefcase,
  CreditCard,
  Wallet,
  X,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAppData } from "@/hooks/use-app-data"

interface IncomeAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function IncomeAnalyticsModal({ isOpen, onClose }: IncomeAnalyticsModalProps) {
  const { transactions, categories, accounts, isLoading } = useAppData()
  const [selectedPeriod, setSelectedPeriod] = useState("30")

  // Calculate income analytics from real data
  const incomeAnalytics = useMemo(() => {
    const incomeTransactions = transactions.filter((t) => t.type === "income")
    const now = new Date()
    const periodDays = Number.parseInt(selectedPeriod)
    const periodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000)

    const periodTransactions = incomeTransactions.filter((t) => new Date(t.transaction_date) >= periodStart)

    const totalIncome = periodTransactions.reduce((sum, t) => sum + t.amount, 0)
    const avgDaily = totalIncome / periodDays
    const transactionCount = periodTransactions.length

    // Income by category
    const categoryBreakdown = periodTransactions.reduce(
      (acc, t) => {
        const category = categories.find((c) => c.id === t.category_id)
        const categoryName = category?.name || "Other"

        if (!acc[categoryName]) {
          acc[categoryName] = { amount: 0, count: 0, percentage: 0 }
        }
        acc[categoryName].amount += t.amount
        acc[categoryName].count += 1
        return acc
      },
      {} as Record<string, { amount: number; count: number; percentage: number }>,
    )

    // Calculate percentages
    Object.keys(categoryBreakdown).forEach((key) => {
      categoryBreakdown[key].percentage = totalIncome > 0 ? (categoryBreakdown[key].amount / totalIncome) * 100 : 0
    })

    const topCategories = Object.entries(categoryBreakdown)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    // Income by account
    const accountBreakdown = periodTransactions.reduce(
      (acc, t) => {
        const account = accounts.find((a) => a.id === t.account_id)
        const accountName = account?.name || "Unknown Account"

        if (!acc[accountName]) {
          acc[accountName] = { amount: 0, count: 0 }
        }
        acc[accountName].amount += t.amount
        acc[accountName].count += 1
        return acc
      },
      {} as Record<string, { amount: number; count: number }>,
    )

    // Recent income trends (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayTransactions = incomeTransactions.filter(
        (t) => new Date(t.transaction_date).toDateString() === date.toDateString(),
      )
      const dayTotal = dayTransactions.reduce((sum, t) => sum + t.amount, 0)

      return {
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        amount: dayTotal,
        count: dayTransactions.length,
      }
    }).reverse()

    // Growth calculation (compare with previous period)
    const previousPeriodStart = new Date(periodStart.getTime() - periodDays * 24 * 60 * 60 * 1000)
    const previousPeriodTransactions = incomeTransactions.filter(
      (t) => new Date(t.transaction_date) >= previousPeriodStart && new Date(t.transaction_date) < periodStart,
    )
    const previousTotal = previousPeriodTransactions.reduce((sum, t) => sum + t.amount, 0)
    const growthRate = previousTotal > 0 ? ((totalIncome - previousTotal) / previousTotal) * 100 : 0

    return {
      totalIncome,
      avgDaily,
      transactionCount,
      topCategories,
      accountBreakdown: Object.entries(accountBreakdown).map(([name, data]) => ({ name, ...data })),
      last7Days,
      growthRate,
      periodDays,
    }
  }, [transactions, categories, accounts, selectedPeriod])

  const periodOptions = [
    { value: "7", label: "7 Days" },
    { value: "30", label: "30 Days" },
    { value: "90", label: "90 Days" },
    { value: "365", label: "1 Year" },
  ]

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[1200px] h-[800px] max-w-none max-h-none overflow-hidden">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[1200px] h-[800px] max-w-none max-h-none overflow-hidden p-0">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10" />
          <DialogHeader className="p-6 pb-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold gradient-text">Income Analytics</DialogTitle>
                  <p className="text-sm text-muted-foreground">Comprehensive analysis of your income streams</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10 rounded-full">
                
              </Button>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm font-medium text-muted-foreground">Period:</span>
              <div className="flex gap-1">
                {periodOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedPeriod === option.value ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedPeriod(option.value)}
                    className={
                      selectedPeriod === option.value ? "bg-green-500/20 text-green-400 border-green-500/30" : ""
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="flex-1 h-[650px] overflow-y-auto p-6 pt-0">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="trends"
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
              >
                Trends
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
              >
                Insights
              </TabsTrigger>
            </TabsList>

            <div className="h-[580px] overflow-y-auto">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="premium-card border-green-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                          <p className="text-2xl font-bold text-green-400">
                            {formatCurrency(incomeAnalytics.totalIncome)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Last {incomeAnalytics.periodDays} days</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-green-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="premium-card border-blue-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Daily Average</p>
                          <p className="text-2xl font-bold text-blue-400">{formatCurrency(incomeAnalytics.avgDaily)}</p>
                          <p className="text-xs text-muted-foreground mt-1">Per day</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="premium-card border-purple-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                          <p className="text-2xl font-bold text-purple-400">{incomeAnalytics.transactionCount}</p>
                          <p className="text-xs text-muted-foreground mt-1">Income entries</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <Activity className="w-6 h-6 text-purple-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="premium-card border-orange-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-2xl font-bold ${incomeAnalytics.growthRate >= 0 ? "text-green-400" : "text-red-400"}`}
                            >
                              {incomeAnalytics.growthRate >= 0 ? "+" : ""}
                              {incomeAnalytics.growthRate.toFixed(1)}%
                            </p>
                            {incomeAnalytics.growthRate >= 0 ? (
                              <ArrowUpRight className="w-4 h-4 text-green-400" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">vs previous period</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-orange-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Account Breakdown */}
                <Card className="premium-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-green-400" />
                      Income by Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {incomeAnalytics.accountBreakdown.map((account, index) => (
                        <div
                          key={account.name}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                              <CreditCard className="w-4 h-4 text-green-400" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{account.name}</p>
                              <p className="text-xs text-muted-foreground">{account.count} transactions</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-400">{formatCurrency(account.amount)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Trends Tab */}
              <TabsContent value="trends" className="space-y-6 mt-0">
                <Card className="premium-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-400" />
                      7-Day Income Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {incomeAnalytics.last7Days.map((day, index) => {
                        const maxAmount = Math.max(...incomeAnalytics.last7Days.map((d) => d.amount))
                        const percentage = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0

                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                  <Calendar className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{day.date}</p>
                                  <p className="text-xs text-muted-foreground">{day.count} transactions</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-blue-400">{formatCurrency(day.amount)}</p>
                              </div>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories" className="space-y-6 mt-0">
                <Card className="premium-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-purple-400" />
                      Top Income Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {incomeAnalytics.topCategories.map((category, index) => (
                        <div key={category.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Briefcase className="w-4 h-4 text-purple-400" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{category.name}</p>
                                <p className="text-xs text-muted-foreground">{category.count} transactions</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-purple-400">{formatCurrency(category.amount)}</p>
                              <Badge variant="secondary" className="text-xs">
                                {category.percentage.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                          <Progress value={category.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="premium-card border-green-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-400">
                        <Zap className="w-5 h-5" />
                        Performance Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm text-green-400">Income Growth</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Your income has {incomeAnalytics.growthRate >= 0 ? "increased" : "decreased"} by{" "}
                              {Math.abs(incomeAnalytics.growthRate).toFixed(1)}% compared to the previous period.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm text-blue-400">Consistency</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              You're averaging {formatCurrency(incomeAnalytics.avgDaily)} per day with{" "}
                              {incomeAnalytics.transactionCount} income transactions.
                            </p>
                          </div>
                        </div>
                      </div>

                      {incomeAnalytics.topCategories.length > 0 && (
                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                          <div className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-purple-400 mt-0.5" />
                            <div>
                              <p className="font-semibold text-sm text-purple-400">Top Income Source</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {incomeAnalytics.topCategories[0].name} is your largest income source at{" "}
                                {formatCurrency(incomeAnalytics.topCategories[0].amount)} (
                                {incomeAnalytics.topCategories[0].percentage.toFixed(1)}%).
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="premium-card border-orange-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-400">
                        <Target className="w-5 h-5" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                        <div className="flex items-start gap-3">
                          <Zap className="w-5 h-5 text-orange-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm text-orange-400">Diversification</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Consider diversifying your income streams to reduce dependency on your top source.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm text-green-400">Growth Opportunity</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {incomeAnalytics.growthRate >= 0
                                ? "Great job on the positive growth! Keep up the momentum."
                                : "Focus on identifying new income opportunities to reverse the decline."}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm text-blue-400">Tracking</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Regular income tracking helps identify patterns and optimize your earning potential.
                            </p>
                          </div>
                        </div>
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
