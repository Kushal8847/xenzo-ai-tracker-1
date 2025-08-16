"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Target,
  Home,
  Car,
  Plane,
  GraduationCap,
  Heart,
  Gift,
  Briefcase,
  Calendar,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useState, useEffect } from "react"
import { AddGoalModal } from "./add-goal-modal"
import { ViewAllGoalsModal } from "./view-all-goals-modal"
import { EditGoalModal } from "./edit-goal-modal"
import { getUserGoalsWrapper, deleteUserGoalWrapper } from "@/lib/local-storage"
import type { Goal } from "@/lib/types"

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

export function SavingsGoals() {
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false)
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = () => {
    try {
      const userGoals = getUserGoalsWrapper("user1") // In a real app, get actual user ID
      setGoals(userGoals)
    } catch (error) {
      console.error("Error loading goals:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoalAdded = (newGoal: Goal) => {
    loadGoals() // Refresh the goals list
  }

  const handleGoalsUpdated = () => {
    loadGoals() // Refresh the goals list
  }

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal)
    setIsEditModalOpen(true)
  }

  const handleDeleteGoal = (goalId: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        deleteUserGoalWrapper("user1", goalId)
        loadGoals() // Refresh the goals list
      } catch (error) {
        console.error("Error deleting goal:", error)
      }
    }
  }

  const handleGoalUpdated = (updatedGoal: Goal) => {
    loadGoals() // Refresh the goals list
  }

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0)
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0)
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  // Show only the first 3 goals in the dashboard
  const displayGoals = goals.slice(0, 3)

  return (
    <>
      <Card className="premium-card h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Savings Goals</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Track your milestones</CardDescription>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 bg-transparent border-white/20 hover:bg-white/5"
              onClick={() => setIsAddGoalModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
              </div>
            ) : goals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No savings goals yet</p>
                <p className="text-sm text-muted-foreground">Create your first goal to get started!</p>
              </div>
            ) : (
              <>
                {/* Overall Progress */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">Overall Progress</span>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(totalSaved)} / {formatCurrency(totalTarget)}
                    </span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{overallProgress.toFixed(1)}% complete</span>
                    <span>{formatCurrency(totalTarget - totalSaved)} remaining</span>
                  </div>
                </div>

                {/* Individual Goals */}
                <div className="space-y-3">
                  {displayGoals.map((goal, index) => {
                    const Icon = categoryIcons[goal.category as keyof typeof categoryIcons] || Target
                    const percentage = (goal.current_amount / goal.target_amount) * 100

                    return (
                      <div
                        key={goal.id}
                        className="group p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 relative"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:bg-blue-500/20 hover:text-blue-400"
                            onClick={() => handleEditGoal(goal)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:bg-red-500/20 hover:text-red-400"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/10 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-orange-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm">{goal.name}</h3>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-xs text-muted-foreground capitalize">{goal.category}</span>
                                {goal.target_date && (
                                  <>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(goal.target_date).toLocaleDateString()}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {getStatusBadge(goal.current_amount, goal.target_amount, goal.target_date)}
                        </div>

                        <div className="space-y-2">
                          <Progress value={percentage} className="h-1.5" />

                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{formatCurrency(goal.current_amount)}</span>
                            <span className="font-semibold">{formatCurrency(goal.target_amount)}</span>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">{percentage.toFixed(1)}% complete</span>
                            <span className="text-muted-foreground">
                              {formatCurrency(goal.target_amount - goal.current_amount)} remaining
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* View All Goals Button */}
                {goals.length > 3 && (
                  <Button
                    variant="outline"
                    className="w-full gap-2 bg-transparent border-white/20 hover:bg-white/5 mt-4"
                    onClick={() => setIsViewAllModalOpen(true)}
                  >
                    <Eye className="w-4 h-4" />
                    View All Goals ({goals.length})
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        onGoalAdded={handleGoalAdded}
      />

      <ViewAllGoalsModal
        isOpen={isViewAllModalOpen}
        onClose={() => setIsViewAllModalOpen(false)}
        onGoalsUpdated={handleGoalsUpdated}
      />

      <EditGoalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onGoalUpdated={handleGoalUpdated}
        goal={selectedGoal}
      />
    </>
  )
}
