import type { Transaction, Category, Account, Budget, Goal, UserSession, TransactionWithCategory } from "./types"
import { mockTransactions, mockCategories, mockAccounts, mockBudgets, mockGoals } from "./data"

const STORAGE_KEYS = {
  USER: "expense_tracker_user",
  TRANSACTIONS: "expense_tracker_transactions",
  CATEGORIES: "expense_tracker_categories",
  ACCOUNTS: "expense_tracker_accounts",
  BUDGETS: "expense_tracker_budgets",
  GOALS: "expense_tracker_goals",
}

class LocalStorageService {
  private static readonly USER_KEY = "expense_tracker_user"
  private static readonly ACCOUNTS_KEY = "expense_tracker_accounts"
  private static readonly CATEGORIES_KEY = "expense_tracker_categories"
  private static readonly TRANSACTIONS_KEY = "expense_tracker_transactions"
  private static readonly BUDGETS_KEY = "expense_tracker_budgets"
  private static readonly GOALS_KEY = "expense_tracker_goals"

  // Emit change event for real-time updates
  private static emitDataChange(userId: string) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("app:data-changed", {
          detail: { userId, timestamp: Date.now() },
        }),
      )
    }
  }

  // --- User Session ---
  static getUserSession(): UserSession | null {
    if (typeof window === "undefined") return null
    const sessionStr = localStorage.getItem(LocalStorageService.USER_KEY)
    return sessionStr ? JSON.parse(sessionStr) : null
  }

  static setUserSession(session: UserSession) {
    if (typeof window === "undefined") return
    localStorage.setItem(LocalStorageService.USER_KEY, JSON.stringify(session))
    LocalStorageService.emitDataChange(session.user.id)
  }

  static clearUserSession() {
    if (typeof window === "undefined") return
    localStorage.removeItem(LocalStorageService.USER_KEY)
  }

  // --- Setup New User with Sample Data ---
  static setupNewUser(userId: string) {
    if (typeof window === "undefined") return

    // Check if data already exists for this user
    if (localStorage.getItem(`${LocalStorageService.TRANSACTIONS_KEY}_${userId}`)) {
      return // Data already set up
    }

    // Create sample data with user ID
    const initialAccounts = mockAccounts.map((acc) => ({ ...acc, user_id: userId }))
    const initialCategories = mockCategories.map((cat) => ({ ...cat, user_id: userId }))
    const initialTransactions = mockTransactions.map((trans) => ({ ...trans, user_id: userId }))
    const initialBudgets = mockBudgets.map((bud) => ({ ...bud, user_id: userId }))
    const initialGoals = mockGoals.map((goal) => ({ ...goal, user_id: userId }))

    // Store all data
    localStorage.setItem(`${LocalStorageService.ACCOUNTS_KEY}_${userId}`, JSON.stringify(initialAccounts))
    localStorage.setItem(`${LocalStorageService.CATEGORIES_KEY}_${userId}`, JSON.stringify(initialCategories))
    localStorage.setItem(`${LocalStorageService.TRANSACTIONS_KEY}_${userId}`, JSON.stringify(initialTransactions))
    localStorage.setItem(`${LocalStorageService.BUDGETS_KEY}_${userId}`, JSON.stringify(initialBudgets))
    localStorage.setItem(`${LocalStorageService.GOALS_KEY}_${userId}`, JSON.stringify(initialGoals))

    LocalStorageService.emitDataChange(userId)
  }

  // --- Generic Get/Set for User-specific Data ---
  private static getItems<T>(key: string, userId: string): T[] {
    if (typeof window === "undefined") return []
    const itemsStr = localStorage.getItem(`${key}_${userId}`)
    return itemsStr ? JSON.parse(itemsStr) : []
  }

  private static setItems<T>(key: string, userId: string, items: T[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(`${key}_${userId}`, JSON.stringify(items))
  }

  // --- Specific Data Accessors ---
  static getUserAccounts(userId: string): Account[] {
    return LocalStorageService.getItems<Account>(LocalStorageService.ACCOUNTS_KEY, userId)
  }

  static setUserAccounts(userId: string, accounts: Account[]) {
    LocalStorageService.setItems<Account>(LocalStorageService.ACCOUNTS_KEY, userId, accounts)
    LocalStorageService.emitDataChange(userId)
  }

  static addUserAccount(userId: string, account: Account) {
    const accounts = LocalStorageService.getUserAccounts(userId)
    accounts.push(account)
    LocalStorageService.setUserAccounts(userId, accounts)
  }

  static updateUserAccount(userId: string, accountId: string, updates: Partial<Account>) {
    const accounts = LocalStorageService.getUserAccounts(userId)
    const index = accounts.findIndex((acc) => acc.id === accountId)
    if (index !== -1) {
      accounts[index] = { ...accounts[index], ...updates, updated_at: new Date().toISOString() }
      LocalStorageService.setUserAccounts(userId, accounts)
    }
  }

  static getUserCategories(userId: string): Category[] {
    return LocalStorageService.getItems<Category>(LocalStorageService.CATEGORIES_KEY, userId)
  }

  static setUserCategories(userId: string, categories: Category[]) {
    LocalStorageService.setItems<Category>(LocalStorageService.CATEGORIES_KEY, userId, categories)
    LocalStorageService.emitDataChange(userId)
  }

  static addUserCategory(userId: string, category: Category) {
    const categories = LocalStorageService.getUserCategories(userId)
    categories.push(category)
    LocalStorageService.setUserCategories(userId, categories)
  }

  static findOrCreateCategory(userId: string, name: string, type: "income" | "expense"): Category {
    const categories = LocalStorageService.getUserCategories(userId)
    const existing = categories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase() && cat.type === type && cat.is_active,
    )

    if (existing) return existing

    const newCategory: Category = {
      id: LocalStorageService.generateId(),
      user_id: userId,
      name,
      type,
      color: type === "income" ? "#10b981" : "#ef4444",
      icon: type === "income" ? "dollar-sign" : "tag",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    categories.push(newCategory)
    LocalStorageService.setUserCategories(userId, categories)
    return newCategory
  }

  static getUserTransactions(userId: string, limit?: number): Transaction[] {
    const transactions = LocalStorageService.getItems<Transaction>(LocalStorageService.TRANSACTIONS_KEY, userId)
    // Sort by date descending to get most recent
    const sortedTransactions = transactions.sort(
      (a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime(),
    )
    return limit ? sortedTransactions.slice(0, limit) : sortedTransactions
  }

  static getUserTransactionsWithCategory(userId: string, limit?: number): TransactionWithCategory[] {
    const transactions = LocalStorageService.getUserTransactions(userId, limit)
    const categories = LocalStorageService.getUserCategories(userId)
    const accounts = LocalStorageService.getUserAccounts(userId)

    return transactions.map((transaction) => {
      const category = categories.find((cat) => cat.id === transaction.category_id)
      const account = accounts.find((acc) => acc.id === transaction.account_id)
      return {
        ...transaction,
        category_name: category?.name,
        category_color: category?.color,
        category_icon: category?.icon,
        account_name: account?.name,
      }
    })
  }

  static setUserTransactions(userId: string, transactions: Transaction[]) {
    LocalStorageService.setItems<Transaction>(LocalStorageService.TRANSACTIONS_KEY, userId, transactions)
    LocalStorageService.emitDataChange(userId)
  }

  static addUserTransaction(userId: string, transaction: Transaction) {
    const transactions = LocalStorageService.getUserTransactions(userId)
    // Add new transaction at the beginning of the array to ensure it appears at the top
    transactions.unshift(transaction)
    LocalStorageService.setItems<Transaction>(LocalStorageService.TRANSACTIONS_KEY, userId, transactions)

    // Update account balance if account_id is provided
    if (transaction.account_id && transaction.status === "completed") {
      const accounts = LocalStorageService.getUserAccounts(userId)
      const accountIndex = accounts.findIndex((acc) => acc.id === transaction.account_id)
      if (accountIndex !== -1) {
        const balanceChange = transaction.type === "income" ? transaction.amount : -Math.abs(transaction.amount)
        accounts[accountIndex].balance += balanceChange
        accounts[accountIndex].updated_at = new Date().toISOString()
        LocalStorageService.setItems<Account>(LocalStorageService.ACCOUNTS_KEY, userId, accounts)
      }
    }

    LocalStorageService.emitDataChange(userId)
  }

  static updateUserTransaction(userId: string, transactionId: string, updates: Partial<Transaction>) {
    const transactions = LocalStorageService.getUserTransactions(userId)
    const index = transactions.findIndex((trans) => trans.id === transactionId)
    if (index !== -1) {
      const oldTransaction = transactions[index]
      transactions[index] = { ...transactions[index], ...updates, updated_at: new Date().toISOString() }

      // Update account balances if needed
      if (oldTransaction.account_id && oldTransaction.status === "completed") {
        const accounts = LocalStorageService.getUserAccounts(userId)
        const accountIndex = accounts.findIndex((acc) => acc.id === oldTransaction.account_id)
        if (accountIndex !== -1) {
          // Reverse old transaction
          const oldBalanceChange =
            oldTransaction.type === "income" ? -oldTransaction.amount : Math.abs(oldTransaction.amount)
          accounts[accountIndex].balance += oldBalanceChange

          // Apply new transaction
          const newTransaction = transactions[index]
          if (newTransaction.status === "completed") {
            const newBalanceChange =
              newTransaction.type === "income" ? newTransaction.amount : -Math.abs(newTransaction.amount)
            accounts[accountIndex].balance += newBalanceChange
          }

          accounts[accountIndex].updated_at = new Date().toISOString()
          LocalStorageService.setItems<Account>(LocalStorageService.ACCOUNTS_KEY, userId, accounts)
        }
      }

      LocalStorageService.setUserTransactions(userId, transactions)
    }
  }

  static deleteUserTransaction(userId: string, transactionId: string) {
    const transactions = LocalStorageService.getUserTransactions(userId)
    const transactionIndex = transactions.findIndex((trans) => trans.id === transactionId)

    if (transactionIndex !== -1) {
      const transaction = transactions[transactionIndex]

      // Update account balance if needed
      if (transaction.account_id && transaction.status === "completed") {
        const accounts = LocalStorageService.getUserAccounts(userId)
        const accountIndex = accounts.findIndex((acc) => acc.id === transaction.account_id)
        if (accountIndex !== -1) {
          // Reverse the transaction
          const balanceChange = transaction.type === "income" ? -transaction.amount : Math.abs(transaction.amount)
          accounts[accountIndex].balance += balanceChange
          accounts[accountIndex].updated_at = new Date().toISOString()
          LocalStorageService.setItems<Account>(LocalStorageService.ACCOUNTS_KEY, userId, accounts)
        }
      }

      const filteredTransactions = transactions.filter((trans) => trans.id !== transactionId)
      LocalStorageService.setUserTransactions(userId, filteredTransactions)
    }
  }

  static getUserBudgets(userId: string): Budget[] {
    return LocalStorageService.getItems<Budget>(LocalStorageService.BUDGETS_KEY, userId)
  }

  static setUserBudgets(userId: string, budgets: Budget[]) {
    LocalStorageService.setItems<Budget>(LocalStorageService.BUDGETS_KEY, userId, budgets)
    LocalStorageService.emitDataChange(userId)
  }

  static addUserBudget(userId: string, budget: Budget) {
    const budgets = LocalStorageService.getUserBudgets(userId)
    budgets.push(budget)
    LocalStorageService.setUserBudgets(userId, budgets)
  }

  static updateUserBudget(userId: string, budgetId: string, updates: Partial<Budget>) {
    const budgets = LocalStorageService.getUserBudgets(userId)
    const index = budgets.findIndex((bud) => bud.id === budgetId)
    if (index !== -1) {
      budgets[index] = { ...budgets[index], ...updates, updated_at: new Date().toISOString() }
      LocalStorageService.setUserBudgets(userId, budgets)
    }
  }

  static getUserGoals(userId: string): Goal[] {
    return LocalStorageService.getItems<Goal>(LocalStorageService.GOALS_KEY, userId)
  }

  static setUserGoals(userId: string, goals: Goal[]) {
    LocalStorageService.setItems<Goal>(LocalStorageService.GOALS_KEY, userId, goals)
    LocalStorageService.emitDataChange(userId)
  }

  static addUserGoal(userId: string, goal: Goal) {
    const goals = LocalStorageService.getUserGoals(userId)
    goals.push(goal)
    LocalStorageService.setUserGoals(userId, goals)
  }

  static updateUserGoal(userId: string, goalId: string, updates: Partial<Goal>) {
    const goals = LocalStorageService.getUserGoals(userId)
    const index = goals.findIndex((goal) => goal.id === goalId)
    if (index !== -1) {
      goals[index] = { ...goals[index], ...updates, updated_at: new Date().toISOString() }
      LocalStorageService.setUserGoals(userId, goals)
    }
  }

  static deleteUserGoal(userId: string, goalId: string) {
    const goals = LocalStorageService.getUserGoals(userId)
    const filteredGoals = goals.filter((goal) => goal.id !== goalId)
    LocalStorageService.setUserGoals(userId, filteredGoals)
  }

  // --- Financial Summary Calculations ---
  static getFinancialSummary(userId: string) {
    const accounts = LocalStorageService.getUserAccounts(userId)
    const transactions = LocalStorageService.getUserTransactions(userId)

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

    // Calculate monthly income and expenses from last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentTransactions = transactions.filter(
      (trans) => new Date(trans.transaction_date) >= thirtyDaysAgo && trans.status === "completed",
    )

    const monthlyIncome = recentTransactions
      .filter((trans) => trans.type === "income")
      .reduce((sum, trans) => sum + Math.abs(trans.amount), 0)

    const monthlyExpenses = recentTransactions
      .filter((trans) => trans.type === "expense")
      .reduce((sum, trans) => sum + Math.abs(trans.amount), 0)

    return {
      totalBalance: Math.round(totalBalance * 100) / 100,
      monthlyIncome: Math.round(monthlyIncome * 100) / 100,
      monthlyExpenses: Math.round(monthlyExpenses * 100) / 100,
      netWorth: Math.round(totalBalance * 100) / 100,
      savingsRate:
        monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 * 100) / 100 : 0,
    }
  }

  // --- Clear All User Data ---
  static clearAllUserData(userId: string) {
    if (typeof window === "undefined") return
    localStorage.removeItem(`${LocalStorageService.ACCOUNTS_KEY}_${userId}`)
    localStorage.removeItem(`${LocalStorageService.CATEGORIES_KEY}_${userId}`)
    localStorage.removeItem(`${LocalStorageService.TRANSACTIONS_KEY}_${userId}`)
    localStorage.removeItem(`${LocalStorageService.BUDGETS_KEY}_${userId}`)
    localStorage.removeItem(`${LocalStorageService.GOALS_KEY}_${userId}`)
    LocalStorageService.emitDataChange(userId)
  }

  // --- Utility Functions ---
  static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  static exportUserData(userId: string) {
    const data = {
      accounts: LocalStorageService.getUserAccounts(userId),
      categories: LocalStorageService.getUserCategories(userId),
      transactions: LocalStorageService.getUserTransactions(userId),
      budgets: LocalStorageService.getUserBudgets(userId),
      goals: LocalStorageService.getUserGoals(userId),
      exportDate: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }

  static importUserData(userId: string, jsonData: string) {
    try {
      const data = JSON.parse(jsonData)
      if (data.accounts) LocalStorageService.setUserAccounts(userId, data.accounts)
      if (data.categories) LocalStorageService.setUserCategories(userId, data.categories)
      if (data.transactions) LocalStorageService.setUserTransactions(userId, data.transactions)
      if (data.budgets) LocalStorageService.setUserBudgets(userId, data.budgets)
      if (data.goals) LocalStorageService.setUserGoals(userId, data.goals)
      return true
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }
}

export default LocalStorageService

export function addUserGoalWrapper(goalData: Omit<Goal, "id" | "created_at" | "updated_at">): Goal {
  const now = new Date().toISOString()
  const newGoal: Goal = {
    ...goalData,
    id: LocalStorageService.generateId(),
    created_at: now,
    updated_at: now,
  }

  LocalStorageService.addUserGoal(goalData.user_id, newGoal)
  return newGoal
}

export function getUserGoalsWrapper(userId: string): Goal[] {
  return LocalStorageService.getUserGoals(userId)
}

export function updateUserGoalWrapper(userId: string, goalId: string, updates: Partial<Goal>): void {
  LocalStorageService.updateUserGoal(userId, goalId, updates)
}

export function deleteUserGoalWrapper(userId: string, goalId: string): void {
  LocalStorageService.deleteUserGoal(userId, goalId)
}

export function getUserTransactionsWrapper(userId: string, limit?: number): Transaction[] {
  return LocalStorageService.getUserTransactions(userId, limit)
}
