"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, TrendingUp, Target, DollarSign } from 'lucide-react'
import { formatCurrency } from "@/lib/utils"

export function AIIncomeAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  const handleQuickAnalyze = () => {
    setIsAnalyzing(true)
    const timer = setTimeout(() => {
      setIsAnalyzing(false)
      setHasAnalyzed(true)
    }, 2500)
    return () => clearTimeout(timer)
  }

  const analysisData = {
    totalAnalyzed: 6750,
    sourcesAnalyzed: 4,
    transactionsProcessed: 23,
    growthOpportunity: 1250,
    incomeEfficiency: 92,
    earningPattern: "Consistent Growth",
    topInsight: "Freelance income shows 15% month-over-month growth",
    recommendation: "Increase freelance rates by 10-15% based on demand patterns",
  }

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Brain className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <CardTitle className="text-lg font-bold">AI Income Analyzer</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {isAnalyzing
                ? "Analyzing your income patterns..."
                : hasAnalyzed
                  ? "Smart insights from your income data"
                  : "Intelligent income analysis powered by AI"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {!hasAnalyzed && !isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto">
                <Brain className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">AI-Powered Income Analysis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                  Get intelligent insights about your income patterns, growth opportunities, and
                  personalized strategies to maximize your earnings.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>Growth Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Rate Optimization</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Income Diversification</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span>Smart Recommendations</span>
              </div>
            </div>

            <Button
              onClick={handleQuickAnalyze}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Quick Analyze
            </Button>
          </div>
        ) : isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
              <div
                className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-emerald-500 rounded-full animate-spin"
                style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
              />
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
              <p className="text-sm text-muted-foreground">
                Processing {analysisData.transactionsProcessed} income transactions...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Analysis Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-lg font-bold text-green-400">{formatCurrency(analysisData.totalAnalyzed)}</p>
                <p className="text-xs text-muted-foreground">Analyzed</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-lg font-bold text-blue-400">{analysisData.sourcesAnalyzed}</p>
                <p className="text-xs text-muted-foreground">Sources</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-lg font-bold text-purple-400">{analysisData.incomeEfficiency}%</p>
                <p className="text-xs text-muted-foreground">Efficiency</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-lg font-bold text-orange-400">{formatCurrency(analysisData.growthOpportunity)}</p>
                <p className="text-xs text-muted-foreground">Growth Potential</p>
              </div>
            </div>

            {/* Key Insights */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-400" />
                AI Insights
              </h4>

              <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">Income Pattern: {analysisData.earningPattern}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{analysisData.topInsight}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-blue-400" />
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
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
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
