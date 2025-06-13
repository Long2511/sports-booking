"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for users
const users = [
  {
    id: 1,
    name: "Nguyễn Văn Bê",
    userId: "10422000",
    isAdmin: false,
  },
  {
    id: 2,
    name: "Nguyễn Văn Cê",
    userId: "10422000",
    isAdmin: true,
  },
]

export default function UserManagement() {
  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={true} />

      <div className="p-6">
        <div className="bg-secondary rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
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
          </div>
        </div>

        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="font-bold">{user.name}</div>
              </div>
              <div className="flex-1">
                <div>{user.userId}</div>
              </div>
              <div className="flex-1">{user.isAdmin && <div className="font-medium">Admin</div>}</div>
              <div className="flex space-x-2">
                {user.isAdmin ? (
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Demote to admin
                  </Button>
                ) : (
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Promote to admin
                  </Button>
                )}
                <Button variant="destructive">Delete User</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
