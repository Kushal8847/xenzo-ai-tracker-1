import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NotificationProvider } from "@/contexts/notification-context"
import { Toaster } from "@/components/ui/toaster"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Aussie Tracker - Smart Financial Management",
  description: "Beautiful expense tracking designed for Australians",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NotificationProvider>
            {children}
            <Toaster />
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
