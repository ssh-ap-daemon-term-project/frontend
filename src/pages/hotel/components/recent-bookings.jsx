"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentBookings() {
  const bookings = [
    {
      id: "B001",
      customer: "John Doe",
      initials: "JD",
      roomType: "Luxury",
      startDate: "2023-05-15",
      endDate: "2023-05-20",
      status: "confirmed",
    },
    {
      id: "B002",
      customer: "Jane Smith",
      initials: "JS",
      roomType: "Suite",
      startDate: "2023-05-16",
      endDate: "2023-05-18",
      status: "pending",
    },
    {
      id: "B003",
      customer: "Robert Johnson",
      initials: "RJ",
      roomType: "Basic",
      startDate: "2023-05-17",
      endDate: "2023-05-19",
      status: "confirmed",
    },
    {
      id: "B004",
      customer: "Emily Davis",
      initials: "ED",
      roomType: "Luxury",
      startDate: "2023-05-18",
      endDate: "2023-05-22",
      status: "cancelled",
    },
  ]

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{booking.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{booking.customer}</p>
              <p className="text-sm text-muted-foreground">
                {booking.startDate} to {booking.endDate}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{booking.roomType}</Badge>
            <Badge
              variant={
                booking.status === "confirmed" ? "default" : booking.status === "pending" ? "secondary" : "destructive"
              }
            >
              {booking.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

