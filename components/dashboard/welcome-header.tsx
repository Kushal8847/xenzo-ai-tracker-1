"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import { AddTransactionModal } from "./add-transaction-modal"
import { CashFlowAnalysis } from "./cash-flow-analysis"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function WelcomeHeader() {
  const currentTime = new Date().getHours()
  const greeting = currentTime < 12 ? "Good morning" : currentTime < 18 ? "Good afternoon" : "Good evening"
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false)
  const [isCashFlowModalOpen, setIsCashFlowModalOpen] = useState(false)

  return (
    <>
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
                    <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                    <span className="text-caption text-muted-foreground font-medium">{greeting}, Sarah</span>
                  </div>
                  <h1 className="text-display gradient-text">Your Financial Journey</h1>
                  <p className="text-body text-muted-foreground max-w-2xl">
                    Track, analyze, and optimize your spending with AI-powered insights. You're on track to save{" "}
                    <strong className="text-green-400">{formatCurrency(1250)}</strong> this month.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                    onClick={() => setIsAddTransactionModalOpen(true)}
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    Add Transaction
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white/20 hover:bg-white/5"
                    onClick={() => setIsCashFlowModalOpen(true)}
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    View Reports
                  </Button>
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

      <AddTransactionModal isOpen={isAddTransactionModalOpen} onClose={() => setIsAddTransactionModalOpen(false)} />
      <Dialog open={isCashFlowModalOpen} onOpenChange={setIsCashFlowModalOpen}>
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl border-white/10"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Cash Flow Analysis</DialogTitle>
          </DialogHeader>
          <CashFlowAnalysis period="monthly" />
        </DialogContent>
      </Dialog>
    </>
  )
}
