"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarProps {
  className?: string
  onDateSelect?: (date: Date) => void
}

export function Calendar({ className, onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
  const monthNames = [
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

  const getMonthData = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const daysInMonth = lastDay.getDate()
    let dayOfWeek = firstDay.getDay()
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Adjust to start from Monday

    const prevMonthLastDay = new Date(year, month, 0).getDate()

    const days = []

    // Previous month days
    for (let i = dayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        currentMonth: false,
        prevMonth: true,
        nextMonth: false,
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        currentMonth: true,
        prevMonth: false,
        nextMonth: false,
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        currentMonth: false,
        prevMonth: false,
        nextMonth: true,
      })
    }

    return days
  }

  const days = getMonthData(currentDate)

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return

    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(newDate)

    if (onDateSelect) {
      onDateSelect(newDate)
    }
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    )
  }

  return (
    <div className={cn("p-4 bg-white rounded-lg", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <Button variant="ghost" size="sm" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1 font-medium">
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 font-normal",
              !day.currentMonth && "text-muted-foreground opacity-50",
              isToday(day.date) && "border border-primary",
              isSelected(day.date) &&
                day.currentMonth &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            )}
            onClick={() => handleDateClick(day.date, day.currentMonth)}
            disabled={!day.currentMonth}
          >
            {day.date}
          </Button>
        ))}
      </div>
    </div>
  )
}
