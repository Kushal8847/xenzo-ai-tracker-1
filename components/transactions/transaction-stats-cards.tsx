"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Receipt, TrendingUp, TrendingDown, Calendar, DollarSign, CreditCard, PieChart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAppData } from "@/hooks/use-app-data"
import { useMemo } from "react"

export function TransactionStatsCards() {
  const { transactions, categories, isLoading } = useAppData()

  const stats = useMemo(() => {
    if (isLoading || transactions.length === 0) {
      return {
        totalTransactions: 0,
        totalVolume: 0,
        avgTransaction: 0,
        incomeCount: 0,
        expenseCount: 0,
        totalIncome: 0,
        totalExpenses: 0,
        topCategory: null,
        monthlyAvg: 0,
        weeklyAvg: 0,
        savingsRate: 0,
        dailyAvg: 0,
      }
    }

    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const totalVolume = totalIncome + totalExpenses
    const incomeCount = transactions.filter((t) => t.type === "income").length
    const expenseCount = transactions.filter((t) => t.type === "expense").length

    // Calculate top spending category
    const categorySpending = transactions
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

    // Calculate averages
    const monthlyAvg = totalVolume / Math.max(1, new Date().getMonth() + 1)
    const weeklyAvg = totalVolume / Math.max(1, Math.ceil(transactions.length / 7))
    const dailyAvg = totalVolume / Math.max(1, new Date().getDate())

    // Calculate savings rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

    return {
      totalTransactions: transactions.length,
      totalVolume,
      avgTransaction: totalVolume / Math.max(1, transactions.length),
      incomeCount,
      expenseCount,
      totalIncome,
      totalExpenses,
      topCategory: topCategory.name ? topCategory : null,
      monthlyAvg,
      weeklyAvg,
      savingsRate,
      dailyAvg,
    }
  }, [transactions, categories, isLoading])

  const transactionStats = [
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      change: "+18.2%",
      changeType: "positive" as const,
      icon: Receipt,
      gradient: "aussie-gradient",
      description: "This month",
      isNumber: true,
    },
    {
      title: "Total Volume",
      value: stats.totalVolume,
      change: "+5.8%",
      changeType: "positive" as const,
      icon: DollarSign,
      gradient: "balance-gradient",
      description: "Transaction value",
    },
    {
      title: "Average Transaction",
      value: stats.avgTransaction,
      change: "-2.1%",
      changeType: "negative" as const,
      icon: TrendingDown,
      gradient: "expense-gradient",
      description: "Per transaction",
    },
    {
      title: "Daily Average",
      value: stats.dailyAvg,
      change: "+12.5%",
      changeType: "positive" as const,
      icon: Calendar,
      gradient: "income-gradient",
      description: "Transactions per day",
      isNumber: true,
    },
    {
      title: "Income Transactions",
      value: stats.incomeCount,
      change: "+4.5%",
      changeType: "positive" as const,
      icon: TrendingUp,
      gradient: "savings-gradient",
      description: "Income entries",
      isNumber: true,
    },
    {
      title: "Expense Transactions",
      value: stats.expenseCount,
      change: "+19.8%",
      changeType: "positive" as const,
      icon: CreditCard,
      gradient: "investment-gradient",
      description: "Expense entries",
      isNumber: true,
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="premium-card animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-3 bg-white/5 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-white/10 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {transactionStats.slice(0, 4).map((stat, index) => {
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
                          : "text-red-400 bg-red-400/10 border border-red-400/20"
                      }`}
                    >
                      {stat.change}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-caption text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-headline font-bold tracking-tight">
                      {stat.isNumber ? Math.round(stat.value) : formatCurrency(stat.value)}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Income Transactions - 1:4 */}
        <div className="lg:col-span-1">
          {(() => {
            const stat = transactionStats[4] // Income Transactions
            const Icon = stat.icon
            return (
              <Card
                className="glass-card border-white/10 overflow-hidden group"
                style={{ animationDelay: `${4 * 100}ms` }}
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
                            : "text-red-400 bg-red-400/10 border border-red-400/20"
                        }`}
                      >
                        {stat.change}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-caption text-muted-foreground font-medium">{stat.title}</p>
                      <p className="text-headline font-bold tracking-tight">
                        {stat.isNumber ? Math.round(stat.value) : formatCurrency(stat.value)}
                      </p>
                      <p className="text-sm text-muted-foreground">{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })()}
        </div>

        {/* Expense Transactions - 1:4 */}
        <div className="lg:col-span-1">
          {(() => {
            const stat = transactionStats[5] // Expense Transactions
            const Icon = stat.icon
            return (
              <Card
                className="glass-card border-white/10 overflow-hidden group"
                style={{ animationDelay: `${5 * 100}ms` }}
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
                            : "text-red-400 bg-red-400/10 border border-red-400/20"
                        }`}
                      >
                        {stat.change}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-caption text-muted-foreground font-medium">{stat.title}</p>
                      <p className="text-headline font-bold tracking-tight">
                        {stat.isNumber ? Math.round(stat.value) : formatCurrency(stat.value)}
                      </p>
                      <p className="text-sm text-muted-foreground">{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })()}
        </div>

        {/* Top Categories Card - 2:4 */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-white/10 h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Top Categories</h3>
                  <p className="text-sm text-muted-foreground">Spending by category this month</p>
                </div>
              </div>

              <div className="relative overflow-hidden">
                {/*{transactionStats.topCategories.length > 0 ? (*/}
                {/*  <div*/}
                {/*    className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"*/}
                {/*    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}*/}
                {/*  >*/}
                {/*    {transactionStats.topCategories.map((category, index) => (*/}
                {/*      <div*/}
                {/*        key={category.name}*/}
                {/*        className="flex-shrink-0 w-32 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"*/}
                {/*        style={{ animationDelay: `${index * 50}ms` }}*/}
                {/*      >*/}
                {/*        <div className="text-center">*/}
                {/*          <div className="flex items-center justify-center mb-2">*/}
                {/*            <span className={`text-xs font-bold ${category.color}`}>*/}
                {/*              {category.percentage.toFixed(1)}%*/}
                {/*            </span>*/}
                {/*          </div>*/}
                {/*          <p className="font-medium text-xs mb-1 truncate">{category.name}</p>*/}
                {/*          <p className="font-bold text-xs">{formatCurrency(category.amount)}</p>*/}
                {/*        </div>*/}
                {/*      </div>*/}
                {/*    ))}*/}
                {/*  </div>*/}
                {/*) : (*/}
                <div className="text-center py-8">
                  <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No expense categories yet</p>
                  <p className="text-xs text-muted-foreground">Add some expenses to see category breakdown</p>
                </div>
                {/*)}*/}

                {/* Scroll indicator */}
                {/*{transactionStats.topCategories.length > 4 && (*/}
                {/*  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />*/}
                {/*)}*/}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
