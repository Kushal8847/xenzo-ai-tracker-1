"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useAppData } from "@/hooks/use-app-data"

interface CreativeBudgetCardProps extends React.HTMLAttributes<HTMLDivElement> {
  budgetId?: string
  variant?: "spending" | "savings" | "overview" | "goal"
}

const CreativeBudgetCard = React.forwardRef<HTMLDivElement, CreativeBudgetCardProps>(
  ({ className, budgetId, variant = "overview", ...props }, ref) => {
    const { budgets, transactions } = useAppData()

    const budget = budgetId ? budgets.find((b) => b.id === budgetId) : budgets[0]
    const spent = budget
      ? transactions
          .filter((t) => t.categoryId === budget.categoryId && t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0)
      : 0
    const remaining = budget ? budget.amount - spent : 0
    const percentage = budget ? Math.min((spent / budget.amount) * 100, 100) : 0

    const getStatusColor = () => {
      if (percentage >= 90) return "from-red-500 to-red-600"
      if (percentage >= 75) return "from-orange-500 to-orange-600"
      if (percentage >= 50) return "from-yellow-500 to-yellow-600"
      return "from-green-500 to-green-600"
    }

    const getGlowColor = () => {
      if (percentage >= 90) return "shadow-red-500/20"
      if (percentage >= 75) return "shadow-orange-500/20"
      if (percentage >= 50) return "shadow-yellow-500/20"
      return "shadow-green-500/20"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-slate-900/90 to-slate-800/90",
          "backdrop-blur-sm shadow-2xl transition-all duration-500 hover:scale-[1.02]",
          "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
          `before:bg-gradient-to-r ${getStatusColor()} before:mask-composite-subtract`,
          "before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]",
          getGlowColor(),
          className,
        )}
        {...props}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-lg animate-pulse delay-1000" />
        </div>

        <div className="relative p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">{budget?.name || "Budget Overview"}</h3>
              <p className="text-sm text-slate-300">
                {budget ? `$${remaining.toFixed(2)} remaining` : "Track your spending"}
              </p>
            </div>

            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-slate-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${(percentage / 100) * 175.93} 175.93`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop
                      offset="0%"
                      className={
                        percentage >= 90
                          ? "text-red-500"
                          : percentage >= 75
                            ? "text-orange-500"
                            : percentage >= 50
                              ? "text-yellow-500"
                              : "text-green-500"
                      }
                    />
                    <stop
                      offset="100%"
                      className={
                        percentage >= 90
                          ? "text-red-400"
                          : percentage >= 75
                            ? "text-orange-400"
                            : percentage >= 50
                              ? "text-yellow-400"
                              : "text-green-400"
                      }
                    />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{percentage.toFixed(0)}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300">Spent</span>
              <span className="font-semibold text-white">${spent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300">Budget</span>
              <span className="font-semibold text-white">${budget?.amount.toFixed(2) || "0.00"}</span>
            </div>

            <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getStatusColor()} transition-all duration-1000 ease-out rounded-full`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
              {percentage > 100 && <div className="absolute right-0 top-0 h-full w-2 bg-red-500 animate-pulse" />}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button className="flex-1 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105">
              Add Expense
            </button>
            <button className="flex-1 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 transform hover:scale-105">
              Edit Budget
            </button>
          </div>
        </div>

        <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-ping" />
        <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-500" />
      </div>
    )
  },
)

CreativeBudgetCard.displayName = "CreativeBudgetCard"

export { CreativeBudgetCard }
