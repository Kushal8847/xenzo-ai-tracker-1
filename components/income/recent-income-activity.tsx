"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Briefcase, TrendingUp, PiggyBank, Building, ArrowRight } from 'lucide-react'
import { formatCurrency, formatDate } from "@/lib/utils"

interface RecentIncomeActivityProps {
  category: string
  searchQuery: string
}

const recentIncomes = [
  {
    id: 1,
    description: "Monthly Salary",
    amount: 4500,
    category: "Salary",
    date: "2024-01-15",
    icon: Briefcase,
    status: "completed"
  },
  {
    id: 2,
    description: "Freelance Project",
    amount: 800,
    category: "Freelance",
    date: "2024-01-14",
    icon: TrendingUp,
    status: "completed"
  },
  {
    id: 3,
    description: "Dividend Payment",
    amount: 250,
    category: "Investments",
    date: "2024-01-13",
    icon: PiggyBank,
    status: "pending"
  },
  {
    id: 4,
    description: "Consulting Fee",
    amount: 400,
    category: "Freelance",
    date: "2024-01-12",
    icon: TrendingUp,
    status: "completed"
  },
  {
    id: 5,
    description: "Side Business Revenue",
    amount: 200,
    category: "Business",
    date: "2024-01-11",
    icon: Building,
    status: "completed"
  }
]

export function RecentIncomeActivity({ category, searchQuery }: RecentIncomeActivityProps) {
  const filteredIncomes = recentIncomes.filter(income => {
    const matchesCategory = category === "all" || income.category.toLowerCase() === category.toLowerCase()
    const matchesSearch = searchQuery === "" || 
      income.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      income.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Recent Income</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Latest earnings activity</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          {filteredIncomes.map((income, index) => {
            const Icon = income.icon
            return (
              <div
                key={income.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{income.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {income.category}
                      </Badge>
                      <Badge 
                        variant={income.status === "completed" ? "default" : "secondary"}
                        className={`text-xs px-1.5 py-0 ${
                          income.status === "completed" 
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        {income.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(income.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-green-400">+{formatCurrency(income.amount)}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <Button size="sm" variant="outline" className="w-full bg-transparent border-white/20 hover:bg-white/5 group">
            View All Income
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
