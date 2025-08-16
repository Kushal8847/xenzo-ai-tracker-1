"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Home, CreditCard, List, BarChart3, Bot, Settings, Banknote, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AuthService } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"

export const navItems = [
  { href: "/", title: "Dashboard", icon: Home },
  { href: "/expenses", title: "Expenses", icon: CreditCard },
  { href: "/transactions", title: "Transactions", icon: List },
  { href: "/reports", title: "Reports", icon: BarChart3 },
  { href: "/ai", title: "AI Assistant", icon: Bot },
]

export const settingsItem = {
  href: "/settings",
  title: "Settings",
  icon: Settings,
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

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
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Banknote className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Aussie Tracker</span>
        </Link>
        <TooltipProvider>
          {navItems.map(({ href, title, icon: Icon }) => (
            <Tooltip key={title}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    pathname === href && "bg-accent text-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{title}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={settingsItem.href}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                  pathname === settingsItem.href && "bg-accent text-accent-foreground",
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">{settingsItem.title}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{settingsItem.title}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSignOut}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-accent md:h-8 md:w-8 cursor-pointer"
                type="button"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sign Out</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign Out</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  )
}
