"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useForm } from "react-hook-form"
import { PlusIcon, Pencil, Trash2 } from "lucide-react"

// Mock data for rooms
const roomsData = [
  {
    id: 1,
    total_no: 20,
    type: "Basic",
    room_capacity: 2,
    no_booked: Array(60).fill(5),
    no_available: Array(60).fill(15),
    price: Array(60).fill(100),
    hotelfk: 1,
  },
  {
    id: 2,
    total_no: 15,
    type: "Luxury",
    room_capacity: 3,
    no_booked: Array(60).fill(8),
    no_available: Array(60).fill(7),
    price: Array(60).fill(200),
    hotelfk: 1,
  },
  {
    id: 3,
    total_no: 10,
    type: "Suite",
    room_capacity: 4,
    no_booked: Array(60).fill(3),
    no_available: Array(60).fill(7),
    price: Array(60).fill(300),
    hotelfk: 1,
  },
]

export default function RoomManagement() {
  const [rooms, setRooms] = useState(roomsData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

  const form = useForm({
    defaultValues: {
      total_no: "",
      type: "",
      room_capacity: "",
      base_price: "",
    },
  })

  const handleAddRoom = (data) => {
    const newRoom = {
      id: rooms.length + 1,
      total_no: Number.parseInt(data.total_no),
      type: data.type,
      room_capacity: Number.parseInt(data.room_capacity),
      no_booked: Array(60).fill(0),
      no_available: Array(60).fill(Number.parseInt(data.total_no)),
      price: Array(60).fill(Number.parseInt(data.base_price)),
      hotelfk: 1,
    }
    setRooms([...rooms, newRoom])
    setIsAddDialogOpen(false)
    form.reset()
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

  const openEditDialog = (room) => {
    setSelectedRoom(room)
    form.setValue("total_no", room.total_no.toString())
    form.setValue("type", room.type)
    form.setValue("room_capacity", room.room_capacity.toString())
    form.setValue("base_price", room.price[0].toString())
    setIsEditDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Room Management</CardTitle>
          <CardDescription>Manage your hotel rooms, types, and capacity</CardDescription>
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
              <DialogDescription>Add a new room type to your hotel inventory</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddRoom)} className="space-y-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  control={form.control}
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
                  control={form.control}
                  name="base_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormDescription>Base price per night in USD</FormDescription>
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
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRoom(room.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

