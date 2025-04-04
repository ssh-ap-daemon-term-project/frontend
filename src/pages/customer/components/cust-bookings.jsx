import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { CalendarIcon, MapPinIcon, UsersIcon, AlertTriangleIcon } from "lucide-react"
import { toast } from "react-toastify"

// Mock data for bookings
const mockBookings = [
  {
    id: 1,
    hotelId: 1,
    hotelName: "Grand Plaza Hotel",
    roomName: "Deluxe Room",
    city: "New York",
    startDate: new Date(2023, 7, 15),
    endDate: new Date(2023, 7, 18),
    guests: 2,
    totalPrice: 897,
    status: "upcoming",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 2,
    hotelId: 3,
    hotelName: "Mountain View Lodge",
    roomName: "Standard Room",
    city: "Denver",
    startDate: new Date(2023, 8, 10),
    endDate: new Date(2023, 8, 15),
    guests: 1,
    totalPrice: 895,
    status: "upcoming",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 3,
    hotelId: 2,
    hotelName: "Seaside Resort",
    roomName: "Executive Suite",
    city: "Miami",
    startDate: new Date(2023, 6, 5),
    endDate: new Date(2023, 6, 10),
    guests: 3,
    totalPrice: 1495,
    status: "completed",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 4,
    hotelId: 5,
    hotelName: "Harbor View Inn",
    roomName: "Standard Room",
    city: "San Francisco",
    startDate: new Date(2023, 5, 20),
    endDate: new Date(2023, 5, 25),
    guests: 2,
    totalPrice: 1295,
    status: "cancelled",
    image: "/placeholder.svg?height=300&width=500",
  },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState(mockBookings)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const upcomingBookings = bookings.filter((booking) => booking.status === "upcoming")
  const completedBookings = bookings.filter((booking) => booking.status === "completed")
  const cancelledBookings = bookings.filter((booking) => booking.status === "cancelled")

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking)
    setShowCancelDialog(true)
  }

  const confirmCancelBooking = () => {
    // In a real app, you would call an API to cancel the booking
    setBookings(
      bookings.map((booking) => (booking.id === selectedBooking.id ? { ...booking, status: "cancelled" } : booking)),
    )

    setShowCancelDialog(false)

    toast({
      title: "Booking Cancelled",
      description: `Your booking at ${selectedBooking.hotelName} has been cancelled.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">My Bookings</h1>

      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">
            Upcoming
            {upcomingBookings.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {upcomingBookings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            {completedBookings.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {completedBookings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled
            {cancelledBookings.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {cancelledBookings.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={() => handleCancelBooking(booking)}
                  showCancelButton={true}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming bookings"
              description="You don't have any upcoming bookings at the moment."
              actionText="Find Hotels"
              actionLink="/hotels"
            />
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedBookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} showReviewButton={true} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No completed bookings"
              description="You don't have any completed bookings yet."
              actionText="Find Hotels"
              actionLink="/hotels"
            />
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {cancelledBookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cancelledBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} showRebookButton={true} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No cancelled bookings"
              description="You don't have any cancelled bookings."
              actionText="Find Hotels"
              actionLink="/hotels"
            />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your booking at {selectedBooking?.hotelName}?
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="mt-2 rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">{selectedBooking.hotelName}</p>
              <p className="text-muted-foreground">{selectedBooking.roomName}</p>
              <p className="text-muted-foreground">
                {format(selectedBooking.startDate, "MMM d, yyyy")} - {format(selectedBooking.endDate, "MMM d, yyyy")}
              </p>
              <p className="text-muted-foreground">
                {selectedBooking.guests} {selectedBooking.guests === 1 ? "guest" : "guests"}
              </p>
            </div>
          )}

          <div className="mt-2 flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm dark:bg-amber-950">
            <AlertTriangleIcon className="mt-0.5 h-4 w-4 text-amber-500" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300">Cancellation Policy</p>
              <p className="text-amber-700 dark:text-amber-400">
                Free cancellation until 24 hours before check-in. After that, a cancellation fee may apply.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={confirmCancelBooking}>
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BookingCard({ booking, onCancel, showCancelButton, showReviewButton, showRebookButton }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <img src={booking.image || "/placeholder.svg"} alt={booking.hotelName} className="h-full w-full object-cover" />
        <div className="absolute right-2 top-2">
          <Badge
            className={`
              ${booking.status === "upcoming" ? "bg-green-500" : ""}
              ${booking.status === "completed" ? "bg-blue-500" : ""}
              ${booking.status === "cancelled" ? "bg-red-500" : ""}
            `}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold">{booking.hotelName}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPinIcon className="h-4 w-4" />
          <span>{booking.city}</span>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="font-medium">{booking.roomName}</p>

        <div className="mt-2 space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(booking.startDate, "MMM d, yyyy")} - {format(booking.endDate, "MMM d, yyyy")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
            </span>
          </div>
        </div>

        <div className="mt-3 text-right">
          <p className="text-sm text-muted-foreground">Total paid</p>
          <p className="text-lg font-bold">${booking.totalPrice}</p>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        {showCancelButton && (
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel Booking
          </Button>
        )}

        {showReviewButton && <Button className="flex-1">Write Review</Button>}

        {showRebookButton && <Button className="flex-1">Book Again</Button>}

        <Button variant="secondary" className="flex-1" asChild>
          <a href={`/hotels/${booking.hotelId}`}>View Hotel</a>
        </Button>
      </CardFooter>
    </Card>
  )
}

function EmptyState({ title, description, actionText, actionLink }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <CalendarIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="mb-6 text-muted-foreground">{description}</p>
      <Button asChild>
        <a href={actionLink}>{actionText}</a>
      </Button>
    </div>
  )
}

