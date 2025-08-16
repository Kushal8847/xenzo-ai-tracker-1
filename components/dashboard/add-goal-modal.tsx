"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Target, Home, Car, Plane, GraduationCap, Heart, Wallet } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { addUserGoalWrapper } from "@/lib/local-storage"
import type { Goal } from "@/lib/types"

interface AddGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onGoalAdded?: (goal: Goal) => void
}

const goalCategories = [
  { value: "emergency", label: "Emergency Fund", icon: Target, color: "text-green-400" },
  { value: "house", label: "House/Property", icon: Home, color: "text-blue-400" },
  { value: "car", label: "Vehicle", icon: Car, color: "text-purple-400" },
  { value: "vacation", label: "Vacation/Travel", icon: Plane, color: "text-orange-400" },
  { value: "education", label: "Education", icon: GraduationCap, color: "text-indigo-400" },
  { value: "wedding", label: "Wedding", icon: Heart, color: "text-pink-400" },
  { value: "other", label: "Other", icon: Wallet, color: "text-gray-400" },
]

export function AddGoalModal({ isOpen, onClose, onGoalAdded }: AddGoalModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    target_amount: "",
    current_amount: "0",
    category: "",
    target_date: undefined as Date | undefined,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.target_amount || !formData.category) return

    setIsSubmitting(true)
    try {
      const newGoalData: Omit<Goal, "id" | "created_at" | "updated_at"> = {
        user_id: "user1", // Made consistent with SavingsGoals component
        name: formData.name,
        description: formData.description || undefined,
        target_amount: Number.parseFloat(formData.target_amount),
        current_amount: Number.parseFloat(formData.current_amount),
        target_date: formData.target_date?.toISOString(),
        category: formData.category,
        is_completed: false,
        is_active: true,
      }

      const savedGoal = addUserGoalWrapper(newGoalData)
      onGoalAdded?.(savedGoal)

      // Reset form
      setFormData({
        name: "",
        description: "",
        target_amount: "",
        current_amount: "0",
        category: "",
        target_date: undefined,
      })

      onClose()
    } catch (error) {
      console.error("Error adding goal:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCategory = goalCategories.find((cat) => cat.value === formData.category)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900/95 border-white/10 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">Create Savings Goal</DialogTitle>
              <DialogDescription className="text-gray-400">
                Set a target and track your progress towards your financial goals
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Goal Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-white">
              Goal Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Emergency Fund, New Car, Vacation"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-white">
              Category *
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-orange-500/50">
                <SelectValue placeholder="Select a category">
                  {selectedCategory && (
                    <div className="flex items-center gap-2">
                      <selectedCategory.icon className={`w-4 h-4 ${selectedCategory.color}`} />
                      <span>{selectedCategory.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 border-white/10 backdrop-blur-xl">
                {goalCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <SelectItem key={category.value} value={category.value} className="text-white hover:bg-white/5">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${category.color}`} />
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Target Amount */}
          <div className="space-y-2">
            <Label htmlFor="target_amount" className="text-sm font-medium text-white">
              Target Amount *
            </Label>
            <Input
              id="target_amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.target_amount}
              onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
              placeholder="0.00"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50"
              required
            />
          </div>

          {/* Current Amount */}
          <div className="space-y-2">
            <Label htmlFor="current_amount" className="text-sm font-medium text-white">
              Current Amount
            </Label>
            <Input
              id="current_amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.current_amount}
              onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
              placeholder="0.00"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50"
            />
          </div>

          {/* Target Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white">Target Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10",
                    !formData.target_date && "text-gray-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.target_date ? format(formData.target_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-900/95 border-white/10 backdrop-blur-xl" align="start">
                <Calendar
                  mode="single"
                  selected={formData.target_date}
                  onSelect={(date) => setFormData({ ...formData, target_date: date })}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-white">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add notes about this goal..."
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50 resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/5"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold"
              disabled={isSubmitting || !formData.name || !formData.target_amount || !formData.category}
            >
              {isSubmitting ? "Creating..." : "Create Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
