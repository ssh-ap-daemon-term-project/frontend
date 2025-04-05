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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Search, ChevronDown, ChevronRight, User, Calendar, Star, Car, BriefcaseBusiness } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllCustomers, updateCustomer, deleteCustomer, getCustomerById, getCustomerBookings, getCustomerReviews, getCustomerRideBookings, getCustomerItineraries } from "@/api/admin";
import { signup } from "@/api/auth";
import { toast } from "react-toastify";
import { format } from "date-fns";

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [expandedCustomerId, setExpandedCustomerId] = useState(null);
    const [expandedCustomerDetails, setExpandedCustomerDetails] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        phone: "",
        name: "",
        address: "",
        dob: "",
        gender: "male",
    });

    // Fetch customers on component mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setIsLoading(true);
            const response = await getAllCustomers();
            setCustomers(response.data);
        } catch (error) {
            toast.error("Failed to fetch customers: " + (error.response?.data?.detail || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name) => (value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateCustomer = async () => {
        try {
            setIsLoading(true);
            await signup(
                formData.username,
                formData.email,
                formData.password,
                formData.phone,
                formData.name,
                formData.address,
                "customer",
                {
                    dob: formData.dob,
                    gender: formData.gender,
                }
            );
            setShowCreateDialog(false);
            fetchCustomers();
            resetForm();
            toast.success("Customer created successfully");
        } catch (error) {
            toast.error("Failed to create customer: " + (error.response?.data?.detail || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditCustomer = async () => {
        try {
            setIsLoading(true);
            await updateCustomer(currentCustomer.id, formData);
            setShowEditDialog(false);
            fetchCustomers();
            resetForm();
            toast.success("Customer updated successfully");
        } catch (error) {
            toast.error("Failed to update customer: " + (error.response?.data?.detail || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCustomer = async () => {
        try {
            setIsLoading(true);
            await deleteCustomer(currentCustomer.id);
            setShowDeleteDialog(false);
            fetchCustomers();
            toast.success("Customer deleted successfully");
        } catch (error) {
            toast.error("Failed to delete customer: " + (error.response?.data?.detail || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const toggleExpandCustomer = async (customerId) => {
        if (expandedCustomerId === customerId) {
            setExpandedCustomerId(null);
            setExpandedCustomerDetails(null);
            return;
        }

        setExpandedCustomerId(customerId);
        setIsLoadingDetails(true);

        try {
            // Fetch all customer details
            const customerResponse = await getCustomerById(customerId);
            const bookingsResponse = await getCustomerBookings(customerId);
            const rideBookingsResponse = await getCustomerRideBookings(customerId);
            const reviewsResponse = await getCustomerReviews(customerId);
            const itinerariesResponse = await getCustomerItineraries(customerId);

            setExpandedCustomerDetails({
                customer: customerResponse.data,
                bookings: bookingsResponse.data,
                rideBookings: rideBookingsResponse.data,
                reviews: reviewsResponse.data,
                itinerariesCount: itinerariesResponse.data.count,
            });
        } catch (error) {
            toast.error("Failed to fetch customer details");
            setExpandedCustomerId(null);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const openEditDialog = (customer) => {
        setCurrentCustomer(customer);
        setFormData({
            username: customer.username,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            dob: customer.dob ? format(new Date(customer.dob), "yyyy-MM-dd") : "",
            gender: customer.gender || "male",
            // password not included - will only be set if provided
        });
        setShowEditDialog(true);
    };

    const openDeleteDialog = (customer) => {
        setCurrentCustomer(customer);
        setShowDeleteDialog(true);
    };

    const resetForm = () => {
        setFormData({
            username: "",
            email: "",
            password: "",
            phone: "",
            name: "",
            address: "",
            dob: "",
            gender: "male",
        });
        setCurrentCustomer(null);
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
    );

    const renderStarRating = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
        }

        if (hasHalfStar) {
            stars.push(
                <div key="half" className="relative">
                    <Star className="h-4 w-4 text-gray-300" />
                    <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                </div>
            );
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
        }

        return <div className="flex">{stars}</div>;
    };

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader className="bg-muted/50">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">Customer Management</CardTitle>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Customer
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search customers by name, email, or phone..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No customers found. {searchQuery ? "Try a different search term." : "Create your first customer."}
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-10"></TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Contact Information</TableHead>
                                        <TableHead>Demographics</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCustomers.map((customer) => (
                                        <>
                                            <TableRow key={customer.id}>
                                                <TableCell>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => toggleExpandCustomer(customer.id)}
                                                        aria-label={expandedCustomerId === customer.id ? "Collapse details" : "Expand details"}
                                                    >
                                                        {expandedCustomerId === customer.id ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {customer.name}
                                                    <div className="text-xs text-muted-foreground">@{customer.username}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>{customer.email}</div>
                                                    <div className="text-sm text-muted-foreground">{customer.phone}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>Gender: {customer.gender}</div>
                                                    <div>DOB: {customer.dob ? format(new Date(customer.dob), "MMM dd, yyyy") : "Not set"}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">{customer.address}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => openEditDialog(customer)}
                                                            aria-label="Edit customer"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="text-destructive hover:bg-destructive/10"
                                                            onClick={() => openDeleteDialog(customer)}
                                                            aria-label="Delete customer"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {expandedCustomerId === customer.id && (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="p-0">
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
                                                                        <TabsTrigger value="room-bookings">
                                                                            <Calendar className="h-4 w-4 mr-2" /> 
                                                                            Room Bookings
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="ride-bookings">
                                                                            <Car className="h-4 w-4 mr-2" /> 
                                                                            Ride Bookings
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="reviews">
                                                                            <Star className="h-4 w-4 mr-2" /> 
                                                                            Reviews
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="itineraries">
                                                                            <BriefcaseBusiness className="h-4 w-4 mr-2" /> 
                                                                            Itineraries
                                                                        </TabsTrigger>
                                                                    </TabsList>

                                                                    <TabsContent value="details">
                                                                        <div className="rounded-md border bg-background p-6">
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                <div>
                                                                                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                                                                                    <div className="grid grid-cols-1 gap-3">
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Name:</span>
                                                                                            <p className="font-medium">{expandedCustomerDetails?.customer?.name}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Username:</span>
                                                                                            <p className="font-medium">{expandedCustomerDetails?.customer?.username}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Gender:</span>
                                                                                            <p className="font-medium">{expandedCustomerDetails?.customer?.gender}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Date of Birth:</span>
                                                                                            <p className="font-medium">
                                                                                                {expandedCustomerDetails?.customer?.dob ? 
                                                                                                    format(new Date(expandedCustomerDetails.customer.dob), "MMMM d, yyyy") 
                                                                                                    : 'Not set'}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div>
                                                                                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                                                                                    <div className="grid grid-cols-1 gap-3">
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Email:</span>
                                                                                            <p className="font-medium">{expandedCustomerDetails?.customer?.email}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Phone:</span>
                                                                                            <p className="font-medium">{expandedCustomerDetails?.customer?.phone}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Address:</span>
                                                                                            <p className="font-medium">{expandedCustomerDetails?.customer?.address}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Member Since:</span>
                                                                                            <p className="font-medium">
                                                                                                {expandedCustomerDetails?.customer?.createdAt ? 
                                                                                                    format(new Date(expandedCustomerDetails.customer.createdAt), "MMMM d, yyyy") 
                                                                                                    : 'N/A'}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div className="md:col-span-2">
                                                                                    <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
                                                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                                        <div className="bg-primary/10 p-4 rounded-lg">
                                                                                            <div className="text-sm text-muted-foreground">Room Bookings</div>
                                                                                            <div className="text-2xl font-bold mt-1">{expandedCustomerDetails?.roomBookings?.length || 0}</div>
                                                                                        </div>
                                                                                        <div className="bg-primary/10 p-4 rounded-lg">
                                                                                            <div className="text-sm text-muted-foreground">Ride Bookings</div>
                                                                                            <div className="text-2xl font-bold mt-1">{expandedCustomerDetails?.rideBookings?.length || 0}</div>
                                                                                        </div>
                                                                                        <div className="bg-primary/10 p-4 rounded-lg">
                                                                                            <div className="text-sm text-muted-foreground">Reviews</div>
                                                                                            <div className="text-2xl font-bold mt-1">{expandedCustomerDetails?.reviews?.length || 0}</div>
                                                                                        </div>
                                                                                        <div className="bg-primary/10 p-4 rounded-lg">
                                                                                            <div className="text-sm text-muted-foreground">Itineraries</div>
                                                                                            <div className="text-2xl font-bold mt-1">{expandedCustomerDetails?.itinerariesCount || 0}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </TabsContent>

                                                                    <TabsContent value="room-bookings">
                                                                        <div className="rounded-md border bg-background">
                                                                            <Table>
                                                                                <TableHeader>
                                                                                    <TableRow>
                                                                                        <TableHead>Hotel</TableHead>
                                                                                        <TableHead>Room Type</TableHead>
                                                                                        <TableHead>Dates</TableHead>
                                                                                        <TableHead>Guests</TableHead>
                                                                                        <TableHead>Status</TableHead>
                                                                                        <TableHead>Price</TableHead>
                                                                                    </TableRow>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                    {expandedCustomerDetails?.roomBookings?.map(booking => (
                                                                                        <TableRow key={booking.id}>
                                                                                            <TableCell className="font-medium">{booking.hotelName}</TableCell>
                                                                                            <TableCell className="capitalize">{booking.roomType}</TableCell>
                                                                                            <TableCell>
                                                                                                <div>{format(new Date(booking.startDate), "MMM dd, yyyy")}</div>
                                                                                                <div className="text-muted-foreground text-xs">to</div>
                                                                                                <div>{format(new Date(booking.endDate), "MMM dd, yyyy")}</div>
                                                                                            </TableCell>
                                                                                            <TableCell>{booking.numberOfPersons}</TableCell>
                                                                                            <TableCell>
                                                                                                <Badge 
                                                                                                    variant={booking.status === "confirmed" ? "default" : 
                                                                                                        booking.status === "completed" ? "success" : 
                                                                                                        booking.status === "pending" ? "warning" : 
                                                                                                        "destructive"}>
                                                                                                    {booking.status}
                                                                                                </Badge>
                                                                                            </TableCell>
                                                                                            <TableCell>${booking.price.toFixed(2)}</TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                    {(!expandedCustomerDetails?.roomBookings || expandedCustomerDetails.roomBookings.length === 0) && (
                                                                                        <TableRow>
                                                                                            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                                                                                No room bookings found for this customer
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    )}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </div>
                                                                    </TabsContent>

                                                                    <TabsContent value="ride-bookings">
                                                                        <div className="rounded-md border bg-background">
                                                                            <Table>
                                                                                <TableHeader>
                                                                                    <TableRow>
                                                                                        <TableHead>Driver</TableHead>
                                                                                        <TableHead>Vehicle</TableHead>
                                                                                        <TableHead>Pickup</TableHead>
                                                                                        <TableHead>Destination</TableHead>
                                                                                        <TableHead>Status</TableHead>
                                                                                        <TableHead>Price</TableHead>
                                                                                    </TableRow>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                    {expandedCustomerDetails?.rideBookings?.map(booking => (
                                                                                        <TableRow key={booking.id}>
                                                                                            <TableCell className="font-medium">{booking.driverName}</TableCell>
                                                                                            <TableCell>{booking.carModel}</TableCell>
                                                                                            <TableCell>
                                                                                                <div>{booking.pickupLocation}</div>
                                                                                                <div className="text-xs text-muted-foreground">
                                                                                                    {format(new Date(booking.pickupTime), "MMM dd, yyyy h:mm a")}
                                                                                                </div>
                                                                                            </TableCell>
                                                                                            <TableCell>{booking.dropLocation}</TableCell>
                                                                                            <TableCell>
                                                                                                <Badge 
                                                                                                    variant={booking.status === "confirmed" ? "default" : 
                                                                                                        booking.status === "completed" ? "success" : 
                                                                                                        booking.status === "pending" ? "warning" : 
                                                                                                        "destructive"}>
                                                                                                    {booking.status}
                                                                                                </Badge>
                                                                                            </TableCell>
                                                                                            <TableCell>${booking.price.toFixed(2)}</TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                    {(!expandedCustomerDetails?.rideBookings || expandedCustomerDetails.rideBookings.length === 0) && (
                                                                                        <TableRow>
                                                                                            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                                                                                No ride bookings found for this customer
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    )}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </div>
                                                                    </TabsContent>

                                                                    <TabsContent value="reviews">
                                                                        <div className="rounded-md border bg-background">
                                                                            <Table>
                                                                                <TableHeader>
                                                                                    <TableRow>
                                                                                        <TableHead>Hotel</TableHead>
                                                                                        <TableHead>Rating</TableHead>
                                                                                        <TableHead>Comment</TableHead>
                                                                                        <TableHead>Date</TableHead>
                                                                                    </TableRow>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                    {expandedCustomerDetails?.reviews?.map(review => (
                                                                                        <TableRow key={review.id}>
                                                                                            <TableCell className="font-medium">{review.hotelName}</TableCell>
                                                                                            <TableCell>
                                                                                                {renderStarRating(review.rating)}
                                                                                            </TableCell>
                                                                                            <TableCell>{review.comment}</TableCell>
                                                                                            <TableCell>{format(new Date(review.date), "MMM dd, yyyy")}</TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                    {(!expandedCustomerDetails?.reviews || expandedCustomerDetails.reviews.length === 0) && (
                                                                                        <TableRow>
                                                                                            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                                                                                No reviews found for this customer
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    )}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </div>
                                                                    </TabsContent>

                                                                    <TabsContent value="itineraries">
                                                                        <div className="rounded-md border bg-background p-6">
                                                                            <div className="text-center py-4">
                                                                                <div className="text-4xl font-bold mb-2">{expandedCustomerDetails?.itinerariesCount || 0}</div>
                                                                                <p className="text-muted-foreground">Total Itineraries Created</p>
                                                                            </div>
                                                                        </div>
                                                                    </TabsContent>
                                                                </Tabs>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Customer Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="sm:max-w-[500px]" style={{ maxHeight: "90vh", overflowY: "auto" }}>
                    <DialogHeader>
                        <DialogTitle>Add New Customer</DialogTitle>
                        <DialogDescription>
                            Enter the details of the new customer. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <CustomerForm 
                            formData={formData} 
                            handleChange={handleChange} 
                            handleSelectChange={handleSelectChange}
                            isCreating={true} 
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateCustomer} disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Customer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Customer Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-[500px]" style={{ maxHeight: "90vh", overflowY: "auto" }}>
                    <DialogHeader>
                        <DialogTitle>Edit Customer</DialogTitle>
                        <DialogDescription>
                            Update the customer details. Leave password blank to keep current password.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <CustomerForm 
                            formData={formData} 
                            handleChange={handleChange} 
                            handleSelectChange={handleSelectChange}
                            isCreating={false} 
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditCustomer} disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {currentCustomer?.name}'s account and all associated data.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={handleDeleteCustomer}
                            disabled={isLoading}
                        >
                            {isLoading ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

// Customer Form Component
const CustomerForm = ({ formData, handleChange, handleSelectChange, isCreating }) => {
    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">
                        Password {!isCreating && "(leave blank to keep current)"}
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={isCreating}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                        id="dob"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                        value={formData.gender} 
                        onValueChange={handleSelectChange("gender")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    );
};

export default CustomerManagement;