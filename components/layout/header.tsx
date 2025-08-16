"use client"

import { Search, User, Menu, Bot, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserProfileModal } from "@/components/profile/user-profile-modal"
import { AIAdviceModal } from "@/components/ai/ai-advice-modal"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"

interface HeaderProps {
  activeView: string
  setSidebarOpen: (open: boolean) => void
}

export function Header({ activeView, setSidebarOpen }: HeaderProps) {
  const router = useRouter()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isAIAdviceModalOpen, setIsAIAdviceModalOpen] = useState(false)

  const currentUser = {
    name: "Kushal Neupane",
    email: "neupanekushal9@gmail.com",
    avatar: "/placeholder-user.jpg",
    initials: "KN",
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

  const viewTitles = {
    dashboard: "Dashboard",
    transactions: "Transactions",
    expenses: "Expenses",
    income: "Income",
    budget: "Budget",
    reports: "Reports",
    settings: "Settings",
    ai: "AI Assistant",
  }

  const currentDate = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {viewTitles[activeView as keyof typeof viewTitles] || "Dashboard"}
              </h1>
              <p className="text-sm text-muted-foreground">Budget for {currentDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="w-64 pl-10 bg-white/5 border-white/10 focus:border-white/20"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAIAdviceModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-blue-500 text-white font-medium"
            >
              <Bot className="h-4 w-4 mr-2" />
              NEED AI ADVICE?
            </Button>

            <NotificationDropdown />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black/90 border-white/10" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <AIAdviceModal isOpen={isAIAdviceModalOpen} onClose={() => setIsAIAdviceModalOpen(false)} />
    </>
  )
}
