"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import LocalStorageService from "@/lib/local-storage"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Dashboard } from "@/components/dashboard/dashboard"
import { ExpensesView } from "@/components/expenses/expenses-view"
import { IncomeView } from "@/components/income/income-view"
import { TransactionsView } from "@/components/transactions/transactions-view"
import { ReportsView } from "@/components/reports/reports-view"
import { AIAssistantView } from "@/components/ai/ai-assistant-view"
import { SettingsView } from "@/components/settings/settings-view"
import { BudgetView } from "@/components/budget/budget-view"
import { Banknote, Loader2 } from "lucide-react"
import type { User } from "@/lib/types"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()

        if (currentUser) {
          setUser(currentUser)

          // Set up sample data for new users
          const existingAccounts = LocalStorageService.getUserAccounts(currentUser.id)
          if (existingAccounts.length === 0) {
            LocalStorageService.setupNewUser(currentUser.id)
          }
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth state changes
    const authListener = AuthService.onAuthStateChange((user) => {
      if (user) {
        setUser(user)
      } else {
        router.push("/login")
      }
    })

    return () => {
      authListener?.data?.subscription?.unsubscribe()
    }
  }, [router])

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />
      case "income":
        return <IncomeView />
      case "expenses":
        return <ExpensesView />
      case "budget":
        return <BudgetView />
      case "transactions":
        return <TransactionsView />
      case "reports":
        return <ReportsView />
      case "ai":
        return <AIAssistantView />
      case "settings":
        return <SettingsView />
      default:
        return <Dashboard />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-3xl font-bold mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
            <Banknote className="h-8 w-8 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Xenzo AI Tracker
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading your dashboard...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeView={activeView} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-auto">{renderView()}</main>
      </div>
    </div>
  )
}
