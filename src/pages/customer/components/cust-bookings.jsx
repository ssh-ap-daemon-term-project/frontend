import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CalendarIcon, MapPinIcon, UsersIcon, AlertTriangleIcon, StarIcon } from "lucide-react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { getBookings, cancelBooking, postReview } from "@/api/customer"
import { HotelIcon } from "lucide-react"

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  // Review dialog state
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [bookingToReview, setBookingToReview] = useState(null)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const [hoverRating, setHoverRating] = useState(0)
  const [submittingReview, setSubmittingReview] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const response = await getBookings()

      // Convert date strings to Date objects
      const formattedBookings = response.data.map(booking => ({
        ...booking,
        startDate: new Date(booking.startDate),
        endDate: new Date(booking.endDate)
      }))
      console.log("Formatted Bookings:")
      setBookings(formattedBookings)
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
      toast.error("Failed to load bookings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const upcomingBookings = bookings.filter((booking) => booking.status === "upcoming")
  const completedBookings = bookings.filter((booking) => booking.status === "completed")

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking)
    setShowCancelDialog(true)
  }

  const confirmCancelBooking = async () => {
    try {
      setCancelling(true)
      await cancelBooking(selectedBooking.id)

      // Update local state
      setBookings(
        bookings.map((booking) =>
          booking.id === selectedBooking.id ? { ...booking, status: "cancelled" } : booking
        )
      )

      toast.success(`Your booking at ${selectedBooking.hotelName} has been cancelled.`)
      setShowCancelDialog(false)
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to cancel booking. Please try again.")
    } finally {
      setCancelling(false)
    }
  }

  // Handle opening the review dialog
  const handleOpenReviewDialog = (booking) => {
    setBookingToReview(booking)
    setReviewRating(0)
    setReviewComment("")
    setShowReviewDialog(true)
  }

  // Handle submitting the review
  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      toast.error("Please select a rating")
      return
    }

    try {
      setSubmittingReview(true)
      await postReview(bookingToReview.id, reviewRating, reviewComment)

      toast.success("Thank you for your review!")
      setShowReviewDialog(false)

      // Optionally mark the booking as reviewed in the UI
      // This depends on your backend implementation
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to submit review. Please try again.")
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading your bookings...</p>
        </div>
      </div>
    )
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
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={() => handleCancelBooking(booking)}
                  onReview={() => handleOpenReviewDialog(booking)}
                  showCancelButton={true}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming bookings"
              description="You don't have any upcoming bookings at the moment."
              actionText="Find Hotels"
              actionLink="/customer/hotels"
            />
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedBookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onReview={() => handleOpenReviewDialog(booking)}
                  showReviewButton={true}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No completed bookings"
              description="You don't have any completed bookings yet."
              actionText="Find Hotels"
              actionLink="/customer/hotels"
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Booking Dialog */}
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
            <Button variant="outline" onClick={() => setShowCancelDialog(false)} disabled={cancelling}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={confirmCancelBooking} disabled={cancelling}>
              {cancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience at {bookingToReview?.hotelName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <label className="block mb-3 font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <StarIcon
                      className={`h-8 w-8 ${(hoverRating || reviewRating) >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted"
                        }`}
                    />
                  </button>
                ))}
              </div>
              {reviewRating > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {reviewRating === 1 && "Poor - Not what I expected"}
                  {reviewRating === 2 && "Fair - Could have been better"}
                  {reviewRating === 3 && "Good - Met expectations"}
                  {reviewRating === 4 && "Very Good - Would recommend"}
                  {reviewRating === 5 && "Excellent - Exceeded expectations"}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="comment" className="block mb-2 font-medium">
                Your Review
              </label>
              <Textarea
                id="comment"
                placeholder="Tell us about your experience..."
                rows={5}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReviewDialog(false)}
              disabled={submittingReview}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={reviewRating === 0 || submittingReview}
            >
              {submittingReview ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BookingCard({ booking, onCancel, onReview, showCancelButton, showReviewButton, showRebookButton }) {
  const navigate = useNavigate()

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        {booking.image ? (
          <img
            src={booking.image}
            alt={booking.hotelName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 dark:bg-slate-800">
            <HotelIcon className="h-12 w-12 text-slate-400 dark:text-slate-500" />
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No image available</p>
          </div>
        )}
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
        {showCancelButton && booking.status === "upcoming" && (
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel Booking
          </Button>
        )}

        {showReviewButton && booking.status === "completed" && (
          <Button className="flex-1" onClick={onReview}>
            Write Review
          </Button>
        )}

        {showRebookButton && (
          <Button className="flex-1" onClick={() => navigate(`/customer/hotels/${booking.hotelId}`)}>
            Book Again
          </Button>
        )}

        <Button variant="secondary" className="flex-1" onClick={() => navigate(`/customer/hotels/${booking.hotelId}`)}>
          View Hotel
        </Button>
      </CardFooter>
    </Card>
  )
}

function EmptyState({ title, description, actionText, actionLink }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <CalendarIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="mb-6 text-muted-foreground">{description}</p>
      <Button onClick={() => navigate(actionLink)}>
        {actionText}
      </Button>
    </div>
  )
}