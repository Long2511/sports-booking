"use client"
import { Header } from "@/components/header"
import { CustomCalendar } from "@/components/custom-calendar"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data for bookings
const activeBookings = [
  { id: 1, court: "Outdoor Badminton Court 1", timeStart: "08:00", timeEnd: "10:00" },
  { id: 2, court: "Outdoor Badminton Court 1", timeStart: "08:00", timeEnd: "10:00" },
]

const historyBookings = [
  { id: 3, court: "Outdoor Badminton Court 1", timeStart: "08:00", timeEnd: "10:00" },
  { id: 4, court: "Outdoor Badminton Court 1", timeStart: "08:00", timeEnd: "10:00" },
]

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
      description: "Regular badminton practice session",
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
      description: "Tennis training session",
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
      description: "Friendly basketball match",
    },
  },
  {
    id: "4",
    title: "Volleyball Training",
    start: new Date(2025, 5, 13, 9, 0), // June 13, 2025, 9:00 AM
    end: new Date(2025, 5, 13, 11, 0), // June 13, 2025, 11:00 AM
    extendedProps: {
      status: "rejected",
      court: "Volleyball Court 1",
      user: "Jane Smith",
      location: "Main Campus",
      description: "Volleyball team practice",
    },
  },
]

export default function Dashboard() {
  const router = useRouter()

  const handleEventClick = (event: any) => {
    const props = event.extendedProps

    alert(`
Event: ${event.title}
Court: ${props?.court || "N/A"}
User: ${props?.user || "N/A"}
Status: ${props?.status || "N/A"}
Time: ${event.start?.toLocaleString()} - ${event.end?.toLocaleString()}
Location: ${props?.location || "N/A"}
Description: ${props?.description || "N/A"}
    `)
  }

  const handleTimeSlotClick = (start: Date, end: Date) => {
    const confirmed = confirm(`Create a new booking for ${start.toLocaleString()} - ${end.toLocaleString()}?`)

    if (confirmed) {
      router.push("/sport-hall-booking")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex flex-col lg:flex-row p-4 gap-4">
        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-secondary rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">My Booking</h2>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-primary mb-2">Active Booking</h3>
            {activeBookings.map((booking) => (
              <div key={booking.id} className="bg-primary text-white rounded-lg p-3 mb-2">
                <div className="font-medium">{booking.court}</div>
                <div className="text-sm">
                  {booking.timeStart} - {booking.timeEnd}
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary mb-2">History</h3>
            {historyBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg p-3 mb-2">
                <div className="font-medium">{booking.court}</div>
                <div className="text-sm">
                  {booking.timeStart} - {booking.timeEnd}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-right">
            <Link href="/sport-hall-booking" className="text-primary text-sm flex items-center justify-end">
              To Sport Hall Booking Page
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

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
      </div>
    </div>
  )
}
