import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount)
  } catch (error) {
    console.error("Error formatting currency:", error)
    return `$${amount.toFixed(2)}`
  }
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString)
      return dateString
    }
    return new Intl.DateTimeFormat("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString)
      return dateString
    }
    return new Intl.DateTimeFormat("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  } catch (error) {
    console.error("Error formatting date time:", error)
    return dateString
  }
}
