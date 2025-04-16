import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
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
import { StarIcon, MapPinIcon, CheckIcon, CreditCardIcon, UsersIcon, Loader2, CalendarIcon } from "lucide-react"
import { format, addDays, parseISO } from "date-fns"
import { toast } from "react-toastify"
import { getHotelById, bookRoomByRoomId } from "@/api/customer"

export default function HotelDetailPage() {
  const navigate = useNavigate()
  const { hotelId } = useParams()

  // State variables
  const [loading, setLoading] = useState(true)
  const [hotel, setHotel] = useState(null)
  const [itineraries, setItineraries] = useState([])
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
  const [processingPayment, setProcessingPayment] = useState(false)
  const [processingItinerary, setProcessingItinerary] = useState(false)

  // Fetch hotel data
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true)
        const response = await getHotelById(hotelId)
        setHotel(response.data)
      } catch (error) {
        console.error("Failed to fetch hotel:", error)
        toast.error("Could not load hotel details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchHotelData()
  }, [hotelId])

  // Fetch itineraries when needed
  // const fetchItineraries = async () => {
  //   try {
  //     const response = await getCustomerItineraries()
  //     setItineraries(response.data)
  //   } catch (error) {
  //     console.error("Failed to fetch itineraries:", error)
  //     toast.error("Could not load your itineraries")
  //     setItineraries([])
  //   }
  // }

  const handleRoomBooking = async () => {
    try {
      if (!selectedRoom) {
        toast.error("Please select a room to book.")
        return
      }
  
      if (!bookingDates || !bookingDates.from || !bookingDates.to) {
        toast.error("Please select check-in and check-out dates.")
        return
      }
  
      if (guests <= 0) {
        toast.error("Please select at least one guest.")
        return
      }
  
      // Show loading state
      toast.info("Processing your booking...")
      
      // Call the API directly with the correct parameters
      const response = await bookRoomByRoomId({
        room_id: selectedRoom.id,
        start_date: bookingDates.from.toISOString(),
        end_date: bookingDates.to.toISOString(),
        number_of_persons: guests
      })
      
      // Handle successful booking
      toast.success("Room booked successfully!")
      
      // Close the booking dialog
      setSelectedRoom(null)
      
      // Optionally redirect to bookings page
      // navigate("/customer/bookings")
    } catch (error) {
      console.error("Booking error:", error)
      toast.error(error?.response?.data?.detail || "An error occurred while booking the room.")
    }
  }

  const handleBookNow = (room) => {
    setSelectedRoom(room)
    // Reset guests to room roomCapacity if current selection is too high
    if (guests > room.roomCapacity) {
      setGuests(room.roomCapacity)
    }
  }

  const handleConfirmBooking = () => {
    setShowPaymentDialog(true)
  }

  const handlePayment = async (e) => {
    e.preventDefault()

    if (!selectedRoom || !bookingDates.from || !bookingDates.to) {
      toast.error("Please select dates for your booking")
      return
    }

    try {
      setProcessingPayment(true)

      // Prepare booking data
      const bookingData = {
        roomId: selectedRoom.id,
        startDate: bookingDates.from.toISOString(),
        endDate: bookingDates.to.toISOString(),
        numberOfPersons: guests
      }

      // Call API to book the room
      await customerBookRoom(bookingData)

      // Show success toast
      toast.success(`Your booking at ${hotel.name} has been confirmed!`)

      // Close dialogs and reset form
      setShowPaymentDialog(false)
      setSelectedRoom(null)

      // Redirect to bookings page
      setTimeout(() => {
        navigate("/customer/bookings")
      }, 2000)

    } catch (error) {
      console.error("Booking failed:", error)
      toast.error(error.response?.data?.detail || "Failed to process your booking")
    } finally {
      setProcessingPayment(false)
    }
  }

  // const handleAddToItinerary = async (room) => {
  //   setSelectedRoom(room)
  //   await fetchItineraries()
  //   setShowAddToItineraryDialog(true)
  // }

  // const confirmAddToItinerary = async () => {
  //   if (!selectedItinerary) {
  //     toast.error("Please select an itinerary")
  //     return
  //   }

  //   if (!selectedRoom || !bookingDates.from || !bookingDates.to) {
  //     toast.error("Please select dates")
  //     return
  //   }

  //   try {
  //     setProcessingItinerary(true)

  //     // Prepare data
  //     const data = {
  //       roomId: selectedRoom.id,
  //       itineraryId: selectedItinerary.id,
  //       startDate: bookingDates.from.toISOString(),
  //       endDate: bookingDates.to.toISOString()
  //     }

  //     // Call API to add room to itinerary
  //     await addRoomToItinerary(data)

  //     // Show success toast
  //     toast.success(`${selectedRoom.name} at ${hotel.name} has been added to your itinerary`)

  //     // Close dialog and reset
  //     setShowAddToItineraryDialog(false)
  //     setSelectedItinerary(null)
  //     setSelectedRoom(null)

  //   } catch (error) {
  //     console.error("Failed to add to itinerary:", error)
  //     toast.error(error.response?.data?.detail || "Failed to add to itinerary")
  //   } finally {
  //     setProcessingItinerary(false)
  //   }
  // }

  const calculateTotalPrice = () => {
    if (!selectedRoom || !bookingDates || !bookingDates.from || !bookingDates.to) return 0

    const startDate = bookingDates.from
    const endDate = bookingDates.to
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

    let total = selectedRoom.basePrice * days
    // for (let i = 0; i < days; i++) {
    //   const dayIndex = Math.min(i, selectedRoom.basePrice)
    //   total += selectedRoom.basePrice
    // }

    return total
  }

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-lg">Loading hotel details...</p>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-bold text-red-700">Hotel Not Found</h2>
          <p className="mt-2">The hotel you're looking for doesn't exist or you don't have access to it.</p>
          <Button className="mt-4" asChild>
            <Link to="/hotels">Back to Hotels</Link>
          </Button>
        </div>
      </div>
    )
  }

  const averageRating = hotel.reviews.length > 0
    ? hotel.reviews.reduce((acc, review) => acc + Number(review.rating), 0) / hotel.reviews.length
    : 0

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
          {hotel?.images?.map((image, index) => (
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
            {hotel?.rooms?.map((room) => (
              <Card key={room.id} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="h-48 md:h-full">
                    <img
                      src={room.images ? room.images[0] : "/placeholder.svg"}
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
                        <div className="text-2xl font-bold">${room.basePrice}</div>
                        <div className="text-sm text-muted-foreground">per night</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 flex items-center gap-2">
                        <UsersIcon className="h-4 w-4" />
                        <span>Max {room.roomCapacity} guests</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="text-sm">
                        <AvailabilityCalendar room={room} />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => navigate(`/customer`)}>
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
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold">Location</h3>
                  <div className="mb-4 aspect-video overflow-hidden rounded-md bg-muted">
                    {/* Map placeholder */}
                    <div className="flex h-full items-center justify-center hover:cursor-pointer" onClick={() => window.open(`https://maps.google.com/?q=${hotel?.latitude},${hotel?.longitude}`, '_blank')}>
                      <MapPinIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => window.open(`https://maps.google.com/?q=${hotel?.latitude},${hotel?.longitude}`, '_blank')}
                  >
                    View on Google Maps
                  </Button>
                  <p className="text-muted-foreground">{hotel.address}</p>
                  <p className="text-muted-foreground">{hotel.city}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h3 className="mb-4 text-xl font-bold">Guest Reviews</h3>

              {hotel.reviews.length > 0 ? (
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
              ) : (
                <p className="text-muted-foreground">No reviews yet for this hotel.</p>
              )}

              <Button className="mt-6" variant="outline">
                Write a Review
              </Button>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold">Rating Summary</h3>

                  {hotel.reviews.length > 0 ? (
                    <>
                      <div className="mb-4 flex items-center gap-2">
                        <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                        <div>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-5 w-5 ${i < Math.floor(averageRating)
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
                          const count = hotel.reviews.filter((r) => Number(r.rating) === rating).length
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
                    </>
                  ) : (
                    <p className="text-muted-foreground">No ratings yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {selectedRoom && !showAddToItineraryDialog && (
        <Dialog open={true} onOpenChange={(open) => !open && setSelectedRoom(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book {selectedRoom.name}</DialogTitle>
              <DialogDescription>Select your check-in and check-out dates and number of guests</DialogDescription>
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
                        selectedRoom.availableRoomsList[dayIndex <= 0 ? 0 : Math.min(dayIndex, 59)] <= 0
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
                  max={selectedRoom.roomCapacity}
                  value={guests}
                  onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">Maximum {selectedRoom.roomCapacity} guests per room</p>
              </div>

              <Separator />

              {bookingDates?.from && bookingDates?.to ? (
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
              ) : (
                <div className="rounded-md bg-muted p-4 text-center">
                  <p className="text-sm font-medium">Please select check-in and check-out dates to see pricing</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRoom(null)}>
                Cancel
              </Button>
              <Button onClick={handleRoomBooking} disabled={!bookingDates || !bookingDates?.from || !bookingDates?.to}>
                Book
              </Button>
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
                  {bookingDates?.from && bookingDates?.to
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
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)} disabled={processingPayment}>
                Cancel
              </Button>
              <Button type="submit" disabled={processingPayment}>
                {processingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Complete Booking"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* <Dialog open={showAddToItineraryDialog} onOpenChange={setShowAddToItineraryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Itinerary</DialogTitle>
            <DialogDescription>Select an itinerary to add this room to</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {itineraries.length > 0 ? (
              <div className="space-y-4">
                {itineraries.map((itinerary) => (
                  <div
                    key={itinerary.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted ${
                      selectedItinerary?.id === itinerary.id ? "border-primary bg-primary/10" : ""
                    }`}
                    onClick={() => setSelectedItinerary(itinerary)}
                  >
                    <h3 className="font-medium">{itinerary.name}</h3>
                    {itinerary.startDate && itinerary.endDate && (
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(itinerary.startDate), "MMM d")} - {format(new Date(itinerary.endDate), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-4">You don't have any itineraries yet.</p>
                <Button asChild>
                  <Link to="/itineraries/new">Create an Itinerary</Link>
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
              disabled={processingItinerary}
            >
              Cancel
            </Button>
            <Button onClick={confirmAddToItinerary} disabled={!selectedItinerary || processingItinerary}>
              {processingItinerary ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Add to Itinerary"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}

function AvailabilityCalendar({ room }) {
  const [isOpen, setIsOpen] = useState(false)
  const startDate = new Date()

  // Generate dates for the next 60 days for display
  const dates = Array.from({ length: 60 }, (_, i) => addDays(startDate, i))

  return (
    <>
      <Button
        variant="ghost"
        className="h-auto p-0 text-sm text-muted-foreground hover:bg-transparent hover:underline"
        onClick={() => setIsOpen(true)}
      >
        <CalendarIcon className="mr-1 h-3 w-3" />
        {room.availableRoomsList == null ? "0" : room.availableRoomsList[0]} rooms available today
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Room Availability - {room.name}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-medium">Legend:</p>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 rounded bg-green-500"></span>
                  <span>Available (5+ rooms)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 rounded bg-yellow-500"></span>
                  <span>Limited (2-4 rooms)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 rounded bg-red-500"></span>
                  <span>Almost full (1 room)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 rounded bg-gray-300"></span>
                  <span>Sold out (0 rooms)</span>
                </div>
              </div>

              <div>
                <p className="mb-2 font-medium">Current selection:</p>
                <p>{room.name}</p>
                <p>Base price: ${room.basePrice}/night</p>
                <p>Maximum capacity: {room.roomCapacity} guests</p>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium">
                  {day}
                </div>
              ))}

              {/* First row offset for correct day alignment */}
              {Array.from({ length: dates[0].getDay() }, (_, i) => (
                <div key={`empty-${i}`} className="h-[70px]"></div>
              ))}

              {/* Calendar days */}
              {dates.map((date, i) => {
                const available = room.availableRoomsList?.[i] || 0;
                let bgColor = "bg-gray-300"; // Sold out

                if (available > 4) bgColor = "bg-green-500";
                else if (available > 1) bgColor = "bg-yellow-500";
                else if (available === 1) bgColor = "bg-red-500";

                return (
                  <div
                    key={date.toString()}
                    className="flex h-[70px] flex-col rounded border p-1"
                  >
                    <div className="text-xs">{format(date, 'MMM d')}</div>
                    <div className={`mt-1 flex flex-1 flex-col items-center justify-center rounded ${bgColor}`}>
                      <span className="font-bold text-white">{available}</span>
                      <span className="text-xs text-white">
                        {available === 1 ? 'room' : 'rooms'}
                      </span>
                    </div>
                    {room.price && (
                      <div className="mt-1 text-xs font-medium">${room.price[i]}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}