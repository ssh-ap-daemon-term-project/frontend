"use client"

import { useState, useEffect, useContext } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Calendar, MapPin, ChevronDown, ChevronRight, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import { AuthContext } from "@/context/AuthContext"
import { getAcceptedTrips } from "@/api/driver.jsx" // Ensure this is correctly implemented

// Keep this as fallback data in case API fails
const acceptedTripsData = [
    {
        id: "t-123456",
        passengerName: "Emma Wilson",
        passengerAvatar: "/placeholder.svg?height=40&width=40",
        pickupLocation: "123 Main St, Downtown",
        dropoffLocation: "456 Park Ave, Uptown",
        date: "2023-11-27T14:30:00",
        distance: 5.2,
        duration: 18,
        fare: 15.75,
        status: "confirmed",
        paymentMethod: "Credit Card",
        tip: 3.0,
    },
    {
        id: "t-234567",
        passengerName: "Alex Johnson",
        passengerAvatar: "/placeholder.svg?height=40&width=40",
        pickupLocation: "789 Broadway, Midtown",
        dropoffLocation: "101 River Rd, Eastside",
        date: "2023-11-26T10:15:00",
        distance: 3.8,
        duration: 12,
        fare: 12.5,
        status: "completed",
        paymentMethod: "Cash",
        tip: 2.0,
    },
    {
        id: "t-345678",
        passengerName: "Sophia Martinez",
        passengerAvatar: "/placeholder.svg?height=40&width=40",
        pickupLocation: "222 Oak St, Westside",
        dropoffLocation: "333 Pine Ave, Northside",
        date: "2023-11-25T18:45:00",
        distance: 7.5,
        duration: 25,
        fare: 22.3,
        status: "completed",
        paymentMethod: "Credit Card",
        tip: 4.5,
    },
    {
        id: "t-456789",
        passengerName: "Michael Brown",
        passengerAvatar: "/placeholder.svg?height=40&width=40",
        pickupLocation: "444 Maple Dr, Southside",
        dropoffLocation: "555 Elm St, Downtown",
        date: "2023-11-24T09:30:00",
        distance: 4.3,
        duration: 15,
        fare: 14.2,
        status: "completed",
        paymentMethod: "Credit Card",
        tip: 2.5,
    },
    {
        id: "t-567890",
        passengerName: "David Lee",
        passengerAvatar: "/placeholder.svg?height=40&width=40",
        pickupLocation: "666 Cedar Ln, Eastside",
        dropoffLocation: "777 Birch Ave, Westside",
        date: "2023-11-23T16:20:00",
        distance: 6.1,
        duration: 22,
        fare: 18.9,
        status: "completed",
        paymentMethod: "Cash",
        tip: 0.0,
    },
]

export function AcceptedTrips() {
    const [searchQuery, setSearchQuery] = useState("")
    const [dateFilter, setDateFilter] = useState(null)
    const [selectedTrip, setSelectedTrip] = useState(null)
    const [trips, setTrips] = useState(acceptedTripsData) // Start with mock data
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { userId } = useContext(AuthContext)

    useEffect(() => {
        async function fetchTrips() {
            try {
                setLoading(true)
                const response = await getAcceptedTrips(userId)
                console.log("API response:", response.data) // Add logging to see the response structure
                
                // Transform the API data to match the expected structure if needed
                const formattedTrips = response.data.map(trip => ({
                    id: trip.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
                    passengerName: "Customer", // Fallback name since API might not provide this
                    passengerAvatar: "/placeholder.svg?height=40&width=40",
                    pickupLocation: trip.pickupLocation || "Not specified",
                    dropoffLocation: trip.dropoffLocation || "Not specified",
                    date: trip.pickupDateTime || new Date().toISOString(),
                    distance: 5.0, // Default values since API might not provide these
                    duration: 15,
                    fare: parseFloat(trip.price) || 0,
                    status: trip.status || "confirmed",
                    paymentMethod: "Credit Card",
                    tip: 0
                }));

                setTrips(formattedTrips.length > 0 ? formattedTrips : acceptedTripsData);
            } catch (err) {
                console.error("Error fetching trips:", err)
                setError("Failed to load trips")
                toast.error("Could not load accepted trips")
                // Fallback to mock data on error
                setTrips(acceptedTripsData)
            } finally {
                setLoading(false)
            }
        }
        
        if (userId) {
            fetchTrips()
        } else {
            // If no userId, use mock data and don't show loading state
            setTrips(acceptedTripsData)
            setLoading(false)
        }
    }, [userId])

    const filteredTrips = trips.filter((trip) => {
        // Add null checks to prevent "toLowerCase of undefined" errors
        const passengerMatch = trip.passengerName ? 
            trip.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) : false;
        
        const pickupMatch = trip.pickupLocation ? 
            trip.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) : false;
        
        const dropoffMatch = trip.dropoffLocation ? 
            trip.dropoffLocation.toLowerCase().includes(searchQuery.toLowerCase()) : false;
        
        const matchesSearch = passengerMatch || pickupMatch || dropoffMatch;

        // Make sure date exists and is a string before using includes
        const matchesDate = dateFilter && trip.date ? 
            String(trip.date).includes(dateFilter) : true;

        return matchesSearch && matchesDate;
    });

    const handleTripSelect = (trip) => {
        setSelectedTrip(trip === selectedTrip ? null : trip)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Accepted Trips</CardTitle>
                    <CardDescription>View your accepted ride requests</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search trips..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select onValueChange={setDateFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by date" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All dates</SelectItem>
                                <SelectItem value={new Date().toISOString().substring(0, 10)}>Today</SelectItem>
                                <SelectItem value={new Date(Date.now() - 86400000).toISOString().substring(0, 10)}>Yesterday</SelectItem>
                                <SelectItem value={new Date().toISOString().substring(0, 7)}>This month</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Loading state */}
                    {loading && (
                        <div className="py-8 text-center">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                            <p className="mt-2 text-sm text-muted-foreground">Loading trips...</p>
                        </div>
                    )}

                    {/* Error state */}
                    {!loading && error && (
                        <div className="py-8 text-center text-destructive">
                            <p>{error}</p>
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setError(null)
                                    setLoading(true)
                                    getAcceptedTrips(userId)
                                        .then(res => {
                                            setTrips(res.data)
                                            setLoading(false)
                                        })
                                        .catch(err => {
                                            console.error(err)
                                            setError("Failed to load trips")
                                            setLoading(false)
                                        })
                                }}
                                className="mt-2"
                            >
                                Try Again
                            </Button>
                        </div>
                    )}

                    {/* Data table - only show when not loading and no error */}
                    {!loading && !error && (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Passenger</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Fare</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTrips.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                {trips.length === 0 ? "No accepted trips found" : "No trips found matching your criteria"}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredTrips.map((trip) => (
                                            <TableRow key={trip.id} className={selectedTrip?.id === trip.id ? "bg-muted" : ""}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={trip.passengerAvatar} alt={trip.passengerName} />
                                                            <AvatarFallback>{trip.passengerName.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="font-medium">{trip.passengerName}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>{format(new Date(trip.date), "MMM d, h:mm a")}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    ${(trip.fare + trip.tip).toFixed(2)}
                                                    {trip.tip > 0 && (
                                                        <span className="text-xs text-muted-foreground ml-1">(${trip.tip.toFixed(2)} tip)</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                                        {trip.status === "confirmed" ? "Confirmed" : "Completed"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleTripSelect(trip)}>
                                                        {selectedTrip?.id === trip.id ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Selected trip details */}
                    {selectedTrip && (
                        <div className="mt-4 p-4 border rounded-md bg-muted/50">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Trip Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex">
                                            <div className="mr-4 flex flex-col items-center">
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                </div>
                                                <div className="h-8 w-0.5 bg-border" />
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                                                    <MapPin className="h-2.5 w-2.5 text-primary-foreground" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-xs font-medium leading-none">Pickup</p>
                                                    <p className="text-xs text-muted-foreground">{selectedTrip.pickupLocation}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium leading-none">Dropoff</p>
                                                    <p className="text-xs text-muted-foreground">{selectedTrip.dropoffLocation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium mb-2">Payment Information</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Base fare:</span>
                                            <span>${selectedTrip.fare.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tip:</span>
                                            <span>${selectedTrip.tip.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-medium pt-1 border-t">
                                            <span>Total:</span>
                                            <span>${(selectedTrip.fare + selectedTrip.tip).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground pt-1">
                                            <span>Payment method:</span>
                                            <span>{selectedTrip.paymentMethod}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-4">
                                <div className="flex flex-col items-center justify-center rounded-lg border p-2">
                                    <p className="text-xs text-muted-foreground">Distance</p>
                                    <p className="text-sm font-medium">{selectedTrip.distance} mi</p>
                                </div>
                                <div className="flex flex-col items-center justify-center rounded-lg border p-2">
                                    <p className="text-xs text-muted-foreground">Duration</p>
                                    <p className="text-sm font-medium">{selectedTrip.duration} min</p>
                                </div>
                                <div className="flex flex-col items-center justify-center rounded-lg border p-2">
                                    <p className="text-xs text-muted-foreground">Date & Time</p>
                                    <p className="text-sm font-medium">{format(new Date(selectedTrip.date), "MMM d, h:mm a")}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}