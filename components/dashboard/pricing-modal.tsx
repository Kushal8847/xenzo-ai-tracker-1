"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { X, Check, Crown, Zap, BarChart3, Headphones, Star, Shield, Clock } from "lucide-react"

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [isAnnual, setIsAnnual] = useState(true)

  const monthlyPrice = 29
  const annualPrice = 19
  const annualTotal = annualPrice * 12
  const monthlySavings = monthlyPrice * 12 - annualTotal

  const trialFeatures = [
    { name: "Up to 50 transactions", included: true },
    { name: "3 expense categories", included: true },
    { name: "Basic reports", included: true },
    { name: "Mobile app access", included: true },
    { name: "Unlimited transactions", included: false },
    { name: "AI-powered insights", included: false },
    { name: "Advanced analytics", included: false },
    { name: "Custom categories", included: false },
    { name: "Export data", included: false },
    { name: "Priority support", included: false },
  ]

  const premiumFeatures = [
    { name: "Unlimited transactions", included: true },
    { name: "Unlimited categories", included: true },
    { name: "AI-powered insights", included: true },
    { name: "Advanced analytics", included: true },
    { name: "Custom reports", included: true },
    { name: "Data export (CSV, PDF)", included: true },
    { name: "Budget forecasting", included: true },
    { name: "Bill reminders", included: true },
    { name: "Priority support", included: true },
    { name: "Multi-device sync", included: true },
  ]

  const benefits = [
    {
      icon: Zap,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations and spending insights powered by advanced AI",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep dive into your financial data with trends, forecasting, and custom reports",
    },
    {
      icon: Headphones,
      title: "Priority Support",
      description: "Get help when you need it with 24/7 priority customer support",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl w-full max-h-[90vh] overflow-y-auto p-0 bg-background/95 backdrop-blur-xl border border-white/10"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Choose Your Plan
              </h2>
              <p className="text-muted-foreground">Unlock the full potential of your financial tracking</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <span className={`text-sm font-medium ${!isAnnual ? "text-white" : "text-muted-foreground"}`}>Monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
            />
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isAnnual ? "text-white" : "text-muted-foreground"}`}>Annual</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">2 months free</Badge>
            </div>
          </div>
        </div>

        {/* Plans Comparison */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Trial Plan */}
            <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Trial Plan</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Perfect for getting started</p>
              </div>

              <div className="space-y-3 mb-6">
                {trialFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? "text-white" : "text-muted-foreground"}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full bg-transparent border-white/20 hover:bg-white/5" disabled>
                Current Plan
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-3 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-xl font-bold">Premium Plan</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ${isAnnual ? annualPrice : monthlyPrice}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                {isAnnual && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-green-400">
                      ${annualTotal}/year • Save ${monthlySavings}/year
                    </span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-2">Everything you need to master your finances</p>
              </div>

              <div className="space-y-3 mb-6">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-white">{feature.name}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold shadow-lg border-0 transition-all duration-300 hover:scale-105">
                Upgrade Now
              </Button>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-6 text-center">Why Choose Premium?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h4 className="font-semibold mb-2">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center space-y-4 p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Join thousands of users who have transformed their financial habits with Xenzo Premium
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
