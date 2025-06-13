"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  extendedProps?: {
    status?: "pending" | "confirmed" | "rejected"
    location?: string
    court?: string
    user?: string
    description?: string
  }
}

interface CustomCalendarProps {
  events?: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  onTimeSlotClick?: (start: Date, end: Date) => void
  initialView?: "week" | "day" | "month"
  initialDate?: Date
  height?: string | number
  slotMinTime?: string
  slotMaxTime?: string
  businessHours?: {
    daysOfWeek: number[]
    startTime: string
    endTime: string
  }
  selectable?: boolean
  editable?: boolean
  headerToolbar?: {
    left: string
    center: string
    right: string
  }
}

export function CustomCalendar({
  events = [],
  onEventClick,
  onTimeSlotClick,
  initialView = "week",
  initialDate = new Date(),
  height = "auto",
  slotMinTime = "06:00",
  slotMaxTime = "22:00",
  businessHours = {
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
    startTime: "06:00",
    endTime: "22:00",
  },
  selectable = true,
}: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(initialDate)
  const [view, setView] = useState<"week" | "day" | "month">(initialView)

  // Generate days for the current week
  const generateWeekDays = (date: Date) => {
    const result = []
    const day = new Date(date)
    // Start from Sunday (0) or Monday (1) depending on preference
    const startOfWeek = new Date(day)
    startOfWeek.setDate(day.getDate() - day.getDay()) // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek)
      weekDay.setDate(startOfWeek.getDate() + i)
      result.push(weekDay)
    }
    return result
  }

  // Generate days for the current month
  const generateMonthDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const dayOfWeek = firstDay.getDay()

    const days = []
    const prevMonthLastDay = new Date(year, month, 0).getDate()

    // Previous month days
    for (let i = dayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        currentMonth: false,
        actualDate: new Date(year, month - 1, prevMonthLastDay - i),
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        currentMonth: true,
        actualDate: new Date(year, month, i),
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        currentMonth: false,
        actualDate: new Date(year, month + 1, i),
      })
    }

    return days
  }

  const weekDays = generateWeekDays(currentDate)
  const monthDays = generateMonthDays(currentDate)
  const displayDays = view === "week" ? weekDays : view === "day" ? [currentDate] : monthDays.map((d) => d.actualDate)

  // Generate hours based on business hours
  const startHour = Number.parseInt(slotMinTime.split(":")[0])
  const endHour = Number.parseInt(slotMaxTime.split(":")[0])
  const hours = Array.from({ length: endHour - startHour }, (_, i) => i + startHour)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const formatDay = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" })
  }

  const formatHour = (hour: number) => {
    return `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? "AM" : "PM"}`
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (view === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else if (view === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (view === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else if (view === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const getEventsForDateAndHour = (date: Date, hour?: number) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)

      const sameDate =
        eventStart.getDate() === date.getDate() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getFullYear() === date.getFullYear()

      if (hour !== undefined) {
        return sameDate && eventStart.getHours() === hour
      }

      return sameDate
    })
  }

  const handleTimeSlotClick = (date: Date, hour?: number) => {
    if (onTimeSlotClick && selectable) {
      const start = new Date(date)
      if (hour !== undefined) {
        start.setHours(hour, 0, 0, 0)
      } else {
        start.setHours(9, 0, 0, 0) // Default to 9 AM for month view
      }

      const end = new Date(start)
      end.setHours(start.getHours() + 1, 0, 0, 0)

      onTimeSlotClick(start, end)
    }
  }

  const getTitle = () => {
    if (view === "week") {
      return `${formatDate(weekDays[0])} - ${formatDate(weekDays[6])}`
    } else if (view === "day") {
      return formatDate(currentDate)
    } else {
      return formatMonthYear(currentDate)
    }
  }

  if (view === "month") {
    return (
      <div className="sports-calendar bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-lg font-medium">{getTitle()}</div>

          <div className="flex space-x-2">
            <Button variant={view === "month" ? "default" : "outline"} size="sm" onClick={() => setView("month")}>
              Month
            </Button>
            <Button variant={view === "week" ? "default" : "outline"} size="sm" onClick={() => setView("week")}>
              Week
            </Button>
            <Button variant={view === "day" ? "default" : "outline"} size="sm" onClick={() => setView("day")}>
              Day
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          {/* Header row with days */}
          <div className="grid grid-cols-7 border-b bg-secondary">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-3 text-center font-medium border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7">
            {monthDays.map((day, index) => {
              const eventsForDay = getEventsForDateAndHour(day.actualDate)

              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[100px] p-2 border-r border-b last:border-r-0 cursor-pointer hover:bg-gray-50",
                    !day.currentMonth && "bg-gray-50 text-gray-400",
                    isToday(day.actualDate) && "bg-blue-50 border-blue-200",
                  )}
                  onClick={() => handleTimeSlotClick(day.actualDate)}
                >
                  <div className={cn("font-medium mb-1", isToday(day.actualDate) && "text-blue-600")}>{day.date}</div>
                  <div className="space-y-1">
                    {eventsForDay.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "text-xs p-1 rounded text-white cursor-pointer truncate",
                          event.extendedProps?.status === "confirmed"
                            ? "bg-primary"
                            : event.extendedProps?.status === "rejected"
                              ? "bg-destructive"
                              : "bg-amber-500",
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick && onEventClick(event)
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {eventsForDay.length > 3 && (
                      <div className="text-xs text-gray-500">+{eventsForDay.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sports-calendar bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
            {view === "week" ? "Previous Week" : "Previous Day"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext}>
            {view === "week" ? "Next Week" : "Next Day"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="text-lg font-medium">{getTitle()}</div>

        <div className="flex space-x-2">
          <Button variant={view === "month" ? "default" : "outline"} size="sm" onClick={() => setView("month")}>
            Month
          </Button>
          <Button variant={view === "week" ? "default" : "outline"} size="sm" onClick={() => setView("week")}>
            Week
          </Button>
          <Button variant={view === "day" ? "default" : "outline"} size="sm" onClick={() => setView("day")}>
            Day
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {/* Header row with days */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b bg-secondary">
          <div className="p-2 border-r"></div>
          {displayDays.map((day, index) => (
            <div key={index} className={cn("p-2 text-center border-r", isToday(day) && "bg-blue-50")}>
              <div className="font-medium">{formatDay(day)}</div>
              <div>{formatDate(day)}</div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="relative">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-[80px_repeat(7,1fr)] border-b">
              <div className="p-2 border-r text-right text-sm font-medium">{formatHour(hour)}</div>
              {displayDays.map((day, dayIndex) => {
                const eventsForThisSlot = getEventsForDateAndHour(day, hour)

                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "border-r h-16 relative hover:bg-gray-50 cursor-pointer",
                      isToday(day) && "bg-blue-50",
                    )}
                    onClick={() => handleTimeSlotClick(day, hour)}
                  >
                    {eventsForThisSlot.map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute top-0 left-0 right-0 m-1 p-1 rounded text-white text-sm cursor-pointer shadow-sm hover:shadow-md transition-shadow",
                          event.extendedProps?.status === "confirmed"
                            ? "bg-primary"
                            : event.extendedProps?.status === "rejected"
                              ? "bg-destructive"
                              : "bg-amber-500",
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick && onEventClick(event)
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        {event.extendedProps?.court && (
                          <div className="text-xs truncate opacity-90">{event.extendedProps.court}</div>
                        )}
                        {event.extendedProps?.user && (
                          <div className="text-xs truncate opacity-80">{event.extendedProps.user}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
