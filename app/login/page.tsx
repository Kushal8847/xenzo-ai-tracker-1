"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Banknote,
  Eye,
  EyeOff,
  Loader2,
  TrendingUp,
  Shield,
  Smartphone,
  BarChart3,
  Target,
  Zap,
  Users,
} from "lucide-react"
import { AuthService } from "@/lib/auth"
import { VerificationCodeModal } from "@/components/auth/verification-code-modal"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const [error, setError] = useState("")
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await AuthService.signInWith2FA(email, password)

      if (result.success && result.requiresVerification) {
        // Show verification modal
        setVerificationEmail(email)
        setShowVerificationModal(true)
        setIsLoading(false)
      } else if (result.success) {
        // Direct login success (fallback)
        router.push("/")
      } else {
        setError(result.message || "Invalid email or password. Please try again.")
      }
    } catch (err) {
      setError("An error occurred during sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationSuccess = (user: any) => {
    setShowVerificationModal(false)
    setVerificationEmail("")
    router.push("/")
  }

  const handleResendCode = async () => {
    // The VerificationCodeModal handles the resend logic internally
    // This is just for any additional logic if needed
  }

  const handleCloseVerificationModal = () => {
    setShowVerificationModal(false)
    setVerificationEmail("")
    setIsLoading(false)
  }

  const handleDemoLogin = async () => {
    setIsDemoLoading(true)
    setError("")

    try {
      const success = await AuthService.demoLogin()

      if (success) {
        router.push("/")
      } else {
        setError("Demo login failed. Please try again.")
      }
    } catch (err) {
      setError("Demo login failed. Please try again.")
    } finally {
      setIsDemoLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const success = await AuthService.resetPassword(email)
      if (success) {
        setError("Password reset email sent! Check your inbox.")
      } else {
        setError("Failed to send password reset email. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "AI-powered insights to understand your spending patterns and optimize your budget",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your financial data is protected with enterprise-grade encryption and security",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Access your finances anywhere with our responsive design and mobile app",
    },
  ]

  return (
    <>
      <div className="min-h-screen flex bg-background">
        {/* Left Column - Project Information */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><g fill="#ffffff" fillOpacity="0.05"><circle cx="30" cy="30" r="2"/></g></g></svg>')}")`,
                backgroundRepeat: "repeat",
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <Banknote className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold"> XENZO AI Tracker</h1>
                <p className="text-blue-100 text-sm">Smart Financial Management</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold leading-tight mb-4">
                  Take Control of Your
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Financial Future
                  </span>
                </h2>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Australia's most intuitive expense tracker with AI-powered insights, smart budgeting, and
                  comprehensive financial analytics.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-4 w-4 text-yellow-300" />
                    <span className="text-2xl font-bold text-white">10K+</span>
                  </div>
                  <p className="text-blue-100 text-xs">Active Users</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BarChart3 className="h-4 w-4 text-green-300" />
                    <span className="text-2xl font-bold text-white">$2M+</span>
                  </div>
                  <p className="text-blue-100 text-xs">Tracked</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="h-4 w-4 text-orange-300" />
                    <span className="text-2xl font-bold text-white">95%</span>
                  </div>
                  <p className="text-blue-100 text-xs">Goal Success</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center justify-center gap-3 text-2xl font-bold mb-8">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                <Banknote className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                XENZO AI Tracker
              </span>
            </div>

            <Card className="premium-card border-0 shadow-2xl">
              <CardHeader className="space-y-2 text-center pb-6">
                <CardTitle className="text-2xl font-bold text-foreground">Welcome back</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Sign in to access your financial dashboard
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <Alert
                    variant={error.includes("sent") ? "default" : "destructive"}
                    className="border-0 bg-red-50/50 dark:bg-red-950/20"
                  >
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Demo Login Button */}
                <Button
                  onClick={handleDemoLogin}
                  disabled={isLoading || isDemoLoading}
                  className="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isDemoLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entering Demo...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Try Demo Dashboard
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading || isDemoLoading}
                      className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading || isDemoLoading}
                        className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading || isDemoLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      onClick={handleForgotPassword}
                      disabled={isLoading || isDemoLoading}
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isLoading || isDemoLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Sign in
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="pt-2">
                <div className="text-center text-sm text-muted-foreground w-full">
                  {"Don't have an account? "}
                  <Link
                    href="/signup"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </Card>

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground mt-8">
              <p>Secure • Encrypted • Australian Made</p>
            </div>
          </div>
        </div>
      </div>

      <VerificationCodeModal
        isOpen={showVerificationModal}
        onClose={handleCloseVerificationModal}
        email={verificationEmail}
        onVerificationSuccess={handleVerificationSuccess}
        onResendCode={handleResendCode}
      />
    </>
  )
}
