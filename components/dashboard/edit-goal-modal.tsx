"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Target, Home, Car, Plane, GraduationCap, Heart, Gift, Briefcase } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { updateUserGoalWrapper } from "@/lib/local-storage"
import type { Goal } from "@/lib/types"

interface EditGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onGoalUpdated: (updatedGoal: Goal) => void
  goal: Goal | null
}

const categories = [
  { value: "emergency", label: "Emergency Fund", icon: Target },
  { value: "housing", label: "Housing", icon: Home },
  { value: "transportation", label: "Transportation", icon: Car },
  { value: "travel", label: "Travel", icon: Plane },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "health", label: "Health", icon: Heart },
  { value: "entertainment", label: "Entertainment", icon: Gift },
  { value: "business", label: "Business", icon: Briefcase },
  { value: "other", label: "Other", icon: Target },
]

export function EditGoalModal({ isOpen, onClose, onGoalUpdated, goal }: EditGoalModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    target_amount: "",
    current_amount: "",
    target_date: undefined as Date | undefined,
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (goal && isOpen) {
      setFormData({
        name: goal.name,
        category: goal.category,
        target_amount: goal.target_amount.toString(),
        current_amount: goal.current_amount.toString(),
        target_date: goal.target_date ? new Date(goal.target_date) : undefined,
        description: goal.description || "",
      })
    }
  }, [goal, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal) return

    setIsSubmitting(true)

    try {
      const updatedGoal: Goal = {
        ...goal,
        name: formData.name,
        category: formData.category,
        target_amount: Number.parseFloat(formData.target_amount),
        current_amount: Number.parseFloat(formData.current_amount),
        target_date: formData.target_date?.toISOString(),
        description: formData.description,
        updated_at: new Date().toISOString(),
      }

      updateUserGoalWrapper("user1", updatedGoal)
      onGoalUpdated(updatedGoal)
      onClose()
    } catch (error) {
      console.error("Error updating goal:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    // Reset form after a short delay to avoid visual glitch
    setTimeout(() => {
      setFormData({
        name: "",
        category: "",
        target_amount: "",
        current_amount: "",
        target_date: undefined,
        description: "",
      })
    }, 200)
  }

  if (!goal) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Edit Savings Goal
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-200">
              Goal Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Emergency Fund"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-400/50"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-200">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <SelectItem key={category.value} value={category.value} className="text-white hover:bg-white/10">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {category.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_amount" className="text-sm font-medium text-gray-200">
                Target Amount
              </Label>
              <Input
                id="target_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                placeholder="0.00"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-400/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_amount" className="text-sm font-medium text-gray-200">
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
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-400/50"
                required
              />
            </div>
          </div>

          {/* Target Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-200">Target Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10",
                    !formData.target_date && "text-gray-400",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.target_date ? format(formData.target_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-900 border-white/10" align="start">
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
            <Label htmlFor="description" className="text-sm font-medium text-gray-200">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add notes about this goal..."
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-400/50 resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/5"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
