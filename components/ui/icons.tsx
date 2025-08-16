export const Check = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
)

export const ChevronDown = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
)

export const ChevronRight = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
)

export const X = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

export const Plus = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
)

export const DollarSign = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
)

export const TrendingUp = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
    <polyline points="17,6 23,6 23,12"></polyline>
  </svg>
)

export const TrendingDown = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <polyline points="23,18 13.5,8.5 8.5,13.5 1,6"></polyline>
    <polyline points="17,18 23,18 23,12"></polyline>
  </svg>
)

export const ArrowUpRight = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7,7 17,7 17,17"></polyline>
  </svg>
)

export const ArrowDownLeft = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <line x1="17" y1="7" x2="7" y2="17"></line>
    <polyline points="17,17 7,17 7,7"></polyline>
  </svg>
)

export const Calendar = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
)

export const Target = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
)

export const Lightbulb = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M9 21h6"></path>
    <path d="M12 17v4"></path>
    <path d="M12 3a6 6 0 0 1 6 6c0 3-2 5.5-2 8H8c0-2.5-2-5-2-8a6 6 0 0 1 6-6z"></path>
  </svg>
)

export const Sparkles = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M12 3l1.09 3.26L16 7.5l-2.91 1.24L12 12l-1.09-3.26L8 7.5l2.91-1.24L12 3z"></path>
    <path d="M5 3l.5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5L5 3z"></path>
    <path d="M19 17l.5 1.5L21 19l-1.5.5L19 21l-.5-1.5L17 19l1.5-.5L19 17z"></path>
  </svg>
)

export const BarChart3 = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
)

export const PieChartIcon = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
  </svg>
)

export const HelpCircle = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <point cx="12" cy="17"></point>
  </svg>
)

export const Search = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <circle cx="11" cy="11" r="8"></circle>
    <path d="M21 21l-4.35-4.35"></path>
  </svg>
)

export const Mail = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
)

export const Phone = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
)

export const MessageCircle = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
)

export const Send = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
  </svg>
)
