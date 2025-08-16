"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import { useAppData } from "@/hooks/use-app-data"
import { useMemo } from "react"

export function BudgetList() {
  const { budgets, categories, transactions } = useAppData()

  const budgetData = useMemo(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    return budgets
      .filter((budget) => budget.is_active)
      .map((budget) => {
        const category = categories.find((cat) => cat.id === budget.category_id)

        // Calculate actual spent amount from transactions
        let actualSpent = 0
        if (budget.category_id) {
          const categoryTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.transaction_date)
            return (
              transaction.category_id === budget.category_id &&
              transaction.type === "expense" &&
              transaction.status === "completed" &&
              transactionDate.getMonth() === currentMonth &&
              transactionDate.getFullYear() === currentYear
            )
          })
          actualSpent = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
        } else {
          actualSpent = budget.spent
        }

        const percentage = budget.amount > 0 ? (actualSpent / budget.amount) * 100 : 0
        const isOverBudget = actualSpent > budget.amount
        const remaining = Math.max(0, budget.amount - actualSpent)

        return {
          ...budget,
          category_name: category?.name || "General",
          category_color: category?.color || "#6b7280",
          actualSpent,
          percentage: Math.min(percentage, 100),
          isOverBudget,
          remaining,
          status: isOverBudget ? "over" : percentage > 80 ? "warning" : "good",
        }
      })
      .sort((a, b) => b.percentage - a.percentage) // Sort by percentage used
  }, [budgets, categories, transactions])

  if (budgetData.length === 0) {
    return (
      <Card className="glass-card border-white/10">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Budgets Created</h3>
          <p className="text-muted-foreground mb-4">Create your first budget to start tracking your spending</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {budgetData.map((budget) => (
        <Card key={budget.id} className="glass-card border-white/10 hover:border-white/20 transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: budget.category_color }} />
                <div>
                  <CardTitle className="text-base font-semibold">{budget.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{budget.category_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    budget.status === "over" ? "destructive" : budget.status === "warning" ? "secondary" : "default"
                  }
                  className={
                    budget.status === "over"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : budget.status === "warning"
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        : "bg-green-500/10 text-green-400 border-green-500/20"
                  }
                >
                  {budget.status === "over" ? "Over Budget" : budget.status === "warning" ? "Warning" : "On Track"}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Budget
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Budget
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-medium">
                  {formatCurrency(budget.actualSpent)} of {formatCurrency(budget.amount)}
                </span>
              </div>
              <Progress
                value={budget.percentage}
                className="h-2"
                style={
                  {
                    "--progress-background":
                      budget.status === "over"
                        ? "rgb(239 68 68)"
                        : budget.status === "warning"
                          ? "rgb(245 158 11)"
                          : "rgb(34 197 94)",
                  } as React.CSSProperties
                }
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {budget.isOverBudget
                    ? `Over by ${formatCurrency(budget.actualSpent - budget.amount)}`
                    : `${formatCurrency(budget.remaining)} remaining`}
                </span>
                <span className="font-medium">{Math.round(budget.percentage)}%</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Period: {budget.period} •{new Date(budget.start_date).toLocaleDateString()} -{" "}
                {new Date(budget.end_date).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
