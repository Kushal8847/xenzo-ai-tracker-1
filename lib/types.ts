// User types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  subscription_plan: "trial" | "premium" | "enterprise"
  currency: string
  timezone: string
  created_at: string
  updated_at: string
  last_login_at?: string
}

export interface UserSession {
  user: User
  access_token?: string
  refresh_token?: string
}

// Account types
export interface Account {
  id: string
  user_id: string
  name: string
  type: "checking" | "savings" | "credit" | "investment" | "cash"
  balance: number
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Category types
export interface Category {
  id: string
  user_id: string
  name: string
  type: "income" | "expense"
  color: string
  icon: string
  parent_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Transaction types
export interface Transaction {
  id: string
  user_id: string
  account_id?: string
  category_id?: string
  amount: number
  description: string
  transaction_date: string
  type: "income" | "expense" | "transfer"
  status: "pending" | "completed" | "cancelled"
  notes?: string
  receipt_url?: string
  created_at: string
  updated_at: string
}

export interface TransactionWithCategory extends Transaction {
  category_name?: string
  category_color?: string
  category_icon?: string
  account_name?: string
}

// Budget types
export interface Budget {
  id: string
  user_id: string
  category_id?: string
  name?: string
  amount: number
  spent: number
  period: "weekly" | "monthly" | "quarterly" | "yearly"
  start_date: string
  end_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Goal types
export interface Goal {
  id: string
  user_id: string
  name: string
  description?: string
  target_amount: number
  current_amount: number
  target_date?: string
  category?: string
  is_completed: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

// Recurring transaction types
export interface RecurringTransaction {
  id: string
  user_id: string
  account_id?: string
  category_id?: string
  amount: number
  description: string
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
  start_date: string
  end_date?: string
  next_occurrence: string
  type: "income" | "expense"
  is_active: boolean
  created_at: string
  updated_at: string
}

// Bill types
export interface Bill {
  id: string
  user_id: string
  name: string
  amount: number
  due_date: string
  frequency: "weekly" | "monthly" | "quarterly" | "yearly"
  category_id?: string
  account_id?: string
  is_paid: boolean
  is_active: boolean
  notes?: string
  created_at: string
  updated_at: string
}

// Tag types
export interface Tag {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

// Investment types
export interface InvestmentHolding {
  id: string
  user_id: string
  account_id?: string
  symbol: string
  name: string
  quantity: number
  purchase_price: number
  current_price?: number
  purchase_date: string
  created_at: string
  updated_at: string
}

// AI Chat types
export interface AIChatSession {
  id: string
  user_id: string
  title?: string
  created_at: string
  updated_at: string
}

export interface AIChatMessage {
  id: string
  session_id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

// Notification types
export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  is_read: boolean
  action_url?: string
  created_at: string
}

// Settings types
export interface UserSetting {
  id: string
  user_id: string
  setting_key: string
  setting_value: string
  created_at: string
  updated_at: string
}

// Chart data types
export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
  net?: number
}

export interface BudgetData {
  category: string
  budgeted: number
  spent: number
  color: string
}

// Financial summary types
export interface FinancialSummary {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  netWorth: number
  savingsRate?: number
  expenseGrowth?: number
}

// Filter types
export interface TransactionFilters {
  search: string
  category: string
  type: string
  dateRange: string
  account?: string
  minAmount?: number
  maxAmount?: number
}

// Dashboard widget types
export interface DashboardWidget {
  id: string
  type: string
  title: string
  data: any
  position: { x: number; y: number; w: number; h: number }
  isVisible: boolean
}

// Export all mock data
export * from "./data"
