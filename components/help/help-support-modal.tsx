"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Search,
  Send,
  Clock,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Users,
  BookOpen,
  Video,
  FileText,
} from "lucide-react"

interface HelpSupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpSupportModal({ isOpen, onClose }: HelpSupportModalProps) {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setContactForm({ name: "", email: "", subject: "", message: "", priority: "medium" })

      // Show success message
      const successDiv = document.createElement("div")
      successDiv.className =
        "fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] backdrop-blur-sm"
      successDiv.innerHTML = "✅ Support ticket submitted successfully! We'll respond within 2 hours."
      document.body.appendChild(successDiv)

      setTimeout(() => {
        document.body.removeChild(successDiv)
      }, 4000)
    }, 2000)
  }

  const faqs = [
    {
      question: "How do I add my first transaction?",
      answer:
        "Click the 'Add Income' or 'Add Expense' buttons in the sidebar, or use the '+' button on the dashboard. Fill in the amount, category, and description, then save. You can also use voice commands or upload receipts for automatic categorization.",
      category: "Getting Started",
    },
    {
      question: "Can I connect my Australian bank account?",
      answer:
        "Yes! We support all major Australian banks including CBA, ANZ, Westpac, and NAB. Click 'Connect Bank' in the sidebar to securely link your account using bank-grade encryption. Your login details are never stored on our servers.",
      category: "Bank Integration",
    },
    {
      question: "How does the AI Assistant analyze my spending?",
      answer:
        "Our AI uses machine learning to identify spending patterns, detect unusual transactions, and provide personalized insights. It can predict future expenses, suggest budget optimizations, and alert you to potential savings opportunities.",
      category: "AI Features",
    },
    {
      question: "Is my financial data secure and private?",
      answer:
        "Absolutely. We use military-grade 256-bit SSL encryption, two-factor authentication, and store data in Australian servers. Your information is never shared with third parties and you maintain full control over your data.",
      category: "Security",
    },
    {
      question: "How do I create and track budgets effectively?",
      answer:
        "Navigate to the Budget page and click 'Create Budget'. Set categories, amounts, and time periods. Use our smart budget suggestions based on your spending history. Track progress with real-time notifications and visual indicators.",
      category: "Budgeting",
    },
    {
      question: "Can I export my financial data?",
      answer:
        "Yes! Export your data in multiple formats including CSV, PDF reports, and Excel. Go to Settings > Data Management to download your complete transaction history, budgets, and analytics reports.",
      category: "Data Management",
    },
    {
      question: "What's included in the Premium plan?",
      answer:
        "Premium includes unlimited transactions, advanced AI insights, custom categories, priority support, bank sync for multiple accounts, investment tracking, tax reporting, and exclusive financial planning tools.",
      category: "Premium Features",
    },
    {
      question: "How do I set up automatic categorization?",
      answer:
        "Our AI learns from your manual categorizations and automatically suggests categories for new transactions. You can also set up rules in Settings > Automation to automatically categorize recurring transactions.",
      category: "Automation",
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] h-[90vh] max-w-6xl bg-gray-900/95 backdrop-blur-2xl border border-gray-700/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col">
        <DialogHeader className="pb-0 border-b border-gray-700/30 bg-gradient-to-r from-gray-800/80 via-gray-900/80 to-gray-800/80 p-8 -m-6 mb-8 flex-shrink-0">
          <DialogTitle className="flex items-center gap-6 text-3xl">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Help & Support Center
              </h2>
              <p className="text-lg text-gray-400 font-normal mt-1">
                Get help with Xenzo AI Expense Tracker • Available 24/7
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                  Online Support
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <Clock className="w-3 h-3 mr-1" />
                  2hr Response Time
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="faq" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/60 p-2 rounded-2xl mb-8 border border-gray-700/40 backdrop-blur-sm flex-shrink-0">
              <TabsTrigger
                value="faq"
                className="flex items-center gap-3 text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 rounded-xl py-4 px-6"
              >
                <Search className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">FAQ</div>
                  <div className="text-xs opacity-80">Quick Answers</div>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="flex items-center gap-3 text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 rounded-xl py-4 px-6"
              >
                <MessageCircle className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Contact</div>
                  <div className="text-xs opacity-80">Get in Touch</div>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="flex items-center gap-3 text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 rounded-xl py-4 px-6"
              >
                <BookOpen className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Resources</div>
                  <div className="text-xs opacity-80">Learn More</div>
                </div>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="faq" className="h-full flex flex-col mt-0">
                <div className="mb-8 flex-shrink-0">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <Input
                      placeholder="Search frequently asked questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 text-lg bg-gray-800/60 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-2xl backdrop-blur-sm"
                    />
                  </div>
                  {searchQuery && (
                    <p className="text-sm text-gray-400 mt-3 ml-1">
                      Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""} for "{searchQuery}"
                    </p>
                  )}
                </div>

                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-6 pb-6">
                    {filteredFaqs.map((faq, index) => (
                      <Card
                        key={index}
                        className="bg-gray-800/60 border-gray-600/40 hover:bg-gray-700/60 transition-all duration-300 hover:border-blue-500/40 backdrop-blur-sm rounded-2xl overflow-hidden group"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between gap-4">
                            <CardTitle className="text-xl leading-relaxed text-white group-hover:text-blue-300 transition-colors">
                              {faq.question}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/40 shrink-0"
                            >
                              {faq.category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 leading-relaxed text-lg">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="contact" className="h-full flex flex-col mt-0">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-8 pb-6">
                    {/* Contact Methods Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Email Support */}
                      <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/40 backdrop-blur-sm rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300">
                        <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-blue-500/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/40 transition-colors">
                            <Mail className="w-8 h-8 text-blue-300" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3">Email Support</h3>
                          <p className="text-blue-200 font-mono text-lg mb-2">customersupport@xenzo.com.au</p>
                          <p className="text-blue-300 text-sm mb-6">Response within 2 hours</p>
                          <Button
                            className="w-full bg-blue-500/20 border border-blue-500/40 text-blue-200 hover:bg-blue-500/30 hover:text-white transition-all rounded-xl"
                            onClick={() => window.open("mailto:customersupport@xenzo.com.au")}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Phone Support */}
                      <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/40 backdrop-blur-sm rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300">
                        <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-green-500/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/40 transition-colors">
                            <Phone className="w-8 h-8 text-green-300" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3">Phone Support</h3>
                          <p className="text-green-200 font-mono text-lg mb-2">+61 3 9876 5432</p>
                          <p className="text-green-300 text-sm mb-6">Available 24/7</p>
                          <Button
                            className="w-full bg-green-500/20 border border-green-500/40 text-green-200 hover:bg-green-500/30 hover:text-white transition-all rounded-xl"
                            onClick={() => window.open("tel:+61398765432")}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call Now
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Live Chat */}
                      <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/40 backdrop-blur-sm rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300">
                        <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-purple-500/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/40 transition-colors relative">
                            <MessageCircle className="w-8 h-8 text-purple-300" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3">Live Chat</h3>
                          <p className="text-purple-200 text-lg mb-2">Instant messaging</p>
                          <p className="text-purple-300 text-sm mb-6">Online now</p>
                          <Button className="w-full bg-purple-500/20 border border-purple-500/40 text-purple-200 hover:bg-purple-500/30 hover:text-white transition-all rounded-xl">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Start Chat
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Contact Form */}
                    <Card className="bg-gray-800/60 border-gray-600/40 backdrop-blur-sm rounded-2xl">
                      <CardHeader className="pb-6">
                        <CardTitle className="text-2xl text-white flex items-center gap-3">
                          <Send className="w-6 h-6 text-blue-400" />
                          Send us a Message
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-300">
                          We'll get back to you within 2 hours during business hours
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="text-sm font-semibold mb-3 block text-gray-300">Full Name</label>
                              <Input
                                value={contactForm.name}
                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                placeholder="Your full name"
                                className="h-12 bg-gray-700/60 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-semibold mb-3 block text-gray-300">Email Address</label>
                              <Input
                                type="email"
                                value={contactForm.email}
                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                placeholder="your@email.com"
                                className="h-12 bg-gray-700/60 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="text-sm font-semibold mb-3 block text-gray-300">Subject</label>
                              <Input
                                value={contactForm.subject}
                                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                                placeholder="Brief description of your issue"
                                className="h-12 bg-gray-700/60 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-semibold mb-3 block text-gray-300">Priority Level</label>
                              <select
                                value={contactForm.priority}
                                onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                                className="h-12 w-full bg-gray-700/60 border border-gray-600/50 text-white rounded-xl px-4 focus:border-blue-500/50 focus:ring-blue-500/20 focus:outline-none"
                              >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                                <option value="urgent">Urgent</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-semibold mb-3 block text-gray-300">Message</label>
                            <Textarea
                              value={contactForm.message}
                              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                              placeholder="Please describe your issue in detail. Include any error messages, steps you've taken, and what you expected to happen..."
                              rows={6}
                              className="bg-gray-700/60 border-gray-600/50 resize-none text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl"
                              required
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                                Sending Message...
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5 mr-3" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    {/* Office Hours & Response Times */}
                    <Card className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 border-gray-600/40 backdrop-blur-sm rounded-2xl">
                      <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                          <Clock className="w-6 h-6 text-blue-400" />
                          Office Hours & Response Times
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-600/30">
                              <span className="text-gray-300 font-medium">Email Support:</span>
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Within 2 hours</Badge>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-600/30">
                              <span className="text-gray-300 font-medium">Phone Support:</span>
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                24/7 Available
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-600/30">
                              <span className="text-gray-300 font-medium">Live Chat:</span>
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Instant</Badge>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-600/30">
                              <span className="text-gray-300 font-medium">Office Hours:</span>
                              <span className="text-gray-300">Mon-Fri 9AM-6PM AEST</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-600/30">
                              <span className="text-gray-300 font-medium">Weekend Support:</span>
                              <span className="text-gray-300">Emergency only</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                              <span className="text-gray-300 font-medium">Premium Support:</span>
                              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                                Priority Queue
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="resources" className="h-full flex flex-col mt-0">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-8 pb-6">
                    {/* Quick Links */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        Learning Resources
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/40 backdrop-blur-sm rounded-2xl hover:scale-105 transition-all duration-300 group">
                          <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/40 transition-colors">
                              <BookOpen className="w-8 h-8 text-blue-300" />
                            </div>
                            <h4 className="font-bold text-white text-xl mb-3">Getting Started Guide</h4>
                            <p className="text-blue-200 mb-6 leading-relaxed">
                              Complete walkthrough for new users to set up their account and master all features
                            </p>
                            <Button className="w-full bg-blue-500/20 border border-blue-500/40 text-blue-200 hover:bg-blue-500/30 hover:text-white transition-all rounded-xl">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Read Guide
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/40 backdrop-blur-sm rounded-2xl hover:scale-105 transition-all duration-300 group">
                          <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/40 transition-colors">
                              <Video className="w-8 h-8 text-purple-300" />
                            </div>
                            <h4 className="font-bold text-white text-xl mb-3">Video Tutorials</h4>
                            <p className="text-purple-200 mb-6 leading-relaxed">
                              Step-by-step video guides covering all features, tips, and advanced techniques
                            </p>
                            <Button className="w-full bg-purple-500/20 border border-purple-500/40 text-purple-200 hover:bg-purple-500/30 hover:text-white transition-all rounded-xl">
                              <Video className="w-4 h-4 mr-2" />
                              Watch Videos
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/40 backdrop-blur-sm rounded-2xl hover:scale-105 transition-all duration-300 group">
                          <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-green-500/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/40 transition-colors">
                              <Users className="w-8 h-8 text-green-300" />
                            </div>
                            <h4 className="font-bold text-white text-xl mb-3">Community Forum</h4>
                            <p className="text-green-200 mb-6 leading-relaxed">
                              Connect with other users, share tips, and get answers from the community
                            </p>
                            <Button className="w-full bg-green-500/20 border border-green-500/40 text-green-200 hover:bg-green-500/30 hover:text-white transition-all rounded-xl">
                              <Users className="w-4 h-4 mr-2" />
                              Join Forum
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Documentation Links */}
                    <Card className="bg-gray-800/60 border-gray-600/40 backdrop-blur-sm rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-2xl text-white flex items-center gap-3">
                          <FileText className="w-6 h-6 text-blue-400" />
                          Documentation & API
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-300">
                          Comprehensive documentation for all features and integrations
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-white text-lg mb-4">User Guides</h4>
                            <div className="space-y-3">
                              {[
                                "Account Setup & Security",
                                "Transaction Management",
                                "Budget Planning & Tracking",
                                "Bank Integration Guide",
                                "AI Features & Insights",
                                "Data Export & Backup",
                              ].map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 transition-colors cursor-pointer"
                                >
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                  <span className="text-gray-300 hover:text-white transition-colors">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="font-semibold text-white text-lg mb-4">Developer Resources</h4>
                            <div className="space-y-3">
                              {[
                                "API Documentation",
                                "Webhook Integration",
                                "Third-party Plugins",
                                "Data Import/Export",
                                "Custom Categories",
                                "Advanced Automation",
                              ].map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 transition-colors cursor-pointer"
                                >
                                  <CheckCircle className="w-5 h-5 text-blue-400" />
                                  <span className="text-gray-300 hover:text-white transition-colors">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
