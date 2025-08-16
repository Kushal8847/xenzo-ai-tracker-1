"use client"

import { Target, TrendingUp, AlertTriangle, CheckCircle, Plus, BarChart3 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BudgetWelcomeHeaderProps {
  onCreateBudget: () => void
}

export function BudgetWelcomeHeader({ onCreateBudget }: BudgetWelcomeHeaderProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-3xl blur-3xl" />
      <Card className="premium-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-500/20 to-blue-500/20 rounded-full blur-3xl transform -translate-x-24 translate-y-24" />

        <CardContent className="p-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-400 animate-pulse" />
                  <span className="text-caption text-muted-foreground font-medium">Budget Management</span>
                </div>
                <h1 className="text-display gradient-text">Stay On Track</h1>
                <p className="text-body text-muted-foreground max-w-2xl">
                  Set smart budgets and track your spending across categories. You're currently{" "}
                  <strong className="text-green-400">15% under budget</strong> this month.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  onClick={onCreateBudget}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Budget
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white/20 hover:bg-white/5">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Analytics
                </Button>
              </div>

              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-muted-foreground">4 budgets on track</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">1 budget warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-muted-foreground">85% avg utilization</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-float" />
                <div
                  className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-blue-500 opacity-70 animate-pulse-glow"
                  style={{ animationDelay: "1s" }}
                />
                <div
                  className="absolute inset-4 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-50 animate-float"
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
