import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

const comparisons = [
  {
    category: "Income",
    current: 8750,
    previous: 8200,
    icon: ArrowUpRight,
    color: "text-green-400",
  },
  {
    category: "Expenses",
    current: 3240,
    previous: 3450,
    icon: ArrowDownLeft,
    color: "text-red-400",
  },
  {
    category: "Savings",
    current: 5510,
    previous: 4750,
    icon: TrendingUp,
    color: "text-blue-400",
  },
  {
    category: "Investments",
    current: 2200,
    previous: 1800,
    icon: TrendingUp,
    color: "text-purple-400",
  },
  {
    category: "Bills",
    current: 1450,
    previous: 1520,
    icon: ArrowDownLeft,
    color: "text-yellow-400",
  },
  {
    category: "Entertainment",
    current: 450,
    previous: 380,
    icon: ArrowUpRight,
    color: "text-pink-400",
  },
]

export function MonthlyComparison() {
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString("default", { month: "long", year: "numeric" })
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  })

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-bold">Monthly Comparison</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {currentMonth} vs {lastMonth}
            </CardDescription>
            <div className="flex gap-2 mt-2">
              <div className="px-2 py-1 rounded-md bg-green-500/20 border border-green-500/30">
                <span className="text-xs font-medium text-green-400">Current: {currentMonth}</span>
              </div>
              <div className="px-2 py-1 rounded-md bg-blue-500/20 border border-blue-500/30">
                <span className="text-xs font-medium text-blue-400">Previous: {lastMonth}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparisons.map((item, index) => {
            const Icon = item.icon
            const difference = item.current - item.previous
            const percentageChange = ((difference / item.previous) * 100).toFixed(1)
            const isPositive = difference > 0

            return (
              <div
                key={item.category}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.category}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(item.current)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="text-xs font-medium">{percentageChange}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isPositive ? "+" : ""}
                    {formatCurrency(difference)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
