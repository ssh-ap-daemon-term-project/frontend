"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { getRecentBookings } from "@/api/hotel" // Assuming this API function exists or needs to be created

export function RecentBookings() {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getRecentBookings();
        if (response.status === 200) {
          setBookings(response.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Error fetching recent bookings");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading recent bookings...</div>;
  }

  if (!bookings || bookings.length === 0) {
    return <div className="text-center py-4">No recent bookings found</div>;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{booking.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{booking.username}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} to {new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{booking.roomType}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}