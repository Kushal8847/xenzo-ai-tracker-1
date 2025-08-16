"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react"

interface CashFlowAnalysisProps {
  period: string
}

export function CashFlowAnalysis({ period }: CashFlowAnalysisProps) {
  const cashFlowData = {
    totalInflow: 32540,
    totalOutflow: 24180,
    netCashFlow: 8360,
    cashFlowHealth: 87,
    monthlyAverage: 1393,
    trend: "positive",
  }

  const flowBreakdown = [
    { type: "Salary", amount: 27000, percentage: 83, color: "bg-green-500" },
    { type: "Freelance", amount: 4200, percentage: 13, color: "bg-blue-500" },
    { type: "Investments", amount: 1340, percentage: 4, color: "bg-purple-500" },
  ]

  const outflowBreakdown = [
    { type: "Fixed Expenses", amount: 12000, percentage: 50, color: "bg-red-500" },
    { type: "Variable Expenses", amount: 8180, percentage: 34, color: "bg-orange-500" },
    { type: "Discretionary", amount: 4000, percentage: 16, color: "bg-yellow-500" },
  ]

  return (
    <Card className="premium-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Cash Flow Analysis</CardTitle>
            <p className="text-sm text-muted-foreground">Money flow patterns and health</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cash Flow Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">Total Inflow</span>
            </div>
            <div className="text-2xl font-bold text-green-400">${cashFlowData.totalInflow.toLocaleString()}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium">Total Outflow</span>
            </div>
            <div className="text-2xl font-bold text-red-400">${cashFlowData.totalOutflow.toLocaleString()}</div>
          </div>
        </div>

        {/* Net Cash Flow */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="font-medium">Net Cash Flow</span>
            </div>
            <div className="text-xl font-bold text-green-400">+${cashFlowData.netCashFlow.toLocaleString()}</div>
          </div>
        </div>

        {/* Cash Flow Health */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Cash Flow Health</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {cashFlowData.cashFlowHealth}% Healthy
            </Badge>
          </div>
          <Progress value={cashFlowData.cashFlowHealth} className="h-2" />
        </div>

        {/* Income Sources & Expense Categories - 2 Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Income Sources Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">Income Sources</h4>
            {flowBreakdown.map((item, index) => (
              <div
                key={item.type}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium">{item.type}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">${item.amount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* Expense Categories Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">Expense Categories</h4>
            {outflowBreakdown.map((item, index) => (
              <div
                key={item.type}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium">{item.type}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">${item.amount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-medium text-yellow-400">Tip: </span>
            <span className="text-muted-foreground">
              Your cash flow is healthy! Consider increasing automated savings by 5% to optimize growth.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
