"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react"
import { useAppData } from "@/hooks/use-app-data"
import { formatCurrency } from "@/lib/utils"
import { useMemo } from "react"

interface TransactionWelcomeHeaderProps {
  onAddTransaction: () => void
}

export function TransactionWelcomeHeader({ onAddTransaction }: TransactionWelcomeHeaderProps) {
  const { transactions, isLoading } = useAppData()

  // Calculate quick stats
  const stats = useMemo(() => {
    if (isLoading || transactions.length === 0) {
      return {
        totalTransactions: 0,
        totalIncome: 0,
        totalExpenses: 0,
        netFlow: 0,
      }
    }

    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return {
      totalTransactions: transactions.length,
      totalIncome,
      totalExpenses,
      netFlow: totalIncome - totalExpenses,
    }
  }, [transactions, isLoading])

  return (
    <Card className="premium-card overflow-hidden">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left side - Welcome content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Transaction Management</h1>
                <p className="text-muted-foreground">Track, analyze, and manage all your financial transactions</p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
                <p className="text-lg font-bold text-white">{stats.totalTransactions}</p>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-muted-foreground">Income</span>
                </div>
                <p className="text-lg font-bold text-green-400">{formatCurrency(stats.totalIncome)}</p>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-muted-foreground">Expenses</span>
                </div>
                <p className="text-lg font-bold text-red-400">{formatCurrency(stats.totalExpenses)}</p>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-muted-foreground">Net Flow</span>
                </div>
                <p className={`text-lg font-bold ${stats.netFlow >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {formatCurrency(stats.netFlow)}
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Action button */}
          <div className="flex flex-col items-end gap-4">
            <Button
              onClick={onAddTransaction}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Transaction
            </Button>

            <div className="flex gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                {transactions.filter((t) => t.type === "income").length} Income
              </Badge>
              <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                <TrendingDown className="w-3 h-3 mr-1" />
                {transactions.filter((t) => t.type === "expense").length} Expenses
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
