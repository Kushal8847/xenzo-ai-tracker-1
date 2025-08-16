"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, Download, Upload, RefreshCw } from "lucide-react"

interface TransactionFiltersProps {
  filters: {
    search: string
    category: string
    type: string
    dateRange: string
  }
  setFilters: (filters: any) => void
}

export function TransactionFilters({ filters, setFilters }: TransactionFiltersProps) {
  const activeFiltersCount = Object.values(filters).filter((value) => value !== "" && value !== "all").length

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Filters & Search</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Find and filter your transactions
              </CardDescription>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{activeFiltersCount} active</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions, merchants, descriptions..."
            className="pl-10 bg-white/5 border-white/10"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="dining">Dining Out</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Select value={filters.dateRange} onValueChange={(value) => setFilters({ ...filters, dateRange: value })}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent border-white/20 hover:bg-white/5"
            onClick={() => setFilters({ search: "", category: "all", type: "all", dateRange: "all" })}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button size="sm" variant="outline" className="bg-transparent border-white/20 hover:bg-white/5">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Date
          </Button>
          <Button size="sm" variant="outline" className="bg-transparent border-white/20 hover:bg-white/5">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" variant="outline" className="bg-transparent border-white/20 hover:bg-white/5">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
