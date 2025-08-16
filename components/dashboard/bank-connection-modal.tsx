"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  Globe,
  Lock,
  TrendingUp,
  RefreshCw,
  Sparkles,
} from "lucide-react"

interface BankConnectionModalProps {
  isOpen: boolean
  onClose: () => void
}

const popularBanks = [
  { name: "Commonwealth Bank", logo: "🏦", color: "bg-yellow-500", supported: true },
  { name: "Westpac", logo: "🏛️", color: "bg-red-500", supported: true },
  { name: "ANZ Bank", logo: "🏪", color: "bg-blue-600", supported: true },
  { name: "NAB", logo: "🏢", color: "bg-red-600", supported: true },
  { name: "Bendigo Bank", logo: "🏦", color: "bg-purple-500", supported: true },
  { name: "ING Australia", logo: "🏛️", color: "bg-orange-500", supported: true },
  { name: "Macquarie Bank", logo: "🏪", color: "bg-green-600", supported: true },
  { name: "Bank Australia", logo: "🏢", color: "bg-teal-500", supported: true },
]

const features = [
  {
    icon: RefreshCw,
    title: "Real-time Sync",
    description: "Automatically sync transactions as they happen",
    color: "text-blue-400",
  },
  {
    icon: Shield,
    title: "Bank-level Security",
    description: "256-bit encryption and read-only access",
    color: "text-green-400",
  },
  {
    icon: TrendingUp,
    title: "Smart Categorisation",
    description: "AI-powered transaction categorisation",
    color: "text-purple-400",
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Balance and transaction updates in real-time",
    color: "text-yellow-400",
  },
]

export function BankConnectionModal({ isOpen, onClose }: BankConnectionModalProps) {
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [connectionStep, setConnectionStep] = useState<"select" | "connect" | "success">("select")
  const [isConnecting, setIsConnecting] = useState(false)
  const [showDevModal, setShowDevModal] = useState(false)

  const handleBankSelect = (bankName: string) => {
    setSelectedBank(bankName)
    setConnectionStep("connect")
  }

  const handleConnect = async () => {
    setShowDevModal(true)
  }

  const resetModal = () => {
    setSelectedBank(null)
    setConnectionStep("select")
    setIsConnecting(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border border-white/10">
          <DialogHeader className="border-b border-white/10 pb-4">
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Connect Your Bank Account
              </span>
            </DialogTitle>
          </DialogHeader>

          {connectionStep === "select" && (
            <div className="space-y-8 pt-2">
              {/* Security Notice */}
              <Card className="border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-green-400 mb-2 text-lg">Secure & Read-Only Access</h4>
                      <p className="text-sm text-green-300/80 leading-relaxed">
                        We use bank-level 256-bit encryption and only request read-only access. We cannot move money or
                        make changes to your account. Your security is our top priority.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <div>
                <h3 className="font-bold text-xl mb-6 text-white">What you'll get:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <Card
                        key={index}
                        className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                              <Icon className={`w-5 h-5 ${feature.color}`} />
                            </div>
                            <div>
                              <p className="font-semibold text-white mb-1">{feature.title}</p>
                              <p className="text-sm text-white/70">{feature.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Bank Selection */}
              <div>
                <h3 className="font-bold text-xl mb-6 text-white">Select your Australian bank:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularBanks.map((bank, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-6 justify-start hover:bg-white/10 bg-white/5 border-white/20 hover:border-white/30 transition-all duration-300 group"
                      onClick={() => handleBankSelect(bank.name)}
                      disabled={!bank.supported}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div
                          className={`w-12 h-12 rounded-xl ${bank.color} flex items-center justify-center text-white text-lg shadow-lg group-hover:scale-105 transition-transform duration-300`}
                        >
                          {bank.logo}
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-white text-base">{bank.name}</p>
                          {bank.supported ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs mt-1">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Supported
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs mt-1 border-white/30 text-white/70">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Manual Connection */}
              <Card className="border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Don't see your bank?
                  </CardTitle>
                  <CardDescription className="text-blue-300/80">
                    Connect manually using your online banking credentials or CSV import
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full bg-white/5 border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50 text-blue-400 transition-all duration-300"
                    onClick={() => handleBankSelect("Manual")}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Connect Manually
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {connectionStep === "connect" && (
            <div className="space-y-8 pt-2">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Connecting to {selectedBank}</h3>
                <p className="text-white/70 text-lg">You'll be redirected to your bank's secure login page</p>
              </div>

              <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-400 mb-3 text-lg">Important Security Information</h4>
                      <ul className="text-sm text-amber-300/80 space-y-2 leading-relaxed">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-amber-400" />
                          Use your regular online banking credentials
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-amber-400" />
                          We'll only access transaction data (read-only)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-amber-400" />
                          You can disconnect at any time in settings
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setConnectionStep("select")}
                  className="flex-1 bg-white/5 border-white/20 hover:bg-white/10 text-white"
                >
                  <TrendingUp className="w-4 h-4 mr-2 rotate-180" />
                  Back
                </Button>
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Connect Securely
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {connectionStep === "success" && (
            <div className="space-y-8 text-center pt-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3 text-white">Successfully Connected!</h3>
                <p className="text-white/70 text-lg">
                  Your {selectedBank} account has been connected. We're now syncing your transactions.
                </p>
              </div>

              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Syncing transactions...</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        In Progress
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Setting up categories...</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        In Progress
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Updating balance...</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Development Modal */}
      <Dialog open={showDevModal} onOpenChange={setShowDevModal}>
        <DialogContent className="max-w-lg bg-background/95 backdrop-blur-xl border border-white/10">
          <DialogHeader className="border-b border-white/10 pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Feature Under Development
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
              <Building2 className="w-8 h-8 text-white" />
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-white">Coming Soon!</h3>
              <p className="text-white/80 mb-4 leading-relaxed">
                Bank integration is currently under development and review. We're working hard to bring you secure,
                seamless connectivity with Australian banks.
              </p>
              <p className="text-sm text-white/60">
                We appreciate your patience and will notify you as soon as this feature becomes available.
              </p>
            </div>

            <Card className="border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-blue-400 mb-3">What's Coming</h4>
                    <ul className="text-sm text-blue-300/80 space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-blue-400" />
                        Secure bank-level encryption
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-blue-400" />
                        Real-time transaction sync
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-blue-400" />
                        Support for all major Australian banks
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-blue-400" />
                        Smart AI-powered categorisation
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => setShowDevModal(false)}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Got It, Thanks!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
