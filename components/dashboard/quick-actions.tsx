"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Upload, Download, Calculator, Zap } from "lucide-react"
import { useState } from "react"
import { AddTransactionModal } from "./add-transaction-modal"
import { ViewReportsModal } from "./view-reports-modal"

const actions = [
  {
    title: "Add Income",
    description: "Record new income",
    icon: Plus,
    color:
      "bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 hover:from-green-500/30 hover:to-emerald-500/30 border-green-500/20",
    action: "income" as const,
  },
  {
    title: "Add Expense",
    description: "Log an expense",
    icon: Minus,
    color:
      "bg-gradient-to-br from-red-500/20 to-rose-500/20 text-red-400 hover:from-red-500/30 hover:to-rose-500/30 border-red-500/20",
    action: "expense" as const,
  },
  {
    title: "Budget Planner",
    description: "Plan your budget",
    icon: Calculator,
    color:
      "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 hover:from-blue-500/30 hover:to-cyan-500/30 border-blue-500/20",
    action: null,
  },
  {
    title: "Import Bank",
    description: "Upload statements",
    icon: Upload,
    color:
      "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-400 hover:from-yellow-500/30 hover:to-orange-500/30 border-yellow-500/20",
    action: null,
  },
  {
    title: "View Reports",
    description: "Live financial data",
    icon: Download,
    color:
      "bg-gradient-to-br from-pink-500/20 to-rose-500/20 text-pink-400 hover:from-pink-500/30 hover:to-rose-500/30 border-pink-500/20",
    action: "reports" as const,
  },
]

export function QuickActions() {
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false)
  const [isViewReportsModalOpen, setIsViewReportsModalOpen] = useState(false)
  const [modalDefaultType, setModalDefaultType] = useState<"income" | "expense">("income")
  const [hideExpenseOption, setHideExpenseOption] = useState(false)
  const [hideIncomeOption, setHideIncomeOption] = useState(false)

  const handleActionClick = (action: (typeof actions)[0]) => {
    if (action.action === "income") {
      setModalDefaultType("income")
      setHideExpenseOption(true)
      setHideIncomeOption(false)
      setIsAddTransactionModalOpen(true)
    } else if (action.action === "expense") {
      setModalDefaultType("expense")
      setHideExpenseOption(false)
      setHideIncomeOption(true)
      setIsAddTransactionModalOpen(true)
    } else if (action.action === "reports") {
      setIsViewReportsModalOpen(true)
    } else {
      // Handle other actions here
      console.log(`${action.title} clicked`)
    }
  }

  const handleModalClose = () => {
    setIsAddTransactionModalOpen(false)
    // Reset modal options
    setHideExpenseOption(false)
    setHideIncomeOption(false)
  }

  return (
    <>
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Manage your finances efficiently
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="grid grid-cols-1 gap-3 h-full">
            {actions.map((action, index) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.title}
                  variant="ghost"
                  className={`h-auto p-3 flex items-center gap-3 justify-start ${action.color} border transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleActionClick(action)}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm">{action.title}</p>
                    <p className="text-xs opacity-70">{action.description}</p>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={handleModalClose}
        defaultType={modalDefaultType}
        hideExpenseOption={hideExpenseOption}
        hideIncomeOption={hideIncomeOption}
      />

      <ViewReportsModal isOpen={isViewReportsModalOpen} onClose={() => setIsViewReportsModalOpen(false)} />
    </>
  )
}
