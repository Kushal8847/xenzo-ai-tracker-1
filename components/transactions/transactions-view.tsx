"use client"

import { useState } from "react"
import { TransactionWelcomeHeader } from "./transaction-welcome-header"
import { TransactionStatsCards } from "./transaction-stats-cards"
import { TransactionList } from "./transaction-list"
import { TransactionModal } from "./transaction-modal"
import { RecentActivity } from "./recent-activity"
import { TransactionInsights } from "./transaction-insights"
import { TransactionTrends } from "./transaction-trends"
import type { Transaction } from "@/lib/data"
import { AITransactionAnalyzer } from "./ai-transaction-analyzer"
import { AddTransactionModal } from "@/components/dashboard/add-transaction-modal"

export function TransactionsView() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
    dateRange: "all",
  })

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTransaction(null)
  }

  const handleAddTransaction = () => {
    setIsAddTransactionModalOpen(true)
  }

  const handleCloseAddTransactionModal = () => {
    setIsAddTransactionModalOpen(false)
  }

  return (
    <div className="space-y-8 p-8">
      {/* Welcome Header with Add Transaction Button */}
      <TransactionWelcomeHeader onAddTransaction={handleAddTransaction} />

      {/* Stats Overview - Now using live data */}
      <TransactionStatsCards />

      {/* Main Bento Grid Layout */}
      <div className="bento-grid">
        {/* Row 1: Transaction List (Full Width) - Now using live data */}
        <div className="bento-item-12 bento-row-2">
          <TransactionList filters={filters} setFilters={setFilters} onViewTransaction={handleViewTransaction} />
        </div>

        {/* Row 2: Recent Activity + Insights + Transaction Trends (1:1:1) - All using live data */}
        <div className="bento-item-4 bento-row-2">
          <RecentActivity />
        </div>
        <div className="bento-item-4 bento-row-2">
          <TransactionInsights />
        </div>
        <div className="bento-item-4 bento-row-2">
          <TransactionTrends />
        </div>

        {/* Row 3: AI Transaction Analyzer (Full Width) */}
        <div className="bento-item-12 bento-row-1">
          <AITransactionAnalyzer />
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal transaction={selectedTransaction} isOpen={isModalOpen} onClose={handleCloseModal} />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={handleCloseAddTransactionModal}
        defaultType="income"
        hideExpenseOption={false}
        hideIncomeOption={false}
      />
    </div>
  )
}
