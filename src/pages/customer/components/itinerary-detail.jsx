"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { format, isToday, isTomorrow, isYesterday, addDays } from "date-fns"
import { toast } from "react-toastify"
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  PlusIcon,
  BedDoubleIcon,
  CalendarDaysIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  UsersIcon,
  CarIcon,
  CheckIcon,
  StarIcon,
  CreditCardIcon,
  DollarSignIcon,
  Hotel,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Import API functions
import {
  getItineraryById,
  updateItinerary,
  addScheduleItem,
  updateScheduleItem,
  deleteScheduleItem,
  addRoomToItinerary,
  updateRoomDates,
  removeRoomFromItinerary,
  bookRide,
  updateRideBooking,
  cancelRide,
  toggleDriverService,
  getAvailableRooms,
  submitHotelReview,
} from "../../../api/itineraryApi"

import { bookRoom } from "../../../api/customer"

export default function ItineraryDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const itineraryId = Number.parseInt(id)

  // State for itinerary data
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [availableRooms, setAvailableRooms] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(false)

  // Dialog states
  const [showAddRoomDialog, setShowAddRoomDialog] = useState(false)
  const [showAddActivityDialog, setShowAddActivityDialog] = useState(false)
  const [showEditActivityDialog, setShowEditActivityDialog] = useState(false)
  const [showEditRoomDialog, setShowEditRoomDialog] = useState(false)
  const [showAddRideDialog, setShowAddRideDialog] = useState(false)
  const [showEditRideDialog, setShowEditRideDialog] = useState(false)
  const [showDriverServiceDialog, setShowDriverServiceDialog] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)

  // Selected item states
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedRoomItem, setSelectedRoomItem] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [selectedRide, setSelectedRide] = useState(null)
  const [selectedReviewType, setSelectedReviewType] = useState(null)
  const [currentPaymentIndex, setCurrentPaymentIndex] = useState(0)

  // tab state
  const [activeTab, setActiveTab] = useState("schedule")

  // Form states
  const [roomBookingDates, setRoomBookingDates] = useState({
    from: null,
    to: null,
  })

  const [activityForm, setActivityForm] = useState({
    description: "",
    location: "",
    startDateTime: "",
    endDateTime: "",
  })

  const [rideForm, setRideForm] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDateTime: "",
  })

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  })

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const fetchItinerary = async () => {
    try {
      setLoading(true)
      const response = await getItineraryById(itineraryId)
      console.log("Itinerary response:", response.data)
      console.log("Ride Bookings:", response.data.rideBookings)
      setItinerary(response.data)
      setLoading(false)
    } catch (err) {
      setError("Failed to load itinerary details")
      setLoading(false)
      toast.error("Failed to load itinerary details")
      console.error(err)
    }
  }

  // Fetch itinerary data
  useEffect(() => {

    if (itineraryId) {
      fetchItinerary()
    }
  }, [itineraryId])

  // Fetch available rooms when adding a room
  const fetchAvailableRooms = async (startDate, endDate, city, guests) => {
    try {
      setLoadingRooms(true)
      const response = await getAvailableRooms(
        startDate ? format(startDate, "yyyy-MM-dd") : null,
        endDate ? format(endDate, "yyyy-MM-dd") : null,
        city,
        guests,
      )
      setAvailableRooms(response.data)
      setLoadingRooms(false)
    } catch (err) {
      toast.error("Failed to load available rooms")
      setLoadingRooms(false)
      console.error(err)
    }
  }

  // Calculate total accommodation price
  const calculateTotalAccommodationPrice = () => {
    if (!itinerary || !itinerary.roomItems || itinerary.roomItems.length === 0) return 0

    return itinerary.roomItems.reduce((total, roomItem) => {
      // Access basePrice from the nested room object
      const basePrice = roomItem.room?.basePrice || 0

      const startDate = new Date(roomItem.startDate)
      const endDate = new Date(roomItem.endDate)

      // Calculate number of nights (not days)
      // End date - start date gives milliseconds, divide by ms in a day
      const nights = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)))

      // Calculate cost for this room
      const roomCost = basePrice * nights

      return total + roomCost
    }, 0)
  }

  // Calculate price for a specific room
  const calculateRoomPrice = (room) => {
    const startDate = new Date(room.startDate)
    const endDate = new Date(room.endDate)
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    return room.room.basePrice * days
  }

  // Handle adding a room
  const handleAddRoom = (room) => {
    setSelectedRoom(room)
    setRoomBookingDates({
      from: itinerary?.startDate ? new Date(itinerary.startDate) : new Date(),
      to: itinerary?.startDate ? addDays(new Date(itinerary.startDate), 3) : addDays(new Date(), 3),
    })
  }

  const confirmAddRoom = async () => {
    try {
      const roomData = {
        roomId: selectedRoom.id,
        startDate: format(roomBookingDates.from, "yyyy-MM-dd"),
        endDate: format(roomBookingDates.to, "yyyy-MM-dd"),
      }

      const response = await addRoomToItinerary(itineraryId, roomData)

      // Update the itinerary state with the new room
      // setItinerary({
      //   ...itinerary,
      //   roomItems: [...itinerary.roomItems, response.data],
      //   destinations: [...new Set([...itinerary.destinations, selectedRoom.city])],
      // })

      fetchItinerary()
      // set the tab to accommodations
      setActiveTab("accommodations")

      setShowAddRoomDialog(false)
      setSelectedRoom(null)

      toast.success(`${selectedRoom.type} at ${selectedRoom.hotelName} has been added to your itinerary.`)
    } catch (err) {
      toast.error("Failed to add room to itinerary")
      console.error(err)
    }
  }

  // Handle editing a room booking
  const handleEditRoom = (roomItem) => {
    setSelectedRoomItem(roomItem)
    setRoomBookingDates({
      from: new Date(roomItem.startDate),
      to: new Date(roomItem.endDate),
    })
    setShowEditRoomDialog(true)
  }

  const confirmEditRoom = async () => {
    try {
      const roomData = {
        startDate: format(roomBookingDates.from, "yyyy-MM-dd"),
        endDate: format(roomBookingDates.to, "yyyy-MM-dd"),
      }

      const response = await updateRoomDates(itineraryId, selectedRoomItem.id, roomData)

      fetchItinerary()
      setActiveTab("accommodations")

      // Update the itinerary state with the updated room
      const updatedRoomItems = itinerary.roomItems.map((item) =>
        item.id === selectedRoomItem.id ? response.data : item,
      )

      setItinerary({
        ...itinerary,
        roomItems: updatedRoomItems,
      })

      setShowEditRoomDialog(false)
      setSelectedRoomItem(null)

      toast.success(`Your booking for ${response.data.roomName} has been updated.`)
    } catch (err) {
      toast.error("Failed to update room booking")
      console.error(err)
    }
  }

  // Handle removing a room
  const handleRemoveRoom = async (roomItemId) => {
    try {
      await removeRoomFromItinerary(itineraryId, roomItemId)

      const updatedRoomItems = itinerary.roomItems.filter((item) => item.id !== roomItemId)

      // Recalculate destinations based on remaining rooms
      const destinations = [...new Set(updatedRoomItems.map((item) => item.city))]

      setItinerary({
        ...itinerary,
        roomItems: updatedRoomItems,
        destinations,
      })

      toast.success("The room has been removed from your itinerary.")
    } catch (err) {
      toast.error("Failed to remove room from itinerary")
      console.error(err)
    }
  }

  // Handle adding an activity
  const handleAddActivity = async (e) => {
    e.preventDefault()

    try {
      const activityData = {
        startTime: new Date(activityForm.startDateTime).toISOString(),
        endTime: new Date(activityForm.endDateTime).toISOString(),
        location: activityForm.location,
        description: activityForm.description,
      }

      const response = await addScheduleItem(itineraryId, activityData)

      setItinerary({
        ...itinerary,
        scheduleItems: [...itinerary.scheduleItems, response.data],
      })

      setShowAddActivityDialog(false)
      setActivityForm({
        description: "",
        location: "",
        startDateTime: "",
        endDateTime: "",
      })

      toast.success(`${activityForm.description} has been added to your itinerary.`)
    } catch (err) {
      toast.error("Failed to add activity to itinerary")
      console.error(err)
    }
  }

  // Handle editing an activity
  const handleEditActivity = (activity) => {
    setSelectedActivity(activity)
    setActivityForm({
      description: activity.description,
      location: activity.location,
      startDateTime: format(new Date(activity.startTime), "yyyy-MM-dd'T'HH:mm"),
      endDateTime: format(new Date(activity.endTime), "yyyy-MM-dd'T'HH:mm"),
    })
    setShowEditActivityDialog(true)
  }

  const confirmEditActivity = async (e) => {
    e.preventDefault()

    try {
      const activityData = {
        description: activityForm.description,
        location: activityForm.location,
        startTime: new Date(activityForm.startDateTime).toISOString(),
        endTime: new Date(activityForm.endDateTime).toISOString(),
      }

      const response = await updateScheduleItem(itineraryId, selectedActivity.id, activityData)

      const updatedScheduleItems = itinerary.scheduleItems.map((item) =>
        item.id === selectedActivity.id ? response.data : item,
      )

      setItinerary({
        ...itinerary,
        scheduleItems: updatedScheduleItems,
      })

      setShowEditActivityDialog(false)
      setSelectedActivity(null)
      setActivityForm({
        description: "",
        location: "",
        startDateTime: "",
        endDateTime: "",
      })

      toast.success("Your activity has been updated successfully.")
    } catch (err) {
      toast.error("Failed to update activity")
      console.error(err)
    }
  }

  // Handle removing an activity
  const handleRemoveActivity = async (activityId) => {
    try {
      await deleteScheduleItem(itineraryId, activityId)

      setItinerary({
        ...itinerary,
        scheduleItems: itinerary.scheduleItems.filter((item) => item.id !== activityId),
      })

      toast.success("The activity has been removed from your itinerary.")
    } catch (err) {
      toast.error("Failed to remove activity from itinerary")
      console.error(err)
    }
  }

  /**
 * Books a room from an itinerary item
 * @param {number} roomItemId - The ID of the room item in the itinerary
 * @param {number} numberOfPersons - Number of persons staying in the room
 * @param {number} customerId - The customer's ID
 * @returns {Promise} - Promise with booking details or error
 */
  async function handleBookRoom(room) {
    try {
      // Extract parameters from the room object and itinerary
      const roomItemId = room.id;
      const numberOfPersons = itinerary.numberOfPersons;
      const customerId = itinerary.customerId;

      // Call the API function
      const response = await bookRoom(roomItemId, numberOfPersons, customerId);

      // Handle successful response
      toast.success('Room booked successfully');

      // Refresh the itinerary to get the updated booking status
      fetchItinerary();

      return response.data;
    } catch (error) {
      // Handle error properly
      const errorMessage = error.response?.data?.detail || 'Failed to book room';
      toast.error(errorMessage);
      console.error('Error booking room:', error);
      throw error;
    }
  }

  // Handle adding a ride
  const handleAddRide = async (e) => {
    e.preventDefault()

    try {
      const rideData = {
        pickupLocation: rideForm.pickupLocation,
        dropoffLocation: rideForm.dropoffLocation,
        pickupDateTime: new Date(rideForm.pickupDateTime).toISOString(),
        numberOfPersons: itinerary.numberOfPersons,
      }

      const response = await bookRide(itineraryId, rideData)

      setItinerary({
        ...itinerary,
        rideBookings: [...(itinerary.rideBookings || []), response.data],
      });

      setShowAddRideDialog(false);
      setRideForm({
        pickupLocation: "",
        dropoffLocation: "",
        pickupDateTime: "",
      });

      toast.success(`Your ride has been booked successfully.`)
    } catch (err) {
      toast.error("Failed to book ride")
      console.error(err)
    }
  }

  // Handle editing a ride
  const handleEditRide = (ride) => {
    setSelectedRide(ride)
    setRideForm({
      type: ride.type,
      pickupLocation: ride.pickupLocation,
      dropoffLocation: ride.dropoffLocation,
      pickupDateTime: format(new Date(ride.pickupDateTime), "yyyy-MM-dd'T'HH:mm"),
      withDriverService: ride.withDriverService,
    })
    setShowEditRideDialog(true)
  }

  const confirmEditRide = async (e) => {
    e.preventDefault()

    try {
      const rideData = {
        type: rideForm.type,
        pickupLocation: rideForm.pickupLocation,
        dropoffLocation: rideForm.dropoffLocation,
        pickupDateTime: new Date(rideForm.pickupDateTime).toISOString(),
        withDriverService: rideForm.withDriverService,
      }

      const response = await updateRideBooking(itineraryId, selectedRide.id, rideData)

      const updatedRideBookings = itinerary.rideBookings.map((ride) =>
        ride.id === selectedRide.id ? response.data : ride,
      )

      setItinerary({
        ...itinerary,
        rideBookings: updatedRideBookings,
      })

      setShowEditRideDialog(false)
      setSelectedRide(null)
      setRideForm({
        type: "taxi",
        pickupLocation: "",
        dropoffLocation: "",
        pickupDateTime: "",
        withDriverService: false,
      })

      toast.success("Your ride booking has been updated successfully.")
    } catch (err) {
      toast.error("Failed to update ride booking")
      console.error(err)
    }
  }

  // Handle canceling a ride
  const handleCancelRide = async (rideId) => {
    try {
      await cancelRide(itineraryId, rideId)

      // In this case, we're not removing the ride from the list, just updating its status
      const updatedRideBookings = itinerary.rideBookings.map((ride) =>
        ride.id === rideId ? { ...ride, status: "cancelled" } : ride,
      )

      setItinerary({
        ...itinerary,
        rideBookings: updatedRideBookings,
      })

      toast.success("Your ride has been cancelled successfully.")
    } catch (err) {
      toast.error("Failed to cancel ride")
      console.error(err)
    }
  }

  // Handle driver service confirmation
  const toggleDriverServiceHandler = async () => {
    try {
      const response = await toggleDriverService(itineraryId, !itinerary.driverServiceRequested)

      setItinerary({
        ...itinerary,
        driverServiceRequested: !itinerary.driverServiceRequested,
      })

      setShowDriverServiceDialog(false)

      toast.success(
        itinerary.driverServiceRequested
          ? "Driver service has been removed from your itinerary."
          : "Driver service has been added to your itinerary.",
      )
    } catch (err) {
      toast.error("Failed to update driver service")
      console.error(err)
    }
  }

  // Handle submitting a review
  const handleOpenReviewDialog = (type) => {
    setSelectedReviewType(type)
    setReviewForm({
      rating: 5,
      comment: "",
    })
    setShowReviewDialog(true)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    try {
      // For hotel/room reviews
      if (selectedReviewType.startsWith("room-")) {
        const roomId = Number.parseInt(selectedReviewType.split("-")[1])
        const roomItem = itinerary.roomItems.find((room) => room.id === roomId)

        if (roomItem) {
          const reviewData = {
            hotelId: roomItem.hotelId,
            rating: reviewForm.rating,
            description: reviewForm.comment,
          }

          await submitHotelReview(reviewData)
        }
      }

      // If it's a ride review, mark the ride as reviewed
      if (selectedReviewType.startsWith("ride-")) {
        const rideId = Number.parseInt(selectedReviewType.split("-")[1])
        const updatedRideBookings = itinerary.rideBookings.map((ride) =>
          ride.id === rideId ? { ...ride, isReviewed: true } : ride,
        )

        setItinerary({
          ...itinerary,
          rideBookings: updatedRideBookings,
        })
      }

      toast.success("Your review has been submitted successfully.")

      setShowReviewDialog(false)
      setSelectedReviewType(null)
      setReviewForm({
        rating: 5,
        comment: "",
      })
    } catch (err) {
      toast.error("Failed to submit review")
      console.error(err)
    }
  }

  // Handle accepting itinerary
  const handleAcceptItinerary = () => {
    setShowAcceptDialog(true)
  }

  const confirmAcceptItinerary = () => {
    setShowAcceptDialog(false)

    // Start payment process
    if (itinerary.roomItems.length > 0) {
      setCurrentPaymentIndex(0)
      setShowPaymentDialog(true)
    } else {
      completeAcceptance()
    }
  }

  const handlePayment = async (e) => {
    e.preventDefault()

    try {
      // In a real app, you would process the payment here
      // For now, we'll just mark the room as paid

      // Mark the current room as paid
      const updatedRoomItems = [...itinerary.roomItems]
      updatedRoomItems[currentPaymentIndex].isPaid = true

      setItinerary({
        ...itinerary,
        roomItems: updatedRoomItems,
      })

      // Check if there are more rooms to pay for
      if (currentPaymentIndex < itinerary.roomItems.length - 1) {
        setCurrentPaymentIndex(currentPaymentIndex + 1)

        // Reset payment form for next room
        setPaymentDetails({
          cardNumber: "",
          cardName: "",
          expiryDate: "",
          cvv: "",
        })

        toast.success(
          `Payment for ${itinerary.roomItems[currentPaymentIndex].roomName} at ${itinerary.roomItems[currentPaymentIndex].hotelName} was successful.`,
        )
      } else {
        // All rooms paid, complete acceptance
        setShowPaymentDialog(false)
        completeAcceptance()
      }
    } catch (err) {
      toast.error("Payment failed")
      console.error(err)
    }
  }

  const completeAcceptance = async () => {
    try {
      // Update itinerary status to accepted
      const response = await updateItinerary(itineraryId, { status: "accepted" })

      setItinerary({
        ...itinerary,
        status: "accepted",
      })

      toast.success("Your itinerary has been accepted and all payments have been processed.")
    } catch (err) {
      toast.error("Failed to update itinerary status")
      console.error(err)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading itinerary details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !itinerary) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Itinerary</h2>
          <p className="mb-4">{error || "Itinerary not found"}</p>
          <Button asChild>
            <Link to="/customer">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Group schedule items by date
  const scheduleByDate = itinerary.scheduleItems?.reduce((acc, item) => {
    const date = new Date(item.startTime)
    date.setHours(0, 0, 0, 0)

    const dateKey = date.toISOString()
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }

    acc[dateKey].push(item)
    return acc
  }, {})

  // Sort dates
  const sortedDates = scheduleByDate && Object.keys(scheduleByDate).sort()

  // Format date for display
  const formatDateHeading = (dateStr) => {
    const date = new Date(dateStr)

    if (isToday(date)) {
      return "Today"
    } else if (isTomorrow(date)) {
      return "Tomorrow"
    } else if (isYesterday(date)) {
      return "Yesterday"
    }

    return format(date, "EEEE, MMMM d, yyyy")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" className="mb-2 gap-2" asChild>
          <Link to="/customer">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">{itinerary.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {itinerary.numberOfPersons} {itinerary.numberOfPersons === 1 ? "traveler" : "travelers"}
                </span>
              </div>

              {itinerary.startDate && itinerary.endDate && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {format(new Date(itinerary.startDate), "MMM d")} -{" "}
                    {format(new Date(itinerary.endDate), "MMM d, yyyy")}
                  </span>
                </div>
              )}

              <Badge
                className={`
                  ${itinerary.status === "upcoming" ? "bg-blue-500" : ""}
                  ${itinerary.status === "ongoing" ? "bg-green-500" : ""}
                  ${itinerary.status === "completed" ? "bg-gray-500" : ""}
                  ${itinerary.status === "accepted" ? "bg-purple-500" : ""}
                `}
              >
                {itinerary?.status?.charAt(0).toUpperCase() + itinerary?.status?.slice(1)}
              </Badge>

              {itinerary.driverServiceRequested && (
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                  Driver Service
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {itinerary.status === "upcoming" && (
              <Button onClick={handleAcceptItinerary} className="gap-2">
                <CheckIcon className="h-4 w-4" />
                Accept Itinerary
              </Button>
            )}

            <Button variant="outline" onClick={() => setShowDriverServiceDialog(true)} className="gap-2">
              <CarIcon className="h-4 w-4" />
              {itinerary.driverServiceRequested ? "Remove Driver Service" : "Add Driver Service"}
            </Button>

            <Button variant="outline" asChild>
              <Link to={`/itineraries/${itinerary.id}/edit`}>
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Itinerary
              </Link>
            </Button>

            {itinerary.status === "completed" && (
              <Button variant="outline" className="gap-2" onClick={() => handleOpenReviewDialog("itinerary")}>
                <StarIcon className="h-4 w-4" />
                Review
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {itinerary.destinations &&
          itinerary.destinations.map((destination) => (
            <Badge key={destination} variant="secondary" className="text-sm">
              {destination}
            </Badge>
          ))}
      </div>

      <Tabs defaultValue="schedule" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
          <TabsTrigger value="transportation">Transportation</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <div className="mb-4 flex justify-between">
            <h2 className="text-xl font-bold">Itinerary Schedule</h2>
            <Button
              onClick={() => {
                setActivityForm({
                  description: "",
                  location: "",
                  startDateTime: "",
                  endDateTime: "",
                })
                setShowAddActivityDialog(true)
              }}
              className="gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Activity
            </Button>
          </div>

          {sortedDates?.length > 0 ? (
            <div className="space-y-6">
              {sortedDates?.map((dateKey) => (
                <div key={dateKey}>
                  <h3 className="mb-4 text-lg font-semibold">{formatDateHeading(dateKey)}</h3>

                  <div className="space-y-4">
                    {scheduleByDate && scheduleByDate[dateKey]
                      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                      .map((activity) => (
                        <Card key={activity.id}>
                          <CardContent className="p-4">
                            <div className="flex flex-col justify-between gap-4 md:flex-row">
                              <div>
                                <div className="mb-2 flex items-center gap-2">
                                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                  <div className="activity-time">
                                    <div className="time-range">
                                      {format(new Date(activity.startTime), "h:mm a")} - {format(new Date(activity.endTime), "h:mm a")}
                                    </div>
                                    <div className="date-display text-sm text-gray-500">
                                      {format(new Date(activity.startTime), "MMM d, yyyy")} - {format(new Date(activity.endTime), "MMM d, yyyy")}
                                    </div>
                                  </div>
                                </div>

                                <h4 className="font-medium">{activity.description}</h4>

                                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPinIcon className="h-4 w-4" />
                                  <span>{activity.location}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditActivity(activity)}>
                                  <PencilIcon className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveActivity(activity.id)}>
                                  <TrashIcon className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="mb-4 rounded-full bg-muted p-3">
                <CalendarDaysIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-medium">No activities yet</h3>
              <p className="mb-6 text-muted-foreground">Start adding activities to build your itinerary schedule.</p>
              <Button onClick={() => setShowAddActivityDialog(true)}>Add First Activity</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="accommodations">
          <div className="mb-4 flex justify-between">
            <div>
              <h2 className="text-xl font-bold">Accommodations</h2>
              <p className="text-muted-foreground">Total estimated price: ${calculateTotalAccommodationPrice()}</p>
            </div>
            <Button
              onClick={() => {
                setShowAddRoomDialog(true)
                // Fetch available rooms when opening the dialog
                // itinerary start date is the min of the all schedule items start dates and itinerary end date is the max of the all schedule items end dates
                const startDate = itinerary.scheduleItems.reduce((min, item) => {
                  const itemStartDate = new Date(item.startTime)
                  return itemStartDate < min ? itemStartDate : min
                }, new Date(itinerary.scheduleItems[0].startTime))
                const endDate = itinerary.scheduleItems.reduce((max, item) => {
                  const itemEndDate = new Date(item.endTime)
                  return itemEndDate > max ? itemEndDate : max
                }, new Date(itinerary.scheduleItems[0].endTime))
                fetchAvailableRooms(
                  startDate,
                  endDate,
                  null,
                  itinerary.numberOfPersons,
                )
              }}
              className="gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Room
            </Button>
          </div>

          {itinerary.roomItems && itinerary.roomItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {itinerary.roomItems.map((room) => (
                <Card key={room.id} className="overflow-hidden">
                  <div className="relative h-48">
                    {room.image ? (
                      <img
                        src={room.image}
                        alt={`${room.type} room`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite error loop
                          e.target.style.display = "none";
                          e.target.parentNode.classList.add("flex", "items-center", "justify-center");
                          const fallbackIcon = document.createElement("div");
                          fallbackIcon.innerHTML = `<div class="flex items-center justify-center h-full w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
                <path d="M2 22v-5l5-5 5 5-5 5z"/>
                <path d="M9.5 14.5 16 8"/>
                <path d="M17 2v5h5"/>
                <path d="M22 7-8.5 15.5"/>
                <path d="M14 22v-4h-4v4"/>
                <path d="M18 22V9"/>
              </svg>
            </div>`;
                          e.target.parentNode.appendChild(fallbackIcon);
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full">
                        <Hotel className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    {room.isPaid ? (
                      <div className="absolute right-2 top-2">
                        <Badge className="bg-green-500">Booked</Badge>
                      </div>
                    ) :
                      <div className="absolute right-2 top-2">
                        <Badge className="bg-red-500">Not Booked</Badge>
                      </div>
                    }
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold">{room.room.hotel.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {room.room.hotel.name}, {room.room.hotel.city}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditRoom(room)} disabled={room.isPaid}>
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveRoom(room.id)}
                          disabled={room.isPaid}
                        >
                          <TrashIcon className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(room.startDate), "MMM d")} - {format(new Date(room.endDate), "MMM d, yyyy")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        <span>Capacity: {room.room.roomCapacity} guests</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                        <span>
                          ${room.room.basePrice}/night (Total: ${calculateRoomPrice(room)})
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex justify-between">
                      {itinerary.status === "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleOpenReviewDialog(`room-${room.id}`)}
                        >
                          <StarIcon className="h-4 w-4" />
                          Review
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/hotels/${room.roomId}`}>View Hotel</Link>
                      </Button>
                      <Button size="sm" onClick={() => handleBookRoom(room)} disabled={room.isPaid}>
                        Book Room
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="mb-4 rounded-full bg-muted p-3">
                <BedDoubleIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-medium">No accommodations yet</h3>
              <p className="mb-6 text-muted-foreground">
                Add rooms to your itinerary to keep track of your accommodations.
              </p>
              <Button onClick={() => setShowAddRoomDialog(true)}>Add First Room</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="transportation">
          <div className="mb-4 flex justify-between">
            <h2 className="text-xl font-bold">Transportation</h2>
            <Button
              variant="destructive"
              onClick={() => {
                // Find the first ride that can be cancelled (not completed)
                const cancelableRide = itinerary.rideBookings.find(
                  ride => ride.status !== "completed" && ride.status !== "cancelled"
                );
                if (cancelableRide) {
                  handleCancelRide(cancelableRide.id);
                } else {
                  toast.info("No active rides to cancel");
                }
              }}
              className="gap-2"
            >
              <TrashIcon className="h-4 w-4" />
              Cancel Ride
            </Button>
          </div>

          {itinerary.rideBookings && itinerary.rideBookings.length > 0 ? (
            <div className="space-y-4">
              {itinerary.rideBookings.map((ride) => (
                <Card key={ride.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant={ride.status === "confirmed" ? "default" : "destructive"}>
                            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                          </Badge>

                        </div>

                        <h4 className="font-medium">{format(new Date(ride.pickupDateTime), "MMM d, yyyy h:mm a")}</h4>

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

                        {ride.status === "confirmed" && ride.driverName !== "Pending..." && (
                          <div className="mt-3 rounded-md bg-muted p-2 text-sm">
                            <p className="font-medium">Driver: {ride.driverName}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <div className="flex gap-1">
                          {ride.status === "confirmed" && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => handleEditRide(ride)}>
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleCancelRide(ride.id)}>
                                <TrashIcon className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}

                          {itinerary.status === "completed" && ride.status !== "cancelled" && !ride.isReviewed && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenReviewDialog(`ride-${ride.id}`)}
                            >
                              <StarIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

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
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="mb-4 rounded-full bg-muted p-3">
                <CarIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-medium">No rides booked</h3>
              <p className="mb-6 text-muted-foreground">Book rides to get around during your trip.</p>
              <Button onClick={() => setShowAddRideDialog(true)}>Book First Ride</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Reviews</h2>
            <p className="text-muted-foreground">View and manage reviews for your itinerary experiences.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold">Your Reviews</h3>
              </CardHeader>
              <CardContent>
                {itinerary.status === "completed" ? (
                  <div className="space-y-4">
                    <div className="flex justify-between rounded-lg border p-4">
                      <div>
                        <h4 className="font-medium">Itinerary Experience</h4>
                        <p className="text-sm text-muted-foreground">
                          Rate your overall experience with this itinerary
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleOpenReviewDialog("itinerary")}>
                        Write Review
                      </Button>
                    </div>

                    {itinerary.roomItems &&
                      itinerary.roomItems.map((room) => (
                        <div key={room.id} className="flex justify-between rounded-lg border p-4">
                          <div>
                            <h4 className="font-medium">{room.roomName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {room.hotelName}, {room.city}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleOpenReviewDialog(`room-${room.id}`)}>
                            Write Review
                          </Button>
                        </div>
                      ))}

                    {itinerary.rideBookings &&
                      itinerary.rideBookings
                        .filter((ride) => ride.status !== "cancelled" && !ride.isReviewed)
                        .map((ride) => (
                          <div key={ride.id} className="flex justify-between rounded-lg border p-4">
                            <div>
                              <h4 className="font-medium">Ride Service</h4>
                              <p className="text-sm text-muted-foreground">
                                {ride.type.charAt(0).toUpperCase() + ride.type.slice(1)} -{" "}
                                {format(new Date(ride.pickupDateTime), "MMM d, yyyy")}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenReviewDialog(`ride-${ride.id}`)}
                            >
                              Write Review
                            </Button>
                          </div>
                        ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                    <StarIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                    <h4 className="text-lg font-medium">No reviews available</h4>
                    <p className="text-sm text-muted-foreground">
                      You can write reviews after your itinerary is completed.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold">Public Reviews</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {itinerary.roomItems && itinerary.roomItems.length > 0 ? (
                    itinerary.roomItems.map((room) => (
                      <Accordion key={room.id} type="single" collapsible className="border rounded-lg">
                        <AccordionItem value="reviews">
                          <AccordionTrigger className="px-4">
                            <div className="flex items-center gap-2">
                              <span>
                                {room.hotelName} - {room.roomName}
                              </span>
                              <Badge variant="outline">4.7 ★</Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-3">
                              <div className="rounded-md bg-muted p-3">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">Sarah J.</p>
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <StarIcon
                                        key={star}
                                        className={`h-4 w-4 ${star <= 5 ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="mt-1 text-sm">
                                  Excellent room with amazing views. The staff was very friendly and accommodating.
                                </p>
                              </div>

                              <div className="rounded-md bg-muted p-3">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">Michael T.</p>
                                  <div className="flex">
                                    {[1, 2, 3, 4].map((star) => (
                                      <StarIcon
                                        key={star}
                                        className={`h-4 w-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="mt-1 text-sm">
                                  Great location and comfortable room. The breakfast could be improved.
                                </p>
                              </div>

                              <Button variant="outline" size="sm" className="w-full" asChild>
                                <Link to={`/hotels/${room.roomId}?tab=reviews`}>View All Reviews</Link>
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                      <StarIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                      <h4 className="text-lg font-medium">No reviews to display</h4>
                      <p className="text-sm text-muted-foreground">Add rooms to your itinerary to see their reviews.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Room Dialog */}
      <Dialog open={showAddRoomDialog} onOpenChange={setShowAddRoomDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Room to Itinerary</DialogTitle>
            <DialogDescription>Select a room to add to your itinerary</DialogDescription>
          </DialogHeader>

          {selectedRoom ? (
            <div className="py-4">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-md">
                  <img
                    src={selectedRoom.image || "/placeholder.svg"}
                    alt={selectedRoom.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedRoom.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedRoom.hotelName}, {selectedRoom.city}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Select Dates</label>
                <div className="rounded-md border p-4">
                  <div className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm text-muted-foreground">Check-in</label>
                        <input
                          type="date"
                          className="mt-1 w-full rounded-md border p-2"
                          value={roomBookingDates.from ? format(roomBookingDates.from, "yyyy-MM-dd") : ""}
                          onChange={(e) =>
                            setRoomBookingDates({
                              ...roomBookingDates,
                              from: e.target.value ? new Date(e.target.value) : null,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Check-out</label>
                        <input
                          type="date"
                          className="mt-1 w-full rounded-md border p-2"
                          value={roomBookingDates.to ? format(roomBookingDates.to, "yyyy-MM-dd") : ""}
                          onChange={(e) =>
                            setRoomBookingDates({
                              ...roomBookingDates,
                              to: e.target.value ? new Date(e.target.value) : null,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 rounded-md bg-muted p-3">
                <div className="flex justify-between">
                  <span>Price per night:</span>
                  <span>${selectedRoom.basePrice}</span>
                </div>
                {roomBookingDates.from && roomBookingDates.to && (
                  <>
                    <div className="flex justify-between">
                      <span>Number of nights:</span>
                      <span>{Math.ceil((roomBookingDates.to - roomBookingDates.from) / (1000 * 60 * 60 * 24))}</span>
                    </div>
                    <div className="mt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>
                        $
                        {selectedRoom.basePrice *
                          Math.ceil((roomBookingDates.to - roomBookingDates.from) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedRoom(null)}>
                  Back to Rooms
                </Button>
                <Button onClick={confirmAddRoom} disabled={!roomBookingDates.from || !roomBookingDates.to}>
                  Add to Itinerary
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
              {loadingRooms ? (
                <div className="col-span-2 flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : availableRooms.length > 0 ? (
                availableRooms.map((room) => (
                  <Card key={room.id} className="cursor-pointer overflow-hidden" onClick={() => handleAddRoom(room)}>
                    <div className="grid grid-cols-3">
                      <div className="h-full">
                        <img
                          src={room.image || "/placeholder.svg"}
                          alt={room.type}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="col-span-2 p-4">
                        <h3 className="font-bold">{room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room</h3>
                        <p className="text-sm text-muted-foreground">
                          {room.hotelName}, {room.city}
                        </p>
                        <div className="mt-2 space-y-1 text-sm">
                          <p>Capacity: {room.roomCapacity} guests</p>
                          <p>${room.basePrice}/night</p>

                          {/* Availability calendar section */}
                          <div className="mt-3">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Room availability:</p>
                            <div className="border rounded overflow-hidden">
                              <div className="grid grid-cols-7 bg-muted text-xs font-medium p-1">
                                <div className="text-center">S</div>
                                <div className="text-center">M</div>
                                <div className="text-center">T</div>
                                <div className="text-center">W</div>
                                <div className="text-center">T</div>
                                <div className="text-center">F</div>
                                <div className="text-center">S</div>
                              </div>
                              <div className="grid grid-cols-7 gap-1 p-1 max-h-28 overflow-y-auto">
                                {room.availableRoomsList && room.availableRoomsList.map((count, index) => (
                                  <div
                                    key={index}
                                    className={`aspect-square flex items-center justify-center text-xs font-medium rounded
                                      ${count > 0
                                        ? count > room.totalNumber / 2
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-amber-100 text-amber-800'
                                        : 'bg-red-100 text-red-800'
                                      }`}
                                    title={`${format(addDays(new Date(itinerary.startDate), index), "MMM d")}\nDay ${index + 1}: ${count} rooms available`}
                                  >
                                    {count}
                                  </div>
                                ))}
                              </div>
                            </div>
                            {room.availableRoomsList && room.availableRoomsList.length > 0 && (
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-green-100"></div>
                                  <span>Good</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-amber-100"></div>
                                  <span>Limited</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-red-100"></div>
                                  <span>Unavailable</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center">
                  <p className="mb-2 text-lg font-medium">No available rooms found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search criteria or dates</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={showEditRoomDialog} onOpenChange={setShowEditRoomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room Booking</DialogTitle>
            <DialogDescription>
              Update your stay dates for {selectedRoomItem?.roomName} at {selectedRoomItem?.hotelName}
            </DialogDescription>
          </DialogHeader>

          {selectedRoomItem && (
            <div className="py-4">
              <div className="mb-4">
                <div className="h-40 w-full overflow-hidden rounded-md">
                  {selectedRoomItem.image ? (
                    <img
                      src={selectedRoomItem.image}
                      alt={`${selectedRoomItem.type} selectedRoomItem`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite error loop
                        e.target.style.display = "none";
                        e.target.parentNode.classList.add("flex", "items-center", "justify-center");
                        const fallbackIcon = document.createElement("div");
                        fallbackIcon.innerHTML = `<div class="flex items-center justify-center h-full w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
                <path d="M2 22v-5l5-5 5 5-5 5z"/>
                <path d="M9.5 14.5 16 8"/>
                <path d="M17 2v5h5"/>
                <path d="M22 7-8.5 15.5"/>
                <path d="M14 22v-4h-4v4"/>
                <path d="M18 22V9"/>
              </svg>
            </div>`;
                        e.target.parentNode.appendChild(fallbackIcon);
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">
                      <Hotel className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="text-lg font-bold">{selectedRoomItem.roomName}</h3>
                  <p className="text-muted-foreground">
                    {selectedRoomItem.hotelName}, {selectedRoomItem.city}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Update Dates</label>
                <div className="rounded-md border p-4">
                  <div className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm text-muted-foreground">Check-in</label>
                        <input
                          type="date"
                          className="mt-1 w-full rounded-md border p-2"
                          value={roomBookingDates.from ? format(roomBookingDates.from, "yyyy-MM-dd") : ""}
                          onChange={(e) =>
                            setRoomBookingDates({
                              ...roomBookingDates,
                              from: e.target.value ? new Date(e.target.value) : null,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Check-out</label>
                        <input
                          type="date"
                          className="mt-1 w-full rounded-md border p-2"
                          value={roomBookingDates.to ? format(roomBookingDates.to, "yyyy-MM-dd") : ""}
                          onChange={(e) =>
                            setRoomBookingDates({
                              ...roomBookingDates,
                              to: e.target.value ? new Date(e.target.value) : null,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 rounded-md bg-muted p-3">
                <div className="flex justify-between">
                  <span>Price per night:</span>
                  <span>${selectedRoomItem.room.basePrice}</span>
                </div>
                {roomBookingDates.from && roomBookingDates.to && (
                  <>
                    <div className="flex justify-between">
                      <span>Number of nights:</span>
                      <span>{Math.ceil((roomBookingDates.to - roomBookingDates.from) / (1000 * 60 * 60 * 24))}</span>
                    </div>
                    <div className="mt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>
                        $
                        {selectedRoomItem.room.basePrice *
                          Math.ceil((roomBookingDates.to - roomBookingDates.from) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditRoomDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmEditRoom} disabled={!roomBookingDates.from || !roomBookingDates.to}>
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Activity Dialog */}
      <Dialog open={showAddActivityDialog} onOpenChange={setShowAddActivityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
            <DialogDescription>Add a new activity to your itinerary schedule</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddActivity}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Activity Description
                </label>
                <Input
                  id="description"
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                  placeholder="e.g., Visit Museum"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="location"
                  value={activityForm.location}
                  onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })}
                  placeholder="e.g., Metropolitan Museum of Art"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="startDateTime" className="text-sm font-medium">
                    Start Date & Time
                  </label>
                  <Input
                    id="startDateTime"
                    type="datetime-local"
                    value={activityForm.startDateTime}
                    onChange={(e) => setActivityForm({ ...activityForm, startDateTime: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="endDateTime" className="text-sm font-medium">
                    End Date & Time
                  </label>
                  <Input
                    id="endDateTime"
                    type="datetime-local"
                    value={activityForm.endDateTime}
                    onChange={(e) => setActivityForm({ ...activityForm, endDateTime: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowAddActivityDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Activity</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Activity Dialog */}
      <Dialog open={showEditActivityDialog} onOpenChange={setShowEditActivityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>Update the details of your activity</DialogDescription>
          </DialogHeader>

          <form onSubmit={confirmEditActivity}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Activity Description
                </label>
                <Input
                  id="edit-description"
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                  placeholder="e.g., Visit Museum"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="edit-location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="edit-location"
                  value={activityForm.location}
                  onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })}
                  placeholder="e.g., Metropolitan Museum of Art"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-startDateTime" className="text-sm font-medium">
                    Start Date & Time
                  </label>
                  <Input
                    id="edit-startDateTime"
                    type="datetime-local"
                    value={activityForm.startDateTime}
                    onChange={(e) => setActivityForm({ ...activityForm, startDateTime: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="edit-endDateTime" className="text-sm font-medium">
                    End Date & Time
                  </label>
                  <Input
                    id="edit-endDateTime"
                    type="datetime-local"
                    value={activityForm.endDateTime}
                    onChange={(e) => setActivityForm({ ...activityForm, endDateTime: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowEditActivityDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Ride Dialog */}
      <Dialog open={showAddRideDialog} onOpenChange={setShowAddRideDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book a Ride</DialogTitle>
            <DialogDescription>Book transportation for your itinerary</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddRide}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="pickup-location" className="text-sm font-medium">
                  Pickup Location
                </label>
                <Input
                  id="pickup-location"
                  value={rideForm.pickupLocation}
                  onChange={(e) => setRideForm({ ...rideForm, pickupLocation: e.target.value })}
                  placeholder="e.g., Hotel Name or Address"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="dropoff-location" className="text-sm font-medium">
                  Dropoff Location
                </label>
                <Input
                  id="dropoff-location"
                  value={rideForm.dropoffLocation}
                  onChange={(e) => setRideForm({ ...rideForm, dropoffLocation: e.target.value })}
                  placeholder="e.g., Airport or Attraction"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="pickup-datetime" className="text-sm font-medium">
                  Pickup Date & Time
                </label>
                <Input
                  id="pickup-datetime"
                  type="datetime-local"
                  value={rideForm.pickupDateTime}
                  onChange={(e) => setRideForm({ ...rideForm, pickupDateTime: e.target.value })}
                  required
                />
              </div>

              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-medium">Estimated Price</p>
                <p className="mt-1">$100.00</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Final price may vary based on distance and time
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowAddRideDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Book Ride</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Ride Dialog */}
      <Dialog open={showEditRideDialog} onOpenChange={setShowEditRideDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ride Booking</DialogTitle>
            <DialogDescription>Update your transportation details</DialogDescription>
          </DialogHeader>

          <form onSubmit={confirmEditRide}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-ride-type" className="text-sm font-medium">
                  Ride Type
                </label>
                <Select value={rideForm.type} onValueChange={(value) => setRideForm({ ...rideForm, type: value })}>
                  <SelectTrigger id="edit-ride-type">
                    <SelectValue placeholder="Select ride type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="taxi">Taxi</SelectItem>
                    <SelectItem value="premium">Premium Car</SelectItem>
                    <SelectItem value="shuttle">Shuttle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="edit-pickup-location" className="text-sm font-medium">
                  Pickup Location
                </label>
                <Input
                  id="edit-pickup-location"
                  value={rideForm.pickupLocation}
                  onChange={(e) => setRideForm({ ...rideForm, pickupLocation: e.target.value })}
                  placeholder="e.g., Hotel Name or Address"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="edit-dropoff-location" className="text-sm font-medium">
                  Dropoff Location
                </label>
                <Input
                  id="edit-dropoff-location"
                  value={rideForm.dropoffLocation}
                  onChange={(e) => setRideForm({ ...rideForm, dropoffLocation: e.target.value })}
                  placeholder="e.g., Airport or Attraction"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="edit-pickup-datetime" className="text-sm font-medium">
                  Pickup Date & Time
                </label>
                <Input
                  id="edit-pickup-datetime"
                  type="datetime-local"
                  value={rideForm.pickupDateTime}
                  onChange={(e) => setRideForm({ ...rideForm, pickupDateTime: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-driver-service"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={rideForm.withDriverService}
                  onChange={(e) => setRideForm({ ...rideForm, withDriverService: e.target.checked })}
                />
                <label htmlFor="edit-driver-service" className="text-sm font-medium">
                  Request driver service (personal driver for the duration of your stay)
                </label>
              </div>

              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-medium">Estimated Price</p>
                <p className="mt-1">
                  {rideForm.type === "taxi" ? "$65" : rideForm.type === "premium" ? "$85" : "$45"}
                  {rideForm.withDriverService && " + $120/day for driver service"}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowEditRideDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Driver Service Dialog */}
      <Dialog open={showDriverServiceDialog} onOpenChange={setShowDriverServiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Driver Service</DialogTitle>
            <DialogDescription>
              {itinerary.driverServiceRequested
                ? "Remove driver service from your itinerary"
                : "Add driver service to your itinerary"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4 rounded-md bg-muted p-4">
              <h3 className="mb-2 font-medium">What's included with driver service:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 text-green-500" />
                  <span>Personal driver for the duration of your stay</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 text-green-500" />
                  <span>Transportation between all destinations in your itinerary</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 text-green-500" />
                  <span>Flexible pickup and dropoff times</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 text-green-500" />
                  <span>Local knowledge and recommendations</span>
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <p className="font-medium">Price:</p>
              <p className="text-lg">$120 per day</p>
              <p className="text-sm text-muted-foreground">
                Total for your trip: $
                {itinerary.startDate && itinerary.endDate
                  ? 120 *
                  Math.ceil((new Date(itinerary.endDate) - new Date(itinerary.startDate)) / (1000 * 60 * 60 * 24))
                  : 0}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDriverServiceDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={itinerary.driverServiceRequested ? "destructive" : "default"}
              onClick={toggleDriverServiceHandler}
            >
              {itinerary.driverServiceRequested ? "Remove Driver Service" : "Add Driver Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              {selectedReviewType === "itinerary"
                ? "Share your experience with this itinerary"
                : selectedReviewType?.startsWith("room-")
                  ? "Review your stay in this room"
                  : "Rate your ride experience"}
            </DialogDescription>
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
                        className={`h-6 w-6 ${star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
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
                  placeholder="Share your experience..."
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

      {/* Accept Itinerary Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Itinerary</DialogTitle>
            <DialogDescription>Confirm your itinerary and proceed to payment</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4 rounded-md bg-muted p-4">
              <h3 className="mb-2 font-medium">Itinerary Summary:</h3>
              <ul className="space-y-2 text-sm">
                {itinerary.startDate && itinerary.endDate && (
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-green-500" />
                    <div>
                      <span className="font-medium">Dates:</span> {format(new Date(itinerary.startDate), "MMM d")} -{" "}
                      {format(new Date(itinerary.endDate), "MMM d, yyyy")}
                    </div>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 text-green-500" />
                  <div>
                    <span className="font-medium">Accommodations:</span> {itinerary.roomItems?.length || 0} rooms
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 text-green-500" />
                  <div>
                    <span className="font-medium">Activities:</span> {itinerary.scheduleItems?.length || 0} activities
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 text-green-500" />
                  <div>
                    <span className="font-medium">Transportation:</span>{" "}
                    {itinerary.rideBookings?.filter((ride) => ride.status === "confirmed").length || 0} rides
                  </div>
                </li>
                {itinerary.driverServiceRequested && (
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-green-500" />
                    <div>
                      <span className="font-medium">Driver Service:</span> Included
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-medium">Payment Details:</h3>
              <p className="text-sm text-muted-foreground">
                By accepting this itinerary, you'll proceed to payment for each accommodation. You'll be charged
                separately for each room booking.
              </p>

              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <span>Accommodation Total:</span>
                  <span>${calculateTotalAccommodationPrice()}</span>
                </div>
                {itinerary.driverServiceRequested && itinerary.startDate && itinerary.endDate && (
                  <div className="flex justify-between">
                    <span>Driver Service:</span>
                    <span>
                      $
                      {120 *
                        Math.ceil(
                          (new Date(itinerary.endDate) - new Date(itinerary.startDate)) / (1000 * 60 * 60 * 24),
                        )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Transportation:</span>
                  <span>
                    $
                    {itinerary.rideBookings
                      ?.filter((ride) => ride.status === "confirmed")
                      .reduce((total, ride) => total + ride.price, 0) || 0}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Grand Total:</span>
                  <span>
                    $
                    {calculateTotalAccommodationPrice() +
                      (itinerary.driverServiceRequested && itinerary.startDate && itinerary.endDate
                        ? 120 *
                        Math.ceil(
                          (new Date(itinerary.endDate) - new Date(itinerary.startDate)) / (1000 * 60 * 60 * 24),
                        )
                        : 0) +
                      (itinerary.rideBookings
                        ?.filter((ride) => ride.status === "confirmed")
                        .reduce((total, ride) => total + ride.price, 0) || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAcceptItinerary}>Accept and Proceed to Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
            <DialogDescription>
              {itinerary.roomItems &&
                itinerary.roomItems[currentPaymentIndex] &&
                `Payment ${currentPaymentIndex + 1} of ${itinerary.roomItems.length}: ${itinerary.roomItems[currentPaymentIndex].roomName} at ${itinerary.roomItems[currentPaymentIndex].hotelName}`}
            </DialogDescription>
          </DialogHeader>

          {itinerary.roomItems && itinerary.roomItems[currentPaymentIndex] && (
            <form onSubmit={handlePayment}>
              <div className="grid gap-4 py-4">
                <div className="mb-4 rounded-md bg-muted p-3 text-sm">
                  <p className="font-medium">Booking Summary</p>
                  <p className="mt-1 text-muted-foreground">
                    {itinerary.roomItems[currentPaymentIndex].roomName} at{" "}
                    {itinerary.roomItems[currentPaymentIndex].hotelName}
                  </p>
                  <p className="text-muted-foreground">
                    {format(new Date(itinerary.roomItems[currentPaymentIndex].startDate), "MMM d, yyyy")} -{" "}
                    {format(new Date(itinerary.roomItems[currentPaymentIndex].endDate), "MMM d, yyyy")}
                  </p>
                  <p className="mt-2 font-medium">
                    Total: ${calculateRoomPrice(itinerary.roomItems[currentPaymentIndex])}
                  </p>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="cardName" className="text-sm font-medium">
                    Name on Card
                  </label>
                  <Input
                    id="cardName"
                    value={paymentDetails.cardName}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="cardNumber" className="text-sm font-medium">
                    Card Number
                  </label>
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
                    <label htmlFor="expiryDate" className="text-sm font-medium">
                      Expiry Date
                    </label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="cvv" className="text-sm font-medium">
                      CVV
                    </label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Pay ${calculateRoomPrice(itinerary.roomItems[currentPaymentIndex])}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
