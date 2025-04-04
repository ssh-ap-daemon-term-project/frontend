"use client"

import { useState, useEffect } from "react"
import { Car, Search, Plus, Trash2, Edit, Check, X } from "lucide-react"
import { toast } from "react-toastify" // Keep this import as it's working

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
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { getDrivers, addDriver, updateDriver, deleteDriver } from "@/api/admin"

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
    const [newDriver, setNewDriver] = useState({
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
            
            // Fallback to mock data if API fails
            setDrivers([
            ])
        } finally {
            setIsLoading(false)
        }
    }

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
        setDriverToEdit({...driver})
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
                                    <TableHead>Name</TableHead>
                                    <TableHead>Car Details</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDrivers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6">
                                            No drivers found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredDrivers.map((driver) => (
                                        <TableRow key={driver.id}>
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
                                            <TableCell>
                                                <div className="flex items-center">
                                                    {driver.rating}
                                                    <span className="ml-1 text-yellow-500">★</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(driver)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(driver)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
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
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={driverToEdit.name}
                                    onChange={(e) => setDriverToEdit({...driverToEdit, name: e.target.value})}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={driverToEdit.email}
                                    onChange={(e) => setDriverToEdit({...driverToEdit, email: e.target.value})}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">Phone</Label>
                                <Input
                                    id="phone"
                                    value={driverToEdit.phone}
                                    onChange={(e) => setDriverToEdit({...driverToEdit, phone: e.target.value})}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="carModel" className="text-right">Car Model</Label>
                                <Input
                                    id="carModel"
                                    value={driverToEdit.carModel}
                                    onChange={(e) => setDriverToEdit({...driverToEdit, carModel: e.target.value})}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="carNumber" className="text-right">Car Number</Label>
                                <Input
                                    id="carNumber"
                                    value={driverToEdit.carNumber}
                                    onChange={(e) => setDriverToEdit({...driverToEdit, carNumber: e.target.value})}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="carType" className="text-right">Car Type</Label>
                                <Select 
                                    value={driverToEdit.carType}
                                    onValueChange={(value) => setDriverToEdit({...driverToEdit, carType: value})}
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
                                    onChange={(e) => setDriverToEdit({...driverToEdit, seatingCapacity: parseInt(e.target.value)})}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <Select 
                                    value={driverToEdit.status}
                                    onValueChange={(value) => setDriverToEdit({...driverToEdit, status: value})}
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
                            <Label htmlFor="name-new" className="text-right">Name</Label>
                            <Input 
                                id="name-new" 
                                value={newDriver.name}
                                onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                                className="col-span-3" 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email-new" className="text-right">Email</Label>
                            <Input 
                                id="email-new" 
                                type="email" 
                                value={newDriver.email}
                                onChange={(e) => setNewDriver({...newDriver, email: e.target.value})}
                                className="col-span-3" 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password-new" className="text-right">Password</Label>
                            <Input 
                                id="password-new" 
                                type="password"
                                value={newDriver.password}
                                onChange={(e) => setNewDriver({...newDriver, password: e.target.value})}
                                className="col-span-3" 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone-new" className="text-right">Phone</Label>
                            <Input 
                                id="phone-new"
                                value={newDriver.phone}
                                onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                                className="col-span-3" 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address-new" className="text-right">Address</Label>
                            <Input 
                                id="address-new"
                                value={newDriver.address}
                                onChange={(e) => setNewDriver({...newDriver, address: e.target.value})}
                                className="col-span-3" 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="carModel-new" className="text-right">Car Model</Label>
                            <Input 
                                id="carModel-new"
                                value={newDriver.carModel}
                                onChange={(e) => setNewDriver({...newDriver, carModel: e.target.value})}
                                className="col-span-3" 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="carNumber-new" className="text-right">Car Number</Label>
                            <Input 
                                id="carNumber-new" 
                                value={newDriver.carNumber}
                                onChange={(e) => setNewDriver({...newDriver, carNumber: e.target.value})}
                                className="col-span-3" 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="carType-new" className="text-right">Car Type</Label>
                            <Select 
                                value={newDriver.carType}
                                onValueChange={(value) => setNewDriver({...newDriver, carType: value})}
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
                                onChange={(e) => setNewDriver({...newDriver, seatingCapacity: parseInt(e.target.value)})}
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