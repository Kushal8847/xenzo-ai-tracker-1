"use client"

import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  MapPin,
  Clock,
  Search,
  Calendar,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Transaction, TransactionWithCategory } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useAppData } from "@/hooks/use-app-data"
import { useMemo } from "react"
import { TransactionModal } from "./transaction-modal"

interface TransactionListProps {
  filters: {
    search: string
    category: string
    type: string
    dateRange: string
  }
  setFilters: (filters: any) => void
  onViewTransaction: (transaction: Transaction) => void
}

export function TransactionList({ filters, setFilters, onViewTransaction }: TransactionListProps) {
  const { transactions, categories, accounts, isLoading } = useAppData()
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithCategory | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Enhanced transaction data with category and account information
  const enhancedTransactions = useMemo(() => {
    return transactions.map((transaction) => {
      const category = categories.find((cat) => cat.id === transaction.category_id)
      const account = accounts.find((acc) => acc.id === transaction.account_id)

      return {
        ...transaction,
        category_name: category?.name || "Unknown",
        category_color: category?.color || "#6b7280",
        account_name: account?.name || "Unknown Account",
        // Add mock data for display purposes
        location: transaction.type === "income" ? "Direct Deposit" : "Various Locations",
        paymentMethod: transaction.type === "income" ? "Bank Transfer" : "Credit Card",
        reference: `${(transaction.type || "").toUpperCase()}-${transaction.id.slice(-6)}`,
        balance: account?.balance || 0,
        merchant: transaction.description || "Unknown Merchant",
        tags: [transaction.type || "unknown", (category?.name || "general").toLowerCase()],
      }
    })
  }, [transactions, categories, accounts])

  // Filter transactions based on filters
  const filteredTransactions = useMemo(() => {
    return enhancedTransactions.filter((transaction) => {
      const searchTerm = (filters.search || "").toLowerCase()
      const description = (transaction.description || "").toLowerCase()
      const merchant = (transaction.merchant || "").toLowerCase()
      const location = (transaction.location || "").toLowerCase()
      const categoryName = (transaction.category_name || "").toLowerCase()

      const matchesSearch =
        searchTerm === "" ||
        description.includes(searchTerm) ||
        merchant.includes(searchTerm) ||
        location.includes(searchTerm) ||
        categoryName.includes(searchTerm)

      const matchesCategory =
        filters.category === "all" ||
        (transaction.category_name || "").toLowerCase() === (filters.category || "").toLowerCase()

      const matchesType = filters.type === "all" || transaction.type === filters.type

      // Date range filtering
      let matchesDateRange = true
      if (filters.dateRange !== "all") {
        const transactionDate = new Date(transaction.transaction_date)
        const now = new Date()

        // Check if date is valid
        if (!isNaN(transactionDate.getTime())) {
          switch (filters.dateRange) {
            case "today":
              matchesDateRange = transactionDate.toDateString() === now.toDateString()
              break
            case "week":
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
              matchesDateRange = transactionDate >= weekAgo
              break
            case "month":
              const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
              matchesDateRange = transactionDate >= monthAgo
              break
            case "quarter":
              const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
              matchesDateRange = transactionDate >= quarterAgo
              break
            case "year":
              const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
              matchesDateRange = transactionDate >= yearAgo
              break
          }
        }
      }

      return matchesSearch && matchesCategory && matchesType && matchesDateRange
    })
  }, [enhancedTransactions, filters])

  // Get unique categories for filter dropdown
  const availableCategories = useMemo(() => {
    const categorySet = new Set(enhancedTransactions.map((t) => t.category_name || "Unknown"))
    return Array.from(categorySet).sort()
  }, [enhancedTransactions])

  const handleTransactionClick = (transaction: TransactionWithCategory) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTransaction(null)
  }

  if (isLoading) {
    return (
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Table className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Transaction History</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Loading transactions...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-white/5 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Table className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Transaction History</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {filteredTransactions.length} transactions found
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              {filteredTransactions.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          {/* Filter Controls Section */}
          <div className="mb-6 space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions, merchants, descriptions..."
                className="pl-10 bg-white/5 border-white/10"
                value={filters.search || ""}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={filters.category || "all"}
                  onValueChange={(value) => setFilters({ ...filters, category: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={filters.type || "all"}
                  onValueChange={(value) => setFilters({ ...filters, type: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select
                  value={filters.dateRange || "all"}
                  onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quick Actions */}
            
          </div>

          <div className="rounded-lg border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-muted-foreground font-semibold">Transaction</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Merchant</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Category</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Payment</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">Amount</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Date</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction, index) => (
                  <TableRow
                    key={transaction.id}
                    className="border-white/10 hover:bg-white/5 transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.type === "income"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpRight className="w-5 h-5" />
                          ) : (
                            <ArrowDownLeft className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {transaction.description || "Unknown Transaction"}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground truncate">
                              {transaction.location || "Unknown Location"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{transaction.merchant || "Unknown Merchant"}</p>
                        <p className="text-xs text-muted-foreground">{transaction.reference || "No Reference"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          transaction.type === "income"
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {transaction.category_name || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-sm text-muted-foreground">{transaction.paymentMethod || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold ${
                        transaction.type === "income" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      <div>
                        <p className="font-bold">
                          {transaction.type === "income" ? "+" : ""}
                          {formatCurrency(Math.abs(transaction.amount || 0))}
                        </p>
                        <p className="text-xs text-muted-foreground">Bal: {formatCurrency(transaction.balance || 0)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{formatDate(transaction.transaction_date || "")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent border-white/20 hover:bg-white/5"
                        onClick={() => onViewTransaction(transaction)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Table className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
              <p className="text-muted-foreground">
                {transactions.length === 0
                  ? "Start by adding your first transaction to see it here."
                  : "Try adjusting your filters or search terms."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionModal transaction={selectedTransaction} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
