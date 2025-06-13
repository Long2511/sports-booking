"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface TimeSlot {
  start: string
  end: string
}

interface TimeSlotSelectorProps {
  className?: string
  onTimeSlotSelect?: (timeSlot: TimeSlot) => void
}

export function TimeSlotSelector({ className, onTimeSlotSelect }: TimeSlotSelectorProps) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)

  const timeSlots: TimeSlot[] = [
    { start: "08:00", end: "09:00" },
    { start: "09:00", end: "10:00" },
    { start: "10:00", end: "11:00" },
    { start: "11:00", end: "12:00" },
    { start: "12:00", end: "13:00" },
    { start: "13:00", end: "14:00" },
    { start: "14:00", end: "15:00" },
    { start: "15:00", end: "16:00" },
    { start: "16:00", end: "17:00" },
    { start: "17:00", end: "18:00" },
    { start: "18:00", end: "19:00" },
    { start: "19:00", end: "20:00" },
  ]

  const handleTimeSlotClick = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot)

    if (onTimeSlotSelect) {
      onTimeSlotSelect(timeSlot)
    }
  }

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {timeSlots.map((timeSlot) => (
        <Button
          key={`${timeSlot.start}-${timeSlot.end}`}
          variant={selectedTimeSlot === timeSlot ? "default" : "outline"}
          className={cn("text-xs", selectedTimeSlot === timeSlot && "bg-primary text-primary-foreground")}
          onClick={() => handleTimeSlotClick(timeSlot)}
        >
          {timeSlot.start} - {timeSlot.end}
        </Button>
      ))}
    </div>
  )
}
