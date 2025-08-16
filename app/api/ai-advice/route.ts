import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] AI advice API called")

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("[v0] OpenAI API key not found")
      return NextResponse.json(
        {
          error: "OpenAI API key not configured",
          userMessage: "The AI service is not properly configured. Please contact support.",
        },
        { status: 500 },
      )
    }

    const { message, context } = await request.json()
    console.log("[v0] Received message:", message)

    if (!message) {
      return NextResponse.json(
        {
          error: "Message is required",
          userMessage: "Please enter a message to get AI advice.",
        },
        { status: 400 },
      )
    }

    const systemPrompt = `You are a helpful AI financial advisor integrated into the Aussie Tracker expense tracking app. You provide practical, actionable financial advice tailored to Australian users. 

Key guidelines:
- Focus on budgeting, saving, investing, and expense management
- Use Australian financial terminology and context (AUD, superannuation, etc.)
- Be encouraging and supportive while being realistic
- Provide specific, actionable advice
- Keep responses concise but informative
- If asked about specific investments, remind users to do their own research and consider professional advice

The user is using an expense tracking app, so you can reference features like tracking expenses, setting budgets, monitoring income, and analyzing spending patterns.`

    console.log("[v0] Calling OpenAI API via AI SDK...")

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      maxTokens: 500,
      temperature: 0.7,
    })

    console.log("[v0] Full AI SDK result:", JSON.stringify(result, null, 2))
    console.log("[v0] OpenAI response text:", result.text)
    console.log("[v0] OpenAI response length:", result.text?.length || 0)

    if (!result.text || result.text.trim().length === 0) {
      console.error("[v0] Empty response from OpenAI")

      // Provide a helpful fallback response instead of just an error
      const fallbackResponse = `G'day! I'm here to help with your financial questions. 

Since you said "${message}", here are some general tips:

💰 **Budgeting Basics**: Track your income and expenses to see where your money goes
📊 **Expense Categories**: Group spending into needs vs wants to identify savings opportunities  
🎯 **Emergency Fund**: Aim to save 3-6 months of expenses for unexpected costs
📈 **Superannuation**: Make sure you're getting the most from your super contributions

What specific financial area would you like help with? I can provide more targeted advice!`

      return NextResponse.json({ response: fallbackResponse })
    }

    console.log("[v0] OpenAI response received successfully")
    return NextResponse.json({ response: result.text })
  } catch (error) {
    console.error("[v0] OpenAI API error:", error)

    if (error instanceof Error) {
      console.log("[v0] Error message:", error.message)
      console.log("[v0] Error stack:", error.stack)

      if (error.message.includes("quota") || error.message.includes("exceeded")) {
        return NextResponse.json(
          {
            error: "OpenAI API quota exceeded",
            userMessage:
              "🚫 **API Quota Exceeded**\n\nYour OpenAI API usage has reached its limit. To continue using AI advice:\n\n• Check your OpenAI billing at platform.openai.com\n• Add credits to your account or upgrade your plan\n• Wait for your quota to reset if on a free tier\n\nI'll be here when you're ready to chat again!",
          },
          { status: 429 },
        )
      }
      if (
        error.message.includes("API key") ||
        error.message.includes("authentication") ||
        error.message.includes("401")
      ) {
        return NextResponse.json(
          {
            error: "Invalid OpenAI API key",
            userMessage:
              "🔑 **API Key Issue**\n\nThere's a problem with the OpenAI API key configuration. Please check that your API key is valid and has the necessary permissions.",
          },
          { status: 401 },
        )
      }
      if (error.message.includes("rate limit") || error.message.includes("429")) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            userMessage: "⏱️ **Rate Limited**\n\nToo many requests in a short time. Please wait a moment and try again.",
          },
          { status: 429 },
        )
      }
      if (
        error.message.includes("model") ||
        error.message.includes("does not exist") ||
        error.message.includes("404")
      ) {
        return NextResponse.json(
          {
            error: "Model access error",
            userMessage:
              "🤖 **Model Access Issue**\n\nThe AI model is not accessible with your current API key. You may need to upgrade your OpenAI plan to access the model.",
          },
          { status: 403 },
        )
      }
    }

    const fallbackResponse = `I apologize, but I'm experiencing some technical difficulties right now. 

Here are some general financial tips while I get back online:

💡 **Quick Tips**:
• Review your spending weekly to stay on track
• Set up automatic transfers to savings
• Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings
• Check your bank statements regularly for unexpected charges

Please try asking your question again in a moment, and I'll do my best to provide personalized advice!`

    return NextResponse.json({ response: fallbackResponse })
  }
}
