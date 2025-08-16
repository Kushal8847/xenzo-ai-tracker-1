"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Clock, Activity } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useAppData } from "@/hooks/use-app-data"
import { useMemo } from "react"

export function RecentActivity() {
  const { transactions, categories, isLoading } = useAppData()

  const recentTransactions = useMemo(() => {
    if (isLoading || transactions.length === 0) return []

    return transactions
      .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
      .slice(0, 10)
      .map((transaction) => {
        const category = categories.find((cat) => cat.id === transaction.category_id)
        return {
          ...transaction,
          category_name: category?.name || "Unknown",
          category_color: category?.color || "#6b7280",
        }
      })
  }, [transactions, categories, isLoading])

  if (isLoading) {
    return (
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Loading transactions...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-white/5 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Latest {recentTransactions.length} transactions
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{recentTransactions.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold mb-1">No transactions yet</h3>
            <p className="text-xs text-muted-foreground">Add your first transaction to see activity here.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {recentTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === "income" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownLeft className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm truncate text-white">{transaction.description}</p>
                    <p
                      className={`font-bold text-sm ${
                        transaction.type === "income" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : ""}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                        {transaction.category_name}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDate(transaction.transaction_date)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
