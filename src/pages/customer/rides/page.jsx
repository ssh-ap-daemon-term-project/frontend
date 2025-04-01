"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { CarIcon, MapPinIcon, SearchIcon, StarIcon, PhoneIcon, CalendarIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

// Mock data for rides
const mockRides = {
  upcoming: [
    {
      id: 301,
      itineraryId: 1,
      itineraryName: "Summer Vacation",
      type: "taxi",
      pickupLocation: "Grand Plaza Hotel",
      dropoffLocation: "JFK Airport",
      pickupTime: new Date(2023, 7, 18, 14, 0),
      status: "confirmed",
      driverName: "Michael Johnson",
      driverPhone: "+1 (555) 123-4567",
      vehicleInfo: "Toyota Camry, Black, License: ABC123",
      price: 65,
      withDriverService: true,
      isReviewed: false,
    },
    {
      id: 302,
      itineraryId: 2,
      itineraryName: "Business Trip",
      type: "premium",
      pickupLocation: "City Center Suites",
      dropoffLocation: "Convention Center",
      pickupTime: new Date(2023, 8, 11, 8, 0),
      status: "confirmed",
      driverName: "To be assigned",
      driverPhone: "",
      vehicleInfo: "",
      price: 85,
      withDriverService: false,
      isReviewed: false,
    },
  ],
  past: [
    {
      id: 303,
      itineraryId: 3,
      itineraryName: "Anniversary Trip",
      type: "premium",
      pickupLocation: "Harbor View Inn",
      dropoffLocation: "Wine Country",
      pickupTime: new Date(2023, 4, 22, 9, 0),
      status: "completed",
      driverName: "Sarah Williams",
      driverPhone: "+1 (555) 987-6543",
      vehicleInfo: "Mercedes E-Class, Silver, License: XYZ789",
      price: 120,
      withDriverService: false,
      isReviewed: true,
    },
  ],
  cancelled: [
    {
      id: 304,
      itineraryId: 1,
      itineraryName: "Summer Vacation",
      type: "shuttle",
      pickupLocation: "Airport",
      dropoffLocation: "Seaside Resort",
      pickupTime: new Date(2023, 7, 19, 10, 0),
      status: "cancelled",
      driverName: "",
      driverPhone: "",
      vehicleInfo: "",
      price: 45,
      withDriverService: false,
      isReviewed: false,
    },
  ],
}

export default function RidesPage() {
  const [rides, setRides] = useState(mockRides)
  const [searchQuery, setSearchQuery] = useState("")
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [selectedRide, setSelectedRide] = useState(null)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  })

  // Filter rides based on search query
  const filterRides = (rideList) => {
    if (!searchQuery) return rideList

    return rideList.filter(
      (ride) =>
        ride.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.dropoffLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.itineraryName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  // Handle canceling a ride
  const handleCancelRide = (ride) => {
    // In a real app, you would call an API to cancel the ride

    const updatedUpcoming = rides.upcoming.filter((r) => r.id !== ride.id)
    const updatedCancelled = [...rides.cancelled, { ...ride, status: "cancelled" }]

    setRides({
      ...rides,
      upcoming: updatedUpcoming,
      cancelled: updatedCancelled,
    })

    toast({
      title: "Ride Cancelled",
      description: "Your ride has been cancelled successfully.",
    })
  }

  // Handle submitting a review
  const handleOpenReviewDialog = (ride) => {
    setSelectedRide(ride)
    setReviewForm({
      rating: 5,
      comment: "",
    })
    setShowReviewDialog(true)
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()

    // In a real app, you would call an API to submit the review

    // Mark the ride as reviewed
    const updatedPast = rides.past.map((ride) => (ride.id === selectedRide.id ? { ...ride, isReviewed: true } : ride))

    setRides({
      ...rides,
      past: updatedPast,
    })

    toast({
      title: "Review Submitted",
      description: "Your review has been submitted successfully.",
    })

    setShowReviewDialog(false)
    setSelectedRide(null)
    setReviewForm({
      rating: 5,
      comment: "",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Rides</h1>
          <p className="text-muted-foreground">Manage your ride bookings and transportation</p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search rides"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button asChild>
            <Link href="/itineraries">Book New Ride</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">
            Upcoming
            {rides.upcoming.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {rides.upcoming.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">
            Past
            {rides.past.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {rides.past.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled
            {rides.cancelled.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {rides.cancelled.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {filterRides(rides.upcoming).length > 0 ? (
            <div className="space-y-4">
              {filterRides(rides.upcoming).map((ride) => (
                <Card key={ride.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant="default">{ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}</Badge>
                          <Badge variant="outline">{ride.type.charAt(0).toUpperCase() + ride.type.slice(1)}</Badge>
                          {ride.withDriverService && (
                            <Badge variant="outline" className="border-amber-500 text-amber-500">
                              With Driver
                            </Badge>
                          )}
                        </div>

                        <div className="mb-2 flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <Link
                            href={`/itineraries/${ride.itineraryId}`}
                            className="text-sm text-muted-foreground hover:underline"
                          >
                            Part of: {ride.itineraryName}
                          </Link>
                        </div>

                        <h4 className="font-medium">{format(ride.pickupTime, "MMM d, yyyy h:mm a")}</h4>

                        <div className="mt-2 space-y-1">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPinIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Pickup</p>
                              <p className="text-muted-foreground">{ride.pickupLocation}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 text-sm">
                            <MapPinIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Dropoff</p>
                              <p className="text-muted-foreground">{ride.dropoffLocation}</p>
                            </div>
                          </div>
                        </div>

                        {ride.status === "confirmed" && ride.driverName !== "To be assigned" && (
                          <div className="mt-3 rounded-md bg-muted p-2 text-sm">
                            <p className="font-medium">Driver: {ride.driverName}</p>
                            {ride.driverPhone && (
                              <div className="flex items-center gap-1">
                                <PhoneIcon className="h-3 w-3" />
                                <p>{ride.driverPhone}</p>
                              </div>
                            )}
                            {ride.vehicleInfo && <p>Vehicle: {ride.vehicleInfo}</p>}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <Button variant="destructive" size="sm" onClick={() => handleCancelRide(ride)}>
                          Cancel Ride
                        </Button>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="text-lg font-bold">${ride.price}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CarIcon className="h-6 w-6 text-muted-foreground" />}
              title="No upcoming rides"
              description={searchQuery ? "No rides match your search" : "You don't have any upcoming rides."}
              actionText="Book a Ride"
              actionLink="/itineraries"
            />
          )}
        </TabsContent>

        <TabsContent value="past">
          {filterRides(rides.past).length > 0 ? (
            <div className="space-y-4">
              {filterRides(rides.past).map((ride) => (
                <Card key={ride.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant="secondary">
                            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                          </Badge>
                          <Badge variant="outline">{ride.type.charAt(0).toUpperCase() + ride.type.slice(1)}</Badge>
                          {ride.withDriverService && (
                            <Badge variant="outline" className="border-amber-500 text-amber-500">
                              With Driver
                            </Badge>
                          )}
                        </div>

                        <div className="mb-2 flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <Link
                            href={`/itineraries/${ride.itineraryId}`}
                            className="text-sm text-muted-foreground hover:underline"
                          >
                            Part of: {ride.itineraryName}
                          </Link>
                        </div>

                        <h4 className="font-medium">{format(ride.pickupTime, "MMM d, yyyy h:mm a")}</h4>

                        <div className="mt-2 space-y-1">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPinIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Pickup</p>
                              <p className="text-muted-foreground">{ride.pickupLocation}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 text-sm">
                            <MapPinIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Dropoff</p>
                              <p className="text-muted-foreground">{ride.dropoffLocation}</p>
                            </div>
                          </div>
                        </div>

                        {ride.driverName && (
                          <div className="mt-3 rounded-md bg-muted p-2 text-sm">
                            <p className="font-medium">Driver: {ride.driverName}</p>
                            {ride.vehicleInfo && <p>Vehicle: {ride.vehicleInfo}</p>}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        {!ride.isReviewed && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => handleOpenReviewDialog(ride)}
                          >
                            <StarIcon className="h-4 w-4" />
                            Write Review
                          </Button>
                        )}

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="text-lg font-bold">${ride.price}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CarIcon className="h-6 w-6 text-muted-foreground" />}
              title="No past rides"
              description={searchQuery ? "No rides match your search" : "You don't have any past rides."}
              actionText="Book a Ride"
              actionLink="/itineraries"
            />
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {filterRides(rides.cancelled).length > 0 ? (
            <div className="space-y-4">
              {filterRides(rides.cancelled).map((ride) => (
                <Card key={ride.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant="destructive">
                            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                          </Badge>
                          <Badge variant="outline">{ride.type.charAt(0).toUpperCase() + ride.type.slice(1)}</Badge>
                        </div>

                        <div className="mb-2 flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <Link
                            href={`/itineraries/${ride.itineraryId}`}
                            className="text-sm text-muted-foreground hover:underline"
                          >
                            Part of: {ride.itineraryName}
                          </Link>
                        </div>

                        <h4 className="font-medium">{format(ride.pickupTime, "MMM d, yyyy h:mm a")}</h4>

                        <div className="mt-2 space-y-1">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPinIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Pickup</p>
                              <p className="text-muted-foreground">{ride.pickupLocation}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 text-sm">
                            <MapPinIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Dropoff</p>
                              <p className="text-muted-foreground">{ride.dropoffLocation}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/itineraries/${ride.itineraryId}?tab=transportation`}>Book Again</Link>
                        </Button>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="text-lg font-bold">${ride.price}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CarIcon className="h-6 w-6 text-muted-foreground" />}
              title="No cancelled rides"
              description={searchQuery ? "No rides match your search" : "You don't have any cancelled rides."}
              actionText="Book a Ride"
              actionLink="/itineraries"
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>Share your experience with this ride and driver</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="rounded-md p-1 hover:bg-muted"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    >
                      <StarIcon
                        className={`h-6 w-6 ${
                          star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="review-comment" className="text-sm font-medium">
                  Your Review
                </label>
                <Textarea
                  id="review-comment"
                  rows={5}
                  placeholder="Share your experience with the driver and ride..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowReviewDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Review</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EmptyState({ icon, title, description, actionText, actionLink }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">{icon}</div>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="mb-6 text-muted-foreground">{description}</p>
      <Button asChild>
        <Link href={actionLink}>{actionText}</Link>
      </Button>
    </div>
  )
}

