"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, CreditCard, PiggyBank, Target, ArrowUp, ArrowDown } from "lucide-react"
import { useAppData } from "@/hooks/use-app-data"
import { formatCurrency } from "@/lib/utils"
import { useMemo } from "react"

export function ReportsStatsCards() {
  const { transactions, financialSummary, isLoading } = useAppData()

  const calculatedStats = useMemo(() => {
    if (isLoading || !transactions) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        savingsRate: 0,
        incomeChange: 0,
        expenseChange: 0,
        savingsChange: 0,
        savingsRateChange: 0,
      }
    }

    // Calculate total income and expenses from all transactions
    const totalIncome = transactions
      .filter((t) => t.type === "income" && t.status === "completed")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const totalExpenses = transactions
      .filter((t) => t.type === "expense" && t.status === "completed")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const netSavings = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0

    // Calculate month-over-month changes
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)

    const getMonthlyAmount = (start: Date, end: Date, type: "income" | "expense") => {
      return transactions
        .filter((t) => {
          const transactionDate = new Date(t.transaction_date)
          return transactionDate >= start && transactionDate < end && t.type === type && t.status === "completed"
        })
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    }

    const thisMonthIncome = getMonthlyAmount(thisMonth, now, "income")
    const lastMonthIncome = getMonthlyAmount(lastMonth, thisMonth, "income")
    const thisMonthExpenses = getMonthlyAmount(thisMonth, now, "expense")
    const lastMonthExpenses = getMonthlyAmount(lastMonth, thisMonth, "expense")

    const incomeChange = lastMonthIncome > 0 ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0
    const expenseChange =
      lastMonthExpenses > 0 ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0

    const thisMonthSavings = thisMonthIncome - thisMonthExpenses
    const lastMonthSavings = lastMonthIncome - lastMonthExpenses
    const savingsChange =
      lastMonthSavings !== 0 ? ((thisMonthSavings - lastMonthSavings) / Math.abs(lastMonthSavings)) * 100 : 0

    const thisMonthSavingsRate = thisMonthIncome > 0 ? (thisMonthSavings / thisMonthIncome) * 100 : 0
    const lastMonthSavingsRate = lastMonthIncome > 0 ? (lastMonthSavings / lastMonthIncome) * 100 : 0
    const savingsRateChange = lastMonthSavingsRate !== 0 ? thisMonthSavingsRate - lastMonthSavingsRate : 0

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      incomeChange,
      expenseChange,
      savingsChange,
      savingsRateChange,
    }
  }, [transactions, isLoading])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="premium-card animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
                <div className="w-16 h-6 bg-white/10 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-8 bg-white/10 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      title: "Total Income",
      value: formatCurrency(calculatedStats.totalIncome),
      change: `${calculatedStats.incomeChange >= 0 ? "+" : ""}${calculatedStats.incomeChange.toFixed(1)}%`,
      trend: calculatedStats.incomeChange >= 0 ? "up" : "down",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(calculatedStats.totalExpenses),
      change: `${calculatedStats.expenseChange >= 0 ? "+" : ""}${calculatedStats.expenseChange.toFixed(1)}%`,
      trend: calculatedStats.expenseChange >= 0 ? "up" : "down",
      icon: CreditCard,
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    {
      title: "Net Savings",
      value: formatCurrency(calculatedStats.netSavings),
      change: `${calculatedStats.savingsChange >= 0 ? "+" : ""}${calculatedStats.savingsChange.toFixed(1)}%`,
      trend: calculatedStats.savingsChange >= 0 ? "up" : "down",
      icon: PiggyBank,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Savings Rate",
      value: `${calculatedStats.savingsRate.toFixed(1)}%`,
      change: `${calculatedStats.savingsRateChange >= 0 ? "+" : ""}${calculatedStats.savingsRateChange.toFixed(1)}%`,
      trend: calculatedStats.savingsRateChange >= 0 ? "up" : "down",
      icon: Target,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === "up" ? ArrowUp : ArrowDown

        return (
          <Card
            key={stat.title}
            className={`premium-card ${stat.bgColor} ${stat.borderColor} hover:scale-105 transition-all duration-300`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg relative overflow-hidden group transition-all duration-300 hover:shadow-2xl`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Icon className="w-6 h-6 text-white relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
                </div>
                <Badge
                  className={`${
                    stat.trend === "up"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}
                >
                  <TrendIcon className="w-3 h-3 mr-1" />
                  {stat.change}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
