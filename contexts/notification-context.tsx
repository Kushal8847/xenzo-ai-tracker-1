"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  type:
    | "income"
    | "expense"
    | "budget"
    | "goal"
    | "info"
    | "warning"
    | "success"
    | "error"
    | "budget_alert"
    | "budget_warning"
  isRead: boolean
  createdAt: Date
  actionUrl?: string
  amount?: number
  category?: string
  severity?: "low" | "medium" | "high"
  percentage?: number
  budgetLimit?: number
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "isRead" | "createdAt">) => void
  addBudgetAlert: (category: string, spent: number, budget: number, type: "over_budget" | "approaching_limit") => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Sample notifications for demo
    {
      id: "1",
      title: "Budget Alert: Transportation",
      message: "You've exceeded your transportation budget by $80 (126.7% used)",
      type: "budget_alert",
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      amount: 380,
      category: "Transportation",
      severity: "high",
      percentage: 126.7,
      budgetLimit: 300,
    },
    {
      id: "2",
      title: "Budget Warning: Food & Dining",
      message: "You're approaching your food budget limit (81.3% used)",
      type: "budget_warning",
      isRead: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      amount: 650,
      category: "Food & Dining",
      severity: "medium",
      percentage: 81.3,
      budgetLimit: 800,
    },
    {
      id: "3",
      title: "Budget Alert: Shopping",
      message: "Shopping budget exceeded by $120 (130% used)",
      type: "budget_alert",
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      amount: 520,
      category: "Shopping",
      severity: "high",
      percentage: 130.0,
      budgetLimit: 400,
    },
    {
      id: "4",
      title: "Income Added",
      message: "Salary payment of $5,000 has been recorded",
      type: "income",
      isRead: false,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      amount: 5000,
      category: "Salary",
    },
    {
      id: "5",
      title: "Expense Added",
      message: "Grocery shopping expense of $150 has been logged",
      type: "expense",
      isRead: true,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      amount: 150,
      category: "Groceries",
    },
    {
      id: "6",
      title: "Budget Created",
      message: "Monthly food budget of $800 has been set",
      type: "budget",
      isRead: true,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      amount: 800,
      category: "Food",
    },
    {
      id: "7",
      title: "Budget Performance Update",
      message: "You're saving $1,240 this month across all categories",
      type: "success",
      isRead: true,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      amount: 1240,
      category: "Savings",
    },
    {
      id: "8",
      title: "Goal Achievement",
      message: "Congratulations! You've reached 75% of your emergency fund goal",
      type: "goal",
      isRead: true,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      amount: 3750,
      category: "Emergency Fund",
      percentage: 75,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const addNotification = useCallback((notificationData: Omit<Notification, "id" | "isRead" | "createdAt">) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date(),
    }

    setNotifications((prev) => [newNotification, ...prev])
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }, [])

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const addBudgetAlert = useCallback(
    (category: string, spent: number, budget: number, type: "over_budget" | "approaching_limit") => {
      const percentage = (spent / budget) * 100
      const exceededBy = spent - budget

      const notification: Omit<Notification, "id" | "isRead" | "createdAt"> = {
        title: type === "over_budget" ? `Budget Alert: ${category}` : `Budget Warning: ${category}`,
        message:
          type === "over_budget"
            ? `You've exceeded your ${category.toLowerCase()} budget by $${exceededBy.toFixed(0)} (${percentage.toFixed(1)}% used)`
            : `You're approaching your ${category.toLowerCase()} budget limit (${percentage.toFixed(1)}% used)`,
        type: type === "over_budget" ? "budget_alert" : "budget_warning",
        amount: spent,
        category,
        severity: type === "over_budget" ? "high" : "medium",
        percentage,
        budgetLimit: budget,
      }

      addNotification(notification)
    },
    [addNotification],
  )

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        addBudgetAlert,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
