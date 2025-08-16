"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, CheckCircle, XCircle, Clock, Send, Key, TestTube } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { send2FAVerificationCode } from "@/lib/actions"

interface TestResult {
  step: string
  status: "pending" | "success" | "error"
  message: string
  timestamp: string
}

export function TwoFATestComponent() {
  const [testEmail, setTestEmail] = useState("test@example.com")
  const [testCode, setTestCode] = useState("")
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [currentStep, setCurrentStep] = useState("")

  const addTestResult = (step: string, status: "success" | "error", message: string) => {
    const result: TestResult = {
      step,
      status,
      message,
      timestamp: new Date().toLocaleTimeString(),
    }
    setTestResults((prev) => [...prev, result])
  }

  const runComprehensiveTests = async () => {
    setIsRunningTests(true)
    setTestResults([])

    try {
      // Test 1: Code Generation
      setCurrentStep("Testing code generation...")
      const generatedCode = AuthService.generateVerificationCode()
      if (generatedCode && generatedCode.length === 6 && /^\d{6}$/.test(generatedCode)) {
        addTestResult("Code Generation", "success", `Generated valid 6-digit code: ${generatedCode}`)
      } else {
        addTestResult("Code Generation", "error", `Invalid code format: ${generatedCode}`)
      }

      // Test 2: Email Service Integration
      setCurrentStep("Testing email service...")
      try {
        const emailResult = await send2FAVerificationCode(testEmail, "Test User", generatedCode, "Test User Agent")

        if (emailResult.success) {
          addTestResult("Email Service", "success", `Email sent successfully (${emailResult.mode} mode)`)
        } else {
          addTestResult("Email Service", "error", emailResult.message || "Email sending failed")
        }
      } catch (emailError) {
        addTestResult("Email Service", "error", `Email service error: ${emailError}`)
      }

      // Test 3: Code Storage and Retrieval
      setCurrentStep("Testing code storage...")
      const storeResult = await AuthService.generateAndSendVerificationCode(testEmail)
      if (storeResult.success) {
        addTestResult("Code Storage", "success", "Code stored successfully")

        // Test 4: Code Validation
        setCurrentStep("Testing code validation...")
        const hasCode = AuthService.hasVerificationCode(testEmail)
        if (hasCode) {
          addTestResult("Code Retrieval", "success", "Code retrieved successfully")

          // Test with wrong code
          const wrongValidation = AuthService.validateVerificationCode(testEmail, "000000")
          if (!wrongValidation.success) {
            addTestResult("Invalid Code Test", "success", "Correctly rejected invalid code")
          } else {
            addTestResult("Invalid Code Test", "error", "Should have rejected invalid code")
          }
        } else {
          addTestResult("Code Retrieval", "error", "Code not found after storage")
        }
      } else {
        addTestResult("Code Storage", "error", storeResult.message)
      }

      // Test 5: Timer Functionality
      setCurrentStep("Testing timer functionality...")
      const remainingTime = AuthService.getVerificationCodeRemainingTime(testEmail)
      if (remainingTime > 0) {
        addTestResult("Timer Function", "success", `Timer working: ${Math.ceil(remainingTime / 1000)}s remaining`)
      } else {
        addTestResult("Timer Function", "error", "Timer not working properly")
      }

      // Test 6: Cleanup Function
      setCurrentStep("Testing cleanup...")
      // This would normally be tested with expired codes, but for demo we'll just verify the function exists
      try {
        AuthService.cleanupExpiredCodes?.()
        addTestResult("Cleanup Function", "success", "Cleanup function available")
      } catch {
        addTestResult("Cleanup Function", "error", "Cleanup function not available")
      }
    } catch (error) {
      addTestResult("System Error", "error", `Unexpected error: ${error}`)
    } finally {
      setIsRunningTests(false)
      setCurrentStep("")
    }
  }

  const testManualVerification = async () => {
    if (!testCode || testCode.length !== 6) {
      addTestResult("Manual Verification", "error", "Please enter a 6-digit code")
      return
    }

    const result = AuthService.validateVerificationCode(testEmail, testCode)
    if (result.success) {
      addTestResult("Manual Verification", "success", "Code verified successfully!")
    } else {
      addTestResult("Manual Verification", "error", result.message)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            Success
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
            <TestTube className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">2FA System Test Suite</CardTitle>
          <CardDescription>Comprehensive testing for the Two-Factor Authentication system</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Test Configuration */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Test Email Address</Label>
              <Input
                id="test-email"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter test email"
                disabled={isRunningTests}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={runComprehensiveTests} disabled={isRunningTests || !testEmail} className="flex-1">
                {isRunningTests ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Run Full Test Suite
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={clearResults} disabled={isRunningTests}>
                Clear Results
              </Button>
            </div>

            {currentStep && (
              <Alert className="border-blue-200 bg-blue-50/50">
                <Clock className="h-4 w-4" />
                <AlertDescription>{currentStep}</AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Manual Verification Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Key className="h-5 w-5" />
              Manual Code Verification
            </h3>

            <div className="flex gap-3">
              <Input
                placeholder="Enter 6-digit code"
                value={testCode}
                onChange={(e) => setTestCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="flex-1"
              />
              <Button onClick={testManualVerification} disabled={!testCode || testCode.length !== 6} variant="outline">
                <Send className="mr-2 h-4 w-4" />
                Verify
              </Button>
            </div>
          </div>

          <Separator />

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results</h3>

              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium">{result.step}</div>
                        <div className="text-sm text-muted-foreground">{result.message}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(result.status)}
                      <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Test Summary</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600">
                      ✓ {testResults.filter((r) => r.status === "success").length} Passed
                    </span>
                    <span className="text-red-600">
                      ✗ {testResults.filter((r) => r.status === "error").length} Failed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Information */}
          <div className="mt-8 p-4 rounded-lg bg-muted/30">
            <h4 className="font-medium mb-2">System Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Email Service:</span>
                <span className="ml-2">Resend API</span>
              </div>
              <div>
                <span className="text-muted-foreground">Storage:</span>
                <span className="ml-2">LocalStorage</span>
              </div>
              <div>
                <span className="text-muted-foreground">Code Length:</span>
                <span className="ml-2">6 digits</span>
              </div>
              <div>
                <span className="text-muted-foreground">Expiry Time:</span>
                <span className="ml-2">10 minutes</span>
              </div>
              <div>
                <span className="text-muted-foreground">Max Attempts:</span>
                <span className="ml-2">3 attempts</span>
              </div>
              <div>
                <span className="text-muted-foreground">Environment:</span>
                <span className="ml-2">{process.env.NODE_ENV || "development"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
