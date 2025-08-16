"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIAdviceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AIAdviceModal({ isOpen, onClose }: AIAdviceModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your AI financial advisor. I can help you with budgeting tips, expense analysis, investment advice, and answer any financial questions you have. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      console.log("[v0] Sending message to AI API:", input.trim())

      const response = await fetch("/api/ai-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
          context: "financial_advice",
        }),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.log("[v0] API error response:", errorData)

        const errorMessage = errorData.userMessage || errorData.error || `HTTP ${response.status}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("[v0] API success response:", data)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Error getting AI response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          error instanceof Error ? error.message : "I'm sorry, I encountered an unexpected error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] bg-black/95 border-white/10 flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700">
              <Bot className="h-5 w-5 text-white" />
            </div>
            AI Financial Advisor
          </DialogTitle>
        </DialogHeader>

        <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 p-4 rounded-lg",
                  message.role === "user" ? "bg-blue-600/20 ml-8" : "bg-white/5 mr-8",
                )}
              >
                <div className="flex-shrink-0">
                  {message.role === "user" ? (
                    <div className="p-2 rounded-full bg-blue-600">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white/90 leading-relaxed whitespace-pre-line">{message.content}</div>
                  <p className="text-xs text-muted-foreground mt-2">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 p-4 rounded-lg bg-white/5 mr-8">
                <div className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 flex gap-2 pt-4 border-t border-white/10">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your finances..."
            className="flex-1 bg-white/5 border-white/10 focus:border-white/20"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
