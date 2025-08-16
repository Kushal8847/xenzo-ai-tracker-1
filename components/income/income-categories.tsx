"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Briefcase, TrendingUp, DollarSign, PiggyBank, Building, Coins, CreditCard, Target } from 'lucide-react'
import { formatCurrency } from "@/lib/utils"

interface IncomeCategoriesProps {
  period: string
}

const incomeCategories = [
  {
    name: "Salary",
    amount: 4500,
    target: 5000,
    icon: Briefcase,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    change: "+5.2%"
  },
  {
    name: "Freelance",
    amount: 1200,
    target: 1500,
    icon: TrendingUp,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    change: "+15.8%"
  },
  {
    name: "Investments",
    amount: 850,
    target: 1000,
    icon: PiggyBank,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    change: "+8.3%"
  },
  {
    name: "Side Business",
    amount: 200,
    target: 500,
    icon: Building,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    change: "+25.0%"
  }
]

export function IncomeCategories({ period }: IncomeCategoriesProps) {
  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Income Categories</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Track earnings by source</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {incomeCategories.map((category, index) => {
            const Icon = category.icon
            const percentage = (category.amount / category.target) * 100
            const isOnTrack = percentage >= 80

            return (
              <div
                key={category.name}
                className={`p-4 rounded-xl ${category.bgColor} border ${category.borderColor} hover:bg-white/5 transition-all duration-300`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${category.bgColor} border ${category.borderColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${category.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.change} vs last {period}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-green-400">{formatCurrency(category.amount)}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(category.target)} target</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress value={Math.min(percentage, 100)} className="h-2" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{percentage.toFixed(1)}% of target</span>
                    <Badge
                      variant={isOnTrack ? "default" : "secondary"}
                      className={`text-xs ${
                        isOnTrack
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }`}
                    >
                      {isOnTrack ? "On Track" : "Below Target"}
                    </Badge>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
