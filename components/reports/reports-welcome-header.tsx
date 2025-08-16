"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Calendar, Sparkles } from "lucide-react"

export function ReportsWelcomeHeader() {
  return (
    <Card className="premium-card border-white/10 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      <CardContent className="p-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Financial Reports</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white leading-tight">Complete Financial Analysis</h1>
              <p className="text-muted-foreground text-lg">
                Track every expense with detailed insights. You've analyzed{" "}
                <span className="text-blue-400 font-semibold">156 transactions</span> this month totaling{" "}
                <span className="text-green-400 font-semibold">$15,420.75</span>.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5% vs last month
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Calendar className="w-3 h-3 mr-1" />
                Updated today
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Insights Available
              </Badge>
            </div>
          </div>

          {/* Animated circular elements matching other pages */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-float" />
              <div
                className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-blue-500 opacity-70 animate-pulse-glow"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute inset-4 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-50 animate-float"
                style={{ animationDelay: "2s" }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
