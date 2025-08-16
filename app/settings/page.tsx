"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown } from "lucide-react"
import {
  User,
  Settings,
  Shield,
  Database,
  CreditCard,
  Bell,
  Palette,
  Download,
  Upload,
  Eye,
  EyeOff,
  Camera,
  Save,
  Trash2,
  Key,
  Smartphone,
  Lock,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Kushal Neupane",
    email: "neupanekushal9@gmail.com",
    phone: "+61 423 456 789",
    bio: "Software Developer and financial enthusiast focused on smart spending and investment strategies.",
    avatar: "/placeholder-user.jpg",
    initials: "KN",
    occupation: "Software Developer",
    company: "Tech Solutions Pty Ltd",
    location: "Sydney, Australia",
    joinDate: "January 2024",
  })

  const [preferences, setPreferences] = useState({
    currency: "USD",
    language: "en",
    timezone: "Australia/Sydney",
    dateFormat: "MM/DD/YYYY",
    notifications: {
      email: true,
      push: true,
      sms: false,
      budgetAlerts: true,
      goalReminders: true,
      weeklyReports: true,
    },
  })

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    biometricEnabled: true,
    sessionTimeout: "30",
    dataEncryption: true,
  })

  const handleSave = async (section: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    toast({
      title: "Settings Updated",
      description: `Your ${section} settings have been saved successfully.`,
    })
  }

  const handleExportData = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "Data Export Complete",
      description: "Your financial data has been exported successfully.",
    })
  }

  return (
    <div className="min-h-screen p-6 space-y-8">
      <div className="glass-card border-white/10 p-8 rounded-3xl">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 rounded-2xl aussie-gradient flex items-center justify-center shadow-lg">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-display font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-muted-foreground text-lg">Customize your financial tracking experience</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="glass-card border-white/10 p-2 h-auto rounded-2xl mb-8">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white/10"
          >
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white/10"
          >
            <Palette className="w-4 h-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white/10"
          >
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="data"
            className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white/10"
          >
            <Database className="w-4 h-4" />
            Data
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white/10"
          >
            <CreditCard className="w-4 h-4" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl income-gradient flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal details and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white/20">
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600">
                      {profileData.initials}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-white/10 hover:bg-white/20 border border-white/20"
                    onClick={() => {
                      const input = document.createElement("input")
                      input.type = "file"
                      input.accept = "image/*"
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (e) => {
                            setProfileData({ ...profileData, avatar: e.target?.result as string })
                          }
                          reader.readAsDataURL(file)
                          toast({
                            title: "Profile Picture Updated",
                            description: "Your profile picture has been updated successfully.",
                          })
                        }
                      }
                      input.click()
                    }}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{profileData.name}</h3>
                  <p className="text-muted-foreground">{profileData.email}</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                      Verified Account
                    </Badge>
                    <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="bg-white/5 border-white/10 focus:border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="bg-white/5 border-white/10 focus:border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="bg-white/5 border-white/10 focus:border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation" className="text-sm font-medium">
                    Occupation
                  </Label>
                  <Input
                    id="occupation"
                    value={profileData.occupation}
                    onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                    className="bg-white/5 border-white/10 focus:border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    className="bg-white/5 border-white/10 focus:border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="bg-white/5 border-white/10 focus:border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-sm font-medium">
                    Timezone
                  </Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 focus:border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/10">
                      <SelectItem value="Australia/Sydney">Sydney Time</SelectItem>
                      <SelectItem value="Australia/Melbourne">Melbourne Time</SelectItem>
                      <SelectItem value="Australia/Brisbane">Brisbane Time</SelectItem>
                      <SelectItem value="Australia/Perth">Perth Time</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="bg-white/5 border-white/10 focus:border-white/20 min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <Button
                onClick={() => {
                  handleSave("profile")
                  console.log("[v0] Profile data updated:", profileData)
                }}
                disabled={isLoading}
                className="income-gradient hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Display Settings */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl balance-gradient flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  Display Settings
                </CardTitle>
                <CardDescription>Customize how information is displayed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="bg-white/5 border-white/10 focus:border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/10">
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Currency</Label>
                  <Select
                    value={preferences.currency}
                    onValueChange={(value) => setPreferences({ ...preferences, currency: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 focus:border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/10">
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date Format</Label>
                  <Select
                    value={preferences.dateFormat}
                    onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 focus:border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/10">
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 focus:border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/10">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl expense-gradient flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  Notifications
                </CardTitle>
                <CardDescription>Manage how you receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.email}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, email: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">Browser and mobile notifications</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.push}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, push: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">SMS Alerts</Label>
                    <p className="text-xs text-muted-foreground">Text message notifications</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.sms}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, sms: checked },
                      })
                    }
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Budget Alerts</Label>
                    <p className="text-xs text-muted-foreground">When you exceed budget limits</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.budgetAlerts}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, budgetAlerts: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Goal Reminders</Label>
                    <p className="text-xs text-muted-foreground">Progress updates on savings goals</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.goalReminders}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, goalReminders: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Weekly Reports</Label>
                    <p className="text-xs text-muted-foreground">Summary of your financial activity</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, weeklyReports: checked },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => handleSave("preferences")}
              disabled={isLoading}
              className="balance-gradient hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password & Authentication */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl savings-gradient flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  Password & Authentication
                </CardTitle>
                <CardDescription>Manage your login credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-sm font-medium">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      className="bg-white/5 border-white/10 focus:border-white/20 pr-10"
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-medium">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="bg-white/5 border-white/10 focus:border-white/20"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="bg-white/5 border-white/10 focus:border-white/20"
                    placeholder="Confirm new password"
                  />
                </div>

                <Button className="w-full savings-gradient hover:opacity-90 transition-opacity">
                  <Key className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl investment-gradient flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  Security Features
                </CardTitle>
                <CardDescription>Additional security measures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Two-Factor Authentication
                    </Label>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Biometric Login</Label>
                    <p className="text-xs text-muted-foreground">Use fingerprint or face recognition</p>
                  </div>
                  <Switch
                    checked={security.biometricEnabled}
                    onCheckedChange={(checked) => setSecurity({ ...security, biometricEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Data Encryption</Label>
                    <p className="text-xs text-muted-foreground">Encrypt sensitive financial data</p>
                  </div>
                  <Switch
                    checked={security.dataEncryption}
                    onCheckedChange={(checked) => setSecurity({ ...security, dataEncryption: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Session Timeout</Label>
                  <Select
                    value={security.sessionTimeout}
                    onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 focus:border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/10">
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => handleSave("security")}
              disabled={isLoading}
              className="investment-gradient hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Security Settings
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Export */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl aussie-gradient flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  Export Data
                </CardTitle>
                <CardDescription>Download your financial information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/5 border-white/10 hover:bg-white/10"
                    onClick={handleExportData}
                    disabled={isLoading}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All Transactions (CSV)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/5 border-white/10 hover:bg-white/10"
                    onClick={handleExportData}
                    disabled={isLoading}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Budget Data (JSON)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/5 border-white/10 hover:bg-white/10"
                    onClick={handleExportData}
                    disabled={isLoading}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Goals & Progress (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Import */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl income-gradient flex items-center justify-center">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  Import Data
                </CardTitle>
                <CardDescription>Upload financial data from other sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-2">Drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports CSV, JSON, and Excel files</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Supported formats:</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                      CSV
                    </Badge>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                      JSON
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                      Excel
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Storage Usage */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl balance-gradient flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                Storage Usage
              </CardTitle>
              <CardDescription>Monitor your data usage and storage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Transactions</span>
                  <span className="text-sm text-muted-foreground">2.4 MB</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    style={{ width: "24%" }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Attachments</span>
                  <span className="text-sm text-muted-foreground">1.8 MB</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full"
                    style={{ width: "18%" }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Reports</span>
                  <span className="text-sm text-muted-foreground">0.6 MB</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full"
                    style={{ width: "6%" }}
                  ></div>
                </div>

                <Separator className="bg-white/10" />

                <div className="flex justify-between items-center font-semibold">
                  <span>Total Usage</span>
                  <span>4.8 MB / 100 MB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subscription */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl expense-gradient flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  Subscription
                </CardTitle>
                <CardDescription>Manage your plan and billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">Pro Plan</h3>
                      <p className="text-sm text-muted-foreground">Advanced financial tracking</p>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      $9.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                    </span>
                    <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 bg-transparent">
                      Manage Plan
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Plan Features</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      Unlimited transactions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      Advanced analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      Priority support
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      Data export
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl savings-gradient flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Account Actions
                </CardTitle>
                <CardDescription>Manage your account status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <h4 className="font-medium text-yellow-300 mb-2">Account Deactivation</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Temporarily disable your account while preserving your data.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10 bg-transparent"
                    >
                      Deactivate Account
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <h4 className="font-medium text-red-300 mb-2">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-500/20 hover:bg-red-500/30 border-red-500/30"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="text-2xl font-bold text-blue-400">2.5K</div>
                  <div className="text-sm text-muted-foreground">Total Transactions</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="text-2xl font-bold text-green-400">18</div>
                  <div className="text-sm text-muted-foreground">Active Goals</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="text-2xl font-bold text-purple-400">247</div>
                  <div className="text-sm text-muted-foreground">Days Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
