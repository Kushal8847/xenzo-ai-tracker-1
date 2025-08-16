"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calendar, ArrowRight, ShoppingCart } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useAppData } from "@/hooks/use-app-data"
import { useState } from "react"

export function CategoryBreakdown() {
  const { transactions, categories, isLoading } = useAppData()
  const [isViewAllExpensesModalOpen, setIsViewAllExpensesModalOpen] = useState(false)

  if (isLoading) {
    return (
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Expense Breakdown</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Latest transactions</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="h-16 bg-white/10 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const recentExpenses = transactions
    .filter((t) => t.type === "expense")
    .slice(0, 6)
    .map((transaction) => {
      const category = categories.find((c) => c.id === transaction.category_id)
      return {
        id: transaction.id,
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        category: category?.name || "Other",
        date: transaction.transaction_date,
        icon: ShoppingCart,
      }
    })

  const allExpenses = transactions
    .filter((t) => t.type === "expense")
    .slice(0, 12)
    .map((transaction) => {
      const category = categories.find((c) => c.id === transaction.category_id)
      return {
        id: transaction.id,
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        category: category?.name || "Other",
        date: transaction.transaction_date,
        icon: ShoppingCart,
      }
    })

  return (
    <>
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Expense Breakdown</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Latest transactions</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-3">
            {recentExpenses.map((expense, index) => {
              const Icon = expense.icon
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          {expense.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(expense.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-red-400">-{formatCurrency(expense.amount)}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-transparent border-white/20 hover:bg-white/5 group"
              onClick={() => setIsViewAllExpensesModalOpen(true)}
            >
              View All Expenses
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isViewAllExpensesModalOpen} onOpenChange={setIsViewAllExpensesModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>All Recent Expenses</DialogTitle>
            <DialogDescription>Your latest expense transactions</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
            {allExpenses.map((expense, index) => {
              const Icon = expense.icon
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-base truncate">{expense.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          {expense.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{formatDate(expense.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg text-red-400">-{formatCurrency(expense.amount)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
