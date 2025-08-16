"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, Briefcase } from 'lucide-react'
import { formatCurrency } from "@/lib/utils"

interface IncomeStatsCardsProps {
  period: string
}

export function IncomeStatsCards({ period }: IncomeStatsCardsProps) {
  const stats = [
    {
      title: "Total Income",
      value: 6750,
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      gradient: "income-gradient",
      description: "This month",
    },
    {
      title: "Daily Average",
      value: 225,
      change: "+8.2%",
      changeType: "positive" as const,
      icon: Calendar,
      gradient: "balance-gradient",
      description: "Per day earnings",
    },
    {
      title: "Largest Income",
      value: 2500,
      change: "Salary",
      changeType: "neutral" as const,
      icon: TrendingUp,
      gradient: "investment-gradient",
      description: "Single transaction",
    },
    {
      title: "Income Sources",
      value: 4,
      change: "+1 new",
      changeType: "positive" as const,
      icon: Briefcase,
      gradient: "aussie-gradient",
      isNumber: true,
      description: "Active sources",
    },
  ]

  return (
    <div className="bento-stats">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.title}
            className="glass-card border-white/10 overflow-hidden group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6 relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                <div className={`w-full h-full rounded-full ${stat.gradient} blur-2xl`} />
              </div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div
                    className={`text-sm font-bold px-3 py-1.5 rounded-full backdrop-blur-sm ${
                      stat.changeType === "positive"
                        ? "text-green-400 bg-green-400/10 border border-green-400/20"
                        : stat.changeType === "negative"
                          ? "text-red-400 bg-red-400/10 border border-red-400/20"
                          : "text-blue-400 bg-blue-400/10 border border-blue-400/20"
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-caption text-muted-foreground font-medium">{stat.title}</p>
                  <p className="text-headline font-bold tracking-tight">
                    {stat.isNumber ? stat.value : formatCurrency(stat.value)}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
