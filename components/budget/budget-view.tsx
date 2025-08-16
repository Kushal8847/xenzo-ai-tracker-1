"use client"

import { useState, useEffect, useMemo } from "react"
import { BudgetWelcomeHeader } from "./budget-welcome-header"
import { BudgetStatsCards } from "./budget-stats-cards"
import { BudgetAlerts } from "./budget-alerts"
import { BudgetList } from "./budget-list"
import { CreateBudgetModal } from "./create-budget-modal"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Target, ArrowRight, Plus, ShoppingCart, Utensils, Car, Gamepad2, Home, Coffee } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppData } from "@/hooks/use-app-data"

function CategoryBudgetCard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { budgets, categories, transactions } = useAppData()

  const getIconForCategory = (categoryName: string) => {
    const name = categoryName.toLowerCase()
    if (name.includes("food") || name.includes("grocery") || name.includes("groceries")) return ShoppingCart
    if (name.includes("dining") || name.includes("restaurant") || name.includes("eat")) return Utensils
    if (name.includes("transport") || name.includes("car") || name.includes("gas")) return Car
    if (name.includes("entertainment") || name.includes("game") || name.includes("movie")) return Gamepad2
    if (name.includes("utilities") || name.includes("home") || name.includes("rent")) return Home
    if (name.includes("coffee") || name.includes("cafe")) return Coffee
    return Target
  }

  const categoryBudgets = useMemo(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    return budgets
      .filter((budget) => budget.is_active && budget.category_id)
      .map((budget) => {
        const category = categories.find((cat) => cat.id === budget.category_id)

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

        const spent = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)

        return {
          name: category?.name || "Unknown Category",
          spent,
          budget: budget.amount,
          color: `bg-${category?.color?.replace("#", "") || "gray-500"}`,
          icon: getIconForCategory(category?.name || ""),
          budgetId: budget.id,
        }
      })
      .slice(0, 6)
  }, [budgets, categories, transactions])

  if (categoryBudgets.length === 0) {
    return (
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Category Budgets</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Track spending by category</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No category budgets created yet</p>
            <Button
              size="sm"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-create-budget-modal"))
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Category Budget
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Category Budgets</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Track spending by category</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {categoryBudgets.map((category, index) => {
            const Icon = category.icon
            const percentage = (category.spent / category.budget) * 100
            const isOverBudget = percentage > 100

            return (
              <div
                key={category.budgetId}
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${category.color}/20 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 text-white`} />
                    </div>
                    <span className="font-semibold text-sm">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{formatCurrency(category.spent)}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(category.budget)} limit</p>
                  </div>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className="h-2"
                  style={{
                    background: isOverBudget ? "rgba(239, 68, 68, 0.2)" : undefined,
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{percentage.toFixed(1)}% used</span>
                  <span>
                    {category.budget - category.spent > 0
                      ? `${formatCurrency(category.budget - category.spent)} left`
                      : `${formatCurrency(category.spent - category.budget)} over`}
                  </span>
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
            onClick={() => setIsModalOpen(true)}
          >
            View All Categories
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              All Category Budgets
            </DialogTitle>
            <DialogDescription>Complete overview of all your category budgets and spending limits</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            {categoryBudgets.map((category, index) => {
              const Icon = category.icon
              const percentage = (category.spent / category.budget) * 100
              const isOverBudget = percentage > 100

              return (
                <div
                  key={category.budgetId}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${category.color}/20 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-white`} />
                      </div>
                      <div>
                        <span className="font-semibold text-base">{category.name}</span>
                        <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}% of budget used</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(category.spent)}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(category.budget)} limit</p>
                    </div>
                  </div>

                  <Progress
                    value={Math.min(percentage, 100)}
                    className="h-3 mb-2"
                    style={{
                      background: isOverBudget ? "rgba(239, 68, 68, 0.2)" : undefined,
                    }}
                  />

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {category.budget - category.spent > 0
                        ? `${formatCurrency(category.budget - category.spent)} remaining`
                        : `${formatCurrency(category.spent - category.budget)} over budget`}
                    </span>
                    <Badge
                      variant={isOverBudget ? "destructive" : percentage > 80 ? "secondary" : "default"}
                      className="text-xs"
                    >
                      {isOverBudget ? "Over Budget" : percentage > 80 ? "Near Limit" : "On Track"}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/10">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              onClick={() => {
                setIsModalOpen(false)
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-create-budget-modal"))
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Budget
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export function BudgetView() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    const handleOpenCreateBudget = () => {
      setIsCreateModalOpen(true)
    }

    const handleBudgetCreated = () => {}

    window.addEventListener("open-create-budget-modal", handleOpenCreateBudget)
    window.addEventListener("budgetCreated", handleBudgetCreated)

    return () => {
      window.removeEventListener("open-create-budget-modal", handleOpenCreateBudget)
      window.removeEventListener("budgetCreated", handleBudgetCreated)
    }
  }, [])

  return (
    <div className="space-y-8 p-8">
      <BudgetWelcomeHeader onCreateBudget={() => setIsCreateModalOpen(true)} />
      <BudgetStatsCards />
      <BudgetAlerts />
      <div className="bento-grid">
        <div className="bento-item-6 bento-row-2">
          <BudgetList />
        </div>
        <div className="bento-item-6 bento-row-2">
          <CategoryBudgetCard />
        </div>
      </div>
      <CreateBudgetModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
