"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  BarChart3,
  Bot,
  Settings,
  X,
  Crown,
  TrendingUp,
  Wallet,
  Target,
  HelpCircle,
  LogOut,
  Sparkles,
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"
import { AddTransactionModal } from "../dashboard/add-transaction-modal"
import { PricingModal } from "../dashboard/pricing-modal"
import { BankConnectionModal } from "../dashboard/bank-connection-modal"
import { CreateBudgetModal } from "../budget/create-budget-modal"
import { HelpSupportModal } from "../help/help-support-modal"
import { UserProfileModal } from "../profile/user-profile-modal"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const navigation = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & insights",
    badge: null,
  },
  {
    id: "income",
    name: "Income",
    icon: TrendingUp,
    description: "Track earnings",
    badge: null,
  },
  {
    id: "expenses",
    name: "Expenses",
    icon: CreditCard,
    description: "Track spending",
    badge: "12",
  },
  {
    id: "budget",
    name: "Budget",
    icon: Target,
    description: "Manage budgets",
    badge: null,
  },
  {
    id: "transactions",
    name: "Transactions",
    icon: Receipt,
    description: "All activity",
    badge: null,
  },
  {
    id: "reports",
    name: "Reports",
    icon: BarChart3,
    description: "Analytics & trends",
    badge: "New",
  },
  {
    id: "ai",
    name: "AI Assistant",
    icon: Bot,
    description: "Smart insights",
    badge: "Pro",
  },
]

export function Sidebar({ activeView, setActiveView, isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter()
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false)
  const [modalDefaultType, setModalDefaultType] = useState<"income" | "expense">("income")
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [isBankConnectionModalOpen, setIsBankConnectionModalOpen] = useState(false)
  const [isCreateBudgetModalOpen, setIsCreateBudgetModalOpen] = useState(false)
  const [isHelpSupportModalOpen, setIsHelpSupportModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const openTransactionModal = (type: "income" | "expense") => {
    setModalDefaultType(type)
    setIsAddTransactionModalOpen(true)
  }

  const handleSignOut = async () => {
    try {
      console.log("🔄 Starting signout process...")

      const success = await AuthService.signOut()

      if (success) {
        console.log("✅ Signout successful")
        toast({
          title: "Signed out successfully",
          description: "You have been logged out of your account",
        })

        // Small delay to ensure toast is shown before redirect
        setTimeout(() => {
          router.push("/login")
        }, 500)
      } else {
        console.log("❌ Signout failed")
        toast({
          title: "Signout failed",
          description: "There was an error signing out. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Signout error:", error)
      toast({
        title: "Signout error",
        description: "An unexpected error occurred during signout",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-background/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full premium-card border-0 rounded-none">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 animate-pulse" />
                <span className="text-white font-black text-lg tracking-tight relative z-10">X</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Xenzo AI Tracker
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Expense Tracker</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="mb-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-3">Navigation</h4>
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = activeView === item.id

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-4 h-14 text-left font-medium transition-all duration-300 group relative overflow-hidden",
                      isActive && "bg-white/10 text-white shadow-lg border border-white/20",
                      !isActive && "hover:bg-white/5 hover:translate-x-1",
                    )}
                    onClick={() => {
                      setActiveView(item.id)
                      setIsOpen(false)
                    }}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-50" />
                    )}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                        isActive ? "bg-white/20 shadow-lg" : "bg-white/5 group-hover:bg-white/10",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-base truncate">{item.name}</span>
                        {item.badge && (
                          <Badge
                            variant={item.badge === "Pro" ? "default" : "secondary"}
                            className={cn(
                              "text-xs px-2 py-0 ml-2",
                              item.badge === "Pro" &&
                                "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0",
                              item.badge === "New" && "bg-green-500/20 text-green-400 border-green-500/30",
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                  </Button>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-left font-medium hover:bg-white/5 group"
                  onClick={() => openTransactionModal("income")}
                >
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm">Add Income</span>
                    <p className="text-xs text-muted-foreground">Record earnings</p>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-left font-medium hover:bg-white/5 group"
                  onClick={() => openTransactionModal("expense")}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                    <CreditCard className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm">Add Expense</span>
                    <p className="text-xs text-muted-foreground">Log spending</p>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-left font-medium hover:bg-white/5 group"
                  onClick={() => setIsCreateBudgetModalOpen(true)}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Target className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm">Create Budget</span>
                    <p className="text-xs text-muted-foreground">Set spending limits</p>
                  </div>
                </Button>
              </div>
            </div>

            {/* Connect Your Bank */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                Bank Integration
              </h4>
              <div className="px-3">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-5 h-5 text-blue-400" />
                      <span className="font-bold text-sm text-blue-400">Connect Your Bank</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      Automatically sync transactions and get real-time balance updates
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium shadow-lg border-0 transition-all duration-300 hover:scale-105"
                      onClick={() => setIsBankConnectionModalOpen(true)}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Connect Bank
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Premium Upgrade Section */}
          <div className="p-4 border-t border-white/10">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-yellow-600/20 border border-yellow-500/30 p-4 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-sm text-yellow-400">Upgrade to Premium</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  Unlock advanced analytics, AI insights, and unlimited transactions
                </p>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold shadow-lg border-0 transition-all duration-300 hover:scale-105"
                  onClick={() => setIsPricingModalOpen(true)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Go Premium
                </Button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-10 text-left font-medium hover:bg-white/5"
                onClick={() => setIsHelpSupportModalOpen(true)}
              >
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Help & Support</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-10 text-left font-medium hover:bg-white/5"
                onClick={() => setActiveView("settings")}
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Settings</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-10 text-left font-medium hover:bg-red-500/10 text-red-400"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        defaultType={modalDefaultType}
      />

      <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />

      <BankConnectionModal isOpen={isBankConnectionModalOpen} onClose={() => setIsBankConnectionModalOpen(false)} />

      <CreateBudgetModal isOpen={isCreateBudgetModalOpen} onClose={() => setIsCreateBudgetModalOpen(false)} />

      <HelpSupportModal isOpen={isHelpSupportModalOpen} onClose={() => setIsHelpSupportModalOpen(false)} />

      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  )
}
