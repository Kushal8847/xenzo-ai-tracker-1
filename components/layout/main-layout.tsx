"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { AppSidebar } from "./sidebar/app-sidebar"
import { Header } from "./header"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/signup"

  if (isAuthPage) {
    return <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">{children}</div>
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AppSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">{children}</main>
      </div>
    </div>
  )
}
