"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react"

interface ExpenseBreakdownTableProps {
  period: string
  category: string
}

export function ExpenseBreakdownTable({ period, category }: ExpenseBreakdownTableProps) {
  const expenses = [
    {
      category: "Groceries",
      amount: 1200,
      budget: 1000,
      change: 8.5,
      trend: "up",
      percentage: 30,
      transactions: 24,
    },
    {
      category: "Dining Out",
      amount: 800,
      budget: 600,
      change: -12.3,
      trend: "down",
      percentage: 20,
      transactions: 18,
    },
    {
      category: "Transport",
      amount: 600,
      budget: 700,
      change: 5.2,
      trend: "up",
      percentage: 15,
      transactions: 12,
    },
    {
      category: "Entertainment",
      amount: 400,
      budget: 500,
      change: -8.7,
      trend: "down",
      percentage: 10,
      transactions: 8,
    },
    {
      category: "Utilities",
      amount: 300,
      budget: 350,
      change: 2.1,
      trend: "up",
      percentage: 7.5,
      transactions: 6,
    },
    {
      category: "Shopping",
      amount: 500,
      budget: 400,
      change: 15.8,
      trend: "up",
      percentage: 12.5,
      transactions: 15,
    },
  ]

  return (
    <Card className="premium-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Expense Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">Detailed category analysis with budget comparison</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-muted-foreground">Category</TableHead>
              <TableHead className="text-muted-foreground">Amount</TableHead>
              <TableHead className="text-muted-foreground">Budget</TableHead>
              <TableHead className="text-muted-foreground">Progress</TableHead>
              <TableHead className="text-muted-foreground">Change</TableHead>
              <TableHead className="text-muted-foreground">Transactions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense, index) => {
              const TrendIcon = expense.trend === "up" ? ArrowUp : ArrowDown
              const budgetUsed = (expense.amount / expense.budget) * 100
              const isOverBudget = budgetUsed > 100

              return (
                <TableRow
                  key={expense.category}
                  className="border-white/10 hover:bg-white/5 transition-colors"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TableCell className="font-medium">{expense.category}</TableCell>
                  <TableCell className="font-bold">${expense.amount}</TableCell>
                  <TableCell className="text-muted-foreground">${expense.budget}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Progress
                        value={Math.min(budgetUsed, 100)}
                        className={`h-2 ${isOverBudget ? "bg-red-500/20" : "bg-green-500/20"}`}
                      />
                      <span className={`text-xs ${isOverBudget ? "text-red-400" : "text-green-400"}`}>
                        {budgetUsed.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        expense.trend === "up"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-green-500/20 text-green-400 border-green-500/30"
                      }`}
                    >
                      <TrendIcon className="w-3 h-3 mr-1" />
                      {Math.abs(expense.change)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{expense.transactions}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
