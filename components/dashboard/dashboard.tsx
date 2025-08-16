import { StatsCards } from "./stats-cards"
import { SpendingChart } from "./spending-chart"
import { RecentTransactions } from "./recent-transactions"
import { QuickActions } from "./quick-actions"
import { AIInsights } from "./ai-insights"
import { BudgetOverview } from "./budget-overview"
import { CategoryBreakdown } from "./category-breakdown"
import { SavingsGoals } from "./savings-goals"
import { MonthlyComparison } from "./monthly-comparison"
import { UpcomingBills } from "./upcoming-bills"
import { ExpenseHeatmap } from "./expense-heatmap"
import { WelcomeHeader } from "./welcome-header"

export function Dashboard() {
  return (
    <div className="space-y-8 p-8">
      {/* Welcome Header */}
      <WelcomeHeader />

      {/* Stats Overview */}
      <StatsCards />

      {/* Main Bento Grid Layout with Alternating Pattern */}
      <div className="bento-grid">
        {/* Row 1 (Odd): 2:3 + 1:3 */}
        <div className="bento-item-8 bento-row-2">
          <SpendingChart />
        </div>
        <div className="bento-item-4 bento-row-2">
          <QuickActions />
        </div>

        {/* Row 2 (Even): 1:3 + 2:3 */}
        <div className="bento-item-4 bento-row-2">
          <CategoryBreakdown />
        </div>
        <div className="bento-item-8 bento-row-2">
          <BudgetOverview />
        </div>

        {/* Row 3 (Odd): 2:3 + 1:3 */}
        <div className="bento-item-8 bento-row-2">
          <AIInsights />
        </div>
        <div className="bento-item-4 bento-row-2">
          <SavingsGoals />
        </div>

        {/* Row 4 (Even): 1:3 + 2:3 */}
        <div className="bento-item-12 bento-row-2">
          <MonthlyComparison />
        </div>

        {/* Row 5 (Odd): 1:3 + 2:3 */}
        <div className="bento-item-4 bento-row-2">
          <UpcomingBills />
        </div>
        <div className="bento-item-8 bento-row-2">
          <RecentTransactions />
        </div>

        {/* Row 6: Full Width Spending Pattern (3:3) */}
        <div className="bento-item-12 bento-row-1">
          <ExpenseHeatmap />
        </div>
      </div>
    </div>
  )
}
