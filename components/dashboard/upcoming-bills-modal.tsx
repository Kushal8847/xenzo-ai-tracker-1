"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Bill {
  id: number
  name: string
  amount: number
  dueDate: string
  icon: any
  color: string
  status: string
  description?: string
  category?: string
}

interface UpcomingBillsModalProps {
  isOpen: boolean
  onClose: () => void
  bills: Bill[]
}

export function UpcomingBillsModal({ isOpen, onClose, bills }: UpcomingBillsModalProps) {
  const [paidBills, setPaidBills] = useState<Set<number>>(new Set())

  const markAsPaid = (billId: number) => {
    setPaidBills((prev) => new Set([...prev, billId]))
  }

  const totalUnpaid = bills.filter((bill) => !paidBills.has(bill.id)).reduce((sum, bill) => sum + bill.amount, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] bg-black/95 border-white/10">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-400 bg-clip-text text-transparent">
                All Upcoming Bills
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                Manage your upcoming payments and due dates
              </DialogDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Unpaid</p>
              <p className="text-xl font-bold text-white">{formatCurrency(totalUnpaid)}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
          {bills.map((bill) => {
            const Icon = bill.icon
            const daysUntilDue = Math.max(
              0,
              Math.ceil((new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
            )
            const isPaid = paidBills.has(bill.id)

            return (
              <Card key={bill.id} className={`premium-card transition-all duration-300 ${isPaid ? "opacity-50" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-6 h-6 ${bill.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white text-lg">{bill.name}</h3>
                          {isPaid && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{bill.category || "Utility"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-bold text-white text-lg">{formatCurrency(bill.amount)}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="text-sm text-white font-medium">{new Date(bill.dueDate).toLocaleDateString()}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Days Left</p>
                        <Badge
                          variant={daysUntilDue <= 3 ? "destructive" : daysUntilDue <= 7 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {daysUntilDue === 0 ? "Due Today" : `${daysUntilDue} days`}
                        </Badge>
                      </div>

                      {!isPaid && (
                        <Button
                          onClick={() => markAsPaid(bill.id)}
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex-shrink-0"
                        >
                          Mark as Paid
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
