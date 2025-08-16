"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, PiggyBank, Target, Plus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAppData } from "@/hooks/use-app-data"
import { useMemo } from "react"

export function StatsCards() {
  const { financialSummary, transactions, goals, isLoading } = useAppData()

  const calculatedStats = useMemo(() => {
    if (isLoading || !goals) {
      return {
        emergencyFund: 0,
        totalGoalsProgress: 0,
        monthlyTrend: 0,
      }
    }

    // Find Emergency Fund goal
    const emergencyGoal = goals.find((goal) => goal.name.toLowerCase().includes("emergency") && goal.is_active)

    // Calculate total progress across all goals
    const totalGoalsProgress = goals
      .filter((goal) => goal.is_active)
      .reduce((sum, goal) => sum + goal.current_amount, 0)

    // Calculate monthly trend from recent transactions
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())

    const thisMonthExpenses = transactions
      .filter((t) => t.type === "expense" && new Date(t.transaction_date) >= lastMonth)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const lastMonthExpenses = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          new Date(t.transaction_date) >= twoMonthsAgo &&
          new Date(t.transaction_date) < lastMonth,
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const monthlyTrend = lastMonthExpenses > 0 ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0

    return {
      emergencyFund: emergencyGoal?.current_amount || 0,
      totalGoalsProgress,
      monthlyTrend,
    }
  }, [transactions, goals, isLoading])

  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((index) => (
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
      </>
    )
  }

  const stats = [
    {
      title: "Total Balance",
      value: financialSummary.totalBalance,
      change: "+12.5%",
      changeType: "positive" as const,
      icon: Wallet,
      gradient: "balance-gradient",
      description: "Across all accounts",
    },
    {
      title: "Monthly Income",
      value: financialSummary.monthlyIncome,
      change: "+8.2%",
      changeType: "positive" as const,
      icon: ArrowUpRight,
      gradient: "income-gradient",
      description: "This month",
    },
    {
      title: "Monthly Expenses",
      value: financialSummary.monthlyExpenses,
      change:
        calculatedStats.monthlyTrend >= 0
          ? `+${calculatedStats.monthlyTrend.toFixed(1)}%`
          : `${calculatedStats.monthlyTrend.toFixed(1)}%`,
      changeType: calculatedStats.monthlyTrend >= 0 ? ("positive" as const) : ("negative" as const),
      icon: ArrowDownLeft,
      gradient: "expense-gradient",
      description: "vs last month",
    },
    {
      title: "Savings Rate",
      value: financialSummary.savingsRate,
      change: "+2.3%",
      changeType: "positive" as const,
      icon: TrendingUp,
      gradient: "aussie-gradient",
      isPercentage: true,
      description: "Of total income",
    },
    {
      title: "Emergency Fund",
      value: calculatedStats.emergencyFund,
      change: "+15.2%",
      changeType: "positive" as const,
      icon: PiggyBank,
      gradient: "savings-gradient",
      description: "Emergency savings",
    },
    {
      title: "Goals Progress",
      value: calculatedStats.totalGoalsProgress,
      change: "+7.8%",
      changeType: "positive" as const,
      icon: Target,
      gradient: "investment-gradient",
      description: "Total saved",
    },
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.slice(0, 4).map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="glass-card border-white/10 overflow-hidden group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 relative">
                {/* Background decoration */}
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
                          : "text-red-400 bg-red-400/10 border border-red-400/20"
                      }`}
                    >
                      {stat.change}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-caption text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-headline font-bold tracking-tight">
                      {stat.isPercentage ? `${stat.value}%` : formatCurrency(stat.value)}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.slice(4).map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="glass-card border-white/10 overflow-hidden group"
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              <CardContent className="p-6 relative">
                {/* Background decoration */}
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
                          : "text-red-400 bg-red-400/10 border border-red-400/20"
                      }`}
                    >
                      {stat.change}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-caption text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-headline font-bold tracking-tight">
                      {stat.isPercentage ? `${stat.value}%` : formatCurrency(stat.value)}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        <Card className="glass-card border-dashed border-2 border-white/20 hover:border-white/40 transition-all duration-300 group cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
              <Plus className="w-7 h-7 text-muted-foreground group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-muted-foreground group-hover:text-white transition-colors">
              Add New Tracking
            </h3>
            <p className="text-sm text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
              Create a custom metric to track your financial goals
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
