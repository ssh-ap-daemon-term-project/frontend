"use client"

import { useState, useEffect } from "react"
import { Car, Search, Plus, Trash2, Edit, Check, X, ChevronDown, ChevronRight, User, Calendar, MapPin } from "lucide-react"
import { toast } from "react-toastify"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { getDriver, getDrivers, addDriver, updateDriver, deleteDriver, getDriverRideBookings } from "@/api/admin"
import { format } from "date-fns"

const DriverManagement = () => {
    const [drivers, setDrivers] = useState([])
    const [filteredDrivers, setFilteredDrivers] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [driverToDelete, setDriverToDelete] = useState(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [driverToEdit, setDriverToEdit] = useState(null)
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [expandedDriverId, setExpandedDriverId] = useState(null)
    const [expandedDriverDetails, setExpandedDriverDetails] = useState(null)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)
    const [newDriver, setNewDriver] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        carModel: "",
        carNumber: "",
        carType: "sedan",
        seatingCapacity: 4,
        address: ""
    })

    useEffect(() => {
        fetchDrivers()
    }, [])

    useEffect(() => {
        // Filter drivers based on search query
        if (!searchQuery) {
            setFilteredDrivers(drivers)
            return
        }

        const filtered = drivers.filter(driver =>
            (driver.username?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
            driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.carModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.carNumber.toLowerCase().includes(searchQuery.toLowerCase())
        )

        setFilteredDrivers(filtered)
    }, [searchQuery, drivers])

    const fetchDrivers = async () => {
        setIsLoading(true)
        try {
            // Use the real API endpoint
            const response = await getDrivers()
            setDrivers(response.data)
            setFilteredDrivers(response.data)
        } catch (error) {
            console.error("Error fetching drivers:", error)
            toast.error("Failed to load drivers")
        } finally {
            setIsLoading(false)
        }
    }

    const toggleExpandDriver = async (driverId) => {
        if (expandedDriverId === driverId) {
            setExpandedDriverId(null);
            setExpandedDriverDetails(null);
            return;
        }
    
        setExpandedDriverId(driverId);
        setIsLoadingDetails(true);
    
        try {
            // Get the current driver with totalCompletedRides
            const driverResponse = await getDriver(driverId);
            
            // Fetch ride bookings
            const rideBookingsResponse = await getDriverRideBookings(driverId);
    
            setExpandedDriverDetails({
                driver: driverResponse.data,
                rideBookings: rideBookingsResponse.data,
                // store count of rides in driver object with status confirmed
                totalCompletedRides: rideBookingsResponse.data.filter(booking => booking.status === 'confirmed').length
            });
        } catch (error) {
            toast.error("Failed to fetch driver details");
            setExpandedDriverId(null);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const handleDeleteClick = (driver) => {
        setDriverToDelete(driver)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            await deleteDriver(driverToDelete.id)
            setDrivers(prevDrivers => prevDrivers.filter(driver => driver.id !== driverToDelete.id))
            toast.success("Driver deleted successfully")
        } catch (error) {
            console.error("Error deleting driver:", error)
            toast.error("Failed to delete driver")
        } finally {
            setDeleteDialogOpen(false)
            setDriverToDelete(null)
        }
    }

    const handleEditClick = (driver) => {
        setDriverToEdit({ ...driver })
        setEditDialogOpen(true)
    }

    const handleEditSave = async () => {
        try {
            await updateDriver(driverToEdit.id, driverToEdit)
            setDrivers(prevDrivers =>
                prevDrivers.map(driver =>
                    driver.id === driverToEdit.id ? driverToEdit : driver
                )
            )
            toast.success("Driver updated successfully")
            setEditDialogOpen(false)
        } catch (error) {
            console.error("Error updating driver:", error)
            toast.error("Failed to update driver")
        }
    }

    const handleAddSave = async (newDriver) => {
        try {
            const response = await addDriver(newDriver)
            const addedDriver = response.data

            setDrivers(prevDrivers => [...prevDrivers, addedDriver])
            toast.success("Driver added successfully")
            setAddDialogOpen(false)
        } catch (error) {
            console.error("Error adding driver:", error)
            toast.error(error.response?.data?.detail || "Failed to add driver")
        }
    }

    // Render a badge for driver status
    const StatusBadge = ({ status }) => {
        if (status === "active") {
            return <Badge className="bg-green-500">Active</Badge>
        } else {
            return <Badge variant="outline" className="text-gray-500">Inactive</Badge>
        }
    }

    // Render a badge for ride status
    const RideStatusBadge = ({ status }) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-500">Confirmed</Badge>;
            case 'pending':
                return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
            case 'completed':
                return <Badge variant="secondary">Completed</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Driver Management</h1>
                <Button onClick={() => setAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Driver
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Drivers</CardTitle>
                    <CardDescription>Manage your platform drivers</CardDescription>
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search drivers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="py-6 text-center">Loading drivers...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-10"></TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Car Details</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDrivers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-6">
                                            No drivers found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredDrivers.map((driver) => (
                                        <>
                                            <TableRow key={driver.id}>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleExpandDriver(driver.id)}
                                                        aria-label={expandedDriverId === driver.id ? "Collapse details" : "Expand details"}
                                                    >
                                                        {expandedDriverId === driver.id ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {driver.name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span>{driver.carModel}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {driver.carNumber} • {driver.carType} • {driver.seatingCapacity} seats
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span>{driver.email}</span>
                                                        <span className="text-xs text-muted-foreground">{driver.phone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={driver.status} />
                                                </TableCell>
                                                <TableCell>{driver.joinedDate}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(driver)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(driver)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            {expandedDriverId === driver.id && (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="p-0">
                                                        {isLoadingDetails ? (
                                                            <div className="flex justify-center items-center py-8">
                                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-muted/20 px-10 py-6">
                                                                <Tabs defaultValue="details">
                                                                    <TabsList>
                                                                        <TabsTrigger value="details">
                                                                            <User className="h-4 w-4 mr-2" />
                                                                            Personal Details
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="ride-bookings">
                                                                            <Car className="h-4 w-4 mr-2" />
                                                                            Ride Bookings
                                                                        </TabsTrigger>
                                                                    </TabsList>

                                                                    <TabsContent value="details">
                                                                        <div className="rounded-md border bg-background p-6">
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                <div>
                                                                                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                                                                                    <div className="grid grid-cols-1 gap-3">
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Username:</span>
                                                                                            <p className="font-medium">{expandedDriverDetails?.driver?.username || "N/A"}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Name:</span>
                                                                                            <p className="font-medium">{expandedDriverDetails?.driver?.name}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Address:</span>
                                                                                            <p className="font-medium">{expandedDriverDetails?.driver?.address || "Not provided"}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Status:</span>
                                                                                            <div className="mt-1">
                                                                                                <StatusBadge status={expandedDriverDetails?.driver?.status} />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Member Since:</span>
                                                                                            <p className="font-medium">
                                                                                                {expandedDriverDetails?.driver?.joinedDate || "N/A"}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div>
                                                                                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                                                                                    <div className="grid grid-cols-1 gap-3">
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Email:</span>
                                                                                            <p className="font-medium">{expandedDriverDetails?.driver?.email}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Phone:</span>
                                                                                            <p className="font-medium">{expandedDriverDetails?.driver?.phone}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="md:col-span-2">
                                                                                    <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
                                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                                        <div className="bg-primary/10 p-4 rounded-lg">
                                                                                            <div className="text-sm text-muted-foreground">Car Model</div>
                                                                                            <div className="text-lg font-bold mt-1">{expandedDriverDetails?.driver?.carModel}</div>
                                                                                        </div>
                                                                                        <div className="bg-primary/10 p-4 rounded-lg">
                                                                                            <div className="text-sm text-muted-foreground">Car Number</div>
                                                                                            <div className="text-lg font-bold mt-1">{expandedDriverDetails?.driver?.carNumber}</div>
                                                                                        </div>
                                                                                        <div className="bg-primary/10 p-4 rounded-lg">
                                                                                            <div className="text-sm text-muted-foreground">Car Type</div>
                                                                                            <div className="text-lg font-bold mt-1 capitalize">{expandedDriverDetails?.driver?.carType}</div>
                                                                                            <div className="text-sm text-muted-foreground">{expandedDriverDetails?.driver?.seatingCapacity} seats</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="md:col-span-2">
                                                                                    <h3 className="text-lg font-semibold mb-4">Performance</h3>
                                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                                        <div className="bg-primary/10 p-4 rounded-lg">
                                                                                            <div className="text-sm text-muted-foreground">Total Rides</div>
                                                                                            <div className="text-lg font-bold mt-1">{expandedDriverDetails?.totalCompletedRides || 0}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </TabsContent>

                                                                    <TabsContent value="ride-bookings">
                                                                        <div className="rounded-md border bg-background">
                                                                            <Table>
                                                                                <TableHeader>
                                                                                    <TableRow>
                                                                                        <TableHead>ID</TableHead>
                                                                                        <TableHead>Customer</TableHead>
                                                                                        <TableHead>Route</TableHead>
                                                                                        <TableHead>Time</TableHead>
                                                                                        <TableHead>Passengers</TableHead>
                                                                                        <TableHead>Status</TableHead>
                                                                                        <TableHead>Price</TableHead>
                                                                                    </TableRow>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                    {expandedDriverDetails?.rideBookings?.map(booking => (
                                                                                        <TableRow key={booking.id}>
                                                                                            <TableCell className="font-medium">{booking.id}</TableCell>
                                                                                            <TableCell>{booking.customerName}</TableCell>
                                                                                            <TableCell>
                                                                                                <div className="flex items-start gap-1">
                                                                                                    <MapPin className="h-3 w-3 mt-1 text-muted-foreground" />
                                                                                                    <div>
                                                                                                        <div className="text-sm">{booking.pickupLocation}</div>
                                                                                                        <div className="text-xs text-muted-foreground">to</div>
                                                                                                        <div className="text-sm">{booking.dropLocation}</div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <div>
                                                                                                    <div>{format(new Date(booking.pickupTime), "MMM dd, yyyy")}</div>
                                                                                                    <div className="text-xs text-muted-foreground">
                                                                                                        {format(new Date(booking.pickupTime), "h:mm a")}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </TableCell>
                                                                                            <TableCell>{booking.numberOfPersons}</TableCell>
                                                                                            <TableCell>
                                                                                                <RideStatusBadge status={booking.status} />
                                                                                            </TableCell>
                                                                                            <TableCell>${booking.price.toFixed(2)}</TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                    {(!expandedDriverDetails?.rideBookings || expandedDriverDetails.rideBookings.length === 0) && (
                                                                                        <TableRow>
                                                                                            <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                                                                                                No ride bookings found for this driver
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    )}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </div>
                                                                    </TabsContent>
                                                                </Tabs>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete driver {driverToDelete?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Driver Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Driver</DialogTitle>
                        <DialogDescription>
                            Update driver information
                        </DialogDescription>
                    </DialogHeader>
                    {driverToEdit && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">Username</Label>
                                <Input
                                    id="username"
                                    value={driverToEdit.username || ""}
                                    onChange={(e) => setDriverToEdit({ ...driverToEdit, username: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={driverToEdit.name}
                                    onChange={(e) => setDriverToEdit({ ...driverToEdit, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={driverToEdit.email}
                                    onChange={(e) => setDriverToEdit({ ...driverToEdit, email: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">Phone</Label>
                                <Input
                                    id="phone"
                                    value={driverToEdit.phone}
                                    onChange={(e) => setDriverToEdit({ ...driverToEdit, phone: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" className="text-right">Address</Label>
                                <Input
                                    id="address"
                                    value={driverToEdit.address || ""}
                                    onChange={(e) => setDriverToEdit({ ...driverToEdit, address: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="carModel" className="text-right">Car Model</Label>
                                <Input
                                    id="carModel"
                                    value={driverToEdit.carModel}
                                    onChange={(e) => setDriverToEdit({ ...driverToEdit, carModel: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="carNumber" className="text-right">Car Number</Label>
                                <Input
                                    id="carNumber"
                                    value={driverToEdit.carNumber}
                                    onChange={(e) => setDriverToEdit({ ...driverToEdit, carNumber: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="carType" className="text-right">Car Type</Label>
                                <Select
                                    value={driverToEdit.carType}
                                    onValueChange={(value) => setDriverToEdit({ ...driverToEdit, carType: value })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select car type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sedan">Sedan</SelectItem>
                                        <SelectItem value="suv">SUV</SelectItem>
                                        <SelectItem value="hatchback">Hatchback</SelectItem>
                                        <SelectItem value="luxury">Luxury</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="seats" className="text-right">Seats</Label>
                                <Input
                                    id="seats"
                                    type="number"
                                    value={driverToEdit.seatingCapacity}
                                    onChange={(e) => setDriverToEdit({ ...driverToEdit, seatingCapacity: parseInt(e.target.value) })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <Select
                                    value={driverToEdit.status}
                                    onValueChange={(value) => setDriverToEdit({ ...driverToEdit, status: value })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Driver Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Driver</DialogTitle>
                        <DialogDescription>
                            Enter details for a new driver
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username-new" className="text-right">Username</Label>
                            <Input
                                id="username-new"
                                value={newDriver.username}
                                onChange={(e) => setNewDriver({ ...newDriver, username: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name-new" className="text-right">Name</Label>
                            <Input
                                id="name-new"
                                value={newDriver.name}
                                onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email-new" className="text-right">Email</Label>
                            <Input
                                id="email-new"
                                type="email"
                                value={newDriver.email}
                                onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password-new" className="text-right">Password</Label>
                            <Input
                                id="password-new"
                                type="password"
                                value={newDriver.password}
                                onChange={(e) => setNewDriver({ ...newDriver, password: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone-new" className="text-right">Phone</Label>
                            <Input
                                id="phone-new"
                                value={newDriver.phone}
                                onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address-new" className="text-right">Address</Label>
                            <Input
                                id="address-new"
                                value={newDriver.address}
                                onChange={(e) => setNewDriver({ ...newDriver, address: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="carModel-new" className="text-right">Car Model</Label>
                            <Input
                                id="carModel-new"
                                value={newDriver.carModel}
                                onChange={(e) => setNewDriver({ ...newDriver, carModel: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="carNumber-new" className="text-right">Car Number</Label>
                            <Input
                                id="carNumber-new"
                                value={newDriver.carNumber}
                                onChange={(e) => setNewDriver({ ...newDriver, carNumber: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="carType-new" className="text-right">Car Type</Label>
                            <Select
                                value={newDriver.carType}
                                onValueChange={(value) => setNewDriver({ ...newDriver, carType: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select car type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sedan">Sedan</SelectItem>
                                    <SelectItem value="suv">SUV</SelectItem>
                                    <SelectItem value="hatchback">Hatchback</SelectItem>
                                    <SelectItem value="luxury">Luxury</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="seats-new" className="text-right">Seats</Label>
                            <Input
                                id="seats-new"
                                type="number"
                                value={newDriver.seatingCapacity}
                                onChange={(e) => setNewDriver({ ...newDriver, seatingCapacity: parseInt(e.target.value) })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => handleAddSave(newDriver)}>
                            Add Driver
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DriverManagement