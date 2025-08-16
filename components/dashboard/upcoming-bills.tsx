"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Zap, Wifi, Phone, Car, Home, CreditCard, ArrowRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import { UpcomingBillsModal } from "./upcoming-bills-modal"

const upcomingBills = [
  {
    id: 1,
    name: "AGL Energy",
    amount: 156.75,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 5 days from now
    icon: Zap,
    color: "text-yellow-400",
    status: "due-soon",
    category: "Utilities",
  },
  {
    id: 2,
    name: "Telstra Internet",
    amount: 89.99,
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 8 days from now
    icon: Wifi,
    color: "text-blue-400",
    status: "upcoming",
    category: "Internet",
  },
  {
    id: 3,
    name: "Vodafone Mobile",
    amount: 65.0,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 10 days from now
    icon: Phone,
    color: "text-green-400",
    status: "upcoming",
    category: "Mobile",
  },
  {
    id: 4,
    name: "Car Insurance",
    amount: 124.5,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 15 days from now
    icon: Car,
    color: "text-purple-400",
    status: "upcoming",
    category: "Insurance",
  },
  {
    id: 5,
    name: "Rent Payment",
    amount: 1800.0,
    dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 18 days from now
    icon: Home,
    color: "text-red-400",
    status: "upcoming",
    category: "Housing",
  },
  {
    id: 6,
    name: "Credit Card",
    amount: 450.25,
    dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 25 days from now
    icon: CreditCard,
    color: "text-pink-400",
    status: "upcoming",
    category: "Credit",
  },
  {
    id: 7,
    name: "Netflix",
    amount: 22.99,
    dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 28 days from now
    icon: Wifi,
    color: "text-red-400",
    status: "upcoming",
    category: "Entertainment",
  },
  {
    id: 8,
    name: "Amazon Prime",
    amount: 8.99,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
    icon: Phone,
    color: "text-orange-400",
    status: "upcoming",
    category: "Subscription",
  },
  {
    id: 9,
    name: "ChatGPT Plus",
    amount: 30.0,
    dueDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 32 days from now
    icon: Zap,
    color: "text-green-400",
    status: "upcoming",
    category: "AI Tools",
  },
  {
    id: 10,
    name: "Spotify Premium",
    amount: 14.99,
    dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 35 days from now
    icon: Wifi,
    color: "text-green-400",
    status: "upcoming",
    category: "Music",
  },
  {
    id: 11,
    name: "Adobe Creative",
    amount: 79.99,
    dueDate: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 38 days from now
    icon: CreditCard,
    color: "text-blue-400",
    status: "upcoming",
    category: "Software",
  },
  {
    id: 12,
    name: "Gym Membership",
    amount: 49.95,
    dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 42 days from now
    icon: Home,
    color: "text-purple-400",
    status: "upcoming",
    category: "Health",
  },
]

export function UpcomingBills() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const totalBills = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0)

  return (
    <>
      <Card className="premium-card h-full flex flex-col">
        <CardHeader className="pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Upcoming Bills</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Don't miss any payments</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-muted-foreground">Total</p>
              <p className="text-lg font-bold">{formatCurrency(totalBills)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 gap-3 flex-1 content-start">
            {upcomingBills.slice(0, 6).map((bill, index) => {
              const Icon = bill.icon
              const daysUntilDue = Math.max(
                0,
                Math.ceil((new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
              )

              return (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 h-fit"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${bill.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{bill.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={daysUntilDue <= 3 ? "destructive" : daysUntilDue <= 7 ? "default" : "secondary"}
                          className="text-xs px-1.5 py-0"
                        >
                          {daysUntilDue === 0 ? "Today" : `${daysUntilDue}d`}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatCurrency(bill.amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-transparent border-white/20 hover:bg-white/5 group"
              onClick={() => setIsModalOpen(true)}
            >
              View All Bills
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <UpcomingBillsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} bills={upcomingBills} />
    </>
  )
}
