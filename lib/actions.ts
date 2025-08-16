"use server"

import { formatCurrency } from "./utils"

export async function sendBudgetAlert(
  category: string,
  exceededAmount: number,
  spentAmount: number,
  budgetAmount: number,
) {
  try {
    console.log("🔄 Starting budget alert process...")

    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.log("⚠️ RESEND_API_KEY not found, running in development mode")

      // Development mode - log to console
      const emailContent = {
        to: "neupanekushal9@gmail.com",
        subject: `🚨 Budget Alert: ${category} Over Budget`,
        category,
        exceededAmount: formatCurrency(exceededAmount),
        spentAmount: formatCurrency(spentAmount),
        budgetAmount: formatCurrency(budgetAmount),
        timestamp: new Date().toISOString(),
      }

      console.log("📧 Budget Alert Email Content (Development Mode):")
      console.log("=".repeat(50))
      console.log(`To: ${emailContent.to}`)
      console.log(`Subject: ${emailContent.subject}`)
      console.log(`Category: ${emailContent.category}`)
      console.log(`Budget: ${emailContent.budgetAmount}`)
      console.log(`Spent: ${emailContent.spentAmount}`)
      console.log(`Exceeded by: ${emailContent.exceededAmount}`)
      console.log(`Time: ${emailContent.timestamp}`)
      console.log("=".repeat(50))

      return {
        success: true,
        mode: "development",
        message: "Email logged to console (development mode)",
      }
    }

    // Production mode - send via Resend
    console.log("📧 Sending email via Resend...")

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Budget Alert</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🚨 Budget Alert</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your ${category} budget has been exceeded</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #dc3545; margin-top: 0; font-size: 22px;">Budget Overview</h2>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #dee2e6;">
              <span style="font-weight: bold;">Category:</span>
              <span>${category}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #dee2e6;">
              <span style="font-weight: bold;">Budget Limit:</span>
              <span>${formatCurrency(budgetAmount)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #dee2e6;">
              <span style="font-weight: bold;">Amount Spent:</span>
              <span style="color: #dc3545; font-weight: bold;">${formatCurrency(spentAmount)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0;">
              <span style="font-weight: bold;">Exceeded By:</span>
              <span style="color: #dc3545; font-weight: bold; font-size: 18px;">${formatCurrency(exceededAmount)}</span>
            </div>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #856404; margin-top: 0;">💡 Recommendations</h3>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
              <li>Review your recent ${category.toLowerCase()} expenses</li>
              <li>Consider adjusting your budget for next month</li>
              <li>Look for ways to reduce spending in this category</li>
              <li>Set up spending alerts to prevent future overages</li>
            </ul>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <p style="margin: 0; color: #6c757d; font-size: 14px;">
              This alert was sent automatically from your Expense Tracker.<br>
              Time: ${new Date().toLocaleString()}
            </p>
          </div>
        </body>
      </html>
    `

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "alerts@resend.dev",
        to: ["neupanekushal9@gmail.com"],
        subject: `🚨 Budget Alert: ${category} Over Budget`,
        html: emailHtml,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Resend API Error:", response.status, errorText)
      throw new Error(`Resend API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log("✅ Email sent successfully via Resend:", result)

    return {
      success: true,
      mode: "production",
      emailId: result.id,
      message: "Email sent successfully",
    }
  } catch (error) {
    console.error("❌ Error in sendBudgetAlert action:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function sendLoginAlert(
  userEmail: string,
  userName: string,
  loginType: "demo" | "regular" | "signup",
  userAgent?: string,
) {
  try {
    console.log("🔄 Starting login alert process...")

    const apiKey = process.env.RESEND_API_KEY
    const loginTime = new Date()
    const location = "Sydney, Australia" // Default location

    // Get browser info from user agent
    const getBrowserInfo = (ua = "") => {
      if (ua.includes("Chrome")) return "Chrome"
      if (ua.includes("Firefox")) return "Firefox"
      if (ua.includes("Safari")) return "Safari"
      if (ua.includes("Edge")) return "Edge"
      return "Unknown Browser"
    }

    const getDeviceInfo = (ua = "") => {
      if (ua.includes("Mobile")) return "Mobile Device"
      if (ua.includes("Tablet")) return "Tablet"
      return "Desktop"
    }

    const browser = getBrowserInfo(userAgent)
    const device = getDeviceInfo(userAgent)

    const loginTypeText = {
      demo: "Demo Login",
      regular: "Account Login",
      signup: "New Account Registration",
    }

    if (!apiKey) {
      console.log("⚠️ RESEND_API_KEY not found, running in development mode")

      // Development mode - log to console
      const emailContent = {
        to: "neupanekushal9@gmail.com",
        subject: `🔐 Login Alert: ${loginTypeText[loginType]} Detected`,
        userEmail,
        userName,
        loginType: loginTypeText[loginType],
        location,
        browser,
        device,
        timestamp: loginTime.toISOString(),
      }

      console.log("📧 Login Alert Email Content (Development Mode):")
      console.log("=".repeat(50))
      console.log(`To: ${emailContent.to}`)
      console.log(`Subject: ${emailContent.subject}`)
      console.log(`User: ${emailContent.userName} (${emailContent.userEmail})`)
      console.log(`Login Type: ${emailContent.loginType}`)
      console.log(`Location: ${emailContent.location}`)
      console.log(`Browser: ${emailContent.browser}`)
      console.log(`Device: ${emailContent.device}`)
      console.log(`Time: ${emailContent.timestamp}`)
      console.log("=".repeat(50))

      return {
        success: true,
        mode: "development",
        message: "Login alert logged to console (development mode)",
      }
    }

    // Production mode - send via Resend
    console.log("📧 Sending login alert email via Resend...")

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login Alert</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Login Alert</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">${loginTypeText[loginType]} detected on your account</p>
          </div>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #0c4a6e; margin-top: 0; font-size: 22px;">Login Details</h2>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #bae6fd;">
              <span style="font-weight: bold;">User:</span>
              <span>${userName}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #bae6fd;">
              <span style="font-weight: bold;">Email:</span>
              <span>${userEmail}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #bae6fd;">
              <span style="font-weight: bold;">Login Type:</span>
              <span style="color: #0ea5e9; font-weight: bold;">${loginTypeText[loginType]}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #bae6fd;">
              <span style="font-weight: bold;">Location:</span>
              <span>${location}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #bae6fd;">
              <span style="font-weight: bold;">Browser:</span>
              <span>${browser}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #bae6fd;">
              <span style="font-weight: bold;">Device:</span>
              <span>${device}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0;">
              <span style="font-weight: bold;">Time:</span>
              <span style="font-weight: bold;">${loginTime.toLocaleString("en-AU", {
                timeZone: "Australia/Sydney",
                dateStyle: "full",
                timeStyle: "medium",
              })}</span>
            </div>
          </div>
          
          <div style="background: ${loginType === "signup" ? "#f0fdf4" : "#fefce8"}; border: 1px solid ${loginType === "signup" ? "#bbf7d0" : "#fde047"}; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: ${loginType === "signup" ? "#166534" : "#a16207"}; margin-top: 0;">
              ${loginType === "signup" ? "🎉 Welcome!" : "🔒 Security Notice"}
            </h3>
            <p style="color: ${loginType === "signup" ? "#166534" : "#a16207"}; margin: 0;">
              ${
                loginType === "signup"
                  ? "Welcome to Xenzo AI Expense Tracker! Your account has been successfully created and you've logged in for the first time."
                  : loginType === "demo"
                    ? "A demo login was initiated on your Xenzo AI Expense Tracker account. If this wasn't you, please secure your account immediately."
                    : "A login was detected on your Xenzo AI Expense Tracker account. If this wasn't you, please change your password immediately."
              }
            </p>
          </div>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #475569; margin-top: 0;">🛡️ Security Tips</h3>
            <ul style="color: #475569; margin: 0; padding-left: 20px;">
              <li>Always log out when using shared computers</li>
              <li>Use strong, unique passwords for your account</li>
              <li>Enable two-factor authentication if available</li>
              <li>Report any suspicious activity immediately</li>
            </ul>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <p style="margin: 0; color: #6c757d; font-size: 14px;">
              This security alert was sent automatically from Xenzo AI Expense Tracker.<br>
              If you didn't perform this action, please contact support immediately.
            </p>
            <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
              IP Location: ${location} • Time: ${loginTime.toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}
            </p>
          </div>
        </body>
      </html>
    `

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "security@resend.dev",
        to: ["neupanekushal9@gmail.com"],
        subject: `🔐 Login Alert: ${loginTypeText[loginType]} Detected - Xenzo AI Tracker`,
        html: emailHtml,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Resend API Error:", response.status, errorText)
      throw new Error(`Resend API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log("✅ Login alert email sent successfully via Resend:", result)

    return {
      success: true,
      mode: "production",
      emailId: result.id,
      message: "Login alert email sent successfully",
    }
  } catch (error) {
    console.error("❌ Error in sendLoginAlert action:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function sendSignoutAlert(userEmail: string, userName: string, userAgent?: string) {
  try {
    console.log("🔄 Starting signout alert process...")

    const apiKey = process.env.RESEND_API_KEY
    const signoutTime = new Date()
    const location = "Sydney, Australia" // Default location

    // Get browser info from user agent
    const getBrowserInfo = (ua = "") => {
      if (ua.includes("Chrome")) return "Chrome"
      if (ua.includes("Firefox")) return "Firefox"
      if (ua.includes("Safari")) return "Safari"
      if (ua.includes("Edge")) return "Edge"
      return "Unknown Browser"
    }

    const getDeviceInfo = (ua = "") => {
      if (ua.includes("Mobile")) return "Mobile Device"
      if (ua.includes("Tablet")) return "Tablet"
      return "Desktop"
    }

    const browser = getBrowserInfo(userAgent)
    const device = getDeviceInfo(userAgent)

    if (!apiKey) {
      console.log("⚠️ RESEND_API_KEY not found, running in development mode")

      // Development mode - log to console
      const emailContent = {
        to: "neupanekushal9@gmail.com",
        subject: "🚪 Signout Alert: Account Logged Out Successfully",
        userEmail,
        userName,
        location,
        browser,
        device,
        timestamp: signoutTime.toISOString(),
      }

      console.log("📧 Signout Alert Email Content (Development Mode):")
      console.log("=".repeat(50))
      console.log(`To: ${emailContent.to}`)
      console.log(`Subject: ${emailContent.subject}`)
      console.log(`User: ${emailContent.userName} (${emailContent.userEmail})`)
      console.log(`Location: ${emailContent.location}`)
      console.log(`Browser: ${emailContent.browser}`)
      console.log(`Device: ${emailContent.device}`)
      console.log(`Time: ${emailContent.timestamp}`)
      console.log("=".repeat(50))

      return {
        success: true,
        mode: "development",
        message: "Signout alert logged to console (development mode)",
      }
    }

    // Production mode - send via Resend
    console.log("📧 Sending signout alert email via Resend...")

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Signout Alert</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🚪 Signout Alert</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">You have successfully signed out of your account</p>
          </div>
          
          <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #166534; margin-top: 0; font-size: 22px;">Signout Details</h2>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #bbf7d0;">
              <span style="font-weight: bold;">User:</span>
              <span>${userName}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #bbf7d0;">
              <span style="font-weight: bold;">Email:</span>
              <span>${userEmail}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #bbf7d0;">
              <span style="font-weight: bold;">Action:</span>
              <span style="color: #10b981; font-weight: bold;">Account Logout</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #bbf7d0;">
              <span style="font-weight: bold;">Location:</span>
              <span>${location}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #bbf7d0;">
              <span style="font-weight: bold;">Browser:</span>
              <span>${browser}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #bbf7d0;">
              <span style="font-weight: bold;">Device:</span>
              <span>${device}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0;">
              <span style="font-weight: bold;">Time:</span>
              <span style="font-weight: bold;">${signoutTime.toLocaleString("en-AU", {
                timeZone: "Australia/Sydney",
                dateStyle: "full",
                timeStyle: "medium",
              })}</span>
            </div>
          </div>
          
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #166534; margin-top: 0;">✅ Session Ended Successfully</h3>
            <p style="color: #166534; margin: 0;">
              Your session has been securely terminated. All active sessions for your account have been logged out. 
              If you didn't perform this action, please contact support immediately and consider changing your password.
            </p>
          </div>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #475569; margin-top: 0;">🔒 Security Reminders</h3>
            <ul style="color: #475569; margin: 0; padding-left: 20px;">
              <li>Always sign out when using shared or public computers</li>
              <li>Clear your browser cache and cookies after using public devices</li>
              <li>Use strong, unique passwords for your account</li>
              <li>Enable two-factor authentication for enhanced security</li>
              <li>Report any suspicious activity immediately</li>
            </ul>
          </div>
          
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #1e40af; margin-top: 0;">🔄 Next Steps</h3>
            <p style="color: #1e40af; margin: 0;">
              To access your Xenzo AI Expense Tracker account again, simply visit our login page and enter your credentials. 
              Your data is safely stored and will be available when you return.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <p style="margin: 0; color: #6c757d; font-size: 14px;">
              This security notification was sent automatically from Xenzo AI Expense Tracker.<br>
              Thank you for using our secure logout feature.
            </p>
            <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
              IP Location: ${location} • Time: ${signoutTime.toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}
            </p>
          </div>
        </body>
      </html>
    `

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "security@resend.dev",
        to: ["neupanekushal9@gmail.com"],
        subject: "🚪 Signout Alert: Account Logged Out Successfully - Xenzo AI Tracker",
        html: emailHtml,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Resend API Error:", response.status, errorText)
      throw new Error(`Resend API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log("✅ Signout alert email sent successfully via Resend:", result)

    return {
      success: true,
      mode: "production",
      emailId: result.id,
      message: "Signout alert email sent successfully",
    }
  } catch (error) {
    console.error("❌ Error in sendSignoutAlert action:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function send2FAVerificationCode(
  userEmail: string,
  userName: string,
  verificationCode: string,
  userAgent?: string,
) {
  try {
    console.log("🔄 Starting 2FA verification email process...")

    const apiKey = process.env.RESEND_API_KEY
    const sendTime = new Date()
    const location = "Sydney, Australia" // Default location

    // Get browser info from user agent
    const getBrowserInfo = (ua = "") => {
      if (ua.includes("Chrome")) return "Chrome"
      if (ua.includes("Firefox")) return "Firefox"
      if (ua.includes("Safari")) return "Safari"
      if (ua.includes("Edge")) return "Edge"
      return "Unknown Browser"
    }

    const getDeviceInfo = (ua = "") => {
      if (ua.includes("Mobile")) return "Mobile Device"
      if (ua.includes("Tablet")) return "Tablet"
      return "Desktop"
    }

    const browser = getBrowserInfo(userAgent)
    const device = getDeviceInfo(userAgent)

    if (!apiKey) {
      console.log("⚠️ RESEND_API_KEY not found, running in development mode")

      // Development mode - log to console
      const emailContent = {
        to: userEmail,
        subject: "🔐 Your 2FA Verification Code - Xenzo AI Tracker",
        userEmail,
        userName,
        verificationCode,
        location,
        browser,
        device,
        timestamp: sendTime.toISOString(),
      }

      console.log("📧 2FA Verification Email Content (Development Mode):")
      console.log("=".repeat(50))
      console.log(`To: ${emailContent.to}`)
      console.log(`Subject: ${emailContent.subject}`)
      console.log(`User: ${emailContent.userName} (${emailContent.userEmail})`)
      console.log(`Verification Code: ${emailContent.verificationCode}`)
      console.log(`Location: ${emailContent.location}`)
      console.log(`Browser: ${emailContent.browser}`)
      console.log(`Device: ${emailContent.device}`)
      console.log(`Time: ${emailContent.timestamp}`)
      console.log("=".repeat(50))

      return {
        success: true,
        mode: "development",
        message: "2FA verification email logged to console (development mode)",
        verificationCode,
      }
    }

    // Production mode - send via Resend
    console.log("📧 Sending 2FA verification email via Resend...")

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>2FA Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 2FA Verification</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your verification code for secure login</p>
          </div>
          
          <div style="background: #f8fafc; border: 2px solid #6366f1; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h2 style="color: #374151; margin-top: 0; font-size: 18px;">Your Verification Code</h2>
            <div style="background: #6366f1; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: 'Courier New', monospace;">
              ${verificationCode}
            </div>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">This code will expire in 10 minutes</p>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #92400e; margin-top: 0;">⚠️ Security Notice</h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li>Never share this code with anyone</li>
              <li>Xenzo AI will never ask for this code via phone or email</li>
              <li>If you didn't request this code, please secure your account immediately</li>
              <li>This code expires in 10 minutes for your security</li>
            </ul>
          </div>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #0c4a6e; margin-top: 0; font-size: 18px;">Login Attempt Details</h2>
            <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #bae6fd;">
              <span style="font-weight: bold;">User:</span>
              <span>${userName}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #bae6fd;">
              <span style="font-weight: bold;">Email:</span>
              <span>${userEmail}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #bae6fd;">
              <span style="font-weight: bold;">Location:</span>
              <span>${location}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #bae6fd;">
              <span style="font-weight: bold;">Browser:</span>
              <span>${browser}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #bae6fd;">
              <span style="font-weight: bold;">Device:</span>
              <span>${device}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0;">
              <span style="font-weight: bold;">Time:</span>
              <span style="font-weight: bold;">${sendTime.toLocaleString("en-AU", {
                timeZone: "Australia/Sydney",
                dateStyle: "full",
                timeStyle: "medium",
              })}</span>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <p style="margin: 0; color: #6c757d; font-size: 14px;">
              This verification code was sent automatically from Xenzo AI Expense Tracker.<br>
              If you didn't request this code, please contact support immediately.
            </p>
            <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
              Code expires: ${new Date(sendTime.getTime() + 10 * 60 * 1000).toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}
            </p>
          </div>
        </body>
      </html>
    `

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "security@resend.dev",
        to: [userEmail],
        subject: "🔐 Your 2FA Verification Code - Xenzo AI Tracker",
        html: emailHtml,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Resend API Error:", response.status, errorText)
      throw new Error(`Resend API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log("✅ 2FA verification email sent successfully via Resend:", result)

    return {
      success: true,
      mode: "production",
      emailId: result.id,
      message: "2FA verification email sent successfully",
      verificationCode,
    }
  } catch (error) {
    console.error("❌ Error in send2FAVerificationCode action:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
