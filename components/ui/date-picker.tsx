"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-11 justify-start text-left font-normal border-2 transition-all duration-200",
            "bg-gray-800/50 border-gray-700 text-white hover:border-blue-300 hover:bg-gray-800/70",
            !date && "text-gray-400",
            open && "border-blue-500 ring-2 ring-blue-500/20",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={date ? `Selected date: ${format(date, "MMMM do, yyyy")}` : placeholder}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
          <span className="flex-1 text-white">{date ? format(date, "MMMM do, yyyy") : placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 border border-white/10 shadow-2xl bg-transparent"
        align="start"
        sideOffset={8}
        style={{ zIndex: 200 }}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          disabled={(date) => {
            const oneYearFromNow = new Date()
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
            return date > oneYearFromNow
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
