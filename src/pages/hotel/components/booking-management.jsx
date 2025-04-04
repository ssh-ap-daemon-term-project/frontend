
import { useState  , useEffect , useContext} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useForm } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { AuthContext } from "@/context/AuthContext"
import { getHotelBookings } from "@/api/hotel"

// Mock data for bookings
const bookingsData = [
  {
    id: 1,
    no_persons: 2,
    custfk: 101,
    roomfk: 1,
    start_date: "2025-05-15",
    end_date: "2025-05-20",
    customer_name: "John Doe",
    room_type: "Basic",
    status: "confirmed",
  },
  {
    id: 2,
    no_persons: 3,
    custfk: 102,
    roomfk: 2,
    start_date: "2025-05-16",
    end_date: "2025-05-18",
    customer_name: "Jane Smith",
    room_type: "Luxury",
    status: "pending",
  },
  {
    id: 3,
    no_persons: 2,
    custfk: 103,
    roomfk: 1,
    start_date: "2025-05-17",
    end_date: "2025-05-19",
    customer_name: "Robert Johnson",
    room_type: "Basic",
    status: "confirmed",
  },
  {
    id: 4,
    no_persons: 4,
    custfk: 104,
    roomfk: 3,
    start_date: "2025-05-18",
    end_date: "2025-05-22",
    customer_name: "Emily Davis",
    room_type: "Suite",
    status: "cancelled",
  },
  {
    id: 5,
    no_persons: 2,
    custfk: 105,
    roomfk: 2,
    start_date: "2025-05-20",
    end_date: "2025-05-25",
    customer_name: "Michael Wilson",
    room_type: "Luxury",
    status: "confirmed",
  },
]

export default function BookingManagement() {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchRoomType, setSearchRoomType] = useState("")
  const [searchStatus, setSearchStatus] = useState("")
  const [searchCheckin, setSearchCheckin] = useState("")
  const [searchCheckout, setSearchCheckout] = useState("")


  const { userId } = useContext(AuthContext);


  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await getHotelBookings(userId);
        if (response.status === 200) {
          setBookings(response.data);
        } else {
          // Fallback to mock data in development
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]); // Use mock data on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);


  const form = useForm({
    defaultValues: {
      no_persons: "",
      status: "",
      start_date: "",
      end_date: "",
    },
  })

  const handleEditBooking = (data) => {
    const updatedBookings = bookings.map((booking) => {
      if (booking.id === selectedBooking.id) {
        return {
          ...booking,
          no_persons: Number.parseInt(data.no_persons),
          status: data.status,
          start_date: data.start_date,
          end_date: data.end_date,
        }
      }
      return booking
    })
    setBookings(updatedBookings)
    setIsEditDialogOpen(false)
    setSelectedBooking(null)
    form.reset()
  }

  const handleDeleteBooking = (id) => {
    const updatedBookings = bookings.filter((booking) => booking.id !== id)
    setBookings(updatedBookings)
  }

  const openEditDialog = (booking) => {
    setSelectedBooking(booking)
    form.setValue("no_persons", booking.no_persons.toString())
    form.setValue("status", booking.status)
    form.setValue("start_date", booking.start_date)
    form.setValue("end_date", booking.end_date)
    setIsEditDialogOpen(true)
  }

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      booking.room_type.toLowerCase().includes(searchRoomType.toLowerCase()) &&
      booking.status.toLowerCase().includes(searchStatus.toLowerCase()) &&
      (!searchCheckin || new Date(booking.start_date) >= new Date(searchCheckin)) &&
      (!searchCheckout || new Date(booking.end_date) <= new Date(searchCheckout))
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Management</CardTitle>
        <CardDescription>View and manage all room bookings</CardDescription>
        <div className="grid grid-cols-3 space-y-4 ml-2">
          <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
            <Input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
            <Input
              type="text"
              placeholder="Search room type..."
              value={searchRoomType}
              onChange={(e) => setSearchRoomType(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-4 ">
            <Input
              type="text"
              placeholder="Search status..."
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="pt-4 gap-8 z-10 ml-2">

          <div className="grid grid-cols-2 z-10 ml-2">
            <div>Search Check-in</div>
            <div>Search Check-out</div>
          </div>

          <div className="grid grid-cols-2 gap-6 z-10 ml-2">
            <div className="flex flex-row">
              <input
                className="border rounded"
                style={{ width: "80%" }}
                type="date"
                value={searchCheckin}
                onChange={(e) =>
                  setSearchCheckin(e.target.value ? format(new Date(e.target.value), "yyyy-MM-dd") : ""
                  )} />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-row">
              <input
                className="w-full  border rounded"
                style={{ width: "80%" }}
                type="date"
                value={searchCheckout}
                onChange={(e) =>
                  setSearchCheckout(e.target.value ? format(new Date(e.target.value), "yyyy-MM-dd") : ""
                  )} />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Room Type</TableHead>
              <TableHead>Persons</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.customer_name}</TableCell>
                <TableCell>{booking.room_type}</TableCell>
                <TableCell>{booking.no_persons}</TableCell>
                <TableCell>{booking.start_date}</TableCell>
                <TableCell>{booking.end_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
              <DialogDescription>Update the details for this booking</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEditBooking)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="no_persons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Persons</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-out Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Update Booking</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

