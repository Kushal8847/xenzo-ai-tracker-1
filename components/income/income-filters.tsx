"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Calendar, Tag } from 'lucide-react'

interface IncomeFiltersProps {
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

const periods = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" }
]

const categories = [
  { value: "all", label: "All Sources" },
  { value: "salary", label: "Salary" },
  { value: "freelance", label: "Freelance" },
  { value: "investments", label: "Investments" },
  { value: "business", label: "Business" }
]

export function IncomeFilters({
  selectedPeriod,
  onPeriodChange,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange
}: IncomeFiltersProps) {
  return (
    <Card className="premium-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search income transactions..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 focus:border-green-500/50"
              />
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-2">
              {periods.map((period) => (
                <Button
                  key={period.value}
                  size="sm"
                  variant={selectedPeriod === period.value ? "default" : "outline"}
                  onClick={() => onPeriodChange(period.value)}
                  className={
                    selectedPeriod === period.value
                      ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                      : "bg-transparent border-white/20 hover:bg-white/5"
                  }
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  size="sm"
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  onClick={() => onCategoryChange(category.value)}
                  className={
                    selectedCategory === category.value
                      ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                      : "bg-transparent border-white/20 hover:bg-white/5"
                  }
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
