"use client"

import { useState, useEffect } from "react"
import { AuthService } from "@/lib/auth"
import LocalStorageService from "@/lib/local-storage"
import type { User, FinancialSummary, Transaction, Account, Category, Budget, Goal } from "@/lib/types"

interface AppData {
  user: User | null
  accounts: Account[]
  categories: Category[]
  transactions: Transaction[]
  budgets: Budget[]
  goals: Goal[]
  financialSummary: FinancialSummary
  isLoading: boolean
}

export function useAppData() {
  const [data, setData] = useState<AppData>({
    user: null,
    accounts: [],
    categories: [],
    transactions: [],
    budgets: [],
    goals: [],
    financialSummary: {
      totalBalance: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      netWorth: 0,
      savingsRate: 0,
    },
    isLoading: true,
  })

  const refreshData = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser()
      if (!currentUser) {
        setData((prev) => ({ ...prev, isLoading: false }))
        return
      }

      // Setup new user data if needed
      const existingAccounts = LocalStorageService.getUserAccounts(currentUser.id)
      if (existingAccounts.length === 0) {
        LocalStorageService.setupNewUser(currentUser.id)
      }

      // Fetch all user data
      const accounts = LocalStorageService.getUserAccounts(currentUser.id)
      const categories = LocalStorageService.getUserCategories(currentUser.id)
      const transactions = LocalStorageService.getUserTransactions(currentUser.id)
      const budgets = LocalStorageService.getUserBudgets(currentUser.id)
      const goals = LocalStorageService.getUserGoals(currentUser.id)
      const financialSummary = LocalStorageService.getFinancialSummary(currentUser.id)

      setData({
        user: currentUser,
        accounts,
        categories,
        transactions,
        budgets,
        goals,
        financialSummary,
        isLoading: false,
      })
    } catch (error) {
      console.error("Error refreshing app data:", error)
      setData((prev) => ({ ...prev, isLoading: false }))
    }
  }

  useEffect(() => {
    refreshData()

    // Listen for storage changes (cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes("expense_tracker_")) {
        refreshData()
      }
    }

    // Listen for custom data change events
    const handleDataChange = () => {
      refreshData()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("app:data-changed", handleDataChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("app:data-changed", handleDataChange)
    }
  }, [])

  return {
    ...data,
    refreshData,
  }
}
