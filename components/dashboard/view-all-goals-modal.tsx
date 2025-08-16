"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Target, Home, Car, Plane, GraduationCap, Heart, Gift, Briefcase, Calendar, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { getUserGoalsWrapper, deleteUserGoalWrapper } from "@/lib/local-storage"
import type { Goal } from "@/lib/types"

interface ViewAllGoalsModalProps {
  isOpen: boolean
  onClose: () => void
  onGoalsUpdated?: () => void
}

const categoryIcons = {
  emergency: Target,
  housing: Home,
  transportation: Car,
  travel: Plane,
  education: GraduationCap,
  health: Heart,
  entertainment: Gift,
  business: Briefcase,
  other: Target,
}

const getStatusBadge = (current: number, target: number, targetDate?: string) => {
  const percentage = (current / target) * 100

  if (percentage >= 100) {
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Completed</Badge>
  }

  if (targetDate) {
    const today = new Date()
    const deadline = new Date(targetDate)
    const timeRemaining = deadline.getTime() - today.getTime()
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

    if (daysRemaining < 0) {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Overdue</Badge>
    }

    const expectedProgress = Math.max(0, 100 - (daysRemaining / 365) * 100)

    if (percentage >= expectedProgress + 10) {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Ahead</Badge>
    } else if (percentage < expectedProgress - 10) {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Behind</Badge>
    }
  }

  return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">On Track</Badge>
}

export function ViewAllGoalsModal({ isOpen, onClose, onGoalsUpdated }: ViewAllGoalsModalProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadGoals()
    }
  }, [isOpen])

  const loadGoals = async () => {
    try {
      setLoading(true)
      const userGoals = getUserGoalsWrapper("user1") // In a real app, get actual user ID
      setGoals(userGoals)
    } catch (error) {
      console.error("Error loading goals:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    try {
      deleteUserGoalWrapper("user1", goalId)
      await loadGoals()
      onGoalsUpdated?.()
    } catch (error) {
      console.error("Error deleting goal:", error)
    }
  }

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0)
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0)
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-gradient-to-br from-gray-900/95 to-black/95 border border-white/20 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            All Savings Goals
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-white/10">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(totalSaved)} / {formatCurrency(totalTarget)}
              </span>
            </div>
            <Progress value={overallProgress} className="h-3 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{overallProgress.toFixed(1)}% complete</span>
              <span>{formatCurrency(totalTarget - totalSaved)} remaining</span>
            </div>
          </div>

          {/* Goals List */}
          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
              </div>
            ) : goals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No savings goals yet</p>
                <p className="text-sm text-muted-foreground mt-1">Create your first goal to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {goals.map((goal, index) => {
                  const Icon = categoryIcons[goal.category as keyof typeof categoryIcons] || Target
                  const percentage = (goal.current_amount / goal.target_amount) * 100
                  const isCompleted = percentage >= 100

                  return (
                    <div
                      key={goal.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{goal.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{goal.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(goal.current_amount, goal.target_amount, goal.target_date)}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-red-500/20"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>

                      {goal.description && <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>}

                      <div className="space-y-3">
                        <Progress value={percentage} className="h-2" />

                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{formatCurrency(goal.current_amount)}</span>
                          <span className="font-semibold">{formatCurrency(goal.target_amount)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{percentage.toFixed(1)}% complete</span>
                          {goal.target_date && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(goal.target_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        {isCompleted && (
                          <div className="text-center py-2">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              🎉 Goal Completed!
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <Button variant="outline" onClick={onClose} className="bg-transparent border-white/20 hover:bg-white/5">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
