"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { CalendarIcon, Loader2, Target, Plus, X, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import LocalStorageService from "@/lib/local-storage"
import { useAppData } from "@/hooks/use-app-data"
import type { Budget } from "@/lib/types"

interface CreateBudgetModalProps {
  isOpen: boolean
  onClose: () => void
}

const periods = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
]

const budgetTypes = [
  { value: "category", label: "Category Budget" },
  { value: "goal", label: "Goal-based Budget" },
  { value: "total", label: "Total Spending Budget" },
]

export function CreateBudgetModal({ isOpen, onClose }: CreateBudgetModalProps) {
  const { user, categories, goals, accounts, refreshData } = useAppData()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    category: "",
    goal: "",
    account: "",
    amount: "",
    period: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    description: "",
    autoRenew: true,
    alertThreshold: "80",
    tags: [] as string[],
    newTag: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Budget name is required"
    }
    if (!formData.type) {
      newErrors.type = "Budget type is required"
    }
    if (formData.type === "category" && !formData.category) {
      newErrors.category = "Category is required for category budget"
    }
    if (formData.type === "goal" && !formData.goal) {
      newErrors.goal = "Goal is required for goal-based budget"
    }
    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid budget amount is required"
    }
    if (!formData.period) {
      newErrors.period = "Time period is required"
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateEndDate = (startDate: Date, period: string): Date => {
    const endDate = new Date(startDate)
    switch (period) {
      case "weekly":
        endDate.setDate(endDate.getDate() + 7)
        break
      case "monthly":
        endDate.setMonth(endDate.getMonth() + 1)
        break
      case "quarterly":
        endDate.setMonth(endDate.getMonth() + 3)
        break
      case "yearly":
        endDate.setFullYear(endDate.getFullYear() + 1)
        break
    }
    return endDate
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (!validateForm() || !user) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsLoading(true)

    try {
      // Calculate end date if not provided
      const endDate = formData.endDate || calculateEndDate(formData.startDate!, formData.period)

      // Create new budget object
      const newBudget: Budget = {
        id: LocalStorageService.generateId(),
        user_id: user.id,
        category_id: formData.type === "category" ? formData.category : undefined,
        name: formData.name,
        amount: Number.parseFloat(formData.amount),
        spent: 0,
        period: formData.period as "weekly" | "monthly" | "quarterly" | "yearly",
        start_date: formData.startDate!.toISOString(),
        end_date: endDate.toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Save to localStorage
      LocalStorageService.addUserBudget(user.id, newBudget)

      window.dispatchEvent(new CustomEvent("budgetCreated", { detail: newBudget }))

      // Refresh app data to update all components
      await refreshData()

      const budgetTypeLabel = budgetTypes.find((t) => t.value === formData.type)?.label
      toast.success(`${budgetTypeLabel} "${formData.name}" created successfully!`, {
        description: `Budget of $${formData.amount} for ${formData.period} period has been set up.`,
        duration: 4000,
      })

      // Reset form
      setFormData({
        name: "",
        type: "",
        category: "",
        goal: "",
        account: "",
        amount: "",
        period: "",
        startDate: undefined,
        endDate: undefined,
        description: "",
        autoRenew: true,
        alertThreshold: "80",
        tags: [],
        newTag: "",
      })
      setErrors({})

      onClose()
    } catch (error) {
      console.error("Error creating budget:", error)
      toast.error("Failed to create budget. Please try again.", {
        description: "There was an error saving your budget. Please check your information and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: "",
        type: "",
        category: "",
        goal: "",
        account: "",
        amount: "",
        period: "",
        startDate: undefined,
        endDate: undefined,
        description: "",
        autoRenew: true,
        alertThreshold: "80",
        tags: [],
        newTag: "",
      })
      setErrors({})
      onClose()
    }
  }

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const expenseCategories = categories.filter((cat) => cat.type === "expense" && cat.is_active)
  const activeGoals = goals.filter((goal) => goal.is_active && !goal.is_completed)
  const userAccounts = accounts.filter((acc) => acc.is_active)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Create New Budget</DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Set spending limits and track your financial goals
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 px-6">
            <div className="space-y-6 pb-6">
              {/* Budget Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Budget Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Monthly Groceries, Vacation Fund"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className={cn(
                    "h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20",
                    errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Budget Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Budget Type *
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value, category: "", goal: "" }))}
                >
                  <SelectTrigger
                    className={cn(
                      "h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400",
                      errors.type && "border-red-500",
                    )}
                  >
                    <SelectValue placeholder="Select budget type" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.type}
                  </p>
                )}
              </div>

              {/* Category Selection (for category budget) */}
              {formData.type === "category" && (
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400",
                        errors.category && "border-red-500",
                      )}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.category}
                    </p>
                  )}
                </div>
              )}

              {/* Goal Selection (for goal-based budget) */}
              {formData.type === "goal" && (
                <div className="space-y-2">
                  <Label htmlFor="goal" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Goal *
                  </Label>
                  <Select
                    value={formData.goal}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, goal: value }))}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400",
                        errors.goal && "border-red-500",
                      )}
                    >
                      <SelectValue placeholder="Select a goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeGoals.map((goal) => (
                        <SelectItem key={goal.id} value={goal.id}>
                          <div className="flex flex-col">
                            <span>{goal.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ${goal.current_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.goal && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.goal}
                    </p>
                  )}
                </div>
              )}

              {/* Account Selection */}
              <div className="space-y-2">
                <Label htmlFor="account" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Account (Optional)
                </Label>
                <Select
                  value={formData.account}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, account: value }))}
                >
                  <SelectTrigger className="h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400">
                    <SelectValue placeholder="Select account (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {userAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex flex-col">
                          <span>{account.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ${account.balance.toLocaleString()} {account.currency}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Budget Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Budget Amount *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      $
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                      className={cn(
                        "pl-8 h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20",
                        errors.amount && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                      )}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.amount}
                    </p>
                  )}
                </div>

                {/* Time Period */}
                <div className="space-y-2">
                  <Label htmlFor="period" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Time Period *
                  </Label>
                  <Select
                    value={formData.period}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, period: value }))}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400",
                        errors.period && "border-red-500",
                      )}
                    >
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((period) => (
                        <SelectItem key={period.value} value={period.value}>
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.period && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.period}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full h-11 justify-start text-left font-normal border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
                          !formData.startDate && "text-muted-foreground",
                          errors.startDate && "border-red-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData((prev) => ({ ...prev, startDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">End Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full h-11 justify-start text-left font-normal border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
                          !formData.endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : "Pick end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData((prev) => ({ ...prev, endDate: date }))}
                        initialFocus
                        disabled={(date) => (formData.startDate ? date < formData.startDate : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Alert Threshold */}
              <div className="space-y-2">
                <Label htmlFor="alertThreshold" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Alert Threshold
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="alertThreshold"
                    type="number"
                    placeholder="80"
                    value={formData.alertThreshold}
                    onChange={(e) => setFormData((prev) => ({ ...prev, alertThreshold: e.target.value }))}
                    className="h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 max-w-24"
                    min="1"
                    max="100"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">% of budget spent triggers alert</span>
                </div>
              </div>

              {/* Auto Renew */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Auto Renew</Label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Automatically create a new budget when this period ends
                  </p>
                </div>
                <Switch
                  checked={formData.autoRenew}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, autoRenew: checked }))}
                />
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={formData.newTag}
                    onChange={(e) => setFormData((prev) => ({ ...prev, newTag: e.target.value }))}
                    className="h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTag}
                    className="h-11 px-4 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Add notes about this budget..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t bg-gray-50 dark:bg-gray-800/50">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 h-11 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Budget...
                  </>
                ) : (
                  "Create Budget"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
