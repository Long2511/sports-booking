"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { CustomCalendar } from "@/components/custom-calendar"
import { TimeSlotSelector } from "@/components/time-slot-selector"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { fetcher } from "../../lib/api"

export default function SportHallBooking() {
  const [sports, setSports] = useState<{ id: string; name: string }[]>([])
  useEffect(() => {
    async function loadSports() {
      try {
        const data = await fetcher<{ id: string; name: string }[]>("/sports/get-sports")
        setSports(data)
      } catch (error) {
        console.error("Failed to load sports:", error)
      }
    }
    loadSports()
  }, [])

  const router = useRouter()
  const [bookingType, setBookingType] = useState<"indoor" | "outdoor">("outdoor")
  const [selectedSport, setSelectedSport] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: string; end: string } | null>(null)

  // Mock data for calendar events
  const calendarEvents = [
    {
      id: "1",
      title: "Badminton Session",
      start: new Date(2025, 5, 11, 8, 0), // June 11, 2025, 8:00 AM
      end: new Date(2025, 5, 11, 9, 0), // June 11, 2025, 9:00 AM
      extendedProps: {
        status: "confirmed",
        court: "Outdoor Badminton Court 1",
        user: "Nguyễn Văn Bê",
        location: "Main Campus",
      },
    },
    {
      id: "2",
      title: "Tennis Practice",
      start: new Date(2025, 5, 11, 10, 0), // June 11, 2025, 10:00 AM
      end: new Date(2025, 5, 11, 11, 0), // June 11, 2025, 11:00 AM
      extendedProps: {
        status: "confirmed",
        court: "Outdoor Tennis Court 2",
        user: "Nguyễn Văn Cê",
        location: "East Campus",
      },
    },
    {
      id: "3",
      title: "Basketball Game",
      start: new Date(2025, 5, 12, 14, 0), // June 12, 2025, 2:00 PM
      end: new Date(2025, 5, 12, 16, 0), // June 12, 2025, 4:00 PM
      extendedProps: {
        status: "pending",
        court: "Indoor Basketball Court",
        user: "John Doe",
        location: "Sports Complex",
      },
    },
  ]

  const handleEventClick = (event: any) => {
    const props = event.extendedProps

    alert(`
Event: ${event.title}
Court: ${props?.court || "N/A"}
User: ${props?.user || "N/A"}
Status: ${props?.status || "N/A"}
Time: ${event.start?.toLocaleString()} - ${event.end?.toLocaleString()}
    `)
  }

  const handleTimeSlotClick = (start: Date, end: Date) => {
    setSelectedDate(start)
    setSelectedTimeSlot({
      start: `${start.getHours()}:${start.getMinutes().toString().padStart(2, "0")}`,
      end: `${end.getHours()}:${end.getMinutes().toString().padStart(2, "0")}`,
    })
  }

  const handleConfirm = () => {
    router.push("/booking-success")
  }

  const handleReset = () => {
    setSelectedSport("")
    setSelectedLocation("")
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex flex-col lg:flex-row p-4 gap-4">
        {/* Calendar */}
        <div className="flex-1">
          <CustomCalendar
            events={calendarEvents}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
            initialView="week"
            initialDate={new Date(2025, 5, 11)} // June 11, 2025
            slotMinTime="06:00"
            slotMaxTime="22:00"
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
              startTime: "06:00",
              endTime: "22:00",
            }}
            selectable={true}
          />
        </div>

        {/* Booking Form */}
        <div className="w-full lg:w-96 bg-secondary rounded-lg p-6">
          <div className="flex justify-center mb-4">
            <div className="flex rounded-md overflow-hidden">
              <Button
                variant={bookingType === "indoor" ? "default" : "outline"}
                className={`rounded-none ${bookingType === "indoor" ? "btn-selected" : "btn-unselected"}`}
                onClick={() => setBookingType("indoor")}
              >
                Indoor
              </Button>
              <Button
                variant={bookingType === "outdoor" ? "default" : "outline"}
                className={`rounded-none ${bookingType === "outdoor" ? "btn-selected" : "btn-unselected"}`}
                onClick={() => setBookingType("outdoor")}
              >
                Outdoor
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-primary mb-2">Select the sport</label>
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Sports courts" />
                </SelectTrigger>
                <SelectContent>
                  {sports.length > 0 ? (
                    sports.map((sport) => (
                      <SelectItem key={sport.id} value={sport.id}>
                        {sport.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      Loading sports...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-primary mb-2">Select location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Sports courts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main-campus">Main Campus</SelectItem>
                  <SelectItem value="east-campus">East Campus</SelectItem>
                  <SelectItem value="west-campus">West Campus</SelectItem>
                  <SelectItem value="sports-complex">Sports Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-primary mb-2">Select the time frame</label>
              <p className="text-sm text-muted-foreground mb-2">
                {selectedDate
                  ? `Selected date: ${selectedDate.toLocaleDateString()}`
                  : "Click on the calendar to select a date and time"}
              </p>
              {selectedTimeSlot && (
                <p className="text-sm font-medium">
                  Time: {selectedTimeSlot.start} - {selectedTimeSlot.end}
                </p>
              )}
              <div className="mt-4">
                <TimeSlotSelector onTimeSlotSelect={(timeSlot) => setSelectedTimeSlot(timeSlot)} />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button
                variant="default"
                className="bg-primary text-white"
                onClick={handleConfirm}
                disabled={!selectedSport || !selectedLocation || !selectedTimeSlot}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
