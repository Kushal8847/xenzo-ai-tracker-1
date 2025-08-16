"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppData } from "@/hooks/use-app-data"
import {
  Bot,
  Sparkles,
  TrendingUp,
  PieChart,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Loader2,
  BarChart3,
  Wallet,
  Calendar,
  RefreshCw,
} from "lucide-react"

interface AIReportAnalyzerProps {
  period: string
  category: string
}

type AnalysisType =
  | "summary"
  | "financial-overview"
  | "cash-flow"
  | "spending-patterns"
  | "budget-analysis"
  | "savings-insights"
  | null

interface AnalysisResult {
  title: string
  insights: Array<{
    type: "positive" | "warning" | "neutral"
    text: string
  }>
  recommendations: string[]
  metrics: {
    totalIncome: number
    totalExpenses: number
    netCashFlow: number
    savingsRate: number
    topCategory: string
    topCategoryAmount: number
  }
}

export function AIReportAnalyzer({ period, category }: AIReportAnalyzerProps) {
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisType>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { transactions, categories, accounts } = useAppData()

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]

    // Filter by period
    const now = new Date()
    const periodStart = new Date()

    switch (period) {
      case "1month":
        periodStart.setMonth(now.getMonth() - 1)
        break
      case "3months":
        periodStart.setMonth(now.getMonth() - 3)
        break
      case "6months":
        periodStart.setMonth(now.getMonth() - 6)
        break
      case "1year":
        periodStart.setFullYear(now.getFullYear() - 1)
        break
      default:
        periodStart.setFullYear(2020) // All time
    }

    filtered = filtered.filter((t) => new Date(t.date) >= periodStart)

    // Filter by category if specified
    if (category && category !== "all") {
      filtered = filtered.filter((t) => t.category === category)
    }

    return filtered
  }, [transactions, period, category])

  const metrics = useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const expenses = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const netCashFlow = income - expenses
    const savingsRate = income > 0 ? (netCashFlow / income) * 100 : 0

    // Calculate top spending category
    const categoryTotals = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        },
        {} as Record<string, number>,
      )

    const topCategoryEntry = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0]

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netCashFlow,
      savingsRate,
      topCategory: topCategoryEntry?.[0] || "None",
      topCategoryAmount: topCategoryEntry?.[1] || 0,
      transactionCount: filteredTransactions.length,
    }
  }, [filteredTransactions])

  const analysisOptions = [
    {
      id: "summary" as const,
      title: "Generate Summary",
      description: "Overall financial health overview",
      icon: Bot,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "financial-overview" as const,
      title: "Financial Overview",
      description: "Detailed income vs expenses analysis",
      icon: BarChart3,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "cash-flow" as const,
      title: "Cash Flow Analysis",
      description: "Money flow patterns and trends",
      icon: TrendingUp,
      color: "from-purple-500 to-violet-500",
    },
    {
      id: "spending-patterns" as const,
      title: "Spending Patterns",
      description: "Category-wise spending insights",
      icon: PieChart,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "budget-analysis" as const,
      title: "Budget Performance",
      description: "Budget vs actual spending analysis",
      icon: Target,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "savings-insights" as const,
      title: "Savings Insights",
      description: "Savings goals and recommendations",
      icon: Wallet,
      color: "from-indigo-500 to-blue-500",
    },
  ]

  const handleAnalysis = async (type: AnalysisType) => {
    if (!type) return

    setIsLoading(true)
    setActiveAnalysis(type)
    setError(null)

    try {
      // Prepare data for AI analysis
      const analysisData = {
        type,
        period,
        category,
        metrics,
        transactionCount: filteredTransactions.length,
        recentTransactions: filteredTransactions.slice(-10).map((t) => ({
          amount: t.amount,
          category: t.category,
          type: t.type,
          description: t.description,
        })),
      }

      const response = await fetch("/api/ai-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Analyze my financial data for ${type} analysis. Here's my data: ${JSON.stringify(analysisData)}`,
          context: "financial_report_analysis",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI analysis")
      }

      const data = await response.json()

      const result: AnalysisResult = {
        title: getAnalysisTitle(type),
        insights: generateInsights(type, metrics, data.advice),
        recommendations: generateRecommendations(type, metrics, data.advice),
        metrics,
      }

      setAnalysisResult(result)
    } catch (error) {
      console.error("AI Analysis error:", error)
      setError("Failed to generate AI analysis. Please try again.")
      setAnalysisResult(generateLocalAnalysis(type, metrics))
    } finally {
      setIsLoading(false)
    }
  }

  const getAnalysisTitle = (type: AnalysisType): string => {
    switch (type) {
      case "summary":
        return "Financial Health Summary"
      case "financial-overview":
        return "Financial Overview Analysis"
      case "cash-flow":
        return "Cash Flow Analysis"
      case "spending-patterns":
        return "Spending Pattern Analysis"
      case "budget-analysis":
        return "Budget Performance Analysis"
      case "savings-insights":
        return "Savings & Investment Insights"
      default:
        return "Financial Analysis"
    }
  }

  const generateInsights = (type: AnalysisType, metrics: any, aiAdvice: string) => {
    const insights = []

    // Base insights on actual data
    if (metrics.netCashFlow > 0) {
      insights.push({
        type: "positive" as const,
        text: `Positive cash flow of $${metrics.netCashFlow.toFixed(2)} with ${metrics.savingsRate.toFixed(1)}% savings rate`,
      })
    } else {
      insights.push({
        type: "warning" as const,
        text: `Negative cash flow of $${Math.abs(metrics.netCashFlow).toFixed(2)} - expenses exceed income`,
      })
    }

    if (metrics.topCategory && metrics.topCategoryAmount > 0) {
      insights.push({
        type: "neutral" as const,
        text: `Top spending category: ${metrics.topCategory} ($${metrics.topCategoryAmount.toFixed(2)})`,
      })
    }

    if (metrics.transactionCount > 0) {
      insights.push({
        type: "neutral" as const,
        text: `Analyzed ${metrics.transactionCount} transactions for this period`,
      })
    }

    // Add AI-generated insight if available
    if (aiAdvice && aiAdvice.length > 10) {
      insights.push({
        type: "positive" as const,
        text: aiAdvice.substring(0, 150) + (aiAdvice.length > 150 ? "..." : ""),
      })
    }

    return insights
  }

  const generateRecommendations = (type: AnalysisType, metrics: any, aiAdvice: string) => {
    const recommendations = []

    if (metrics.savingsRate < 10) {
      recommendations.push("Consider increasing your savings rate to at least 10% of income")
    }

    if (metrics.netCashFlow < 0) {
      recommendations.push("Focus on reducing expenses or increasing income to achieve positive cash flow")
    }

    if (metrics.topCategoryAmount > metrics.totalIncome * 0.3) {
      recommendations.push(`Consider reducing spending in ${metrics.topCategory} category`)
    }

    recommendations.push("Track your expenses regularly to identify spending patterns")

    return recommendations
  }

  const generateLocalAnalysis = (type: AnalysisType, metrics: any): AnalysisResult => {
    return {
      title: getAnalysisTitle(type),
      insights: generateInsights(type, metrics, ""),
      recommendations: generateRecommendations(type, metrics, ""),
      metrics,
    }
  }

  return (
    <Card className="premium-card sticky top-8 w-full h-[calc(100vh-4rem)] overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Report Analyzer</CardTitle>
            <p className="text-sm text-muted-foreground">Get intelligent insights on your finances</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="w-fit bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
          <Badge variant="outline" className="text-xs">
            {metrics.transactionCount} transactions
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Period:{" "}
            {period === "1month"
              ? "Last Month"
              : period === "3months"
                ? "Last 3 Months"
                : period === "6months"
                  ? "Last 6 Months"
                  : period === "1year"
                    ? "Last Year"
                    : "All Time"}
            {category && category !== "all" && ` • Category: ${category}`}
          </span>
        </div>

        {/* Analysis Options */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">Choose Analysis Type</h4>
          {analysisOptions.map((option) => {
            const Icon = option.icon
            const isActive = activeAnalysis === option.id

            return (
              <Button
                key={option.id}
                variant="ghost"
                className={`w-full justify-start gap-3 h-auto p-3 text-left transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 border border-white/20 shadow-lg"
                    : "hover:bg-white/5 border border-transparent"
                }`}
                onClick={() => handleAnalysis(option.id)}
                disabled={isLoading || metrics.transactionCount === 0}
              >
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{option.title}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </div>
              </Button>
            )
          })}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}

        {/* Analysis Results */}
        {(isLoading || analysisResult) && (
          <div className="mt-6 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
                  <p className="text-sm text-muted-foreground">Analyzing your financial data...</p>
                </div>
              </div>
            ) : (
              analysisResult && (
                <ScrollArea className="h-96">
                  <div className="space-y-4 pr-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-base">{analysisResult.title}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAnalysis(activeAnalysis)}
                        className="h-8 w-8 p-0"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-400">
                          ${analysisResult.metrics.totalIncome.toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Income</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-red-400">
                          ${analysisResult.metrics.totalExpenses.toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Expenses</div>
                      </div>
                    </div>

                    {/* Key Insights */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Key Insights</h4>
                      {analysisResult.insights.map((insight, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                        >
                          {insight.type === "positive" && (
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          )}
                          {insight.type === "warning" && (
                            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          )}
                          {insight.type === "neutral" && (
                            <DollarSign className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          )}
                          <p className="text-sm leading-relaxed">{insight.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">AI Recommendations</h4>
                      <div className="space-y-2">
                        {analysisResult.recommendations.map((rec, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                          >
                            <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm leading-relaxed">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              )
            )}
          </div>
        )}

        {metrics.transactionCount === 0 && !isLoading && (
          <div className="text-center py-8 space-y-3">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto opacity-50" />
            <p className="text-sm text-muted-foreground">No transactions found for the selected period and category.</p>
            <p className="text-xs text-muted-foreground">Add some transactions to get AI-powered insights.</p>
          </div>
        )}

        {/* Default State */}
        {!activeAnalysis && !isLoading && metrics.transactionCount > 0 && (
          <div className="text-center py-8 space-y-3">
            <Bot className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
            <p className="text-sm text-muted-foreground">
              Select an analysis type above to get AI-powered insights about your financial data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
