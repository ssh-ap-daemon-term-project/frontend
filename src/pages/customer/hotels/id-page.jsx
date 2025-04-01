"use client"

import Link from "next/link"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { StarIcon, MapPinIcon, CheckIcon, CreditCardIcon, UsersIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import { toast } from "@/components/ui/use-toast"

// Mock data for hotel details
const mockHotelDetails = {
  id: 1,
  name: "Grand Plaza Hotel",
  city: "New York",
  address: "123 Broadway, New York, NY 10001",
  description:
    "Experience luxury in the heart of Manhattan. Our hotel offers spacious rooms with stunning city views, world-class dining, and exceptional service. Located just steps away from major attractions, shopping, and entertainment.",
  rating: 4.7,
  images: [
    "/placeholder.svg?height=500&width=800",
    "/placeholder.svg?height=500&width=800",
    "/placeholder.svg?height=500&width=800",
    "/placeholder.svg?height=500&width=800",
  ],
  amenities: [
    "Free WiFi",
    "Pool",
    "Spa",
    "Gym",
    "Restaurant",
    "Room Service",
    "Business Center",
    "Concierge",
    "Laundry Service",
    "Parking",
    "Airport Shuttle",
    "Pet Friendly",
  ],
  rooms: [
    {
      id: 101,
      type: "basic",
      name: "Standard Room",
      description: "Comfortable room with all essential amenities for a pleasant stay.",
      capacity: 2,
      price: Array(60)
        .fill(0)
        .map((_, i) => 199 + (i % 7 === 5 || i % 7 === 6 ? 50 : 0)),
      available: Array(60)
        .fill(0)
        .map(() => Math.floor(Math.random() * 10) + 1),
      booked: Array(60)
        .fill(0)
        .map(() => Math.floor(Math.random() * 5)),
      amenities: ["Free WiFi", "TV", "Air Conditioning", "Private Bathroom", "Coffee Maker"],
      images: ["/placeholder.svg?height=400&width=600"],
    },
    {
      id: 102,
      type: "luxury",
      name: "Deluxe Room",
      description: "Spacious room with premium amenities and city views.",
      capacity: 2,
      price: Array(60)
        .fill(0)
        .map((_, i) => 299 + (i % 7 === 5 || i % 7 === 6 ? 75 : 0)),
      available: Array(60)
        .fill(0)
        .map(() => Math.floor(Math.random() * 8) + 1),
      booked: Array(60)
        .fill(0)
        .map(() => Math.floor(Math.random() * 4)),
      amenities: [
        "Free WiFi",
        "TV",
        "Air Conditioning",
        "Private Bathroom",
        "Mini Bar",
        "City View",
        "Bathrobe",
        "Slippers",
      ],
      images: ["/placeholder.svg?height=400&width=600"],
    },
    {
      id: 103,
      type: "suite",
      name: "Executive Suite",
      description: "Luxurious suite with separate living area and premium amenities.",
      capacity: 4,
      price: Array(60)
        .fill(0)
        .map((_, i) => 499 + (i % 7 === 5 || i % 7 === 6 ? 100 : 0)),
      available: Array(60)
        .fill(0)
        .map(() => Math.floor(Math.random() * 5) + 1),
      booked: Array(60)
        .fill(0)
        .map(() => Math.floor(Math.random() * 3)),
      amenities: [
        "Free WiFi",
        "TV",
        "Air Conditioning",
        "Private Bathroom",
        "Mini Bar",
        "City View",
        "Living Room",
        "Dining Area",
        "Bathrobe",
        "Slippers",
        "Espresso Machine",
      ],
      images: ["/placeholder.svg?height=400&width=600"],
    },
  ],
  reviews: [
    {
      id: 1,
      customerId: 101,
      customerName: "John Smith",
      rating: 5,
      date: "2023-12-15",
      comment:
        "Excellent hotel with amazing service. The staff was very friendly and accommodating. The room was clean and comfortable. Would definitely stay here again!",
    },
    {
      id: 2,
      customerId: 102,
      customerName: "Sarah Johnson",
      rating: 4,
      date: "2023-11-20",
      comment:
        "Great location and beautiful rooms. The only issue was that the WiFi was a bit slow at times. Otherwise, a wonderful stay.",
    },
    {
      id: 3,
      customerId: 103,
      customerName: "Michael Brown",
      rating: 5,
      date: "2023-10-05",
      comment:
        "Perfect stay from start to finish. The room service was prompt and the food was delicious. The spa facilities were top-notch.",
    },
    {
      id: 4,
      customerId: 104,
      customerName: "Emily Davis",
      rating: 3,
      date: "2023-09-18",
      comment:
        "The hotel is beautiful but I found the prices for additional services to be quite high. The room itself was comfortable though.",
    },
  ],
}

// Mock data for user's itineraries
const mockItineraries = [
  {
    id: 1,
    name: "Summer Vacation",
    startDate: new Date(2023, 7, 15),
    endDate: new Date(2023, 7, 25),
  },
  {
    id: 2,
    name: "Business Trip",
    startDate: new Date(2023, 8, 10),
    endDate: new Date(2023, 8, 15),
  },
]

export default function HotelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const hotelId = params.id

  // In a real app, you would fetch the hotel data based on the ID
  const hotel = mockHotelDetails

  const [selectedRoom, setSelectedRoom] = useState(null)
  const [bookingDates, setBookingDates] = useState({
    from: new Date(),
    to: addDays(new Date(), 3),
  })
  const [guests, setGuests] = useState(1)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [showAddToItineraryDialog, setShowAddToItineraryDialog] = useState(false)
  const [selectedItinerary, setSelectedItinerary] = useState(null)

  const handleBookNow = (room) => {
    setSelectedRoom(room)
  }

  const handleConfirmBooking = () => {
    setShowPaymentDialog(true)
  }

  const handlePayment = (e) => {
    e.preventDefault()
    // In a real app, you would process the payment here

    // Show success message
    toast({
      title: "Booking Confirmed!",
      description: `Your booking at ${hotel.name} has been confirmed for ${format(bookingDates.from, "MMM d, yyyy")} to ${format(bookingDates.to, "MMM d, yyyy")}.`,
    })

    // Close dialog and reset form
    setShowPaymentDialog(false)
    setSelectedRoom(null)

    // Redirect to bookings page
    // In a real app, you would redirect to a booking confirmation page
    setTimeout(() => {
      router.push("/bookings")
    }, 2000)
  }

  const handleAddToItinerary = (room) => {
    setSelectedRoom(room)
    setShowAddToItineraryDialog(true)
  }

  const confirmAddToItinerary = () => {
    if (!selectedItinerary) {
      toast({
        title: "Error",
        description: "Please select an itinerary.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would call an API to add the room to the itinerary

    toast({
      title: "Added to Itinerary",
      description: `${selectedRoom.name} at ${hotel.name} has been added to your "${selectedItinerary.name}" itinerary.`,
    })

    setShowAddToItineraryDialog(false)
    setSelectedItinerary(null)
    setSelectedRoom(null)
  }

  const calculateTotalPrice = () => {
    if (!selectedRoom) return 0

    const startDate = bookingDates.from
    const endDate = bookingDates.to
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

    let total = 0
    for (let i = 0; i < days; i++) {
      const dayIndex = Math.min(i, selectedRoom.price.length - 1)
      total += selectedRoom.price[dayIndex]
    }

    return total
  }

  const averageRating = hotel.reviews.reduce((acc, review) => acc + review.rating, 0) / hotel.reviews.length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{hotel.address}</span>
          </div>
          <div className="flex items-center gap-1">
            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{hotel.rating}</span>
            <span className="text-muted-foreground">({hotel.reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      <Carousel className="mb-8">
        <CarouselContent>
          {hotel.images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="h-[400px] overflow-hidden rounded-xl">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${hotel.name} - Image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      <Tabs defaultValue="rooms" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms">
          <div className="space-y-6">
            {hotel.rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="h-48 md:h-full">
                    <img
                      src={room.images[0] || "/placeholder.svg"}
                      alt={room.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="col-span-2 p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{room.name}</h3>
                        <p className="text-muted-foreground">{room.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${room.price[0]}</div>
                        <div className="text-sm text-muted-foreground">per night</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 flex items-center gap-2">
                        <UsersIcon className="h-4 w-4" />
                        <span>Max {room.capacity} guests</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity) => (
                          <Badge key={amenity} variant="outline">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">{room.available[0]} rooms available</div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleAddToItinerary(room)}>
                          Add to Itinerary
                        </Button>
                        <Button onClick={() => handleBookNow(room)}>Book Now</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h3 className="mb-4 text-xl font-bold">About This Hotel</h3>
              <p className="mb-6 text-muted-foreground">{hotel.description}</p>

              <h3 className="mb-4 text-xl font-bold">Amenities</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {hotel.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold">Location</h3>
                  <div className="mb-4 aspect-video overflow-hidden rounded-md bg-muted">
                    {/* Map placeholder */}
                    <div className="flex h-full items-center justify-center">
                      <MapPinIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-muted-foreground">{hotel.address}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h3 className="mb-4 text-xl font-bold">Guest Reviews</h3>

              <div className="space-y-6">
                {hotel.reviews.map((review) => (
                  <div key={review.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-semibold">{review.customerName}</div>
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <div className="mb-2 text-sm text-muted-foreground">{review.date}</div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>

              <Button className="mt-6" variant="outline">
                Write a Review
              </Button>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold">Rating Summary</h3>

                  <div className="mb-4 flex items-center gap-2">
                    <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                    <div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(averageRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : i < averageRating
                                  ? "fill-yellow-400/50 text-yellow-400"
                                  : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">Based on {hotel.reviews.length} reviews</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = hotel.reviews.filter((r) => r.rating === rating).length
                      const percentage = (count / hotel.reviews.length) * 100

                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <div className="w-8 text-sm">{rating} stars</div>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <div className="w-8 text-right text-sm">{count}</div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {selectedRoom && !showAddToItineraryDialog && (
        <Dialog open={true} onOpenChange={(open) => !open && setSelectedRoom(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Book {selectedRoom.name}</DialogTitle>
              <DialogDescription>Select your dates and number of guests</DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="dates">Dates</Label>
                <div className="rounded-md border">
                  <Calendar
                    mode="range"
                    selected={bookingDates}
                    onSelect={setBookingDates}
                    numberOfMonths={2}
                    disabled={(date) => {
                      const dayIndex = Math.floor((date - new Date()) / (1000 * 60 * 60 * 24))
                      return (
                        dayIndex < 0 ||
                        dayIndex >= 60 ||
                        selectedRoom.available[dayIndex] <= selectedRoom.booked[dayIndex]
                      )
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min={1}
                  max={selectedRoom.capacity}
                  value={guests}
                  onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">Maximum {selectedRoom.capacity} guests per room</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Room price</span>
                  <span>${calculateTotalPrice()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & fees</span>
                  <span>${Math.round(calculateTotalPrice() * 0.12)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${calculateTotalPrice() + Math.round(calculateTotalPrice() * 0.12)}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRoom(null)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmBooking}>Continue to Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Enter your payment information to complete your booking</DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePayment}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input
                  id="cardName"
                  value={paymentDetails.cardName}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <CreditCardIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="cardNumber"
                    className="pl-9"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={paymentDetails.expiryDate}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={paymentDetails.cvv}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mt-2 rounded-md bg-muted p-3 text-sm">
                <p className="font-medium">Booking Summary</p>
                <p className="mt-1 text-muted-foreground">
                  {selectedRoom?.name} at {hotel.name}
                </p>
                <p className="text-muted-foreground">
                  {bookingDates.from && bookingDates.to
                    ? `${format(bookingDates.from, "MMM d, yyyy")} - ${format(bookingDates.to, "MMM d, yyyy")}`
                    : "Select dates"}
                </p>
                <p className="text-muted-foreground">
                  {guests} {guests === 1 ? "guest" : "guests"}
                </p>
                <p className="mt-2 font-medium">
                  Total: ${calculateTotalPrice() + Math.round(calculateTotalPrice() * 0.12)}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Complete Booking</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddToItineraryDialog} onOpenChange={setShowAddToItineraryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Itinerary</DialogTitle>
            <DialogDescription>Select an itinerary to add this room to</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {mockItineraries.length > 0 ? (
              <div className="space-y-4">
                {mockItineraries.map((itinerary) => (
                  <div
                    key={itinerary.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted ${
                      selectedItinerary?.id === itinerary.id ? "border-primary bg-primary/10" : ""
                    }`}
                    onClick={() => setSelectedItinerary(itinerary)}
                  >
                    <h3 className="font-medium">{itinerary.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(itinerary.startDate, "MMM d")} - {format(itinerary.endDate, "MMM d, yyyy")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-4">You don't have any itineraries yet.</p>
                <Button asChild>
                  <Link href="/itineraries">Create an Itinerary</Link>
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddToItineraryDialog(false)
                setSelectedRoom(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={confirmAddToItinerary} disabled={!selectedItinerary}>
              Add to Itinerary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

