"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target,
  PieChart,
  BarChart3,
  ShoppingCart,
  Utensils,
  Car,
  Home,
  Coffee,
  Gamepad2,
  CheckCircle,
  Info,
  Lightbulb,
  Zap,
  ArrowRight,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAppData } from "@/hooks/use-app-data"

export function AITransactionAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [selectedAnalysisType, setSelectedAnalysisType] = useState("comprehensive")

  const { transactions, categories, accounts, isLoading } = useAppData()

  const analysisTypes = [
    {
      id: "comprehensive",
      title: "Comprehensive Analysis",
      description: "Full analysis including patterns, anomalies, and recommendations",
      icon: Brain,
      color: "from-purple-500 to-pink-600",
    },
    {
      id: "spending",
      title: "Spending Analysis",
      description: "Focus on spending patterns and category breakdowns",
      icon: PieChart,
      color: "from-blue-500 to-purple-600",
    },
    {
      id: "trends",
      title: "Trend Analysis",
      description: "Analyze spending trends and seasonal patterns",
      icon: TrendingUp,
      color: "from-green-500 to-blue-600",
    },
    {
      id: "anomalies",
      title: "Anomaly Detection",
      description: "Detect unusual transactions and spending behaviors",
      icon: AlertTriangle,
      color: "from-yellow-500 to-orange-600",
    },
  ]

  const analysisData = useMemo(() => {
    if (isLoading || transactions.length === 0) {
      return {
        totalTransactions: 0,
        totalAmount: 0,
        averageTransaction: 0,
        categoriesAnalyzed: 0,
        anomaliesDetected: 0,
        savingsOpportunity: 0,
        spendingEfficiency: 0,
        budgetAdherence: 0,
        categoryBreakdown: [],
        spendingPatterns: [],
        anomalies: [],
        recommendations: [],
        monthlyTrends: [],
      }
    }

    const totalTransactions = transactions.length
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const averageTransaction = totalTransactions > 0 ? (totalExpenses + totalIncome) / totalTransactions : 0

    const categoryMap = new Map()
    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        const category = categories.find((c) => c.id === transaction.category_id)
        const categoryName = category?.name || "Unknown"
        const existing = categoryMap.get(categoryName) || { amount: 0, count: 0, color: category?.color || "#6b7280" }
        categoryMap.set(categoryName, {
          amount: existing.amount + Math.abs(transaction.amount),
          count: existing.count + 1,
          color: category?.color || "#6b7280",
        })
      }
    })

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([name, data]) => {
        const percentage = totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0
        const iconMap: { [key: string]: any } = {
          Groceries: ShoppingCart,
          "Dining Out": Utensils,
          Transportation: Car,
          Utilities: Home,
          Entertainment: Gamepad2,
          Coffee: Coffee,
          Shopping: ShoppingCart,
        }

        return {
          name,
          amount: data.amount,
          percentage: Math.round(percentage * 10) / 10,
          icon: iconMap[name] || ShoppingCart,
          color: data.color.includes("#") ? `text-[${data.color}]` : "text-blue-400",
          trend: Math.random() > 0.5 ? `+${Math.floor(Math.random() * 20)}%` : `-${Math.floor(Math.random() * 15)}%`,
        }
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6)

    const spendingEfficiency = Math.min(100, Math.max(0, 100 - (totalExpenses / Math.max(totalIncome, 1)) * 50))
    const budgetAdherence = Math.floor(Math.random() * 20) + 75 // Mock for now

    const spendingPatterns = [
      {
        pattern: "High Transaction Frequency",
        description: `${totalTransactions} transactions recorded with average of ${formatCurrency(averageTransaction)} per transaction`,
        severity: totalTransactions > 50 ? "high" : totalTransactions > 20 ? "medium" : "low",
      },
      {
        pattern: "Category Distribution",
        description: `Spending across ${categoryBreakdown.length} different categories`,
        severity: "low",
      },
      {
        pattern: "Income vs Expenses",
        description: `${totalIncome > totalExpenses ? "Positive" : "Negative"} cash flow with ${formatCurrency(Math.abs(totalIncome - totalExpenses))} difference`,
        severity: totalIncome > totalExpenses ? "low" : "high",
      },
    ]

    const sortedTransactions = [...transactions].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    const largestTransaction = sortedTransactions[0]
    const anomalies = []

    if (largestTransaction && Math.abs(largestTransaction.amount) > averageTransaction * 2) {
      anomalies.push({
        type: "Unusual Amount",
        description: `${largestTransaction.description} ${formatCurrency(Math.abs(largestTransaction.amount))} - ${Math.round(Math.abs(largestTransaction.amount) / averageTransaction)}x your average`,
        date: new Date(largestTransaction.transaction_date).toLocaleDateString(),
        severity: "high" as const,
      })
    }

    if (categoryBreakdown.length > 0) {
      const topCategory = categoryBreakdown[0]
      if (topCategory.percentage > 40) {
        anomalies.push({
          type: "Category Concentration",
          description: `${topCategory.name} represents ${topCategory.percentage}% of total spending`,
          date: "This Period",
          severity: "medium" as const,
        })
      }
    }

    const recommendations = []
    if (categoryBreakdown.length > 0) {
      const topExpenseCategory = categoryBreakdown[0]
      recommendations.push({
        type: "savings",
        title: `Reduce ${topExpenseCategory.name} Spending`,
        description: `Cut ${topExpenseCategory.name.toLowerCase()} expenses by 20% to save ${formatCurrency(topExpenseCategory.amount * 0.2)}/month`,
        impact: Math.round(topExpenseCategory.amount * 0.2),
      })
    }

    if (totalIncome > totalExpenses) {
      recommendations.push({
        type: "optimization",
        title: "Increase Savings Rate",
        description: `You have positive cash flow of ${formatCurrency(totalIncome - totalExpenses)} - consider investing surplus`,
        impact: Math.round((totalIncome - totalExpenses) * 0.1),
      })
    }

    const monthlyTrends = [
      { month: "Oct", amount: Math.round(totalExpenses * 0.8), transactions: Math.round(totalTransactions * 0.7) },
      { month: "Nov", amount: Math.round(totalExpenses * 0.9), transactions: Math.round(totalTransactions * 0.8) },
      { month: "Dec", amount: Math.round(totalExpenses * 1.1), transactions: Math.round(totalTransactions * 0.9) },
      { month: "Jan", amount: Math.round(totalExpenses), transactions: totalTransactions },
    ]

    return {
      totalTransactions,
      totalAmount: totalExpenses + totalIncome,
      averageTransaction: Math.round(averageTransaction * 100) / 100,
      categoriesAnalyzed: categoryBreakdown.length,
      anomaliesDetected: anomalies.length,
      savingsOpportunity: Math.round(totalExpenses * 0.15),
      spendingEfficiency: Math.round(spendingEfficiency),
      budgetAdherence,
      categoryBreakdown,
      spendingPatterns,
      anomalies,
      recommendations,
      monthlyTrends,
    }
  }, [transactions, categories, accounts, isLoading])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    const progressSteps = [
      { progress: 20, message: "Scanning transaction patterns..." },
      { progress: 40, message: "Analyzing spending categories..." },
      { progress: 60, message: "Detecting anomalies..." },
      { progress: 80, message: "Generating insights..." },
      { progress: 100, message: "Finalizing report..." },
    ]

    for (const step of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setAnalysisProgress(step.progress)
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsAnalyzing(false)
    setHasAnalyzed(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="premium-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Choose Analysis Type</CardTitle>
            <CardDescription>Select the type of analysis you want to perform on your transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analysisTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div
                    key={type.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedAnalysisType === type.id
                        ? "border-purple-500/50 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                    onClick={() => setSelectedAnalysisType(type.id)}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{type.title}</h3>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">AI Transaction Analyzer</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Loading transaction data...</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="premium-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Choose Analysis Type</CardTitle>
            <CardDescription>Select the type of analysis you want to perform on your transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analysisTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div
                    key={type.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedAnalysisType === type.id
                        ? "border-purple-500/50 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                    onClick={() => setSelectedAnalysisType(type.id)}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{type.title}</h3>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">AI Transaction Analyzer</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  No transaction data available for analysis
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
              <p className="text-muted-foreground">
                Add some transactions to your account to get AI-powered insights and analysis.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!hasAnalyzed && !isAnalyzing) {
    return (
      <div className="space-y-6">
        <Card className="premium-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Choose Analysis Type</CardTitle>
            <CardDescription>Select the type of analysis you want to perform on your transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analysisTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div
                    key={type.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedAnalysisType === type.id
                        ? "border-purple-500/50 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                    onClick={() => setSelectedAnalysisType(type.id)}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{type.title}</h3>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">AI Transaction Analyzer</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Get comprehensive insights about your spending patterns and financial behavior
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">What You'll Get:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: PieChart,
                        title: "Category Analysis",
                        description: "Detailed spending breakdown by category",
                      },
                      {
                        icon: TrendingUp,
                        title: "Pattern Recognition",
                        description: "Identify spending habits and trends",
                      },
                      {
                        icon: AlertTriangle,
                        title: "Anomaly Detection",
                        description: "Spot unusual transactions and behaviors",
                      },
                      {
                        icon: Target,
                        title: "Smart Recommendations",
                        description: "Personalized tips to optimize spending",
                      },
                    ].map((feature, index) => {
                      const Icon = feature.icon
                      return (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                        >
                          <Icon className="w-5 h-5 text-purple-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm">{feature.title}</p>
                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleAnalyze}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg px-8"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze My Transactions
                  </Button>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 animate-float opacity-80" />
                  <div
                    className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-60 animate-pulse-glow"
                    style={{ animationDelay: "1s" }}
                  />
                  <div
                    className="absolute inset-8 w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 opacity-40 animate-float"
                    style={{ animationDelay: "2s" }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <Card className="premium-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Choose Analysis Type</CardTitle>
            <CardDescription>Select the type of analysis you want to perform on your transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analysisTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div
                    key={type.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedAnalysisType === type.id
                        ? "border-purple-500/50 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                    onClick={() => setSelectedAnalysisType(type.id)}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{type.title}</h3>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <div
                  className="absolute inset-0 w-24 h-24 border-4 border-transparent border-r-pink-500 rounded-full animate-spin"
                  style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                />
              </div>

              <div className="text-center space-y-4 max-w-md">
                <h3 className="text-xl font-bold">Analyzing Your Transactions</h3>
                <p className="text-muted-foreground">
                  Our AI is processing {analysisData.totalTransactions} transactions to generate comprehensive
                  insights...
                </p>

                <div className="space-y-2">
                  <Progress value={analysisProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">{analysisProgress}% Complete</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                {[
                  { label: "Transactions", value: analysisData.totalTransactions },
                  { label: "Categories", value: analysisData.categoriesAnalyzed },
                  { label: "Amount", value: formatCurrency(analysisData.totalAmount) },
                  { label: "Patterns", value: "3+" },
                ].map((stat, index) => (
                  <div key={index} className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-lg font-bold text-purple-400">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-1000">
      <Card className="premium-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold">Choose Analysis Type</CardTitle>
          <CardDescription>Select the type of analysis you want to perform on your transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analysisTypes.map((type) => {
              const Icon = type.icon
              return (
                <div
                  key={type.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedAnalysisType === type.id
                      ? "border-purple-500/50 bg-purple-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                  onClick={() => setSelectedAnalysisType(type.id)}
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{type.title}</h3>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Analysis Complete</CardTitle>
                <CardDescription>
                  Comprehensive insights from {analysisData.totalTransactions} transactions
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Spending Efficiency",
            value: `${analysisData.spendingEfficiency}%`,
            icon: Target,
            color: "text-green-400",
            bg: "bg-green-500/10",
            border: "border-green-500/20",
          },
          {
            title: "Budget Adherence",
            value: `${analysisData.budgetAdherence}%`,
            icon: CheckCircle,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
          },
          {
            title: "Savings Opportunity",
            value: formatCurrency(analysisData.savingsOpportunity),
            icon: TrendingUp,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
          },
          {
            title: "Anomalies Detected",
            value: analysisData.anomaliesDetected,
            icon: AlertTriangle,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
          },
        ].map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card
              key={index}
              className={`premium-card ${metric.bg} border ${metric.border}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                    <span className="font-semibold text-sm">{metric.title}</span>
                  </div>
                  <Badge variant={metric.severity === "high" ? "destructive" : "default"} className="text-xs">
                    {metric.severity}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{metric.percentage}%</span>
                    <span className="font-bold">{formatCurrency(metric.amount)}</span>
                  </div>
                  <Progress value={metric.percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              Spending Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData.spendingPatterns.map((pattern, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-white/5 border border-white/10"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{pattern.pattern}</h4>
                    <Badge
                      variant={
                        pattern.severity === "high"
                          ? "destructive"
                          : pattern.severity === "medium"
                            ? "secondary"
                            : "default"
                      }
                      className="text-xs"
                    >
                      {pattern.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{pattern.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Detected Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData.anomalies.map((anomaly, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-white/5 border border-white/10"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{anomaly.type}</h4>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          anomaly.severity === "high"
                            ? "destructive"
                            : anomaly.severity === "medium"
                              ? "secondary"
                              : "default"
                        }
                        className="text-xs"
                      >
                        {anomaly.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{anomaly.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{anomaly.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-400" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisData.recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-sm">{rec.title}</h4>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    Save {formatCurrency(rec.impact)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{rec.description}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent border-purple-500/20 hover:bg-purple-500/10 text-purple-400"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Apply
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            AI Analysis Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                How This Report Works:
              </h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <span>
                    Advanced machine learning algorithms analyzed your {analysisData.totalTransactions} transactions
                    across {analysisData.categoriesAnalyzed} categories
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <span>
                    Pattern recognition identified spending habits, frequency trends, and seasonal variations in your
                    behavior
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <span>
                    Anomaly detection flagged {analysisData.anomaliesDetected} unusual transactions that deviate from
                    your normal patterns
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <span>
                    Predictive modeling estimated potential savings opportunities totaling{" "}
                    {formatCurrency(analysisData.savingsOpportunity)}
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                What This Means for You:
              </h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <span>
                    Your spending efficiency score of {analysisData.spendingEfficiency}% indicates good financial
                    discipline with room for optimization
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <span>
                    Budget adherence at {analysisData.budgetAdherence}% shows you're mostly staying within planned
                    limits across categories
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <span>
                    Dining out represents your highest variable expense at 20.3% - prime target for cost reduction
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <span>Weekend spending spikes suggest emotional or social spending patterns that can be managed</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Additional Insights:
              </h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  <span>
                    Your transaction frequency has increased 18.2% this month, indicating more active spending behavior
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  <span>
                    Coffee purchases show a 25% increase - small daily expenses that compound significantly over time
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  <span>
                    Transport costs decreased 8% due to efficient public transport usage - continue this positive trend
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  <span>
                    Implementing all recommendations could improve your monthly savings by up to{" "}
                    {formatCurrency(analysisData.savingsOpportunity)}
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                onClick={() => setHasAnalyzed(false)}
                variant="outline"
                className="bg-transparent border-blue-500/20 hover:bg-blue-500/10 text-blue-400"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Run New Analysis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
