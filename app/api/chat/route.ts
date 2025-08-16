import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json()

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert financial advisor AI assistant specializing in personal finance management. 

CONTEXT: The user has provided their financial data: ${JSON.stringify(context)}

INSTRUCTIONS:
- Analyze their spending patterns, budgets, and financial behavior
- Provide specific, actionable advice based on their actual data
- Use a professional yet friendly tone
- Format responses with clear sections using markdown
- Include specific numbers and calculations when relevant
- Focus on practical recommendations they can implement immediately
- If they ask about spending, analyze their transaction patterns
- If they ask about budgets, review their budget performance
- If they ask about savings, provide personalized savings strategies
- Always base advice on their real financial data, not generic advice

FINANCIAL DATA SUMMARY:
- Total transactions: ${context?.transactions?.length || 0}
- Total spending: $${context?.totalSpent?.toFixed(2) || "0.00"}
- Average transaction: $${context?.avgTransaction?.toFixed(2) || "0.00"}
- Active budgets: ${context?.budgets?.length || 0}
- Categories: ${context?.categories?.map((c: any) => c.name).join(", ") || "None"}

Provide detailed, personalized financial advice based on this specific user's data.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const data = await openaiResponse.json()

    return NextResponse.json({
      response: data.choices[0].message.content,
    })
  } catch (error) {
    console.error("ChatGPT API error:", error)

    const { message, context } = await req.json()
    const lowerMessage = message.toLowerCase()
    const { transactions = [], budgets = [], categories = [], totalSpent = 0, avgTransaction = 0 } = context || {}

    const fallbackResponse = `🤖 **AI Financial Assistant** (Offline Mode)

I'm currently unable to connect to the advanced AI system, but I can still provide basic analysis based on your data:

**Your Financial Summary**:
• **Total Spending**: $${totalSpent.toFixed(2)} across ${transactions.length} transactions
• **Average Transaction**: $${avgTransaction.toFixed(2)}
• **Active Budgets**: ${budgets.length} budgets
• **Categories**: ${categories.length} spending categories

**Quick Insights**:
${avgTransaction > 100 ? "• Your larger transaction amounts suggest planned purchases" : "• Your frequent smaller transactions indicate daily spending habits"}
${budgets.length > 0 ? "• You have active budget management in place" : "• Consider setting up budgets for better financial control"}

**Immediate Recommendations**:
1. Review your top spending categories for optimization opportunities
2. Set up automated savings transfers
3. Monitor budget performance weekly
4. Track spending patterns to identify trends

Please try again in a moment for full AI-powered analysis, or ask me specific questions about your finances.`

    return NextResponse.json({
      response: fallbackResponse,
    })
  }
}
