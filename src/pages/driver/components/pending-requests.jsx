"use client"

import { useState, useEffect, useContext } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Clock, Check, X, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { getPendingRequests, acceptRide, declineRide } from "@/api/driver.jsx" // Ensure this is correctly implemented
import { toast } from "react-toastify"
import { AuthContext } from "@/context/AuthContext"

export function PendingRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const { userId } = useContext(AuthContext)

  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoading(true)
        const res = await getPendingRequests()
        console.log("Fetched data:", res)

        // Ensure res.data is available and is an array
        if (res && Array.isArray(res.data)) {
          setRequests(res.data)
        } else {
          toast.error("Response data is not an array or is missing", res?.data || "No data")
          setRequests([]) // fallback to empty list
        }
      } catch (err) {
        // Make sure to log the error message for better debugging
        toast.error("Failed to fetch pending requests: " + (err.message || err))
        setRequests([])
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchPending()
    }
  }, [userId])

  const handleAccept = async (requestId) => {
    try {
      const numericId = parseInt(requestId.replace("r-", ""), 10)
      
      // Show loading toast
      const toastId = toast.loading("Accepting ride request...")
      
      // Use the userId from AuthContext
      const response = await acceptRide(numericId, userId)
      
      // Update the success toast
      toast.update(toastId, { 
        render: "Ride accepted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000
      })
      
      // Remove from pending list after success
      setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId))
      
    } catch (err) {
      // Detailed error message to help with debugging
      console.error("Error accepting ride:", err)
      
      // User-friendly error message
      const errorMessage = err.response?.data?.detail || "Failed to accept ride"
      toast.error(errorMessage)
    }
  }

  const handleDecline = async (requestId) => {
    try {
      const numericId = parseInt(requestId.replace("r-", ""), 10)
      
      // Show loading toast
      const toastId = toast.loading("Declining ride request...")
      
      // Use the userId from AuthContext
      await declineRide(numericId, userId)
      
      // Update the success toast
      toast.update(toastId, { 
        render: "Ride declined",
        type: "info",
        isLoading: false,
        autoClose: 2000
      })
      
      // Remove from pending list after success
      setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId))
      
    } catch (err) {
      // Detailed error message to help with debugging
      console.error("Error declining ride:", err)
      
      // User-friendly error message
      const errorMessage = err.response?.data?.detail || "Failed to decline ride"
      toast.error(errorMessage)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Ride Requests</CardTitle>
          <CardDescription>Accept or decline incoming ride requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading ride requests...</p>
            </div>
          ) : requests.length === 0 ? (
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
