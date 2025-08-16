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
import { Checkbox } from "@/components/ui/checkbox"
import { Banknote, Eye, EyeOff, Loader2, Check, Zap, Star } from "lucide-react"
import { AuthService } from "@/lib/auth"

export default function SignupPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions.")
      setIsLoading(false)
      return
    }

    try {
      const user = await AuthService.signUp(email, password, firstName, lastName)

      if (user) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        setError("Failed to create account. Please try again.")
      }
    } catch (err) {
      setError("An error occurred during sign up. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoSignup = async () => {
    setIsDemoLoading(true)
    setError("")

    try {
      const success = await AuthService.demoLogin()

      if (success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/")
        }, 1500)
      } else {
        setError("Demo signup failed. Please try manual signup.")
      }
    } catch (err) {
      setError("Demo signup failed. Please try manual signup.")
    } finally {
      setIsDemoLoading(false)
    }
  }

  const benefits = [
    "AI-powered spending insights and recommendations",
    "Automatic transaction categorization and tagging",
    "Real-time budget tracking and alerts",
    "Comprehensive financial reports and analytics",
    "Multi-account and multi-currency support",
    "Bank-level security and data encryption",
    "Mobile app with offline sync capabilities",
    "24/7 customer support and assistance",
  ]

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex items-center justify-center">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/20">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Aussie Tracker!</h1>
            <p className="text-muted-foreground">
              Your account has been created successfully. Redirecting to your dashboard...
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Column - Project Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-blue-700 to-purple-700 relative overflow-hidden">
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
              <h1 className="text-3xl font-bold">Aussie Tracker</h1>
              <p className="text-green-100 text-sm">Smart Financial Management</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold leading-tight mb-4">
                Start Your Journey to
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Financial Freedom
                </span>
              </h2>
              <p className="text-xl text-green-100 leading-relaxed">
                Join thousands of Australians who have transformed their financial lives with our comprehensive expense
                tracking and budgeting platform.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">What you'll get:</h3>
              <div className="grid grid-cols-1 gap-3">
                {benefits.slice(0, 4).map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-green-400/20 flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-300" />
                    </div>
                    <p className="text-green-100 text-sm leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-300 fill-current" />
                ))}
              </div>
              <p className="text-white text-sm leading-relaxed mb-3">
                "Aussie Tracker completely changed how I manage my money. I've saved over $3,000 in just 6 months!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-300 to-orange-300" />
                <div>
                  <p className="text-white text-sm font-medium">Sarah Chen</p>
                  <p className="text-green-100 text-xs">Melbourne, VIC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Signup Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 text-2xl font-bold mb-8">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
              <Banknote className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Aussie Tracker
            </span>
          </div>

          <Card className="premium-card border-0 shadow-2xl">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl font-bold text-foreground">Create your account</CardTitle>
              <CardDescription className="text-muted-foreground">
                Start tracking your expenses and building wealth today
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-0 bg-red-50/50 dark:bg-red-950/20">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Demo Signup Button */}
              <Button
                onClick={handleDemoSignup}
                disabled={isLoading || isDemoLoading}
                className="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isDemoLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Demo Account...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Quick Demo Signup
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or create full account</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={isLoading || isDemoLoading}
                      className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Smith"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      disabled={isLoading || isDemoLoading}
                      className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
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
                      placeholder="Create a strong password"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading || isDemoLoading}
                      className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading || isDemoLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={setAcceptTerms}
                    disabled={isLoading || isDemoLoading}
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading || isDemoLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="pt-2">
              <div className="text-center text-sm text-muted-foreground w-full">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
                >
                  Sign in
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
  )
}
