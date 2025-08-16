"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, List, TrendingUp } from "lucide-react"
import { useAppData } from "@/hooks/use-app-data"

export function RecentTransactions() {
  const { transactions, categories, isLoading } = useAppData()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) {
    return (
      <Card className="h-full bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-white/5">
                <div className="h-12 w-12 bg-white/10 animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 animate-pulse rounded w-32" />
                  <div className="h-3 bg-white/10 animate-pulse rounded w-24" />
                </div>
                <div className="h-4 bg-white/10 animate-pulse rounded w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 2,
    }).format(Math.abs(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      month: "short",
      day: "numeric",
    })
  }

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const recentTransactions = transactions.slice(0, 6)

  const enhancedTransactions = transactions.map((transaction) => {
    const category = categories.find((cat) => cat.id === transaction.category_id)
    return {
      ...transaction,
      category_name: category?.name || "Unknown",
      category_color: category?.color || "#6b7280",
    }
  })

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  return (
    <>
      <Card className="h-full bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-white/10 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                Recent Transactions
              </CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div className="text-xs text-emerald-400">+{formatCurrency(totalIncome)}</div>
                <div className="text-xs text-rose-400">-{formatCurrency(totalExpenses)}</div>
                <div className="text-xs text-slate-400">{transactions.length} total</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/10">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="space-y-3 flex-1">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-slate-500" />
                </div>
                <p className="font-medium">No transactions yet</p>
                <p className="text-sm text-slate-500">Add your first transaction to get started</p>
              </div>
            ) : (
              <>
                {recentTransactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className="flex items-center space-x-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110 ${
                        transaction.type === "income"
                          ? "bg-gradient-to-br from-emerald-500/20 to-green-600/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-gradient-to-br from-rose-500/20 to-red-600/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-white leading-none">{transaction.description}</p>
                      <p className="text-xs text-slate-400">{formatDate(transaction.transaction_date)}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <p
                        className={`text-sm font-bold ${
                          transaction.type === "income" ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-white/10 text-slate-300 border-white/20 hover:bg-white/20"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}

                {transactions.length > 6 && (
                  <div className="pt-4 border-t border-white/10">
                    <Button
                      variant="outline"
                      className="w-full bg-gradient-to-r from-white/5 to-white/10 border-white/20 text-white hover:from-white/10 hover:to-white/20 hover:border-white/30 transition-all duration-200"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <List className="h-4 w-4 mr-2" />
                      View All Transactions ({transactions.length})
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden bg-slate-900/95 border-white/20 backdrop-blur-xl">
          <DialogHeader className="border-b border-white/10 pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              <List className="h-6 w-6 text-emerald-400" />
              All Transactions ({transactions.length})
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[65vh] custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-slate-300 font-semibold">Transaction</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Category</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Date</TableHead>
                  <TableHead className="text-right text-slate-300 font-semibold">Amount</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enhancedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "income"
                              ? "bg-gradient-to-br from-emerald-500/20 to-green-600/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-gradient-to-br from-rose-500/20 to-red-600/20 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{transaction.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-white/10 text-slate-300 border-white/20">
                        {transaction.category_name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{formatFullDate(transaction.transaction_date)}</TableCell>
                    <TableCell
                      className={`text-right font-bold ${
                        transaction.type === "income" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs bg-white/10 text-slate-300 border-white/20">
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
