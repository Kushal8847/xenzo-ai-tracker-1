"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Download,
  Filter,
  Target,
  AlertTriangle,
  CheckCircle,
  FileText,
  Loader2,
} from "lucide-react"
import { ReportsWelcomeHeader } from "./reports-welcome-header"
import { ReportsStatsCards } from "./reports-stats-cards"
import { FinancialOverviewChart } from "./financial-overview-chart"
import { CategorySpendingChart } from "./category-spending-chart"
import { MonthlyTrendsChart } from "./monthly-trends-chart"
import { IncomeAnalysisChart } from "./income-analysis-chart"
import { BudgetPerformanceChart } from "./budget-performance-chart"
import { SavingsProgressChart } from "./savings-progress-chart"
import { CashFlowAnalysis } from "./cash-flow-analysis"
import { ExpenseBreakdownTable } from "./expense-breakdown-table"
import { jsPDF } from "jspdf"

export function ReportsView() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [isExportingCSV, setIsExportingCSV] = useState(false)

  const exportToPDF = async () => {
    try {
      setIsExportingPDF(true) // Set loading state to true

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const doc = new jsPDF()

      console.log("Using dummy data for PDF export...")

      const sampleTransactions = [
        // Income transactions
        {
          id: "txn_001",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_salary_001",
          amount: 5500,
          description: "Monthly Salary",
          transaction_date: "2025-07-15",
          type: "income",
          status: "completed",
          notes: "Regular monthly salary payment",
          created_at: "2025-07-15T09:00:00Z",
          updated_at: "2025-07-15T09:00:00Z",
        },
        {
          id: "txn_002",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_freelance_001",
          amount: 1200,
          description: "Freelance Web Design",
          transaction_date: "2025-07-18",
          type: "income",
          status: "completed",
          notes: "Client project completion",
          created_at: "2025-07-18T14:30:00Z",
          updated_at: "2025-07-18T14:30:00Z",
        },
        {
          id: "txn_003",
          user_id: "user1",
          account_id: "acc_investment_001",
          category_id: "cat_investments_001",
          amount: 350,
          description: "Stock Dividends",
          transaction_date: "2025-07-22",
          type: "income",
          status: "completed",
          notes: "Quarterly dividend payment",
          created_at: "2025-07-22T10:15:00Z",
          updated_at: "2025-07-22T10:15:00Z",
        },
        {
          id: "txn_004",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_business_001",
          amount: 800,
          description: "Side Business Revenue",
          transaction_date: "2025-07-25",
          type: "income",
          status: "completed",
          notes: "Online store sales",
          created_at: "2025-07-25T16:45:00Z",
          updated_at: "2025-07-25T16:45:00Z",
        },
        {
          id: "txn_005",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_rental_001",
          amount: 1500,
          description: "Rental Income",
          transaction_date: "2025-07-28",
          type: "income",
          status: "completed",
          notes: "Monthly rental property income",
          created_at: "2025-07-28T08:00:00Z",
          updated_at: "2025-07-28T08:00:00Z",
        },
        {
          id: "txn_006",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_freelance_001",
          amount: 950,
          description: "Consulting Fee",
          transaction_date: "2025-08-01",
          type: "income",
          status: "completed",
          notes: "Business consulting project",
          created_at: "2025-08-01T11:20:00Z",
          updated_at: "2025-08-01T11:20:00Z",
        },
        {
          id: "txn_007",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_salary_001",
          amount: 2000,
          description: "Bonus Payment",
          transaction_date: "2025-08-05",
          type: "income",
          status: "completed",
          notes: "Performance bonus Q2",
          created_at: "2025-08-05T15:30:00Z",
          updated_at: "2025-08-05T15:30:00Z",
        },
        {
          id: "txn_008",
          user_id: "user1",
          account_id: "acc_investment_001",
          category_id: "cat_investments_001",
          amount: 675,
          description: "Investment Returns",
          transaction_date: "2025-08-10",
          type: "income",
          status: "completed",
          notes: "Portfolio gains realization",
          created_at: "2025-08-10T13:45:00Z",
          updated_at: "2025-08-10T13:45:00Z",
        },
        // Expense transactions
        {
          id: "txn_009",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_groceries_001",
          amount: 185,
          description: "Whole Foods Groceries",
          transaction_date: "2025-07-16",
          type: "expense",
          status: "completed",
          notes: "Weekly grocery shopping",
          created_at: "2025-07-16T18:30:00Z",
          updated_at: "2025-07-16T18:30:00Z",
        },
        {
          id: "txn_010",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_transport_001",
          amount: 65,
          description: "Shell Gas Station",
          transaction_date: "2025-07-17",
          type: "expense",
          status: "completed",
          notes: "Vehicle fuel",
          created_at: "2025-07-17T07:45:00Z",
          updated_at: "2025-07-17T07:45:00Z",
        },
        {
          id: "txn_011",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_entertainment_001",
          amount: 15.99,
          description: "Netflix Subscription",
          transaction_date: "2025-07-18",
          type: "expense",
          status: "completed",
          notes: "Monthly streaming service",
          created_at: "2025-07-18T12:00:00Z",
          updated_at: "2025-07-18T12:00:00Z",
        },
        {
          id: "txn_012",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_dining_001",
          amount: 12.5,
          description: "Starbucks Coffee",
          transaction_date: "2025-07-19",
          type: "expense",
          status: "completed",
          notes: "Morning coffee",
          created_at: "2025-07-19T08:15:00Z",
          updated_at: "2025-07-19T08:15:00Z",
        },
        {
          id: "txn_013",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_utilities_001",
          amount: 125,
          description: "Electric Bill",
          transaction_date: "2025-07-20",
          type: "expense",
          status: "completed",
          notes: "Monthly electricity bill",
          created_at: "2025-07-20T14:20:00Z",
          updated_at: "2025-07-20T14:20:00Z",
        },
        {
          id: "txn_014",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_shopping_001",
          amount: 89,
          description: "Target Shopping",
          transaction_date: "2025-07-21",
          type: "expense",
          status: "completed",
          notes: "Household items",
          created_at: "2025-07-21T16:30:00Z",
          updated_at: "2025-07-21T16:30:00Z",
        },
        {
          id: "txn_015",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_dining_001",
          amount: 78,
          description: "Restaurant Dinner",
          transaction_date: "2025-07-22",
          type: "expense",
          status: "completed",
          notes: "Date night dinner",
          created_at: "2025-07-22T19:45:00Z",
          updated_at: "2025-07-22T19:45:00Z",
        },
        {
          id: "txn_016",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_health_001",
          amount: 45,
          description: "Gym Membership",
          transaction_date: "2025-07-23",
          type: "expense",
          status: "completed",
          notes: "Monthly gym fee",
          created_at: "2025-07-23T06:00:00Z",
          updated_at: "2025-07-23T06:00:00Z",
        },
        {
          id: "txn_017",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_shopping_001",
          amount: 156,
          description: "Amazon Purchase",
          transaction_date: "2025-07-24",
          type: "expense",
          status: "completed",
          notes: "Electronics and books",
          created_at: "2025-07-24T20:15:00Z",
          updated_at: "2025-07-24T20:15:00Z",
        },
        {
          id: "txn_018",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_insurance_001",
          amount: 180,
          description: "Car Insurance",
          transaction_date: "2025-07-25",
          type: "expense",
          status: "completed",
          notes: "Monthly auto insurance",
          created_at: "2025-07-25T10:30:00Z",
          updated_at: "2025-07-25T10:30:00Z",
        },
        {
          id: "txn_019",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_groceries_001",
          amount: 245,
          description: "Costco Groceries",
          transaction_date: "2025-07-26",
          type: "expense",
          status: "completed",
          notes: "Bulk grocery shopping",
          created_at: "2025-07-26T15:20:00Z",
          updated_at: "2025-07-26T15:20:00Z",
        },
        {
          id: "txn_020",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_entertainment_001",
          amount: 32,
          description: "Movie Theater",
          transaction_date: "2025-07-27",
          type: "expense",
          status: "completed",
          notes: "Weekend movie tickets",
          created_at: "2025-07-27T21:00:00Z",
          updated_at: "2025-07-27T21:00:00Z",
        },
      ]

      const sampleGoals = [
        {
          id: "goal_001",
          user_id: "user1",
          name: "Emergency Fund",
          description: "6 months of expenses for financial security and peace of mind",
          target_amount: 15000,
          current_amount: 8500,
          target_date: "2025-12-31",
          category: "emergency",
          is_completed: false,
          is_active: true,
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-08-14T12:00:00Z",
        },
        {
          id: "goal_002",
          user_id: "user1",
          name: "European Vacation",
          description: "2-week trip to Italy and France including flights, hotels, and activities",
          target_amount: 5000,
          current_amount: 2800,
          target_date: "2025-08-15",
          category: "travel",
          is_completed: false,
          is_active: true,
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-08-14T12:00:00Z",
        },
        {
          id: "goal_003",
          user_id: "user1",
          name: "New Car Down Payment",
          description: "Down payment for Tesla Model 3 to reduce monthly payments",
          target_amount: 8000,
          current_amount: 3200,
          target_date: "2025-10-01",
          category: "transport",
          is_completed: false,
          is_active: true,
          created_at: "2025-01-15T00:00:00Z",
          updated_at: "2025-08-14T12:00:00Z",
        },
        {
          id: "goal_004",
          user_id: "user1",
          name: "Home Renovation",
          description: "Kitchen and bathroom remodel to increase home value",
          target_amount: 12000,
          current_amount: 4500,
          target_date: "2025-11-30",
          category: "home",
          is_completed: false,
          is_active: true,
          created_at: "2025-02-01T00:00:00Z",
          updated_at: "2025-08-14T12:00:00Z",
        },
        {
          id: "goal_005",
          user_id: "user1",
          name: "Investment Portfolio",
          description: "Build diversified investment portfolio for long-term wealth building",
          target_amount: 25000,
          current_amount: 12500,
          target_date: "2026-01-01",
          category: "investments",
          is_completed: false,
          is_active: true,
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-08-14T12:00:00Z",
        },
        {
          id: "goal_006",
          user_id: "user1",
          name: "Wedding Fund",
          description: "Dream wedding celebration with family and friends",
          target_amount: 20000,
          current_amount: 7800,
          target_date: "2026-06-15",
          category: "personal",
          is_completed: false,
          is_active: true,
          created_at: "2025-01-10T00:00:00Z",
          updated_at: "2025-08-14T12:00:00Z",
        },
      ]

      // Filter transactions by period
      const filteredTransactions = filterTransactionsByPeriod(sampleTransactions, selectedPeriod)

      // Calculate totals
      const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
      const totalExpenses = filteredTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)
      const totalSavings = totalIncome - totalExpenses

      // Add content to PDF
      doc.setFontSize(20)
      doc.text("Financial Report", 20, 30)

      doc.setFontSize(12)
      doc.text(`Period: ${getPeriodLabel(selectedPeriod)}`, 20, 50)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 60)

      doc.setFontSize(16)
      doc.text("Summary", 20, 80)

      doc.setFontSize(12)
      doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 20, 100)
      doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 20, 110)
      doc.text(`Net Savings: $${totalSavings.toFixed(2)}`, 20, 120)

      // Add transactions
      doc.setFontSize(16)
      doc.text("Recent Transactions", 20, 140)

      const yPos = 160

      filteredTransactions.slice(0, 30).forEach((transaction, index) => {
        doc.setFontSize(10)
        doc.text(
          `${transaction.transaction_date} - ${transaction.description} - $${transaction.amount.toFixed(2)} (${transaction.type})`,
          20,
          yPos + index * 10,
        )
      })

      // Add goals on new page
      doc.addPage()
      doc.setFontSize(16)
      doc.text("Savings Goals", 20, 30)

      sampleGoals.forEach((goal, index) => {
        doc.setFontSize(10)
        const progress = ((goal.current_amount / goal.target_amount) * 100).toFixed(1)
        doc.text(`${goal.name} - $${goal.current_amount}/$${goal.target_amount} (${progress}%)`, 20, 50 + index * 10)
      })

      doc.save(`financial-report-${new Date().toISOString().split("T")[0]}.pdf`)
      console.log("PDF generated successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please check the console for details.")
    } finally {
      setIsExportingPDF(false) // Reset loading state
    }
  }

  const exportToCSV = async () => {
    try {
      setIsExportingCSV(true) // Set loading state to true

      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Using dummy data for CSV export...")

      const sampleTransactions = [
        // Income transactions (same structure as PDF)
        {
          id: "txn_001",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_salary_001",
          amount: 5500,
          description: "Monthly Salary",
          transaction_date: "2025-07-15",
          type: "income",
          status: "completed",
          notes: "Regular monthly salary payment",
          created_at: "2025-07-15T09:00:00Z",
          updated_at: "2025-07-15T09:00:00Z",
        },
        {
          id: "txn_002",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_freelance_001",
          amount: 1200,
          description: "Freelance Web Design",
          transaction_date: "2025-07-18",
          type: "income",
          status: "completed",
          notes: "Client project completion",
          created_at: "2025-07-18T14:30:00Z",
          updated_at: "2025-07-18T14:30:00Z",
        },
        {
          id: "txn_003",
          user_id: "user1",
          account_id: "acc_investment_001",
          category_id: "cat_investments_001",
          amount: 350,
          description: "Stock Dividends",
          transaction_date: "2025-07-22",
          type: "income",
          status: "completed",
          notes: "Quarterly dividend payment",
          created_at: "2025-07-22T10:15:00Z",
          updated_at: "2025-07-22T10:15:00Z",
        },
        {
          id: "txn_004",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_business_001",
          amount: 800,
          description: "Side Business Revenue",
          transaction_date: "2025-07-25",
          type: "income",
          status: "completed",
          notes: "Online store sales",
          created_at: "2025-07-25T16:45:00Z",
          updated_at: "2025-07-25T16:45:00Z",
        },
        {
          id: "txn_005",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_rental_001",
          amount: 1500,
          description: "Rental Income",
          transaction_date: "2025-07-28",
          type: "income",
          status: "completed",
          notes: "Monthly rental property income",
          created_at: "2025-07-28T08:00:00Z",
          updated_at: "2025-07-28T08:00:00Z",
        },
        {
          id: "txn_006",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_freelance_001",
          amount: 950,
          description: "Consulting Fee",
          transaction_date: "2025-08-01",
          type: "income",
          status: "completed",
          notes: "Business consulting project",
          created_at: "2025-08-01T11:20:00Z",
          updated_at: "2025-08-01T11:20:00Z",
        },
        {
          id: "txn_007",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_salary_001",
          amount: 2000,
          description: "Bonus Payment",
          transaction_date: "2025-08-05",
          type: "income",
          status: "completed",
          notes: "Performance bonus Q2",
          created_at: "2025-08-05T15:30:00Z",
          updated_at: "2025-08-05T15:30:00Z",
        },
        {
          id: "txn_008",
          user_id: "user1",
          account_id: "acc_investment_001",
          category_id: "cat_investments_001",
          amount: 675,
          description: "Investment Returns",
          transaction_date: "2025-08-10",
          type: "income",
          status: "completed",
          notes: "Portfolio gains realization",
          created_at: "2025-08-10T13:45:00Z",
          updated_at: "2025-08-10T13:45:00Z",
        },
        {
          id: "txn_009",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_groceries_001",
          amount: 185,
          description: "Whole Foods Groceries",
          transaction_date: "2025-07-16",
          type: "expense",
          status: "completed",
          notes: "Weekly grocery shopping",
          created_at: "2025-07-16T18:30:00Z",
          updated_at: "2025-07-16T18:30:00Z",
        },
        {
          id: "txn_010",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_transport_001",
          amount: 65,
          description: "Shell Gas Station",
          transaction_date: "2025-07-17",
          type: "expense",
          status: "completed",
          notes: "Vehicle fuel",
          created_at: "2025-07-17T07:45:00Z",
          updated_at: "2025-07-17T07:45:00Z",
        },
        {
          id: "txn_011",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_entertainment_001",
          amount: 15.99,
          description: "Netflix Subscription",
          transaction_date: "2025-07-18",
          type: "expense",
          status: "completed",
          notes: "Monthly streaming service",
          created_at: "2025-07-18T12:00:00Z",
          updated_at: "2025-07-18T12:00:00Z",
        },
        {
          id: "txn_012",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_dining_001",
          amount: 12.5,
          description: "Starbucks Coffee",
          transaction_date: "2025-07-19",
          type: "expense",
          status: "completed",
          notes: "Morning coffee",
          created_at: "2025-07-19T08:15:00Z",
          updated_at: "2025-07-19T08:15:00Z",
        },
        {
          id: "txn_013",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_utilities_001",
          amount: 125,
          description: "Electric Bill",
          transaction_date: "2025-07-20",
          type: "expense",
          status: "completed",
          notes: "Monthly electricity bill",
          created_at: "2025-07-20T14:20:00Z",
          updated_at: "2025-07-20T14:20:00Z",
        },
        {
          id: "txn_014",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_shopping_001",
          amount: 89,
          description: "Target Shopping",
          transaction_date: "2025-07-21",
          type: "expense",
          status: "completed",
          notes: "Household items",
          created_at: "2025-07-21T16:30:00Z",
          updated_at: "2025-07-21T16:30:00Z",
        },
        {
          id: "txn_015",
          user_id: "user1",
          account_id: "acc_checking_001",
          category_id: "cat_dining_001",
          amount: 78,
          description: "Restaurant Dinner",
          transaction_date: "2025-07-22",
          type: "expense",
          status: "completed",
          notes: "Date night dinner",
          created_at: "2025-07-22T19:45:00Z",
          updated_at: "2025-07-22T19:45:00Z",
        },
      ]

      const sampleGoals = [
        {
          id: "goal_001",
          user_id: "user1",
          name: "Emergency Fund",
          description: "6 months of expenses for financial security and peace of mind",
          target_amount: 15000,
          current_amount: 8500,
          target_date: "2025-12-31",
          category: "emergency",
          is_completed: false,
          is_active: true,
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-08-14T12:00:00Z",
        },
        {
          id: "goal_002",
          user_id: "user1",
          name: "European Vacation",
          description: "2-week trip to Italy and France including flights, hotels, and activities",
          target_amount: 5000,
          current_amount: 2800,
          target_date: "2025-08-15",
          category: "travel",
          is_completed: false,
          is_active: true,
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-08-14T12:00:00Z",
        },
        {
          id: "goal_003",
          user_id: "user1",
          name: "New Car Down Payment",
          description: "Down payment for Tesla Model 3 to reduce monthly payments",
          target_amount: 8000,
          current_amount: 3200,
          target_date: "2025-10-01",
          category: "transport",
          is_completed: false,
          is_active: true,
          created_at: "2025-01-15T00:00:00Z",
          updated_at: "2025-08-14T12:00:00Z",
        },
        {
          id: "goal_004",
          user_id: "user1",
          name: "Home Renovation",
          description: "Kitchen and bathroom remodel to increase home value",
          target_amount: 12000,
          current_amount: 4500,
          target_date: "2025-11-30",
          category: "home",
          is_completed: false,
          is_active: true,
          created_at: "2025-02-01T00:00:00Z",
          updated_at: "2025-08-14T12:00:00Z",
        },
        {
          id: "goal_005",
          user_id: "user1",
          name: "Investment Portfolio",
          description: "Build diversified investment portfolio for long-term wealth building",
          target_amount: 25000,
          current_amount: 12500,
          target_date: "2026-01-01",
          category: "investments",
          is_completed: false,
          is_active: true,
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-08-14T12:00:00Z",
        },
        {
          id: "goal_006",
          user_id: "user1",
          name: "Wedding Fund",
          description: "Dream wedding celebration with family and friends",
          target_amount: 20000,
          current_amount: 7800,
          target_date: "2026-06-15",
          category: "personal",
          is_completed: false,
          is_active: true,
          created_at: "2025-01-10T00:00:00Z",
          updated_at: "2025-08-14T12:00:00Z",
        },
      ]

      const filteredTransactions = filterTransactionsByPeriod(sampleTransactions, selectedPeriod)

      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,"

      // Add summary
      const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
      const totalExpenses = filteredTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)

      csvContent += "Financial Summary\n"
      csvContent += `Period,${getPeriodLabel(selectedPeriod)}\n`
      csvContent += `Total Income,$${totalIncome.toFixed(2)}\n`
      csvContent += `Total Expenses,$${totalExpenses.toFixed(2)}\n`
      csvContent += `Net Savings,$${(totalIncome - totalExpenses).toFixed(2)}\n\n`

      // Add transactions
      csvContent += "Transactions\n"
      csvContent += "Date,Description,Amount,Type,Category\n"

      filteredTransactions.forEach((transaction) => {
        csvContent += `${transaction.transaction_date},"${transaction.description}",${transaction.amount},${transaction.type},${transaction.category}\n`
      })

      // Add goals
      csvContent += "\nSavings Goals\n"
      csvContent += "Name,Target Amount,Current Amount,Progress %,Category,Target Date\n"

      sampleGoals.forEach((goal) => {
        const progress = ((goal.current_amount / goal.target_amount) * 100).toFixed(1)
        csvContent += `"${goal.name}",${goal.target_amount},${goal.current_amount},${progress}%,${goal.category},${goal.target_date || "N/A"}\n`
      })

      // Download CSV
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `financial-report-${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log("CSV generated successfully!")
    } catch (error) {
      console.error("Error generating CSV:", error)
      alert("Error generating CSV. Please check the console for details.")
    } finally {
      setIsExportingCSV(false) // Reset loading state
    }
  }

  const filterTransactionsByPeriod = (transactions: any[], period: string) => {
    const now = new Date()
    const cutoffDate = new Date()

    switch (period) {
      case "1month":
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case "3months":
        cutoffDate.setMonth(now.getMonth() - 3)
        break
      case "6months":
        cutoffDate.setMonth(now.getMonth() - 6)
        break
      case "1year":
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return transactions
    }

    return transactions.filter((t) => new Date(t.transaction_date) >= cutoffDate)
  }

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "1month":
        return "Last Month"
      case "3months":
        return "Last 3 Months"
      case "6months":
        return "Last 6 Months"
      case "1year":
        return "Last Year"
      default:
        return "All Time"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <ReportsWelcomeHeader />

        {/* Stats Cards */}
        <ReportsStatsCards />

        {/* Controls Section */}
        <Card className="premium-card border-white/10">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Filter className="w-5 h-5 text-white drop-shadow-glow" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Report Controls</CardTitle>
                <CardDescription>Customize your financial analysis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Time Period Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400 drop-shadow-glow" />
                  <label className="text-sm font-medium text-foreground">Time Period</label>
                </div>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-full bg-background/50 border-white/20 hover:border-white/30 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-white/20">
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-400 drop-shadow-glow" />
                  <label className="text-sm font-medium text-foreground">Category Filter</label>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full bg-background/50 border-white/20 hover:border-white/30 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-white/20">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="groceries">Groceries</SelectItem>
                    <SelectItem value="dining">Dining Out</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Export Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 bg-background/50 border-white/20 hover:bg-white/5 hover:border-white/30 transition-all duration-200"
                onClick={exportToPDF}
                disabled={isExportingPDF || isExportingCSV} // Disable button during loading
              >
                {isExportingPDF ? ( // Show loading spinner when exporting PDF
                  <Loader2 className="w-4 h-4 mr-2 animate-spin drop-shadow-glow" />
                ) : (
                  <FileText className="w-4 h-4 mr-2 drop-shadow-glow" />
                )}
                {isExportingPDF ? "Generating PDF..." : "Export PDF"}
              </Button>
              <Button
                size="lg"
                className="flex-1 aussie-gradient text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={exportToCSV}
                disabled={isExportingPDF || isExportingCSV} // Disable button during loading
              >
                {isExportingCSV ? ( // Show loading spinner when exporting CSV
                  <Loader2 className="w-4 h-4 mr-2 animate-spin drop-shadow-glow" />
                ) : (
                  <Download className="w-4 h-4 mr-2 drop-shadow-glow" />
                )}
                {isExportingCSV ? "Generating CSV..." : "Export CSV"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <div className="w-full">
          <Tabs defaultValue="overview" className="w-full">
            <div className="border-b border-white/10 pb-4">
              <TabsList className="grid w-full grid-cols-5 bg-background/50 border border-white/20 rounded-xl p-1 h-12">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:aussie-gradient data-[state=active]:text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4 drop-shadow-glow" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="spending"
                  className="data-[state=active]:expense-gradient data-[state=active]:text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <TrendingDown className="w-4 h-4 drop-shadow-glow" />
                  <span className="hidden sm:inline">Spending</span>
                </TabsTrigger>
                <TabsTrigger
                  value="income"
                  className="data-[state=active]:income-gradient data-[state=active]:text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4 drop-shadow-glow" />
                  <span className="hidden sm:inline">Income</span>
                </TabsTrigger>
                <TabsTrigger
                  value="savings"
                  className="data-[state=active]:savings-gradient data-[state=active]:text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4 drop-shadow-glow" />
                  <span className="hidden sm:inline">Savings</span>
                </TabsTrigger>
                <TabsTrigger
                  value="budget"
                  className="data-[state=active]:balance-gradient data-[state=active]:text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <PieChart className="w-4 h-4 drop-shadow-glow" />
                  <span className="hidden sm:inline">Budget</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="pt-6">
              <TabsContent value="overview" className="mt-0 space-y-6">
                {/* Financial Overview */}
                <FinancialOverviewChart period={selectedPeriod} />

                {/* Cash Flow Analysis */}
                <CashFlowAnalysis period={selectedPeriod} />

                {/* Category Spending & Monthly Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CategorySpendingChart category={selectedCategory} />
                  <MonthlyTrendsChart period={selectedPeriod} />
                </div>
              </TabsContent>

              <TabsContent value="spending" className="mt-0 space-y-6">
                <ExpenseBreakdownTable period={selectedPeriod} category={selectedCategory} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CategorySpendingChart category={selectedCategory} />
                  <MonthlyTrendsChart period={selectedPeriod} />
                </div>
              </TabsContent>

              <TabsContent value="income" className="mt-0 space-y-6">
                <IncomeAnalysisChart period={selectedPeriod} />

                {/* Income-focused Cash Flow Analysis */}
                <Card className="premium-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Income Cash Flow Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CashFlowAnalysis period={selectedPeriod} />
                  </CardContent>
                </Card>

                {/* Monthly Income Trends Chart */}
                <MonthlyTrendsChart period={selectedPeriod} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="premium-card border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        Income Sources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                          <span className="text-sm">Salary</span>
                          <span className="font-semibold text-green-400">$5,500</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                          <span className="text-sm">Freelance</span>
                          <span className="font-semibold text-green-400">$1,200</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                          <span className="text-sm">Investments</span>
                          <span className="font-semibold text-green-400">$675</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                          <span className="text-sm">Rental</span>
                          <span className="font-semibold text-green-400">$1,500</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="premium-card border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                        Income Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">This Month</span>
                          <span className="font-semibold text-green-400">$8,875</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Last Month</span>
                          <span className="font-semibold">$8,200</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Growth</span>
                          <span className="font-semibold text-green-400">+8.2%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                            style={{ width: "82%" }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="savings" className="mt-0 space-y-6">
                <SavingsProgressChart period={selectedPeriod} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="premium-card border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-400" />
                        Active Goals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Emergency Fund</span>
                            <span className="text-xs text-muted-foreground">56.7%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: "56.7%" }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$8,500</span>
                            <span>$15,000</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">European Vacation</span>
                            <span className="text-xs text-muted-foreground">56%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                              style={{ width: "56%" }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$2,800</span>
                            <span>$5,000</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">New Car</span>
                            <span className="text-xs text-muted-foreground">40%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                              style={{ width: "40%" }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$3,200</span>
                            <span>$8,000</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="premium-card border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        Savings Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                          <span className="text-sm">Monthly Savings Rate</span>
                          <span className="font-semibold text-green-400">18%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                          <span className="text-sm">Total Saved This Month</span>
                          <span className="font-semibold text-green-400">$1,597</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                          <span className="text-sm">Goal Completion Rate</span>
                          <span className="font-semibold text-purple-400">67%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                          <span className="text-sm">Emergency Fund Status</span>
                          <span className="font-semibold text-blue-400">4.2 months</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="budget" className="mt-0 space-y-6">
                <BudgetPerformanceChart period={selectedPeriod} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="premium-card border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-orange-400" />
                        Budget vs Actual
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Groceries</span>
                            <span className="text-xs text-green-400">Under by $45</span>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 bg-white/10 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                            </div>
                            <span className="text-xs text-muted-foreground">85%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Dining Out</span>
                            <span className="text-xs text-red-400">Over by $120</span>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 bg-white/10 rounded-full h-2">
                              <div className="bg-red-500 h-2 rounded-full" style={{ width: "134%" }}></div>
                            </div>
                            <span className="text-xs text-muted-foreground">134%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Transportation</span>
                            <span className="text-xs text-green-400">On track</span>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 bg-white/10 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "98%" }}></div>
                            </div>
                            <span className="text-xs text-muted-foreground">98%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Entertainment</span>
                            <span className="text-xs text-yellow-400">Close to limit</span>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 bg-white/10 rounded-full h-2">
                              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                            </div>
                            <span className="text-xs text-muted-foreground">92%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="premium-card border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        Budget Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Dining Budget Exceeded</p>
                            <p className="text-xs text-muted-foreground">
                              You've spent $120 over your dining budget this month
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Entertainment Near Limit</p>
                            <p className="text-xs text-muted-foreground">
                              92% of entertainment budget used with 8 days remaining
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Groceries On Track</p>
                            <p className="text-xs text-muted-foreground">Great job staying under budget by $45</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Charts Grid */}
      </div>
    </div>
  )
}
