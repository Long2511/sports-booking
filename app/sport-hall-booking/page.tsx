"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { CustomCalendar } from "@/components/custom-calendar"
import { TimeSlotSelector } from "@/components/time-slot-selector"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { fetcher } from "../../lib/api"
import { Input } from "@/components/ui/input"

export default function SportHallBooking() {
  const [sports, setSports] = useState<{ id: string; name: string }[]>([])
  const router = useRouter()
  const [bookingType, setBookingType] = useState<"indoor" | "outdoor">("outdoor")
  const [selectedSportId, setSelectedSportId] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ id: string; start: string; end: string } | null>(null)
  const [halls, setHalls] = useState<{ id: string; name: string; sportId: string; location: string }[]>([])
  const [filteredHalls, setFilteredHalls] = useState<typeof halls>([])
  const [purpose, setPurpose] = useState('')
  // Example: get userId from session
  // const { data: session } = useSession()
  // const userId = session?.user?.id ?? ''
  const userId = "22ca47a8-b8f6-4541-a880-16c895b0b091" // Test ID, remove before production

  useEffect(() => {
    async function loadSports() {
      try {
        const data = await fetcher<{ id: string; name: string, description: string }[]>("/sports/get-sports")
        const mapped = data.map(s => ({ id: s.id, name: s.name, description: s.description }))
        setSports(mapped)
      } catch (error) {
        console.error("Failed to load sports:", error)
      }
    }
    loadSports()
  }, [])


  async function loadHalls() {
    try {
      const data = await fetcher<any[]>("/sport-halls/get-sport-halls")
      const mapped = data.map(h => ({
        id: h.id,
        name: h.name,
        sportId: h.sport_id ?? h.sportId,
        location: h.location,
      }))
      console.log("Loaded sport halls:", mapped)
      setHalls(mapped)
    } catch (error) {
      console.error("Failed to load sport halls:", error)
    }
  }

  useEffect(() => {
    loadHalls()
  }, [])

  // Time slots fetched from API
  const [timeSlots, setTimeSlots] = useState<{ id: string; start: string; end: string }[]>([])
  useEffect(() => {
    async function loadTimeSlots() {
      try {
        const data = await fetcher<any[]>("/time-slots/get-time-slots")
        setTimeSlots(
          data.map(ts => ({ id: ts.id, start: ts.start_time, end: ts.end_time }))
        )
      } catch (error) {
        console.error("Failed to load time slots:", error)
      }
    }
    loadTimeSlots()
  }, [])


  // Filter halls based on selected sport and reset location when sport changes
  // Filter halls by selected sport AND booking type
  useEffect(() => {
    if (selectedSportId) {
      setFilteredHalls(
        halls.filter(
          h => h.sportId === selectedSportId && h.location === bookingType
        )
      )
    } else {
      setFilteredHalls([])
    }
  }, [selectedSportId, halls, bookingType])

  // Reset location selection when selected sport changes
  useEffect(() => {
    setSelectedLocation("")
  }, [selectedSportId])

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

  const handleConfirm = async () => {
    debugger  
    if (!userId) {
      console.error('User not authenticated')
      return
    }
    if (!selectedSportId || !selectedLocation || !selectedDate || !selectedTimeSlot?.id) return
    const bookingPayload = {
      userId,
      sportId: selectedSportId,
      sportHallId: selectedLocation,
      date: selectedDate.toISOString().split('T')[0],
      timeSlotId: selectedTimeSlot.id,
      purpose,
    }
    console.log('Booking payload:', bookingPayload)
    try {
      await fetcher('/bookings/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      })
      router.push('/booking-success')
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Failed to create booking. Please try again later.')}
  }

  const handleReset = () => {
    setSelectedSportId("")
    setSelectedLocation("")
    setSelectedDate(null)
    setSelectedTimeSlot(null)
    setPurpose("")
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
              <Select value={selectedSportId} onValueChange={setSelectedSportId}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Sports" />
                </SelectTrigger>
                <SelectContent>
                  {sports.length > 0 ? (
                    sports.map((sport) => (
                      console.log(sport),
                      <SelectItem key={sport.id} value={sport.id}>
                        {sport.description}
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
              <Select value={selectedLocation} onValueChange={setSelectedLocation} onOpenChange ={() => loadHalls()}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select a hall" />
                </SelectTrigger>
                <SelectContent>
                  {!selectedSportId ? (
                    <SelectItem value="no-sport" disabled>  
                      Select a sport first
                    </SelectItem>
                  ) : halls.length === 0 ? (
                    <SelectItem value="loading-hall" disabled>
                      Loading sport halls...
                    </SelectItem>
                  ) : filteredHalls.length > 0 ? (
                    filteredHalls.map((hall) => (
                      <SelectItem key={hall.id} value={hall.id}>
                        {hall.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-halls" disabled>
                      No halls available for this sport
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Error if no halls available for selected sport & bookingType */}
            {selectedSportId && filteredHalls.length === 0 && (
              <p className="text-destructive text-sm mt-1">
                No {bookingType} halls available for this sport.
              </p>
            )}

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
                <TimeSlotSelector
                  onTimeSlotSelect={(timeSlot) => {
                    // Find the slot ID by matching start/end
                    const match = timeSlots.find(
                      ts => ts.start === timeSlot.start && ts.end === timeSlot.end
                    )
                    setSelectedTimeSlot({
                      id: match?.id ?? '',
                      start: timeSlot.start,
                      end: timeSlot.end,
                    })
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-primary mb-2">Note</label>
              <p className="text-sm text-muted-foreground mb-2">
                Add any additional information or requests for your booking
              </p>
            </div>
            <div>
              <Input
                value={purpose}
                placeholder="Your purpose"
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button
                variant="default"
                className="bg-primary text-white"
                onClick={handleConfirm}
                disabled={!selectedSportId || !selectedLocation || !selectedTimeSlot}
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
