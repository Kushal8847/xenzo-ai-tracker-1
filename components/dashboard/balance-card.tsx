"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAppData } from "@/hooks/use-app-data"
import { useMemo } from "react"

type BalanceCardProps = {
  type: "income" | "expenses" | "balance"
  amount: number
}

const iconMap = {
  income: <ArrowUpRight className="h-6 w-6 text-green-500" />,
  expenses: <ArrowDownLeft className="h-6 w-6 text-red-500" />,
  balance: <Scale className="h-6 w-6 text-blue-500" />,
}

const titleMap = {
  income: "Total Income",
  expenses: "Total Expenses",
  balance: "Current Balance",
}

export function BalanceCard({ type, amount }: BalanceCardProps) {
  const { transactions } = useAppData()

  const percentageChange = useMemo(() => {
    if (!transactions || transactions.length === 0) return "+0.0%"

    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)

    const getAmountForPeriod = (start: Date, end: Date) => {
      return transactions
        .filter((t) => {
          const transactionDate = new Date(t.transaction_date)
          const matchesType = type === "balance" ? true : t.type === type.slice(0, -1) // Remove 's' from 'expenses'
          return transactionDate >= start && transactionDate < end && matchesType && t.status === "completed"
        })
        .reduce((sum, t) => {
          if (type === "balance") {
            return sum + (t.type === "income" ? t.amount : -Math.abs(t.amount))
          }
          return sum + Math.abs(t.amount)
        }, 0)
    }

    const thisMonthAmount = getAmountForPeriod(thisMonth, now)
    const lastMonthAmount = getAmountForPeriod(lastMonth, thisMonth)

    if (lastMonthAmount === 0) return "+0.0%"

    const change = ((thisMonthAmount - lastMonthAmount) / Math.abs(lastMonthAmount)) * 100
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(1)}%`
  }, [transactions, type])

  return (
    <Card className="material-background">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{titleMap[type]}</CardTitle>
        {iconMap[type]}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{formatCurrency(amount)}</div>
        <p className="text-xs text-muted-foreground">{percentageChange} from last month</p>
      </CardContent>
    </Card>
  )
}
