"use client"

import { Bell, X, Check, CreditCard, Target, TrendingUp, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/contexts/notification-context"
import { formatDistanceToNow } from "date-fns"

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "income":
      return <TrendingUp className="w-4 h-4 text-green-400" />
    case "expense":
      return <CreditCard className="w-4 h-4 text-red-400" />
    case "budget":
      return <Target className="w-4 h-4 text-blue-400" />
    case "goal":
      return <Sparkles className="w-4 h-4 text-purple-400" />
    case "budget_alert":
      return <Bell className="w-4 h-4 text-red-500" />
    case "budget_warning":
      return <Bell className="w-4 h-4 text-yellow-500" />
    case "success":
      return <Check className="w-4 h-4 text-green-400" />
    case "warning":
      return <Bell className="w-4 h-4 text-yellow-400" />
    case "error":
      return <X className="w-4 h-4 text-red-400" />
    default:
      return <Bell className="w-4 h-4 text-gray-400" />
  }
}

const getNotificationAccent = (type: string) => {
  switch (type) {
    case "income":
      return "border-l-green-400"
    case "expense":
      return "border-l-red-400"
    case "budget":
      return "border-l-blue-400"
    case "goal":
      return "border-l-purple-400"
    case "budget_alert":
      return "border-l-red-500"
    case "budget_warning":
      return "border-l-yellow-500"
    case "success":
      return "border-l-green-400"
    case "warning":
      return "border-l-yellow-400"
    case "error":
      return "border-l-red-400"
    default:
      return "border-l-gray-400"
  }
}

const getAmountColor = (type: string) => {
  switch (type) {
    case "income":
      return "text-green-400"
    case "expense":
      return "text-red-400"
    case "budget":
      return "text-blue-400"
    case "goal":
      return "text-purple-400"
    case "budget_alert":
      return "text-red-500"
    case "budget_warning":
      return "text-yellow-500"
    case "success":
      return "text-green-400"
    case "warning":
      return "text-yellow-400"
    case "error":
      return "text-red-400"
    default:
      return "text-white"
  }
}

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative hover:bg-white/5 transition-all duration-300 rounded-full p-2"
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
        >
          <Bell className="h-5 w-5 text-white/70 hover:text-white transition-colors duration-200" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs font-medium border-2 border-black animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-96 bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center justify-between px-6 py-4 bg-white/5 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white/80" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Notifications</h3>
              {unreadCount > 0 && <p className="text-xs text-white/60">{unreadCount} unread</p>}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 transition-all duration-200 rounded-full font-medium"
              onClick={markAllAsRead}
            >
              Mark All Read
            </Button>
          )}
        </DropdownMenuLabel>

        {notifications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Bell className="w-7 h-7 text-white/40" />
            </div>
            <h4 className="font-medium text-white/90 mb-2">No Notifications</h4>
            <p className="text-sm text-white/50 leading-relaxed max-w-48 mx-auto">
              You're all caught up! New activity will appear here.
            </p>
          </div>
        ) : (
          <>
            <DropdownMenuSeparator className="bg-white/10 mx-0" />
            <div className="max-h-96 overflow-y-auto">
              <div className="py-2">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div
                      className={`group relative mx-3 my-1 p-4 rounded-xl transition-all duration-200 hover:bg-white/5 border-l-4 cursor-pointer ${
                        !notification.isRead
                          ? `bg-white/5 ${getNotificationAccent(notification.type)}`
                          : `bg-transparent border-l-transparent hover:${getNotificationAccent(notification.type)}`
                      }`}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white text-sm leading-tight mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-white/60 text-sm leading-relaxed mb-2">{notification.message}</p>

                              {notification.amount && (
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <span className={`font-semibold text-sm ${getAmountColor(notification.type)}`}>
                                    ${notification.amount.toLocaleString()}
                                  </span>
                                  {notification.category && (
                                    <>
                                      <span className="text-white/30">•</span>
                                      <span className="text-white/50 text-xs font-medium">{notification.category}</span>
                                    </>
                                  )}
                                  {(notification.type === "budget_alert" || notification.type === "budget_warning") &&
                                    notification.budgetLimit && (
                                      <>
                                        <span className="text-white/30">•</span>
                                        <span className="text-white/50 text-xs font-medium">
                                          Limit: ${notification.budgetLimit.toLocaleString()}
                                        </span>
                                        {notification.percentage && (
                                          <>
                                            <span className="text-white/30">•</span>
                                            <span
                                              className={`text-xs font-medium ${
                                                notification.percentage > 100 ? "text-red-400" : "text-yellow-400"
                                              }`}
                                            >
                                              {notification.percentage.toFixed(1)}%
                                            </span>
                                          </>
                                        )}
                                      </>
                                    )}
                                </div>
                              )}

                              <p className="text-white/40 text-xs font-medium">
                                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 hover:bg-green-400/10 text-green-400 hover:text-green-300 rounded-full transition-all duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markAsRead(notification.id)
                                  }}
                                  aria-label="Mark as read"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-red-400/10 text-red-400 hover:text-red-300 rounded-full transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  clearNotification(notification.id)
                                }}
                                aria-label="Remove notification"
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {!notification.isRead && (
                        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      )}
                    </div>

                    {index < notifications.length - 1 && <div className="mx-6 h-px bg-white/5"></div>}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
