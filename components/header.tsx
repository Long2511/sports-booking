"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { UserCircle } from "lucide-react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface HeaderProps {
  isAdmin?: boolean
}

export function Header({ isAdmin = false }: HeaderProps) {
  const pathname = usePathname()
  const [language, setLanguage] = useState("EN")

  return (
    <header className="bg-secondary border-b border-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/dashboard" className="text-primary text-3xl font-bold mr-8">
          Booking
        </Link>

        <nav className="flex items-center space-x-4">
          {isAdmin ? (
            <>
              <Link href="/admin/booking-management" className="flex items-center text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Booking Management
              </Link>
              <Link href="/admin/user-management" className="flex items-center text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                User Management
              </Link>
            </>
          ) : (
            <Link href="/dashboard" className="flex items-center text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              My Booking
            </Link>
          )}
          <Link href="/sport-hall-booking" className="flex items-center text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="m4.93 4.93 4.24 4.24"></path>
              <path d="m14.83 9.17 4.24-4.24"></path>
              <path d="m14.83 14.83 4.24 4.24"></path>
              <path d="m9.17 14.83-4.24 4.24"></path>
              <circle cx="12" cy="12" r="4"></circle>
            </svg>
            Sport Hall Booking
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Switch
            id="language"
            checked={language === "EN"}
            onCheckedChange={(checked) => setLanguage(checked ? "EN" : "VI")}
          />
          <span className="ml-2 text-sm font-medium">{language}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserCircle className="h-6 w-6 text-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href="/profile" className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/login" className="w-full">
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
