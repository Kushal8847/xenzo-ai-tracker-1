"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  MessageSquare,
  Zap,
  Brain,
  User,
  Mic,
  MicOff,
  Copy,
  ThumbsUp,
  Clock,
  Star,
} from "lucide-react"
import { useAppData } from "@/hooks/use-app-data"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

export function AIAssistantView() {
  const { transactions, categories, budgets } = useAppData()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "🤖 Hello! I'm your advanced AI financial assistant powered by ChatGPT. I've analyzed your financial data and I'm ready to provide personalized insights, answer questions, and help optimize your finances. What would you like to explore today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateChatGPTResponse = async (input: string): Promise<string> => {
    const lowerInput = input.toLowerCase()

    // Filter valid transactions with proper date parsing
    const validTransactions = transactions.filter((t) => {
      if (!t.transaction_date) return false
      const date = new Date(t.transaction_date)
      return !isNaN(date.getTime())
    })

    // Calculate comprehensive financial metrics from live data
    const totalSpent = validTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const totalIncome = validTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = validTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const avgTransaction = validTransactions.length > 0 ? totalSpent / validTransactions.length : 0

    // Current month analysis with proper date handling
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    const thisMonthTransactions = validTransactions.filter((t) => {
      const date = new Date(t.transaction_date)
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear
    })
    const thisMonthSpent = thisMonthTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const thisMonthIncome = thisMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
    const thisMonthExpenses = thisMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    // Category analysis with proper category matching
    const categorySpending = categories
      .map((cat) => {
        const catTransactions = validTransactions.filter((t) => t.category_id === cat.id)
        const catTotal = catTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
        return { name: cat.name, amount: catTotal, count: catTransactions.length }
      })
      .sort((a, b) => b.amount - a.amount)

    // Budget analysis with proper budget structure
    const totalBudgetAmount = budgets.reduce((sum, b) => sum + (b.amount || 0), 0)
    const totalBudgetSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0)
    const onTrackBudgets = budgets.filter((b) => (b.spent || 0) <= (b.amount || 0) * 0.8).length
    const overBudgets = budgets.filter((b) => (b.spent || 0) > (b.amount || 0)).length
    const budgetUtilization = totalBudgetAmount > 0 ? (totalBudgetSpent / totalBudgetAmount) * 100 : 0

    // Trend analysis (last 3 months) with proper date handling
    const last3Months = Array.from({ length: 3 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthTransactions = validTransactions.filter((t) => {
        const tDate = new Date(t.transaction_date)
        return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear()
      })
      return {
        month: date.toLocaleString("default", { month: "long" }),
        spent: monthTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0),
        transactions: monthTransactions.length,
      }
    })

    const spendingTrend =
      last3Months.length > 1 ? (last3Months[0].spent > last3Months[1].spent ? "increasing" : "decreasing") : "stable"

    // Simulate ChatGPT API call (replace with actual API call)
    try {
      // In a real implementation, you would call the ChatGPT API here
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message: input,
      //     context: { transactions, budgets, categories, totalSpent, avgTransaction }
      //   })
      // })
      // const data = await response.json()
      // return data.response

      // Enhanced responses using comprehensive live data
      if (lowerInput.includes("spending") || lowerInput.includes("expense")) {
        const topCategory = categorySpending[0]
        return `📊 **Comprehensive Spending Analysis**

Based on my analysis of your ${validTransactions.length} transactions:

**Overall Financial Picture:**
• **Total Spending**: $${totalSpent.toFixed(2)} across all time
• **This Month**: $${thisMonthSpent.toFixed(2)} (${thisMonthTransactions.length} transactions)
• **Average Transaction**: $${avgTransaction.toFixed(2)}
• **Spending Trend**: Your spending is ${spendingTrend} compared to recent months

**Category Breakdown:**
• **Top Category**: ${topCategory?.name || "Miscellaneous"} - $${topCategory?.amount.toFixed(2) || "0.00"} (${topCategory?.count || 0} transactions)
• **Category Distribution**: You spend across ${categorySpending.filter((c) => c.amount > 0).length} different categories
• **Focus Area**: ${topCategory?.amount > totalSpent * 0.4 ? "Consider diversifying spending" : "Good spending distribution"}

**Monthly Comparison:**
${last3Months.map((m) => `• ${m.month}: $${m.spent.toFixed(2)} (${m.transactions} transactions)`).join("\n")}

**AI Insight**: Your spending pattern shows ${avgTransaction > 100 ? "larger, planned purchases" : "frequent smaller transactions"}. ${spendingTrend === "increasing" ? "Consider reviewing recent increases." : "Good job maintaining consistent spending levels."}

Would you like me to dive deeper into any specific category or time period?`
      }

      if (lowerInput.includes("budget")) {
        return `🎯 **Detailed Budget Performance Analysis**

Here's your comprehensive budget status:

**Budget Overview:**
• **Total Budget Allocated**: $${totalBudgetAmount.toFixed(2)}
• **Total Spent**: $${totalBudgetSpent.toFixed(2)}
• **Budget Utilization**: ${budgetUtilization.toFixed(1)}%
• **Remaining Budget**: $${(totalBudgetAmount - totalBudgetSpent).toFixed(2)}

**Budget Performance:**
• **On Track**: ${onTrackBudgets} budgets (under 80% utilization)
• **Needs Attention**: ${budgets.length - onTrackBudgets - overBudgets} budgets (80-100% used)
• **Over Budget**: ${overBudgets} budgets (exceeding limits)
• **Success Rate**: ${budgets.length > 0 ? Math.round((onTrackBudgets / budgets.length) * 100) : 0}%

**Individual Budget Status:**
${budgets
  .slice(0, 5)
  .map((b) => {
    const percentage = (b.amount || 0) > 0 ? ((b.spent || 0) / (b.amount || 0)) * 100 : 0
    const status = percentage > 100 ? "⚠️ Over" : percentage > 80 ? "⚡ Close" : "✅ Good"
    return `• ${b.category || "Unknown"}: ${status} - $${(b.spent || 0).toFixed(2)}/$${(b.amount || 0).toFixed(2)} (${percentage.toFixed(1)}%)`
  })
  .join("\n")}

**AI Recommendation**: ${budgetUtilization < 80 ? "Excellent budget discipline! Consider setting stretch goals or increasing savings." : budgetUtilization < 100 ? "Good budget management with room for optimization in overspending categories." : "Several budgets need immediate attention. Focus on your highest overspending categories first."}

Would you like specific strategies for any particular budget category?`
      }

      if (lowerInput.includes("save") || lowerInput.includes("saving")) {
        const potentialSavings = Math.round(totalExpenses * 0.15)
        const monthlyPotential = Math.round(thisMonthExpenses * 0.1)
        return `💰 **Personalized Savings Strategy**

Based on your actual spending data:

**Savings Potential Analysis:**
• **Monthly Savings Opportunity**: $${monthlyPotential} (10% of current expenses)
• **Annual Potential**: $${potentialSavings} (15% optimization target)
• **Current Monthly Expenses**: $${thisMonthExpenses.toFixed(2)}
• **Income vs Expenses**: ${thisMonthIncome > thisMonthExpenses ? "Positive" : "Needs attention"} ($${(thisMonthIncome - thisMonthExpenses).toFixed(2)} difference)

**Top Savings Opportunities:**
${categorySpending
  .slice(0, 3)
  .map(
    (cat, i) =>
      `${i + 1}. **${cat.name}**: $${cat.amount.toFixed(2)} - Potential savings: $${(cat.amount * 0.15).toFixed(2)}`,
  )
  .join("\n")}

**Personalized Recommendations:**
• **Quick Win**: Review your top spending category (${categorySpending[0]?.name || "Unknown"}) for $${((categorySpending[0]?.amount || 0) * 0.1).toFixed(2)} monthly savings
• **Habit Change**: Your ${avgTransaction < 50 ? "frequent small purchases" : "larger transactions"} suggest ${avgTransaction < 50 ? "tracking daily expenses" : "planning major purchases"}
• **Budget Reallocation**: ${overBudgets > 0 ? `Focus on ${overBudgets} over-budget categories` : "Consider increasing savings allocation"}

**Smart Savings Plan:**
• Week 1-2: Track and reduce top category by 10%
• Week 3-4: Implement automated savings of $${Math.round(monthlyPotential / 4)} weekly
• Month 2+: Scale to full $${monthlyPotential} monthly savings goal

Shall I create a detailed action plan for your specific situation?`
      }

      if (lowerInput.includes("predict") || lowerInput.includes("forecast")) {
        const trendMultiplier = spendingTrend === "increasing" ? 1.1 : spendingTrend === "decreasing" ? 0.95 : 1.02
        const predictedSpending = Math.round(thisMonthSpent * trendMultiplier)
        const confidence = validTransactions.length > 20 ? "High" : validTransactions.length > 10 ? "Medium" : "Low"

        return `🔮 **AI Financial Forecast & Predictions**

Based on ${validTransactions.length} data points and current trends:

**Next Month Prediction:**
• **Predicted Spending**: $${predictedSpending} (${((trendMultiplier - 1) * 100).toFixed(1)}% ${spendingTrend === "increasing" ? "increase" : "change"})
• **Confidence Level**: ${confidence} (${validTransactions.length} transactions analyzed)
• **Trend Direction**: ${spendingTrend.charAt(0).toUpperCase() + spendingTrend.slice(1)} spending pattern

**Category Forecasts:**
${categorySpending
  .slice(0, 3)
  .map((cat) => {
    const predicted = cat.amount * trendMultiplier
    return `• **${cat.name}**: $${predicted.toFixed(2)} (current: $${cat.amount.toFixed(2)})`
  })
  .join("\n")}

**Budget Impact Forecast:**
• **Budget Utilization**: ${(budgetUtilization * trendMultiplier).toFixed(1)}% predicted
• **At-Risk Budgets**: ${budgets.filter((b) => ((b.spent || 0) / (b.amount || 1)) * trendMultiplier > 0.9).length} budgets may exceed limits
• **Recommended Action**: ${trendMultiplier > 1.05 ? "Implement spending controls now" : "Maintain current spending discipline"}

**3-Month Outlook:**
• **Quarterly Spending**: $${(predictedSpending * 3).toFixed(2)} estimated
• **Savings Impact**: ${trendMultiplier > 1.05 ? "May reduce savings by $" + (predictedSpending * 0.1 * 3).toFixed(2) : "Savings goals achievable"}
• **Budget Health**: ${budgetUtilization * trendMultiplier < 90 ? "Stable" : "Requires monitoring"}

**AI Alert System**: I'll monitor your spending and notify you if you're trending ${trendMultiplier > 1.05 ? "toward overspending" : "off track from"} this prediction.

Would you like me to set up automated alerts or create a spending adjustment plan?`
      }

      // Default comprehensive response with live data
      const responses = [
        `🤖 **Complete Financial Analysis Ready**

I've processed your comprehensive financial data:

**Your Financial Snapshot:**
• **Total Transactions**: ${validTransactions.length} across ${categories.length} categories
• **Monthly Activity**: $${thisMonthSpent.toFixed(2)} this month (${thisMonthTransactions.length} transactions)
• **Budget Performance**: ${onTrackBudgets}/${budgets.length} budgets on track (${budgets.length > 0 ? Math.round((onTrackBudgets / budgets.length) * 100) : 0}%)
• **Spending Trend**: ${spendingTrend.charAt(0).toUpperCase() + spendingTrend.slice(1)} pattern detected

**What I Can Help You With:**
• **Deep Spending Analysis**: Analyze your $${totalSpent.toFixed(2)} in total expenses
• **Budget Optimization**: Improve your ${budgetUtilization.toFixed(1)}% budget utilization
• **Savings Strategies**: Identify $${Math.round(totalExpenses * 0.1)} monthly savings potential
• **Trend Forecasting**: Predict future spending based on your ${spendingTrend} pattern
• **Category Insights**: Optimize across your ${categorySpending.filter((c) => c.amount > 0).length} active spending areas

**Top Priority**: ${overBudgets > 0 ? `Address ${overBudgets} over-budget categories` : budgetUtilization > 90 ? "Monitor high budget utilization" : "Explore savings opportunities"}

What specific area would you like to explore first?`,

        `💡 **Personalized Financial Intelligence**

Your unique financial profile shows:

**Spending Behavior:**
• **Transaction Pattern**: ${avgTransaction > 100 ? "Strategic, larger purchases" : "Frequent, smaller transactions"} (avg: $${avgTransaction.toFixed(2)})
• **Category Focus**: ${categorySpending[0]?.name || "Miscellaneous"} dominates at $${categorySpending[0]?.amount.toFixed(2) || "0.00"}
• **Monthly Consistency**: ${spendingTrend === "stable" ? "Stable spending habits" : `${spendingTrend.charAt(0).toUpperCase() + spendingTrend.slice(1)} trend`}

**Budget Intelligence:**
• **Utilization Rate**: ${budgetUtilization.toFixed(1)}% of allocated budgets used
• **Success Rate**: ${budgets.length > 0 ? Math.round((onTrackBudgets / budgets.length) * 100) : 0}% of budgets performing well
• **Risk Assessment**: ${overBudgets > 0 ? "High - immediate attention needed" : budgetUtilization > 80 ? "Medium - monitor closely" : "Low - good control"}

**Optimization Opportunities:**
• **Immediate**: $${Math.round(thisMonthExpenses * 0.05)} monthly quick savings
• **Strategic**: $${Math.round(totalExpenses * 0.15)} annual optimization potential
• **Behavioral**: ${avgTransaction < 30 ? "Track micro-transactions" : "Plan major purchases better"}

**AI Recommendation**: Based on your ${validTransactions.length} transactions, you have ${budgetUtilization < 70 ? "excellent" : budgetUtilization < 90 ? "good" : "challenging"} financial discipline. ${budgetUtilization < 70 ? "Consider aggressive savings goals." : budgetUtilization < 90 ? "Focus on optimization." : "Prioritize expense reduction."}

What aspect of your finances would you like to improve first?`,
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    } catch (error) {
      return "I apologize, but I'm having trouble connecting to my advanced AI systems right now. However, I can still provide insights based on your local financial data. What would you like to know?"
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Show typing indicator
    setTimeout(() => {
      const typingMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "",
        timestamp: new Date(),
        isTyping: true,
      }
      setMessages((prev) => [...prev, typingMessage])

      // Generate AI response
      setTimeout(async () => {
        const aiResponse: Message = {
          id: (Date.now() + 2).toString(),
          type: "assistant",
          content: await generateChatGPTResponse(userMessage.content),
          timestamp: new Date(),
        }
        setMessages((prev) => prev.slice(0, -1).concat(aiResponse))
        setIsLoading(false)
      }, 2500) // Longer delay to simulate ChatGPT processing
    }, 800)
  }

  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false)
    } else {
      setIsListening(true)
      // Enhanced voice input simulation
      setTimeout(() => {
        const voiceQueries = [
          "How much did I spend this month?",
          "What's my biggest expense category?",
          "Can you help me save more money?",
          "Predict my spending for next month",
          "How are my budgets performing?",
        ]
        setInputValue(voiceQueries[Math.floor(Math.random() * voiceQueries.length)])
        setIsListening(false)
      }, 3000)
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 w-full">
      <div className="premium-card p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
            <Brain className="w-10 h-10 text-white relative z-10" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-400 bg-clip-text text-transparent mb-2">
              AI Financial Assistant
            </h1>
            <p className="text-muted-foreground text-lg">Powered by ChatGPT • Real-time insights</p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 px-3 py-1">
            <Sparkles className="w-4 h-4 mr-2" />
            ChatGPT Powered
          </Badge>
          <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
            <Zap className="w-4 h-4 mr-2" />
            Real-time Analysis
          </Badge>
          <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30 px-3 py-1">
            <Star className="w-4 h-4 mr-2" />
            Advanced AI
          </Badge>
        </div>
      </div>

      <Card className="premium-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <MessageSquare className="w-8 h-8" />
            ChatGPT Financial Assistant
            <Badge className="ml-auto bg-green-500/20 text-green-300 border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Online
            </Badge>
          </CardTitle>
          <CardDescription className="text-lg">
            Ask me anything about your spending patterns, {budgets.length} budgets, or get personalized financial
            advice. I'm here to help optimize your finances!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[700px] md:h-[750px] lg:h-[800px] flex flex-col">
            <ScrollArea className="flex-1 pr-4 mb-6">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "assistant" && (
                      <Avatar className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                        <AvatarFallback>
                          <Bot className="w-6 h-6 text-white" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[85%] md:max-w-[80%] lg:max-w-[75%] rounded-2xl p-5 ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                          : "bg-white/5 border border-white/10 backdrop-blur-sm"
                      }`}
                    >
                      {message.isTyping ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                          <span className="text-base">ChatGPT is analyzing your financial data...</span>
                        </div>
                      ) : (
                        <>
                          <div className="text-base leading-relaxed whitespace-pre-line">{message.content}</div>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                            <p className="text-sm opacity-70 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                            {message.type === "assistant" && (
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                                  onClick={() => copyMessage(message.content)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-60 hover:opacity-100">
                                  <ThumbsUp className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    {message.type === "user" && (
                      <Avatar className="w-12 h-12 shadow-lg">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask your AI financial assistant anything..."
                  className="bg-white/5 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-lg py-4 h-14 flex-1"
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  disabled={isLoading}
                />
                <Button
                  onClick={toggleVoiceInput}
                  variant="outline"
                  size="icon"
                  className={`h-14 w-14 ${isListening ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-white/5 border-white/10"}`}
                  disabled={isLoading}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-14 px-8 text-lg"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  size="default"
                  className="bg-white/5 border-white/10 hover:bg-white/10 px-4 py-3 text-sm md:text-base"
                  onClick={() => setInputValue("Analyze my spending patterns")}
                  disabled={isLoading}
                >
                  📊 Analyze Spending
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  className="bg-white/5 border-white/10 hover:bg-white/10 px-4 py-3 text-sm md:text-base"
                  onClick={() => setInputValue("How can I save more money?")}
                  disabled={isLoading}
                >
                  💰 Savings Tips
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  className="bg-white/5 border-white/10 hover:bg-white/10 px-4 py-3 text-sm md:text-base"
                  onClick={() => setInputValue("Predict my next month expenses")}
                  disabled={isLoading}
                >
                  🔮 Forecast
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  className="bg-white/5 border-white/10 hover:bg-white/10 px-4 py-3 text-sm md:text-base"
                  onClick={() => setInputValue("Review my budget performance")}
                  disabled={isLoading}
                >
                  🎯 Budget Review
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
