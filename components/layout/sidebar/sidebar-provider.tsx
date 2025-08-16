"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

type SidebarContextProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true)
  const isMobile = useMediaQuery("(max-width: 640px)")

  const toggleSidebar = React.useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  React.useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }, [isMobile])

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isMobile, toggleSidebar }}>{children}</SidebarContext.Provider>
  )
}
