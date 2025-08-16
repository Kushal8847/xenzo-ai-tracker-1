"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  mode = "single",
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()
  const currentDate = new Date()
  const [currentMonth, setCurrentMonth] = React.useState(currentDate)

  const years = Array.from({ length: 21 }, (_, i) => currentDate.getFullYear() - 10 + i)
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(currentMonth.getFullYear(), monthIndex, 1)
    setCurrentMonth(newDate)
  }

  const handleYearChange = (year: number) => {
    const newDate = new Date(year, currentMonth.getMonth(), 1)
    setCurrentMonth(newDate)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentMonth)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentMonth(newDate)
  }

  return (
    <div className="w-80 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl p-4">
      {/* Custom Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-white hover:bg-white/10 hover:text-white"
          onClick={() => navigateMonth("prev")}
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Select
            value={currentMonth.getMonth().toString()}
            onValueChange={(value) => handleMonthChange(Number.parseInt(value))}
          >
            <SelectTrigger className="w-32 h-8 text-sm bg-gray-800/50 border-white/10 text-white hover:bg-gray-800/70">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800/95 backdrop-blur-xl border-white/10 text-white">
              {months.map((month, index) => (
                <SelectItem
                  key={month}
                  value={index.toString()}
                  className="text-white hover:bg-white/10 focus:bg-white/10"
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentMonth.getFullYear().toString()}
            onValueChange={(value) => handleYearChange(Number.parseInt(value))}
          >
            <SelectTrigger className="w-20 h-8 text-sm bg-gray-800/50 border-white/10 text-white hover:bg-gray-800/70">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800/95 backdrop-blur-xl border-white/10 text-white">
              {years.map((year) => (
                <SelectItem
                  key={year}
                  value={year.toString()}
                  className="text-white hover:bg-white/10 focus:bg-white/10"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-white hover:bg-white/10 hover:text-white"
          onClick={() => navigateMonth("next")}
          aria-label="Next month"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <DayPicker
        mode={mode}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        showOutsideDays={showOutsideDays}
        className={cn("w-full text-white", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4 w-full",
          caption: "hidden",
          caption_label: "hidden",
          nav: "hidden",
          nav_button: "hidden",
          nav_button_previous: "hidden",
          nav_button_next: "hidden",
          table: "w-full border-collapse space-y-1",
          head_row: "flex w-full mb-2",
          head_cell:
            "text-gray-400 rounded-md w-9 font-medium text-[0.8rem] flex items-center justify-center h-9 uppercase tracking-wider",
          row: "flex w-full mt-1",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
            "w-9 h-9 flex items-center justify-center",
          ),
          day: cn(
            "h-9 w-9 p-0 font-normal text-white hover:bg-white/10 hover:text-white rounded-md transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
            "cursor-pointer select-none",
          ),
          day_range_start: "bg-blue-600 text-white hover:bg-blue-700 rounded-l-md rounded-r-none",
          day_range_end: "bg-blue-600 text-white hover:bg-blue-700 rounded-r-md rounded-l-none",
          day_selected:
            "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-600 focus:text-white font-semibold shadow-lg",
          day_today: "bg-blue-600/20 text-blue-400 font-semibold border border-blue-600/50 hover:bg-blue-600/30",
          day_outside: "text-gray-600 opacity-50 hover:text-gray-500 hover:bg-white/5",
          day_disabled: "text-gray-700 opacity-30 cursor-not-allowed hover:bg-transparent hover:text-gray-700",
          day_range_middle: "bg-blue-600/20 text-blue-300 rounded-none hover:bg-blue-600/30",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
          IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
        }}
        {...props}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
