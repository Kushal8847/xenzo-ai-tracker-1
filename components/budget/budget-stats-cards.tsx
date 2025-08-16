"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Target, DollarSign, TrendingDown, AlertTriangle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAppData } from "@/hooks/use-app-data"
import { useMemo } from "react"

export function BudgetStatsCards() {
  const { budgets, transactions } = useAppData()

  const stats = useMemo(() => {
    const activeBudgets = budgets.filter((budget) => budget.is_active)
    const totalBudget = activeBudgets.reduce((sum, budget) => sum + budget.amount, 0)

    // Calculate total spent across all budgets
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.transaction_date)
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear &&
        transaction.type === "expense" &&
        transaction.status === "completed"
      )
    })

    const totalSpent = activeBudgets.reduce((sum, budget) => {
      if (budget.category_id) {
        const categorySpent = monthlyTransactions
          .filter((t) => t.category_id === budget.category_id)
          .reduce((catSum, t) => catSum + Math.abs(t.amount), 0)
        return sum + Math.min(categorySpent, budget.amount)
      }
      return sum + budget.spent
    }, 0)

    const remaining = Math.max(0, totalBudget - totalSpent)
    const overBudget = Math.max(0, totalSpent - totalBudget)

    // Calculate percentage changes (mock for now)
    const budgetChange = activeBudgets.length > 0 ? "+12%" : "0%"
    const spentChange = totalSpent > 0 ? "+8%" : "0%"
    const remainingChange = remaining > 0 ? "-15%" : "0%"
    const overBudgetChange = overBudget > 0 ? "+25%" : "0%"

    return [
      {
        title: "Total Budget",
        value: totalBudget,
        change: budgetChange,
        changeType: "positive" as const,
        icon: Target,
        gradient: "aussie-gradient",
        description: "This month",
      },
      {
        title: "Total Spent",
        value: totalSpent,
        change: spentChange,
        changeType: "neutral" as const,
        icon: DollarSign,
        gradient: "expense-gradient",
        description: "Across all budgets",
      },
      {
        title: "Remaining",
        value: remaining,
        change: remainingChange,
        changeType: "positive" as const,
        icon: TrendingDown,
        gradient: "income-gradient",
        description: "Available to spend",
      },
      {
        title: "Over Budget",
        value: overBudget,
        change: overBudgetChange,
        changeType: overBudget > 0 ? ("negative" as const) : ("neutral" as const),
        icon: AlertTriangle,
        gradient: "balance-gradient",
        description: "Exceeded amount",
      },
    ]
  }, [budgets, transactions])

  return (
    <div className="bento-stats">
      {stats.map((stat, index) => {
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
                  <p className="text-headline font-bold tracking-tight">{formatCurrency(stat.value)}</p>
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
