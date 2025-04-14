"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Clock, DollarSign, Check, X } from "lucide-react"
import { format } from "date-fns"

// Sample pending requests data
const pendingRequestsData = [
  {
    id: "r-123456",
    passengerName: "Michael Johnson",
    passengerAvatar: "/placeholder.svg?height=40&width=40",
    pickupLocation: "123 Main St, Downtown",
    dropoffLocation: "456 Park Ave, Uptown",
    pickupTime: "2023-12-05T14:30:00",
    distance: 5.2,
    duration: 18,
    estimatedFare: 15.75,
    passengerRating: 4.7,
  },
  {
    id: "r-234567",
    passengerName: "Jessica Smith",
    passengerAvatar: "/placeholder.svg?height=40&width=40",
    pickupLocation: "789 Broadway, Midtown",
    dropoffLocation: "101 River Rd, Eastside",
    pickupTime: "2023-12-05T16:15:00",
    distance: 3.8,
    duration: 12,
    estimatedFare: 12.5,
    passengerRating: 4.9,
  },
  {
    id: "r-345678",
    passengerName: "Robert Davis",
    passengerAvatar: "/placeholder.svg?height=40&width=40",
    pickupLocation: "222 Oak St, Westside",
    dropoffLocation: "333 Pine Ave, Northside",
    pickupTime: "2023-12-06T09:45:00",
    distance: 7.5,
    duration: 25,
    estimatedFare: 22.3,
    passengerRating: 4.5,
  }
]

export function PendingRequests() {
  const [requests, setRequests] = useState(pendingRequestsData)

  const handleAccept = (requestId) => {
    // In a real app, this would send an API request to accept the ride
    setRequests(requests.filter(request => request.id !== requestId))
    // Then probably navigate to a "current ride" screen or similar
  }

  const handleDecline = (requestId) => {
    // In a real app, this would send an API request to decline the ride
    setRequests(requests.filter(request => request.id !== requestId))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Ride Requests</CardTitle>
          <CardDescription>Accept or decline incoming ride requests</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="py-24 text-center">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">No pending requests</h3>
              <p className="text-muted-foreground mt-2 mb-8">You'll see new ride requests here when they come in.</p>
              <Button>Go Online to Receive Requests</Button>
            </div>
          ) : (
            requests.map((request) => (
              <Card key={request.id} className="mb-4 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={request.passengerAvatar} alt={request.passengerName} />
                          <AvatarFallback>{request.passengerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{request.passengerName}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>{format(new Date(request.pickupTime), "MMM d, h:mm a")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${request.estimatedFare.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{request.distance} mi • {request.duration} min</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          <div className="h-10 w-0.5 bg-border"></div>
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                            <MapPin className="h-3 w-3 text-primary-foreground" />
                          </div>
                        </div>
                        <div className="space-y-2 flex-1">
                          <div>
                            <p className="text-sm font-medium">Pickup</p>
                            <p className="text-sm text-muted-foreground">{request.pickupLocation}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Dropoff</p>
                            <p className="text-sm text-muted-foreground">{request.dropoffLocation}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleDecline(request.id)}>
                        <X className="mr-1 h-4 w-4" /> Decline
                      </Button>
                      <Button size="sm" onClick={() => handleAccept(request.id)}>
                        <Check className="mr-1 h-4 w-4" /> Accept
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
