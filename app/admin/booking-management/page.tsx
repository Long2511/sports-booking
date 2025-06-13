"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomCalendar } from "@/components/custom-calendar"
import { useState } from "react"

// Mock data for bookings
const bookings = [
  {
    id: 1,
    court: "Outdoor Badminton Court 1",
    user: "Nguyễn Văn Bê",
    userId: "10422000",
    timeStart: "08:00",
    timeEnd: "09:00",
    status: "pending",
  },
  {
    id: 2,
    court: "Outdoor Badminton Court 2",
    user: "Nguyễn Văn Cê",
    userId: "10422000",
    timeStart: "08:00",
    timeEnd: "09:00",
    status: "pending",
  },
]

// Mock data for calendar events
const calendarEvents = [
  {
    id: "1",
    title: "Badminton Session",
    start: new Date(2025, 5, 11, 8, 0), // June 11, 2025, 8:00 AM
    end: new Date(2025, 5, 11, 9, 0), // June 11, 2025, 9:00 AM
    extendedProps: {
      status: "pending",
      court: "Outdoor Badminton Court 1",
      user: "Nguyễn Văn Bê",
      location: "Main Campus",
    },
  },
  {
    id: "2",
    title: "Tennis Practice",
    start: new Date(2025, 5, 11, 8, 0), // June 11, 2025, 8:00 AM
    end: new Date(2025, 5, 11, 9, 0), // June 11, 2025, 9:00 AM
    extendedProps: {
      status: "pending",
      court: "Outdoor Badminton Court 2",
      user: "Nguyễn Văn Cê",
      location: "Main Campus",
    },
  },
  {
    id: "3",
    title: "Basketball Game",
    start: new Date(2025, 5, 12, 14, 0), // June 12, 2025, 2:00 PM
    end: new Date(2025, 5, 12, 16, 0), // June 12, 2025, 4:00 PM
    extendedProps: {
      status: "confirmed",
      court: "Indoor Basketball Court",
      user: "John Doe",
      location: "Sports Complex",
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
    },
  },
]

export default function BookingManagement() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  const handleEventClick = (event: any) => {
    setSelectedEvent(event.id)

    const props = event.extendedProps
    alert(`
Event Details:
Title: ${event.title}
Court: ${props?.court || "N/A"}
User: ${props?.user || "N/A"}
Status: ${props?.status || "N/A"}
Time: ${event.start?.toLocaleString()} - ${event.end?.toLocaleString()}
Location: ${props?.location || "N/A"}
    `)
  }

  const handleBookingAction = (bookingId: number, action: "confirm" | "reject") => {
    alert(`Booking ${bookingId} has been ${action}ed`)
    // In a real app, this would update the booking status
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={true} />

      <div className="p-6">
        <div className="bg-secondary rounded-lg p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <Input placeholder="Student Id" className="max-w-xs bg-white" />
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main-campus">Main Campus</SelectItem>
                <SelectItem value="east-campus">East Campus</SelectItem>
                <SelectItem value="west-campus">West Campus</SelectItem>
                <SelectItem value="sports-complex">Sports Complex</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="max-w-xs bg-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Calendar View</h2>
            <CustomCalendar
              events={calendarEvents}
              onEventClick={handleEventClick}
              initialView="day"
              initialDate={new Date(2025, 5, 11)} // June 11, 2025
              slotMinTime="06:00"
              slotMaxTime="22:00"
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
                startTime: "06:00",
                endTime: "22:00",
              }}
              selectable={false}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Pending Bookings</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`bg-white rounded-lg p-4 flex flex-wrap items-center justify-between shadow-sm border ${
                    selectedEvent === booking.id.toString() ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="flex-1 min-w-[150px] mb-2 lg:mb-0">
                    <div className="font-bold text-primary">{booking.court}</div>
                    <div className="text-sm text-muted-foreground">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          booking.status === "pending"
                            ? "text-amber-600"
                            : booking.status === "confirmed"
                              ? "text-green-600"
                              : "text-red-600"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-[150px] mb-2 lg:mb-0">
                    <div className="font-medium">{booking.user}</div>
                    <div className="text-sm text-muted-foreground">{booking.userId}</div>
                  </div>
                  <div className="flex-1 min-w-[120px] mb-2 lg:mb-0">
                    <div className="font-medium">
                      {booking.timeStart} - {booking.timeEnd}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                      onClick={() => handleBookingAction(booking.id, "reject")}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-primary text-white"
                      onClick={() => handleBookingAction(booking.id, "confirm")}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
