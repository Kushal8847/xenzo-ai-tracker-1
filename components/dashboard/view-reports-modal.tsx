"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  PieChartIcon,
  BarChart3,
  Activity,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import LocalStorageService from "@/lib/local-storage"
import type { Transaction, Goal, Budget } from "@/lib/types"

interface ViewReportsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ViewReportsModal({ isOpen, onClose }: ViewReportsModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = () => {
    try {
      const userId = "user1" // In a real app, get actual user ID
      const userTransactions = LocalStorageService.getUserTransactions(userId)
      const userGoals = LocalStorageService.getUserGoals(userId)
      const userBudgets = LocalStorageService.getUserBudgets(userId)

      setTransactions(userTransactions)
      setGoals(userGoals)
      setBudgets(userBudgets)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate financial metrics
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const thisMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.transaction_date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const totalIncome = thisMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const totalExpenses = thisMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const netIncome = totalIncome - totalExpenses

  // Category breakdown
  const categoryData = thisMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        const category = LocalStorageService.getCategoryById("user1", t.category_id)?.name || "Other"
        acc[category] = (acc[category] || 0) + Math.abs(t.amount)
        return acc
      },
      {} as Record<string, number>,
    )

  const categoryChartData = Object.entries(categoryData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  // Monthly trend data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - i))
    const month = date.getMonth()
    const year = date.getFullYear()

    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.transaction_date)
      return tDate.getMonth() === month && tDate.getFullYear() === year
    })

    const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const expenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      income,
      expenses,
      net: income - expenses,
    }
  })

  // Goals progress
  const totalGoalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0)
  const totalGoalCurrent = goals.reduce((sum, g) => sum + g.current_amount, 0)
  const goalsProgress = totalGoalTarget > 0 ? (totalGoalCurrent / totalGoalTarget) * 100 : 0

  const COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl border-white/10">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Financial Reports Dashboard
          </DialogTitle>
          <p className="text-gray-400">Live data from your financial activities</p>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-600">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-blue-600">
              Categories
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-blue-600">
              Goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    Total Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</div>
                  <p className="text-xs text-gray-500">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    Total Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</div>
                  <p className="text-xs text-gray-500">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                    Net Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${netIncome >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {formatCurrency(netIncome)}
                  </div>
                  <p className="text-xs text-gray-500">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-400" />
                    Goals Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-400">{goalsProgress.toFixed(1)}%</div>
                  <Progress value={goalsProgress} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trend Chart */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  6-Month Financial Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                      formatter={(value: number) => [formatCurrency(value), ""]}
                    />
                    <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" />
                    <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
                    <Line type="monotone" dataKey="net" stroke="#3B82F6" strokeWidth={2} name="Net" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  Recent Transactions ({thisMonthTransactions.length} this month)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {thisMonthTransactions.slice(0, 20).map((transaction) => {
                    const category = LocalStorageService.getCategoryById("user1", transaction.category_id)
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-600/30"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === "income"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {transaction.type === "income" ? (
                              <ArrowUpRight className="w-5 h-5" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{transaction.description}</p>
                            <p className="text-sm text-gray-400">
                              {category?.name || "Unknown"} •{" "}
                              {new Date(transaction.transaction_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`font-bold ${transaction.type === "income" ? "text-green-400" : "text-red-400"}`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-blue-400" />
                    Expense Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryChartData.map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-white text-sm">{category.name}</span>
                        </div>
                        <span className="text-white font-medium">{formatCurrency(category.value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-400" />
                  Savings Goals ({goals.length} active)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.length === 0 ? (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No savings goals found</p>
                    </div>
                  ) : (
                    goals.map((goal) => {
                      const progress = (goal.current_amount / goal.target_amount) * 100
                      const isCompleted = progress >= 100

                      return (
                        <div key={goal.id} className="p-4 rounded-lg bg-gray-700/30 border border-gray-600/30">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-white">{goal.name}</h3>
                              <p className="text-sm text-gray-400 capitalize">{goal.category}</p>
                            </div>
                            <Badge
                              className={
                                isCompleted ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                              }
                            >
                              {isCompleted ? "Completed" : "In Progress"}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">{formatCurrency(goal.current_amount)}</span>
                              <span className="text-white font-medium">{formatCurrency(goal.target_amount)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">{progress.toFixed(1)}% complete</span>
                              {goal.target_date && (
                                <span className="text-gray-400">
                                  Target: {new Date(goal.target_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t border-gray-700">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700 bg-transparent"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
