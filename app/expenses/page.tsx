"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { AddTransactionModal } from "@/components/dashboard/add-transaction-modal"

export default function ExpensesPage() {
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false)

  return (
    <div className="grid gap-4 md:gap-8">
      <Card className="material-background">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>Track and manage your expenses.</CardDescription>
          </div>
          <Button
            size="sm"
            className="gap-1 bg-red-600 hover:bg-red-700"
            onClick={() => setIsAddExpenseModalOpen(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Expense</span>
          </Button>
        </CardHeader>
        <CardContent>
          {/* Placeholder for expense-specific content, e.g., a form or detailed list */}
          <p>Expense management features will be here.</p>
        </CardContent>
      </Card>
      <RecentTransactions />

      {/* Add Expense Modal */}
      <AddTransactionModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        defaultType="expense"
        hideIncomeOption={true}
      />
    </div>
  )
}
