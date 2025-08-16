"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Upload,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import LocalStorageService from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"
import { DatePicker } from "@/components/ui/date-picker"
import { useAppData } from "@/hooks/use-app-data"
import { useNotifications } from "@/contexts/notification-context"
import { formatCurrency } from "@/lib/utils"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  defaultType?: "income" | "expense"
  hideExpenseOption?: boolean
  hideIncomeOption?: boolean
}

export function AddTransactionModal({
  isOpen,
  onClose,
  defaultType = "income",
  hideExpenseOption = false,
  hideIncomeOption = false,
}: AddTransactionModalProps) {
  const { toast } = useToast()
  const { user, refreshData } = useAppData()
  const { addNotification } = useNotifications()
  const [transactionType, setTransactionType] = useState<"income" | "expense">(defaultType)
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [location, setLocation] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [notes, setNotes] = useState("")
  const [receipt, setReceipt] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dropdown states
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)

  // Update transaction type when defaultType changes
  useEffect(() => {
    setTransactionType(defaultType)
  }, [defaultType])

  const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Personal Care",
    "Home & Garden",
    "Groceries",
    "Gas & Fuel",
    "Insurance",
    "Subscriptions",
    "Clothing",
    "Electronics",
    "Gifts & Donations",
    "Pet Care",
    "Sports & Fitness",
    "Other",
  ]

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Business Income",
    "Investments",
    "Dividends",
    "Rental Income",
    "Royalties",
    "Gifts",
    "Bonuses",
    "Commission",
    "Side Hustle",
    "Pension",
    "Social Security",
    "Tax Refund",
    "Interest Income",
    "Capital Gains",
    "Consulting",
    "Part-time Job",
    "Cashback & Rewards",
    "Other",
  ]

  const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "Wire Transfer",
    "PayPal",
    "Venmo",
    "Zelle",
    "Apple Pay",
    "Google Pay",
    "Samsung Pay",
    "Cryptocurrency",
    "Check",
    "Money Order",
    "Direct Deposit",
    "ACH Transfer",
    "Mobile Banking",
    "Online Banking",
    "Gift Card",
    "Other",
  ]

  const categories = transactionType === "income" ? incomeCategories : expenseCategories

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const newErrors: Record<string, string> = {}

    // Validation
    if (!amount || Number.parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }
    if (!description.trim()) {
      newErrors.description = "Description is required"
    }
    if (!category) {
      newErrors.category = "Please select a category"
    }
    if (!paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method"
    }
    if (!date) {
      newErrors.date = "Please select a date"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0 && user) {
      try {
        // Find or create category
        const categoryObj = LocalStorageService.findOrCreateCategory(user.id, category, transactionType)

        // Create new transaction
        const newTransaction = {
          id: LocalStorageService.generateId(),
          user_id: user.id,
          account_id: "acc-1", // Default account - you might want to make this selectable
          category_id: categoryObj.id,
          amount: transactionType === "income" ? Number.parseFloat(amount) : -Math.abs(Number.parseFloat(amount)),
          description,
          transaction_date: date.toISOString(),
          type: transactionType,
          status: "completed" as const,
          notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // Save to localStorage
        LocalStorageService.addUserTransaction(user.id, newTransaction)

        // Refresh app data to trigger UI updates
        await refreshData()

        addNotification({
          type: transactionType === "income" ? "income" : "expense",
          title: `${transactionType === "income" ? "Income" : "Expense"} Added`,
          message: `${transactionType === "income" ? "Income" : "Expense"} of ${formatCurrency(Math.abs(Number.parseFloat(amount)))} from ${category} has been recorded successfully.`,
          severity: "low",
        })

        // Show success toast
        toast({
          title: "Success!",
          description: `${transactionType === "income" ? "Income" : "Expense"} of $${amount} has been added successfully.`,
          duration: 3000,
        })

        handleReset()
        onClose()
      } catch (error) {
        // Show error toast
        toast({
          title: "Error",
          description: "Failed to save transaction. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
        console.error("Error saving transaction:", error)
      }
    } else {
      // Show validation error toast
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
        duration: 3000,
      })
    }

    setIsSubmitting(false)
  }

  const handleReset = () => {
    setAmount("")
    setDescription("")
    setCategory("")
    setPaymentMethod("")
    setDate(new Date())
    setLocation("")
    setTags([])
    setNewTag("")
    setNotes("")
    setReceipt(null)
    setErrors({})
    setCategoryOpen(false)
    setPaymentOpen(false)
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB.",
          variant: "destructive",
          duration: 3000,
        })
        return
      }
      setReceipt(file)
      toast({
        title: "File uploaded",
        description: `${file.name} has been attached successfully.`,
        duration: 2000,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl border-white/10"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            {hideIncomeOption ? (
              <TrendingDown className="w-5 h-5 text-red-400" />
            ) : (
              <TrendingUp className="w-5 h-5 text-green-400" />
            )}
            {hideExpenseOption ? "Add New Income" : hideIncomeOption ? "Add New Expense" : "Add New Transaction"}
          </DialogTitle>
          <p className="text-sm text-gray-400">
            {hideExpenseOption
              ? "Record your income details below"
              : hideIncomeOption
                ? "Record your expense details below"
                : `Fill in the details for your ${transactionType}`}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type Toggle */}
          {!hideExpenseOption && !hideIncomeOption ? (
            <div className="flex gap-2">
              <Button
                type="button"
                variant={transactionType === "income" ? "default" : "outline"}
                className={cn(
                  "flex-1 transition-all duration-200",
                  transactionType === "income"
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                    : "bg-transparent border-green-600/30 text-green-400 hover:bg-green-600/10 hover:border-green-600/50",
                )}
                onClick={() => {
                  setTransactionType("income")
                  setCategory("") // Reset category when switching types
                }}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Income
              </Button>
              <Button
                type="button"
                variant={transactionType === "expense" ? "default" : "outline"}
                className={cn(
                  "flex-1 transition-all duration-200",
                  transactionType === "expense"
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    : "bg-transparent border-red-600/30 text-red-400 hover:bg-red-600/10 hover:border-red-600/50",
                )}
                onClick={() => {
                  setTransactionType("expense")
                  setCategory("") // Reset category when switching types
                }}
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Expense
              </Button>
            </div>
          ) : hideExpenseOption ? (
            <div className="flex items-center justify-center p-4 rounded-lg bg-green-600/20 border border-green-600/30 backdrop-blur-sm">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              <span className="text-green-400 font-semibold">Adding Income Transaction</span>
            </div>
          ) : (
            <div className="flex items-center justify-center p-4 rounded-lg bg-red-600/20 border border-red-600/30 backdrop-blur-sm">
              <TrendingDown className="w-5 h-5 mr-2 text-red-400" />
              <span className="text-red-400 font-semibold">Adding Expense Transaction</span>
            </div>
          )}

          {/* Amount and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white font-medium">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Amount *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={cn(
                  "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 transition-all duration-200",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                  errors.amount && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                )}
              />
              {errors.amount && (
                <p className="text-red-400 text-sm flex items-center gap-1 animate-in slide-in-from-left-2">
                  <AlertCircle className="w-3 h-3" />
                  {errors.amount}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white font-medium">
                Description *
              </Label>
              <Input
                id="description"
                placeholder="What was this transaction for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={cn(
                  "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 transition-all duration-200",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                  errors.description && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                )}
              />
              {errors.description && (
                <p className="text-red-400 text-sm flex items-center gap-1 animate-in slide-in-from-left-2">
                  <AlertCircle className="w-3 h-3" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Category and Payment Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div className="space-y-2">
              <Label className="text-white font-medium">Category *</Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setCategoryOpen(!categoryOpen)
                    setPaymentOpen(false)
                  }}
                  className={cn(
                    "w-full h-11 px-3 py-2 border-2 rounded-md bg-gray-800/50 text-left flex items-center justify-between transition-all duration-200",
                    categoryOpen ? "border-blue-500 ring-1 ring-blue-500/20" : "border-gray-700 hover:border-blue-300",
                    !category && "text-gray-400",
                    errors.category && "border-red-500",
                  )}
                >
                  <span className="flex items-center gap-2 text-white">{category || "Select category"}</span>
                  <ChevronDown
                    className={cn("w-4 h-4 text-gray-400 transition-transform", categoryOpen && "rotate-180")}
                  />
                </button>

                {categoryOpen && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800/95 backdrop-blur-xl border-2 border-blue-500 rounded-md shadow-2xl max-h-60 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat)
                          setCategoryOpen(false)
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-blue-500/20 transition-colors flex items-center justify-between group text-white"
                      >
                        <span>{cat}</span>
                        {category === cat && <Check className="w-4 h-4 text-blue-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.category && (
                <p className="text-red-400 text-sm flex items-center gap-1 animate-in slide-in-from-left-2">
                  <AlertCircle className="w-3 h-3" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Payment Method Dropdown */}
            <div className="space-y-2">
              <Label className="text-white font-medium">Payment Method *</Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentOpen(!paymentOpen)
                    setCategoryOpen(false)
                  }}
                  className={cn(
                    "w-full h-11 px-3 py-2 border-2 rounded-md bg-gray-800/50 text-left flex items-center justify-between transition-all duration-200",
                    paymentOpen ? "border-blue-500 ring-1 ring-blue-500/20" : "border-gray-700 hover:border-blue-300",
                    !paymentMethod && "text-gray-400",
                    errors.paymentMethod && "border-red-500",
                  )}
                >
                  <span className="flex items-center gap-2 text-white">{paymentMethod || "Select payment method"}</span>
                  <ChevronDown
                    className={cn("w-4 h-4 text-gray-400 transition-transform", paymentOpen && "rotate-180")}
                  />
                </button>

                {paymentOpen && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800/95 backdrop-blur-xl border-2 border-blue-500 rounded-md shadow-2xl max-h-60 overflow-y-auto">
                    {paymentMethods.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(method)
                          setPaymentOpen(false)
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-blue-500/20 transition-colors flex items-center justify-between group text-white"
                      >
                        <span>{method}</span>
                        {paymentMethod === method && <Check className="w-4 h-4 text-blue-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.paymentMethod && (
                <p className="text-red-400 text-sm flex items-center gap-1 animate-in slide-in-from-left-2">
                  <AlertCircle className="w-3 h-3" />
                  {errors.paymentMethod}
                </p>
              )}
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-white font-medium">Date *</Label>
            <DatePicker
              date={date}
              onDateChange={(newDate) => {
                if (newDate) {
                  setDate(newDate)
                  if (errors.date) {
                    setErrors((prev) => ({ ...prev, date: "" }))
                  }
                }
              }}
              placeholder="Pick a date"
              className={cn(errors.date && "border-red-500 focus:border-red-500 focus:ring-red-500/20")}
            />
            {errors.date && (
              <p className="text-red-400 text-sm flex items-center gap-1 animate-in slide-in-from-left-2">
                <AlertCircle className="w-3 h-3" />
                {errors.date}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-white font-medium">
              Location
            </Label>
            <Input
              id="location"
              placeholder="Where did this happen?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-white font-medium">Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-700/80 bg-transparent transition-all duration-200 hover:border-gray-600"
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-blue-600/20 text-blue-400 border-blue-600/30 hover:bg-blue-600/30 transition-colors duration-150"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-blue-300 transition-colors duration-150"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white font-medium">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 min-h-[80px] transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          {/* Receipt Upload */}
          <div className="space-y-2">
            <Label className="text-white font-medium">Receipt</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="bg-gray-800/50 border-gray-700 text-white file:bg-gray-700 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {receipt && (
                <Badge
                  variant="outline"
                  className="border-green-600/30 text-green-400 bg-green-600/10 animate-in slide-in-from-right-2"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  {receipt.name.length > 20 ? `${receipt.name.substring(0, 20)}...` : receipt.name}
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-500">Max file size: 5MB. Supported formats: JPG, PNG, PDF</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700/50">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex-1 transition-all duration-200 shadow-lg",
                hideIncomeOption
                  ? "bg-red-600 hover:bg-red-700 hover:shadow-red-600/25"
                  : "bg-green-600 hover:bg-green-700 hover:shadow-green-600/25",
                isSubmitting && "opacity-50 cursor-not-allowed",
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {hideExpenseOption
                    ? "Add Income"
                    : hideIncomeOption
                      ? "Add Expense"
                      : `Add ${transactionType === "income" ? "Income" : "Expense"}`}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
              className="border-gray-700 text-white hover:bg-gray-700/80 bg-transparent transition-all duration-200 hover:border-gray-600"
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-gray-700 text-white hover:bg-gray-700/80 bg-transparent transition-all duration-200 hover:border-gray-600"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
