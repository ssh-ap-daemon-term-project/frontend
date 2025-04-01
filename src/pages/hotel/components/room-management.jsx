"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useForm } from "react-hook-form"
import { PlusIcon, Pencil, Calendar, DollarSign,Trash2 } from 'lucide-react'
import { format, addDays, set } from "date-fns"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Mock data for rooms
const roomsData = [
  {
    id: 1,
    total_no: 20,
    type: "Basic",
    room_capacity: 2,
    no_booked: Array(60).fill().map((_, i) => i < 10 ? 5 : (i < 20 ? 8 : 3)),
    no_available: Array(60).fill().map((_, i) => i < 10 ? 15 : (i < 20 ? 12 : 17)),
    price: Array(60).fill().map((_, i) => i < 15 ? 100 : (i < 30 ? 120 : 90)),
    hotelfk: 1,
  },
  {
    id: 2,
    total_no: 15,
    type: "Luxury",
    room_capacity: 3,
    no_booked: Array(60).fill().map((_, i) => i < 10 ? 8 : (i < 20 ? 10 : 5)),
    no_available: Array(60).fill().map((_, i) => i < 10 ? 7 : (i < 20 ? 5 : 10)),
    price: Array(60).fill().map((_, i) => i < 15 ? 200 : (i < 30 ? 250 : 180)),
    hotelfk: 1,
  },
  {
    id: 3,
    total_no: 10,
    type: "Suite",
    room_capacity: 4,
    no_booked: Array(60).fill().map((_, i) => i < 10 ? 3 : (i < 20 ? 5 : 2)),
    no_available: Array(60).fill().map((_, i) => i < 10 ? 7 : (i < 20 ? 5 : 8)),
    price: Array(60).fill().map((_, i) => i < 15 ? 300 : (i < 30 ? 350 : 280)),
    hotelfk: 1,
  },
]

export default function RoomManagement() {
  const [rooms, setRooms] = useState(roomsData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedDay, setSelectedDay] = useState(0)
  const [isEditPriceDialogOpen, setIsEditPriceDialogOpen] = useState(false)
  const [isEditAvailabilityDialogOpen, setIsEditAvailabilityDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [open, setopen] = useState(false)

  const form = useForm({
    defaultValues: {
      total_no: "",
      type: "",
      room_capacity: "",
      base_price: "",
    },
  })

  const addRoomForm = useForm({
    defaultValues: {
      total_no: "",
      type: "",
      room_capacity: "",
      base_price: "",
    },
  })

  const editPriceForm = useForm({
    defaultValues: {
      price: "",
      apply_range: "single",
    },
  })

  const editAvailabilityForm = useForm({
    defaultValues: {
      available: "",
      apply_range: "single",
    },
  })

  const handleAddRoom = (data) => {
    const basePrice = parseInt(data.base_price)
    const totalRooms = parseInt(data.total_no)
    
    const newRoom = {
      id: rooms.length + 1,
      total_no: totalRooms,
      type: data.type,
      room_capacity: parseInt(data.room_capacity),
      no_booked: Array(60).fill(0),
      no_available: Array(60).fill(totalRooms),
      price: Array(60).fill(basePrice),
      hotelfk: 1,
    }
    setRooms([...rooms, newRoom])
    setIsAddDialogOpen(false)
    addRoomForm.reset()
  }

  const handleEditRoom = (data) => {
    const updatedRooms = rooms.map((room) => {
      if (room.id === selectedRoom.id) {
        return {
          ...room,
          total_no: Number.parseInt(data.total_no),
          type: data.type,
          room_capacity: Number.parseInt(data.room_capacity),
          price: Array(60).fill(Number.parseInt(data.base_price)),
        }
      }
      return room
    })
    setRooms(updatedRooms)
    setIsEditDialogOpen(false)
    setSelectedRoom(null)
    form.reset()
  }

  const handleDeleteRoom = (id) => {
    const updatedRooms = rooms.filter((room) => room.id !== id)
    setRooms(updatedRooms)
  }

  const handleEditPrice = (data) => {
    const newPrice = parseInt(data.price)
    const applyRange = data.apply_range
    
    setRooms(rooms.map(room => {
      if (room.id === selectedRoom.id) {
        const newPrices = [...room.price]
        
        if (applyRange === "single") {
          newPrices[selectedDay] = newPrice
        } else if (applyRange === "week") {
          for (let i = 0; i < 7; i++) {
            if (selectedDay + i < 60) {
              newPrices[selectedDay + i] = newPrice
            }
          }
        } else if (applyRange === "month") {
          for (let i = 0; i < 30; i++) {
            if (selectedDay + i < 60) {
              newPrices[selectedDay + i] = newPrice
            }
          }
        } else if (applyRange === "all") {
          for (let i = 0; i < 60; i++) {
            newPrices[i] = newPrice
          }
        }
        
        return { ...room, price: newPrices }
      }
      return room
    }))
    
    setIsEditPriceDialogOpen(false)
    editPriceForm.reset()
  }

  const handleEditAvailability = (data) => {
    const newAvailable = parseInt(data.available)
    const applyRange = data.apply_range
    
    setRooms(rooms.map(room => {
      if (room.id === selectedRoom.id) {
        const newAvailability = [...room.no_available]
        
        if (applyRange === "single") {
          // Ensure we don't set availability below booked rooms
          if (newAvailable >= room.no_booked[selectedDay]) {
            newAvailability[selectedDay] = newAvailable
          }
        } else if (applyRange === "week") {
          for (let i = 0; i < 7; i++) {
            if (selectedDay + i < 60 && newAvailable >= room.no_booked[selectedDay + i]) {
              newAvailability[selectedDay + i] = newAvailable
            }
          }
        } else if (applyRange === "month") {
          for (let i = 0; i < 30; i++) {
            if (selectedDay + i < 60 && newAvailable >= room.no_booked[selectedDay + i]) {
              newAvailability[selectedDay + i] = newAvailable
            }
          }
        } else if (applyRange === "all") {
          for (let i = 0; i < 60; i++) {
            if (newAvailable >= room.no_booked[i]) {
              newAvailability[i] = newAvailable
            }
          }
        }
        
        return { ...room, no_available: newAvailability }
      }
      return room
    }))
    
    setIsEditAvailabilityDialogOpen(false)
    editAvailabilityForm.reset()
  }

  const openEditPriceDialog = (room, dayIndex) => {
    setSelectedRoom(room)
    setSelectedDay(dayIndex)
    editPriceForm.setValue("price", room.price[dayIndex].toString())
    setIsEditPriceDialogOpen(true)
  }

  const openEditAvailabilityDialog = (room, dayIndex) => {
    setSelectedRoom(room)
    setSelectedDay(dayIndex)
    editAvailabilityForm.setValue("available", room.no_available[dayIndex].toString())
    setIsEditAvailabilityDialogOpen(true)
  }

  const openEditDialog = (room) => {
    setSelectedRoom(room)
    form.setValue("total_no", room.total_no.toString())
    form.setValue("type", room.type)
    form.setValue("room_capacity", room.room_capacity.toString())
    form.setValue("base_price", room.price[0].toString())
    setIsEditDialogOpen(true)
  }

  const getDateString = (dayIndex) => {
    const date = addDays(new Date(), dayIndex)
    return format(date, "MMM dd, yyyy")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Room Management</CardTitle>
          <CardDescription>
            Manage your hotel rooms, types, capacity, availability and pricing
          </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room Type</DialogTitle>
              <DialogDescription>
                Add a new room type to your hotel inventory
              </DialogDescription>
            </DialogHeader>
            <Form {...addRoomForm}>
              <form onSubmit={addRoomForm.handleSubmit(handleAddRoom)} className="space-y-4">
                <FormField
                  control={addRoomForm.control}
                  name="total_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Number of Rooms</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addRoomForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Basic">Basic</SelectItem>
                          <SelectItem value="Luxury">Luxury</SelectItem>
                          <SelectItem value="Suite">Suite</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addRoomForm.control}
                  name="room_capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addRoomForm.control}
                  name="base_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormDescription>
                        Base price per night in USD
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Add Room</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Room Type</DialogTitle>
              <DialogDescription>Update the details for this room type</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEditRoom)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="total_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Number of Rooms</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Basic">Basic</SelectItem>
                          <SelectItem value="Luxury">Luxury</SelectItem>
                          <SelectItem value="Suite">Suite</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="room_capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="base_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>Base price per night in USD</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Update Room</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Room Overview</TabsTrigger>
            <TabsTrigger value="availability">Availability & Pricing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Total Rooms</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Available Today</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.id}</TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell>{room.total_no}</TableCell>
                    <TableCell>{room.room_capacity}</TableCell>
                    <TableCell>{room.no_available[0]}</TableCell>
                    <TableCell>${room.price[0]}</TableCell>
                    <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(room)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <AlertDialog open = {open} onOpenChange={setopen}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setopen(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteRoom(room.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    <Button variant="ghost" size="icon" onClick={() => setopen(true)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="availability">
            <Accordion type="single" collapsible className="w-full">
              {rooms.map((room) => (
                <AccordionItem key={room.id} value={`room-${room.id}`}>
                  <AccordionTrigger>
                    {room.type} Rooms - {room.total_no} Total
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead>Booked</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array(60).fill().map((_, index) => (
                            <TableRow key={index}>
                              <TableCell>{getDateString(index)}</TableCell>
                              <TableCell>{room.no_available[index]}</TableCell>
                              <TableCell>{room.no_booked[index]}</TableCell>
                              <TableCell>${room.price[index]}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditPriceDialog(room, index)}
                                  >
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    Price
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditAvailabilityDialog(room, index)}
                                  >
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Availability
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>

        {/* Edit Price Dialog */}
        <Dialog open={isEditPriceDialogOpen} onOpenChange={setIsEditPriceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Room Price</DialogTitle>
              <DialogDescription>
                {selectedRoom && (
                  <>
                    Update price for {selectedRoom.type} rooms on {getDateString(selectedDay)}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <Form {...editPriceForm}>
              <form onSubmit={editPriceForm.handleSubmit(handleEditPrice)} className="space-y-4">
                <FormField
                  control={editPriceForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Price per night in USD
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editPriceForm.control}
                  name="apply_range"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apply To</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">Selected Day Only</SelectItem>
                          <SelectItem value="week">Week from Selected Day</SelectItem>
                          <SelectItem value="month">Month from Selected Day</SelectItem>
                          <SelectItem value="all">All Future Dates</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Update Price</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Availability Dialog */}
        <Dialog open={isEditAvailabilityDialogOpen} onOpenChange={setIsEditAvailabilityDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Room Availability</DialogTitle>
              <DialogDescription>
                {selectedRoom && (
                  <>
                    Update availability for {selectedRoom.type} rooms on {getDateString(selectedDay)}
                    {selectedRoom && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Note: Available rooms cannot be less than booked rooms ({selectedRoom.no_booked[selectedDay]})
                      </p>
                    )}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <Form {...editAvailabilityForm}>
              <form onSubmit={editAvailabilityForm.handleSubmit(handleEditAvailability)} className="space-y-4">
                <FormField
                  control={editAvailabilityForm.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Rooms</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editAvailabilityForm.control}
                  name="apply_range"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apply To</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">Selected Day Only</SelectItem>
                          <SelectItem value="week">Week from Selected Day</SelectItem>
                          <SelectItem value="month">Month from Selected Day</SelectItem>
                          <SelectItem value="all">All Future Dates</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Update Availability</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
