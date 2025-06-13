"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function BookingSuccess() {
  const router = useRouter()

  const handleConfirm = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="bg-secondary rounded-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-primary mb-6">Your booking has been saved</h1>
          <Button variant="default" className="bg-primary text-white" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}
