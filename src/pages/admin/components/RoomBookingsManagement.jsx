import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Search, 
    Calendar, 
    Filter, 
    ChevronDown, 
    Calendar as CalendarIcon,
    Info
} from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllRoomBookings } from "@/api/admin";

const RoomBookingsManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTab, setSelectedTab] = useState("all");
    const [currentBooking, setCurrentBooking] = useState(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    
    // Filters
    const [selectedHotels, setSelectedHotels] = useState([]);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    
    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [bookings, searchQuery, selectedTab, selectedHotels, selectedRoomTypes, selectedStatuses, dateRange]);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const response = await getAllRoomBookings();
            setBookings(response.data);
        } catch (error) {
            toast.error("Failed to fetch bookings: " + (error.response?.data?.detail || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...bookings];

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(booking => 
                booking.customerName.toLowerCase().includes(query) ||
                booking.hotelName.toLowerCase().includes(query) ||
                String(booking.id).includes(query)
            );
        }
        
        // Apply tab filter
        if (selectedTab === "upcoming") {
            filtered = filtered.filter(booking => 
                new Date(booking.startDate) > new Date()
            );
        } else if (selectedTab === "active") {
            const now = new Date();
            filtered = filtered.filter(booking => 
                new Date(booking.startDate) <= now && 
                new Date(booking.endDate) > now
            );
        } else if (selectedTab === "completed") {
            filtered = filtered.filter(booking => 
                new Date(booking.endDate) <= new Date()
            );
        }
        
        // Apply hotel filter
        if (selectedHotels.length > 0) {
            filtered = filtered.filter(booking => selectedHotels.includes(booking.hotelName));
        }
        
        // Apply room type filter
        if (selectedRoomTypes.length > 0) {
            filtered = filtered.filter(booking => selectedRoomTypes.includes(booking.roomType));
        }
        
        // Apply status filter
        if (selectedStatuses.length > 0) {
            filtered = filtered.filter(booking => selectedStatuses.includes(booking.status));
        }
        
        // Apply date range filter
        if (dateRange?.from) {
            filtered = filtered.filter(booking => {
                const startDate = new Date(booking.startDate);
                return isAfter(startDate, dateRange?.from) || 
                      (dateRange?.to && isBefore(startDate, dateRange?.to));
            });
        }
        
        setFilteredBookings(filtered);
    };
    
    const openDetailsDialog = (booking) => {
        setCurrentBooking(booking);
        setShowDetailsDialog(true);
    };

    // Get unique hotels, room types and statuses for filters
    const uniqueHotels = [...new Set(bookings.map(booking => booking.hotelName))];
    const uniqueRoomTypes = [...new Set(bookings.map(booking => booking.roomType))];
    const uniqueStatuses = [...new Set(bookings.map(booking => booking.status))];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'upcoming':
                return <Badge variant="outline">Upcoming</Badge>;
            case 'active':
                return <Badge variant="primary">Active</Badge>;
            case 'completed':
                return <Badge variant="secondary">Completed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };
    
    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatRoomType = (type) => {
        return type.charAt(0).toUpperCase() + type.slice(1);
    };
    
    const clearAllFilters = () => {
        setSearchQuery("");
        setSelectedHotels([]);
        setSelectedRoomTypes([]);
        setSelectedStatuses([]);
        setDateRange({ from: null, to: null });
    };

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader className="bg-muted/50">
                    <CardTitle className="text-2xl font-bold">Room Bookings Management</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
                        <TabsList>
                            <TabsTrigger value="all">All Bookings</TabsTrigger>
                            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    
                    <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                        <div className="relative flex-1 w-full md:w-auto">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by customer, hotel or booking ID..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex gap-2 md:ml-auto">
                            {/* Date Range Filter */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="justify-start gap-1">
                                        <CalendarIcon className="h-4 w-4" />
                                        {dateRange?.from ? (
                                            dateRange?.to ? (
                                                <>
                                                    {format(dateRange?.from, "MMM d")} - {format(dateRange?.to, "MMM d")}
                                                </>
                                            ) : (
                                                format(dateRange?.from, "MMM d, yyyy")
                                            )
                                        ) : (
                                            "Date Range"
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <CalendarComponent
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            
                            {/* Hotel Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="justify-between gap-1">
                                        <span className="flex items-center gap-1">
                                            <Filter className="h-4 w-4" />
                                            Hotel
                                            {selectedHotels.length > 0 && (
                                                <Badge variant="secondary" className="ml-1">{selectedHotels.length}</Badge>
                                            )}
                                        </span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Filter by Hotel</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {uniqueHotels.map(hotel => (
                                        <DropdownMenuCheckboxItem
                                            key={hotel}
                                            checked={selectedHotels.includes(hotel)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedHotels([...selectedHotels, hotel]);
                                                } else {
                                                    setSelectedHotels(selectedHotels.filter(h => h !== hotel));
                                                }
                                            }}
                                        >
                                            {hotel}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                            {/* Room Type Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="justify-between gap-1">
                                        <span className="flex items-center gap-1">
                                            <Filter className="h-4 w-4" />
                                            Room Type
                                            {selectedRoomTypes.length > 0 && (
                                                <Badge variant="secondary" className="ml-1">{selectedRoomTypes.length}</Badge>
                                            )}
                                        </span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Filter by Room Type</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {uniqueRoomTypes.map(type => (
                                        <DropdownMenuCheckboxItem
                                            key={type}
                                            checked={selectedRoomTypes.includes(type)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedRoomTypes([...selectedRoomTypes, type]);
                                                } else {
                                                    setSelectedRoomTypes(selectedRoomTypes.filter(t => t !== type));
                                                }
                                            }}
                                        >
                                            {formatRoomType(type)}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                            {/* Status Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="justify-between gap-1">
                                        <span className="flex items-center gap-1">
                                            <Filter className="h-4 w-4" />
                                            Status
                                            {selectedStatuses.length > 0 && (
                                                <Badge variant="secondary" className="ml-1">{selectedStatuses.length}</Badge>
                                            )}
                                        </span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {uniqueStatuses.map(status => (
                                        <DropdownMenuCheckboxItem
                                            key={status}
                                            checked={selectedStatuses.includes(status)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedStatuses([...selectedStatuses, status]);
                                                } else {
                                                    setSelectedStatuses(selectedStatuses.filter(s => s !== status));
                                                }
                                            }}
                                        >
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                            {/* Clear Filters Button */}
                            <Button 
                                variant="ghost" 
                                onClick={clearAllFilters}
                                disabled={
                                    !searchQuery && 
                                    selectedHotels.length === 0 && 
                                    selectedRoomTypes.length === 0 && 
                                    selectedStatuses.length === 0 &&
                                    !dateRange?.from
                                }
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No bookings found. {searchQuery || selectedHotels.length > 0 || selectedRoomTypes.length > 0 || selectedStatuses.length > 0 || dateRange?.from ? "Try adjusting your filters." : ""}
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Hotel / Room</TableHead>
                                        <TableHead>Dates</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBookings.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell className="font-medium">{booking.id}</TableCell>
                                            <TableCell>
                                                <div>{booking.customerName}</div>
                                                <div className="text-sm text-muted-foreground">{booking.numberOfPersons} guest{booking.numberOfPersons > 1 ? 's' : ''}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{booking.hotelName}</div>
                                                <div className="text-sm capitalize">{booking.roomType} room</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    <span>{format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d, yyyy")}</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {calculateDuration(booking.startDate, booking.endDate)} night{calculateDuration(booking.startDate, booking.endDate) > 1 ? 's' : ''}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(booking.status)}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                ${booking.price.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openDetailsDialog(booking)}
                                                >
                                                    <Info className="mr-2 h-4 w-4" />
                                                    Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
            
            {/* Booking Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                    </DialogHeader>
                    {currentBooking && (
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Booking ID</h3>
                                    <p className="font-semibold">{currentBooking.id}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                                    <div>{getStatusBadge(currentBooking.status)}</div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer</h3>
                                    <p className="font-semibold">{currentBooking.customerName}</p>
                                    <p className="text-sm">Customer ID: {currentBooking.customerId}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Hotel</h3>
                                    <p className="font-semibold">{currentBooking.hotelName}</p>
                                    <p className="text-sm">Hotel ID: {currentBooking.hotelId}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Room</h3>
                                    <p className="font-semibold capitalize">{currentBooking.roomType}</p>
                                    <p className="text-sm">Room ID: {currentBooking.roomId}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Number of Guests</h3>
                                    <p className="font-semibold">{currentBooking.numberOfPersons}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Check-in Date</h3>
                                    <p className="font-semibold">{format(new Date(currentBooking.startDate), "MMMM d, yyyy")}</p>
                                    <p className="text-sm">{format(new Date(currentBooking.startDate), "h:mm a")}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Check-out Date</h3>
                                    <p className="font-semibold">{format(new Date(currentBooking.endDate), "MMMM d, yyyy")}</p>
                                    <p className="text-sm">{format(new Date(currentBooking.endDate), "h:mm a")}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Duration</h3>
                                    <p className="font-semibold">{calculateDuration(currentBooking.startDate, currentBooking.endDate)} nights</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Price</h3>
                                    <p className="font-semibold">${currentBooking.price.toFixed(2)}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Booking Date</h3>
                                <p className="font-semibold">{format(new Date(currentBooking.createdAt), "MMMM d, yyyy")}</p>
                                <p className="text-sm">{format(new Date(currentBooking.createdAt), "h:mm a")}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RoomBookingsManagement;