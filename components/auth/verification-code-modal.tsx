"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Shield, Mail, Clock, RefreshCw } from "lucide-react"
import { AuthService } from "@/lib/auth"

interface VerificationCodeModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  onVerificationSuccess: (user: any) => void
  onResendCode?: () => void
}

export function VerificationCodeModal({
  isOpen,
  onClose,
  email,
  onVerificationSuccess,
  onResendCode,
}: VerificationCodeModalProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize timer when modal opens
  useEffect(() => {
    if (isOpen && email) {
      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    }
  }, [isOpen, email])

  const updateTimer = () => {
    const remaining = AuthService.getVerificationCodeRemainingTime(email)
    setTimeRemaining(Math.ceil(remaining / 1000))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits are entered
    if (newCode.every((digit) => digit !== "") && !isVerifying) {
      handleVerifyCode(newCode.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)

    if (pastedData.length === 6) {
      const newCode = pastedData.split("")
      setCode(newCode)
      setError("")

      // Focus last input
      inputRefs.current[5]?.focus()

      // Auto-submit
      if (!isVerifying) {
        handleVerifyCode(pastedData)
      }
    }
  }

  const handleVerifyCode = async (codeToVerify: string) => {
    setIsVerifying(true)
    setError("")

    try {
      const result = await AuthService.verifyCodeAndSignIn(email, codeToVerify)

      if (result.success && result.user) {
        onVerificationSuccess(result.user)
        onClose()
      } else {
        setError(result.message || "Invalid verification code")
        // Clear the code on error
        setCode(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    } catch (err) {
      setError("An error occurred during verification. Please try again.")
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setError("")

    try {
      const result = await AuthService.generateAndSendVerificationCode(email)

      if (result.success) {
        setCode(["", "", "", "", "", ""])
        updateTimer()
        inputRefs.current[0]?.focus()
        // Show success message briefly
        setError("New verification code sent to your email")
        setTimeout(() => setError(""), 3000)
      } else {
        setError(result.message || "Failed to resend code")
      }
    } catch (err) {
      setError("Failed to resend verification code. Please try again.")
    } finally {
      setIsResending(false)
    }

    if (onResendCode) {
      onResendCode()
    }
  }

  const canResend = timeRemaining <= 0 && !isResending && !isVerifying

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <DialogTitle className="text-2xl font-bold">Verify Your Identity</DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="text-center pb-4">
            <CardDescription className="text-base">
              We've sent a 6-digit verification code to
              <br />
              <span className="font-semibold text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert
                variant={error.includes("sent") ? "default" : "destructive"}
                className="border-0 bg-red-50/50 dark:bg-red-950/20"
              >
                <AlertDescription className="text-sm text-center">{error}</AlertDescription>
              </Alert>
            )}

            {/* Verification Code Inputs */}
            <div className="space-y-4">
              <div className="flex justify-center gap-3">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={isVerifying || isResending}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-muted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    autoComplete="off"
                  />
                ))}
              </div>

              {/* Timer and Resend */}
              <div className="text-center space-y-3">
                {timeRemaining > 0 ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Code expires in {formatTime(timeRemaining)}</span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Verification code has expired</div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendCode}
                  disabled={!canResend}
                  className="h-9 px-4 border-0 bg-muted/50 hover:bg-muted transition-colors"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Code
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Manual Verify Button (backup) */}
            <Button
              onClick={() => handleVerifyCode(code.join(""))}
              disabled={code.some((digit) => digit === "") || isVerifying || isResending}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Verify Code
                </>
              )}
            </Button>

            {/* Help Text */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>Check your email inbox and spam folder</span>
              </div>
              <p className="text-xs text-muted-foreground">Having trouble? Contact support for assistance</p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
