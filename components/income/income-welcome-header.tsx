"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, Plus, Calendar } from "lucide-react"
import { AddTransactionModal } from "@/components/dashboard/add-transaction-modal"
import { IncomeAnalyticsModal } from "./income-analytics-modal"
import { formatCurrency } from "@/lib/utils"

export function IncomeWelcomeHeader() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false)

  const monthlyGoal = 8000
  const currentIncome = 6750
  const goalProgress = (currentIncome / monthlyGoal) * 100

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl blur-3xl" />
        <Card className="premium-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-500/20 to-green-500/20 rounded-full blur-3xl transform -translate-x-24 translate-y-24" />

          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-400 animate-pulse" />
                    <span className="text-caption text-muted-foreground font-medium">Income Management</span>
                  </div>
                  <h1 className="text-display gradient-text">Maximize Your Earnings</h1>
                  <p className="text-body text-muted-foreground max-w-2xl">
                    Track and optimize your income streams with intelligent insights. You're{" "}
                    <strong className="text-green-400">{goalProgress.toFixed(0)}%</strong> towards your monthly goal of{" "}
                    <strong className="text-green-400">{formatCurrency(monthlyGoal)}</strong>.
                  </p>
                </div>

                {/* Monthly Goal Progress */}
                <div className="space-y-3 max-w-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Monthly Goal Progress</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                      {goalProgress.toFixed(0)}%
                    </Badge>
                  </div>
                  <Progress value={goalProgress} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatCurrency(currentIncome)} earned</span>
                    <span>{formatCurrency(monthlyGoal)} goal</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg transition-all duration-200"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Income
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white/20 hover:bg-white/5 transition-all duration-200"
                    onClick={() => setIsAnalyticsModalOpen(true)}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 animate-float" />
                  <div
                    className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 to-green-500 opacity-70 animate-pulse-glow"
                    style={{ animationDelay: "1s" }}
                  />
                  <div
                    className="absolute inset-4 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 opacity-50 animate-float"
                    style={{ animationDelay: "2s" }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="income"
        hideExpenseOption={true}
      />

      <IncomeAnalyticsModal isOpen={isAnalyticsModalOpen} onClose={() => setIsAnalyticsModalOpen(false)} />
    </>
  )
}
