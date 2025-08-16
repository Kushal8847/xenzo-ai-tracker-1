import type { User } from "./types"
import { sendLoginAlert, sendSignoutAlert, send2FAVerificationCode } from "./actions"

interface VerificationCode {
  code: string
  email: string
  expiresAt: number
  attempts: number
  maxAttempts: number
}

const DEMO_USER: User = {
  id: "demo-user-123",
  email: "demo@aussietracker.com",
  first_name: "Demo",
  last_name: "User",
  subscription_plan: "trial",
  currency: "AUD",
  timezone: "Australia/Sydney",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_login_at: new Date().toISOString(),
}

export class AuthService {
  private static currentUser: User | null = null
  private static authListeners: ((user: User | null) => void)[] = []
  private static readonly VERIFICATION_CODES_KEY = "verification_codes"
  private static readonly CODE_EXPIRY_MINUTES = 10
  private static readonly MAX_VERIFICATION_ATTEMPTS = 3

  static async signIn(email: string, password: string): Promise<User | null> {
    try {
      // For demo purposes, accept any email/password
      if (email && password) {
        this.currentUser = DEMO_USER
        this.notifyAuthListeners(this.currentUser)

        // Store user in localStorage
        const users = this.getStoredUsers()
        const existingUser = users.find((u) => u.email === email)
        if (!existingUser) {
          users.push(this.currentUser)
          this.setStoredUsers(users)
        }

        // Send login alert email in background
        sendLoginAlert(
          email,
          `${this.currentUser.first_name} ${this.currentUser.last_name}`,
          "regular",
          typeof window !== "undefined" ? window.navigator.userAgent : undefined,
        )
          .then((result) => {
            if (result.success) {
              console.log("✅ Login alert sent successfully")
            } else {
              console.log("⚠️ Login alert failed:", result.message)
            }
          })
          .catch((error) => {
            console.error("❌ Login alert error:", error)
          })

        return this.currentUser
      }
      return null
    } catch (error) {
      console.error("Sign in error:", error)
      return null
    }
  }

  static async signInWith2FA(
    email: string,
    password: string,
  ): Promise<{ success: boolean; requiresVerification?: boolean; message?: string }> {
    try {
      // First validate credentials
      if (!email || !password) {
        return { success: false, message: "Email and password are required" }
      }

      // For demo purposes, accept any email/password for credential validation
      // In production, this would validate against a real database

      // Generate and send verification code
      const verificationResult = await this.generateAndSendVerificationCode(email)

      if (!verificationResult.success) {
        return { success: false, message: verificationResult.message }
      }

      return {
        success: true,
        requiresVerification: true,
        message: "Verification code sent to your email",
      }
    } catch (error) {
      console.error("2FA sign in error:", error)
      return { success: false, message: "An error occurred during sign in" }
    }
  }

  static async verifyCodeAndSignIn(
    email: string,
    code: string,
  ): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const verificationResult = this.validateVerificationCode(email, code)

      if (!verificationResult.success) {
        return { success: false, message: verificationResult.message }
      }

      // Clear the verification code after successful validation
      this.clearVerificationCode(email)

      // Complete the sign in process
      const user = await this.completeSignIn(email)

      if (!user) {
        return { success: false, message: "Failed to complete sign in" }
      }

      return { success: true, user, message: "Successfully signed in" }
    } catch (error) {
      console.error("Code verification error:", error)
      return { success: false, message: "An error occurred during verification" }
    }
  }

  private static async completeSignIn(email: string): Promise<User | null> {
    try {
      // For demo purposes, use demo user
      // In production, this would fetch the actual user from database
      const user = { ...DEMO_USER, email }

      this.currentUser = user
      this.notifyAuthListeners(this.currentUser)

      // Store user in localStorage
      const users = this.getStoredUsers()
      const existingUserIndex = users.findIndex((u) => u.email === email)
      if (existingUserIndex >= 0) {
        users[existingUserIndex] = user
      } else {
        users.push(user)
      }
      this.setStoredUsers(users)

      // Send login alert email in background
      sendLoginAlert(
        email,
        `${user.first_name} ${user.last_name}`,
        "regular",
        typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      )
        .then((result) => {
          if (result.success) {
            console.log("✅ Login alert sent successfully")
          } else {
            console.log("⚠️ Login alert failed:", result.message)
          }
        })
        .catch((error) => {
          console.error("❌ Login alert error:", error)
        })

      return user
    } catch (error) {
      console.error("Complete sign in error:", error)
      return null
    }
  }

  static async signUp(email: string, password: string, firstName?: string, lastName?: string): Promise<User | null> {
    try {
      if (email && password) {
        const newUser: User = {
          ...DEMO_USER,
          id: `user-${Date.now()}`,
          email,
          first_name: firstName || "",
          last_name: lastName || "",
        }

        this.currentUser = newUser
        this.notifyAuthListeners(this.currentUser)

        // Store user in localStorage
        const users = this.getStoredUsers()
        users.push(newUser)
        this.setStoredUsers(users)

        // Send signup/login alert email in background
        sendLoginAlert(
          email,
          `${firstName || ""} ${lastName || ""}`.trim() || "New User",
          "signup",
          typeof window !== "undefined" ? window.navigator.userAgent : undefined,
        )
          .then((result) => {
            if (result.success) {
              console.log("✅ Signup alert sent successfully")
            } else {
              console.log("⚠️ Signup alert failed:", result.message)
            }
          })
          .catch((error) => {
            console.error("❌ Signup alert error:", error)
          })

        return this.currentUser
      }
      return null
    } catch (error) {
      console.error("Sign up error:", error)
      return null
    }
  }

  static async signOut(): Promise<boolean> {
    try {
      // Get current user info before signing out
      const currentUser = this.currentUser

      if (currentUser) {
        // Send signout alert email in background
        sendSignoutAlert(
          currentUser.email,
          `${currentUser.first_name} ${currentUser.last_name}`,
          typeof window !== "undefined" ? window.navigator.userAgent : undefined,
        )
          .then((result) => {
            if (result.success) {
              console.log("✅ Signout alert sent successfully")
            } else {
              console.log("⚠️ Signout alert failed:", result.message)
            }
          })
          .catch((error) => {
            console.error("❌ Signout alert error:", error)
          })
      }

      // Clear current user and notify listeners
      this.currentUser = null
      this.notifyAuthListeners(null)
      return true
    } catch (error) {
      console.error("Sign out error:", error)
      return false
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser
    }

    // Try to restore user from localStorage
    try {
      const storedUser = localStorage.getItem("current_user")
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser)
        return this.currentUser
      }
    } catch (error) {
      console.error("Error restoring user from localStorage:", error)
    }

    return null
  }

  static async demoLogin(): Promise<boolean> {
    try {
      this.currentUser = DEMO_USER
      this.notifyAuthListeners(this.currentUser)

      // Send demo login alert email in background
      sendLoginAlert(
        DEMO_USER.email,
        `${DEMO_USER.first_name} ${DEMO_USER.last_name}`,
        "demo",
        typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      )
        .then((result) => {
          if (result.success) {
            console.log("✅ Demo login alert sent successfully")
          } else {
            console.log("⚠️ Demo login alert failed:", result.message)
          }
        })
        .catch((error) => {
          console.error("❌ Demo login alert error:", error)
        })

      return true
    } catch (error) {
      console.error("Demo login error:", error)
      return false
    }
  }

  static async resetPassword(email: string): Promise<boolean> {
    try {
      // Simulate password reset email
      console.log(`Password reset email sent to ${email}`)
      return true
    } catch (error) {
      console.error("Password reset error:", error)
      return false
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void) {
    this.authListeners.push(callback)

    // Return subscription-like object for compatibility
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.authListeners.indexOf(callback)
            if (index > -1) {
              this.authListeners.splice(index, 1)
            }
          },
        },
      },
    }
  }

  private static notifyAuthListeners(user: User | null) {
    // Store current user in localStorage
    if (user) {
      localStorage.setItem("current_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("current_user")
    }

    this.authListeners.forEach((callback) => callback(user))
  }

  private static getStoredUsers(): User[] {
    try {
      const users = localStorage.getItem("all_users")
      return users ? JSON.parse(users) : []
    } catch {
      return []
    }
  }

  private static setStoredUsers(users: User[]) {
    try {
      localStorage.setItem("all_users", JSON.stringify(users))
    } catch (error) {
      console.error("Error storing users:", error)
    }
  }

  static generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  static async generateAndSendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Clean up expired codes first
      this.cleanupExpiredCodes()

      // Generate new verification code
      const code = this.generateVerificationCode()
      const expiresAt = Date.now() + this.CODE_EXPIRY_MINUTES * 60 * 1000

      // Store verification code
      const verificationCode: VerificationCode = {
        code,
        email,
        expiresAt,
        attempts: 0,
        maxAttempts: this.MAX_VERIFICATION_ATTEMPTS,
      }

      this.storeVerificationCode(verificationCode)

      // Send verification code via email
      const emailResult = await send2FAVerificationCode(
        email,
        "User", // In production, get actual user name
        code,
        typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      )

      if (!emailResult.success) {
        // Remove the stored code if email failed
        this.clearVerificationCode(email)
        return { success: false, message: emailResult.message || "Failed to send verification email" }
      }

      console.log(`✅ Verification code generated and sent to ${email}`)
      return { success: true, message: "Verification code sent successfully" }
    } catch (error) {
      console.error("Generate verification code error:", error)
      return { success: false, message: "Failed to generate verification code" }
    }
  }

  static validateVerificationCode(email: string, inputCode: string): { success: boolean; message: string } {
    try {
      const storedCodes = this.getStoredVerificationCodes()
      const verificationCode = storedCodes.find((vc) => vc.email === email)

      if (!verificationCode) {
        return { success: false, message: "No verification code found for this email" }
      }

      // Check if code has expired
      if (Date.now() > verificationCode.expiresAt) {
        this.clearVerificationCode(email)
        return { success: false, message: "Verification code has expired" }
      }

      // Check if max attempts exceeded
      if (verificationCode.attempts >= verificationCode.maxAttempts) {
        this.clearVerificationCode(email)
        return { success: false, message: "Maximum verification attempts exceeded" }
      }

      // Increment attempt counter
      verificationCode.attempts++
      this.updateVerificationCode(verificationCode)

      // Validate the code
      if (verificationCode.code !== inputCode.trim()) {
        const remainingAttempts = verificationCode.maxAttempts - verificationCode.attempts
        if (remainingAttempts > 0) {
          return {
            success: false,
            message: `Invalid verification code. ${remainingAttempts} attempt(s) remaining`,
          }
        } else {
          this.clearVerificationCode(email)
          return { success: false, message: "Invalid verification code. Maximum attempts exceeded" }
        }
      }

      console.log(`✅ Verification code validated successfully for ${email}`)
      return { success: true, message: "Verification code is valid" }
    } catch (error) {
      console.error("Validate verification code error:", error)
      return { success: false, message: "Error validating verification code" }
    }
  }

  private static storeVerificationCode(verificationCode: VerificationCode): void {
    try {
      const storedCodes = this.getStoredVerificationCodes()

      // Remove any existing code for this email
      const filteredCodes = storedCodes.filter((vc) => vc.email !== verificationCode.email)

      // Add the new code
      filteredCodes.push(verificationCode)

      localStorage.setItem(this.VERIFICATION_CODES_KEY, JSON.stringify(filteredCodes))
    } catch (error) {
      console.error("Error storing verification code:", error)
    }
  }

  private static getStoredVerificationCodes(): VerificationCode[] {
    try {
      const codes = localStorage.getItem(this.VERIFICATION_CODES_KEY)
      return codes ? JSON.parse(codes) : []
    } catch (error) {
      console.error("Error getting stored verification codes:", error)
      return []
    }
  }

  private static updateVerificationCode(updatedCode: VerificationCode): void {
    try {
      const storedCodes = this.getStoredVerificationCodes()
      const index = storedCodes.findIndex((vc) => vc.email === updatedCode.email)

      if (index >= 0) {
        storedCodes[index] = updatedCode
        localStorage.setItem(this.VERIFICATION_CODES_KEY, JSON.stringify(storedCodes))
      }
    } catch (error) {
      console.error("Error updating verification code:", error)
    }
  }

  private static clearVerificationCode(email: string): void {
    try {
      const storedCodes = this.getStoredVerificationCodes()
      const filteredCodes = storedCodes.filter((vc) => vc.email !== email)
      localStorage.setItem(this.VERIFICATION_CODES_KEY, JSON.stringify(filteredCodes))
    } catch (error) {
      console.error("Error clearing verification code:", error)
    }
  }

  private static cleanupExpiredCodes(): void {
    try {
      const storedCodes = this.getStoredVerificationCodes()
      const validCodes = storedCodes.filter((vc) => Date.now() <= vc.expiresAt)
      localStorage.setItem(this.VERIFICATION_CODES_KEY, JSON.stringify(validCodes))
    } catch (error) {
      console.error("Error cleaning up expired codes:", error)
    }
  }

  static hasVerificationCode(email: string): boolean {
    try {
      const storedCodes = this.getStoredVerificationCodes()
      const verificationCode = storedCodes.find((vc) => vc.email === email)

      if (!verificationCode) {
        return false
      }

      // Check if code has expired
      if (Date.now() > verificationCode.expiresAt) {
        this.clearVerificationCode(email)
        return false
      }

      return true
    } catch (error) {
      console.error("Error checking verification code:", error)
      return false
    }
  }

  static getVerificationCodeRemainingTime(email: string): number {
    try {
      const storedCodes = this.getStoredVerificationCodes()
      const verificationCode = storedCodes.find((vc) => vc.email === email)

      if (!verificationCode) {
        return 0
      }

      const remainingTime = verificationCode.expiresAt - Date.now()
      return Math.max(0, remainingTime)
    } catch (error) {
      console.error("Error getting verification code remaining time:", error)
      return 0
    }
  }
}
