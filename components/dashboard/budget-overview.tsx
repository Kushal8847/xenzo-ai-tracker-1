import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

const budgetCategories = [
  { name: "Groceries", spent: 850, budget: 1000, color: "bg-green-500", trend: "+5%" },
  { name: "Transport", spent: 320, budget: 400, color: "bg-blue-500", trend: "-12%" },
  { name: "Entertainment", spent: 450, budget: 500, color: "bg-purple-500", trend: "+8%" },
  { name: "Utilities", spent: 280, budget: 300, color: "bg-yellow-500", trend: "+2%" },
  { name: "Dining Out", spent: 620, budget: 600, color: "bg-red-500", trend: "+15%" },
  { name: "Shopping", spent: 340, budget: 800, color: "bg-pink-500", trend: "-25%" },
]

export function BudgetOverview() {
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0)
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budget, 0)
  const overallProgress = (totalSpent / totalBudget) * 100

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-title font-bold">Budget Overview</CardTitle>
              <CardDescription className="text-body text-muted-foreground">Monthly spending vs budgets</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-muted-foreground">Overall</p>
            <p className="text-lg font-bold">{overallProgress.toFixed(1)}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Total Budget Usage</span>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
              </span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetCategories.map((category, index) => {
              const percentage = (category.spent / category.budget) * 100
              const isOverBudget = percentage > 100
              const isNearLimit = percentage > 80 && percentage <= 100

              return (
                <div
                  key={category.name}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${category.color} shadow-lg`} />
                      <div>
                        <span className="font-semibold">{category.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          {isOverBudget && (
                            <Badge variant="destructive" className="text-xs px-2 py-0">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Over Budget
                            </Badge>
                          )}
                          {isNearLimit && !isOverBudget && (
                            <Badge variant="secondary" className="text-xs px-2 py-0 bg-yellow-500/20 text-yellow-400">
                              Near Limit
                            </Badge>
                          )}
                          <span
                            className={`text-xs font-medium ${
                              category.trend.startsWith("+") ? "text-red-400" : "text-green-400"
                            }`}
                          >
                            {category.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(category.spent)}</p>
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
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
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
        </div>
      </CardContent>
    </Card>
  )
}
