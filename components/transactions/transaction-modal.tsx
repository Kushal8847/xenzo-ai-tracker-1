"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Calendar, DollarSign, Tag, MapPin, CreditCard, FileText } from "lucide-react"
import type { TransactionWithCategory } from "@/lib/types"

interface TransactionModalProps {
  transaction: TransactionWithCategory | null
  isOpen: boolean
  onClose: () => void
}

export function TransactionModal({ transaction, isOpen, onClose }: TransactionModalProps) {
  if (!transaction) return null

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    return type?.toLowerCase() === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Amount and Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <span className="text-2xl font-bold">{formatCurrency(Math.abs(transaction.amount || 0))}</span>
            </div>
            <Badge className={getTypeColor(transaction.type || "")}>
              {(transaction.type || "Unknown").charAt(0).toUpperCase() + (transaction.type || "unknown").slice(1)}
            </Badge>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <Badge className={getStatusColor(transaction.status || "")}>
              {(transaction.status || "Unknown").charAt(0).toUpperCase() + (transaction.status || "unknown").slice(1)}
            </Badge>
          </div>

          {/* Description */}
          {transaction.description && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <span className="text-sm text-gray-600">Description</span>
                <p className="text-sm font-medium">{transaction.description}</p>
              </div>
            </div>
          )}

          {/* Category */}
          {transaction.category_name && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <div>
                <span className="text-sm text-gray-600">Category</span>
                <p className="text-sm font-medium">{transaction.category_name}</p>
              </div>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <span className="text-sm text-gray-600">Date</span>
              <p className="text-sm font-medium">
                {formatDate(transaction.transaction_date || new Date().toISOString())}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          {transaction.payment_method && (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <div>
                <span className="text-sm text-gray-600">Payment Method</span>
                <p className="text-sm font-medium">
                  {transaction.payment_method.charAt(0).toUpperCase() + transaction.payment_method.slice(1)}
                </p>
              </div>
            </div>
          )}

          {/* Location */}
          {transaction.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <span className="text-sm text-gray-600">Location</span>
                <p className="text-sm font-medium">{transaction.location}</p>
              </div>
            </div>
          )}

          {/* Account */}
          {transaction.account_name && (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <div>
                <span className="text-sm text-gray-600">Account</span>
                <p className="text-sm font-medium">{transaction.account_name}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
