"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  Shield,
  Crown,
  Edit3,
  Camera,
  Save,
  X,
  Verified,
  Star,
  Award,
  TrendingUp,
  Target,
} from "lucide-react"

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Kushal Neupane",
    email: "neupanekushal9@gmail.com",
    phone: "+61 423 456 789",
    location: "Sydney, Australia",
    joinDate: "January 2024",
    bio: "Financial enthusiast focused on smart spending and investment strategies.",
    occupation: "Software Developer",
    company: "Tech Solutions Pty Ltd",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/95 border-white/10">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            User Profile
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <Card className="premium-card">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-32 h-32 border-4 border-white/20 shadow-2xl">
                    <AvatarImage src="/images/kushal-profile.png" alt="Kushal Neupane" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
                      KN
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Camera className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-2 mb-4">
                  <h3 className="text-xl font-bold">{profileData.name}</h3>
                  <p className="text-muted-foreground">{profileData.email}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Verified className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                    <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-white/10 my-4" />

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">$12,450</div>
                    <div className="text-xs text-muted-foreground">Total Saved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">89%</div>
                    <div className="text-xs text-muted-foreground">Budget Success</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">156</div>
                    <div className="text-xs text-muted-foreground">Transactions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">4.8</div>
                    <div className="text-xs text-muted-foreground">AI Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="premium-card mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Budget Master</div>
                    <div className="text-xs text-muted-foreground">Stayed under budget for 3 months</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Savings Streak</div>
                    <div className="text-xs text-muted-foreground">Saved money for 45 days straight</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">AI Expert</div>
                    <div className="text-xs text-muted-foreground">Used AI assistant 50+ times</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="premium-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Profile Information</CardTitle>
                  <CardDescription>Manage your account details and preferences</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className={
                    isEditing
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      : ""
                  }
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="bg-white/5 border-white/10 focus:border-white/20"
                        />
                      ) : (
                        <div className="p-3 bg-white/5 rounded-md border border-white/10">{profileData.name}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      {isEditing ? (
                        <Input
                          id="occupation"
                          value={profileData.occupation}
                          onChange={(e) => handleInputChange("occupation", e.target.value)}
                          className="bg-white/5 border-white/10 focus:border-white/20"
                        />
                      ) : (
                        <div className="p-3 bg-white/5 rounded-md border border-white/10">{profileData.occupation}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      {isEditing ? (
                        <Input
                          id="company"
                          value={profileData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="bg-white/5 border-white/10 focus:border-white/20"
                        />
                      ) : (
                        <div className="p-3 bg-white/5 rounded-md border border-white/10">{profileData.company}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="joinDate">Member Since</Label>
                      <div className="p-3 bg-white/5 rounded-md border border-white/10 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {profileData.joinDate}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Contact Information */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="bg-white/5 border-white/10 focus:border-white/20"
                        />
                      ) : (
                        <div className="p-3 bg-white/5 rounded-md border border-white/10 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {profileData.email}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="bg-white/5 border-white/10 focus:border-white/20"
                        />
                      ) : (
                        <div className="p-3 bg-white/5 rounded-md border border-white/10 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {profileData.phone}
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="location">Location</Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          className="bg-white/5 border-white/10 focus:border-white/20"
                        />
                      ) : (
                        <div className="p-3 bg-white/5 rounded-md border border-white/10 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {profileData.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-md focus:border-white/20 focus:outline-none resize-none"
                      rows={3}
                    />
                  ) : (
                    <div className="p-3 bg-white/5 rounded-md border border-white/10">{profileData.bio}</div>
                  )}
                </div>

                {/* Account Security */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Account Security
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-md border border-white/10">
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-md border border-white/10">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-muted-foreground">Receive updates about your account</div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Settings className="w-4 h-4 mr-2" />
            Account Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
