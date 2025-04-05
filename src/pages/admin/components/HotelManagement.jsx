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
import { Pencil, Trash2, Plus, Search, ChevronDown, ChevronRight, Star, Bed, Hotel } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllHotels, updateHotel, deleteHotel, getHotelById, getHotelReviews, getHotelRooms } from "@/api/admin";
import { signup } from "@/api/auth";
import { toast } from "react-toastify";

const HotelManagement = () => {
    const [hotels, setHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [currentHotel, setCurrentHotel] = useState(null);
    const [expandedHotelId, setExpandedHotelId] = useState(null);
    const [expandedHotelDetails, setExpandedHotelDetails] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        phone: "",
        name: "",
        address: "",
        city: "",
        latitude: 0.0,
        longitude: 0.0,
        rating: 0.0,
        description: "",
    });

    // Fetch hotels on component mount
    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            setIsLoading(true);
            const response = await getAllHotels();
            setHotels(response.data);
        } catch (error) {
            toast.error("Failed to fetch hotels: " + (error.response?.data?.detail || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateHotel = async () => {
        try {
            setIsLoading(true);
            await signup(
                formData.username,
                formData.email,
                formData.password,
                formData.phone,
                formData.name,
                formData.address,
                "hotel",
                {
                    city: formData.city,
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    rating: formData.rating,
                    description: formData.description,
                }
            );
            setShowCreateDialog(false);
            fetchHotels();
            resetForm();
            toast.success("Hotel created successfully");
        } catch (error) {
            toast.error(error.response?.data?.detail || "Could not create hotel. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditHotel = async () => {
        try {
            setIsLoading(true);
            await updateHotel(currentHotel.id, formData);
            setShowEditDialog(false);
            setExpandedHotelId(null);
            setExpandedHotelDetails(null);
            fetchHotels();
            resetForm();
            toast.success("Hotel updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.detail || "Could not update hotel. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteHotel = async () => {
        try {
            setIsLoading(true);
            await deleteHotel(currentHotel.id);
            setShowDeleteDialog(false);
            fetchHotels();
            toast.success("Hotel deleted successfully");
        } catch (error) {
            toast.error(error.response?.data?.detail || "Could not delete hotel. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const openEditDialog = (hotel) => {
        setCurrentHotel(hotel);
        setFormData({
            name: hotel.name,
            address: hotel.address,
            city: hotel.city,
            email: hotel.email,
            phone: hotel.phone,
            description: hotel.description || "",
        });
        setShowEditDialog(true);
    };

    const openDeleteDialog = (hotel) => {
        setCurrentHotel(hotel);
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
            city: "",
            latitude: 0.0,
            longitude: 0.0,
            rating: 0.0,
            description: "",
        });
        setCurrentHotel(null);
    };

    const toggleExpandHotel = async (hotelId) => {
        if (expandedHotelId === hotelId) {
            setExpandedHotelId(null);
            setExpandedHotelDetails(null);
            return;
        }

        setExpandedHotelId(hotelId);
        setIsLoadingDetails(true);

        try {
            // Fetch detailed hotel information including rooms and reviews
            const hotelResponse = await getHotelById(hotelId);
            const roomsResponse = await getHotelRooms(hotelId);
            const reviewsResponse = await getHotelReviews(hotelId);

            setExpandedHotelDetails({
                hotel: hotelResponse.data,
                rooms: roomsResponse.data,
                reviews: reviewsResponse.data,
            });
        } catch (error) {
            toast.error("Failed to fetch hotel details");
            setExpandedHotelId(null);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const filteredHotels = hotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatRoomType = (type) => {
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

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
                        <CardTitle className="text-2xl font-bold">Hotel Management</CardTitle>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Hotel
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search hotels by name or city..."
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
                    ) : filteredHotels.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No hotels found. {searchQuery ? "Try a different search term." : "Create your first hotel."}
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-10"></TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>City</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredHotels.map((hotel) => (
                                        <>
                                            <TableRow key={hotel.id}>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleExpandHotel(hotel.id)}
                                                        aria-label={expandedHotelId === hotel.id ? "Collapse details" : "Expand details"}
                                                    >
                                                        {expandedHotelId === hotel.id ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{hotel.name}</div>
                                                    <div className="text-sm text-muted-foreground">@{hotel.username}</div>
                                                </TableCell>
                                                <TableCell>{hotel.address}</TableCell>
                                                <TableCell>{hotel.city}</TableCell>
                                                <TableCell>
                                                    <div>{hotel.email}</div>
                                                    <div className="text-sm text-muted-foreground">{hotel.phone}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => openEditDialog(hotel)}
                                                            aria-label="Edit hotel"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="text-destructive hover:bg-destructive/10"
                                                            onClick={() => openDeleteDialog(hotel)}
                                                            aria-label="Delete hotel"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {expandedHotelId === hotel.id && (
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
                                                                            <Hotel className="h-4 w-4 mr-2" />
                                                                            Details
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="rooms">
                                                                            <Bed className="h-4 w-4 mr-2" />
                                                                            Rooms
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="reviews">
                                                                            <Star className="h-4 w-4 mr-2" />
                                                                            Reviews
                                                                        </TabsTrigger>
                                                                    </TabsList>

                                                                    <TabsContent value="details">
                                                                        <div className="rounded-md border bg-background p-6">
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                <div>
                                                                                    <h3 className="text-lg font-semibold mb-4">Hotel Information</h3>
                                                                                    <div className="grid grid-cols-1 gap-3">
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Username:</span>
                                                                                            <p className="font-medium">{expandedHotelDetails?.hotel?.username}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Name:</span>
                                                                                            <p className="font-medium">{expandedHotelDetails?.hotel?.name}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Address:</span>
                                                                                            <p className="font-medium">{expandedHotelDetails?.hotel?.address}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">City:</span>
                                                                                            <p className="font-medium">{expandedHotelDetails?.hotel?.city}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Rating:</span>
                                                                                            <div className="flex items-center">
                                                                                                <span className="font-medium mr-2">{expandedHotelDetails?.hotel?.rating}</span>
                                                                                                {renderStarRating(expandedHotelDetails?.hotel?.rating || 0)}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div>
                                                                                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                                                                                    <div className="grid grid-cols-1 gap-3">
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Email:</span>
                                                                                            <p className="font-medium">{expandedHotelDetails?.hotel?.email}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Phone:</span>
                                                                                            <p className="font-medium">{expandedHotelDetails?.hotel?.phone}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Created:</span>
                                                                                            <p className="font-medium">
                                                                                                {expandedHotelDetails?.hotel?.createdAt ?
                                                                                                    new Date(expandedHotelDetails.hotel.createdAt).toLocaleDateString()
                                                                                                    : 'N/A'}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="md:col-span-2">
                                                                                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                                                                                    <p className="text-muted-foreground">
                                                                                        {expandedHotelDetails?.hotel?.description || 'No description available.'}
                                                                                    </p>
                                                                                </div>

                                                                                <div className="md:col-span-2">
                                                                                    <h3 className="text-lg font-semibold mb-2">Location</h3>
                                                                                    <div className="grid grid-cols-2 gap-3">
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Latitude:</span>
                                                                                            <p className="font-medium">{expandedHotelDetails?.hotel?.latitude}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-muted-foreground">Longitude:</span>
                                                                                            <p className="font-medium">{expandedHotelDetails?.hotel?.longitude}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="mt-4 p-4 bg-muted/30 text-center rounded-md">
                                                                                        <p>Map would be displayed here with these coordinates.</p>
                                                                                        <Button
                                                                                            variant="link"
                                                                                            className="p-0 h-auto"
                                                                                            onClick={() => window.open(`https://maps.google.com/?q=${expandedHotelDetails?.hotel?.latitude},${expandedHotelDetails?.hotel?.longitude}`, '_blank')}
                                                                                        >
                                                                                            View on Google Maps
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </TabsContent>

                                                                    <TabsContent value="rooms">
                                                                        <div className="rounded-md border bg-background">
                                                                            <Table>
                                                                                <TableHeader>
                                                                                    <TableRow>
                                                                                        <TableHead>Room Type</TableHead>
                                                                                        <TableHead>Capacity</TableHead>
                                                                                        <TableHead>Availability</TableHead>
                                                                                        <TableHead>Base Price</TableHead>
                                                                                    </TableRow>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                    {expandedHotelDetails?.rooms.map(room => (
                                                                                        <TableRow key={room.id}>
                                                                                            <TableCell className="font-medium">
                                                                                                {formatRoomType(room.type)}
                                                                                            </TableCell>
                                                                                            <TableCell>{room.roomCapacity} persons</TableCell>
                                                                                            <TableCell>
                                                                                                {room.availableNumber} available / {room.totalNumber} total
                                                                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                                                                    <div
                                                                                                        className="bg-primary h-2 rounded-full"
                                                                                                        style={{ width: `${(room.availableNumber / room.totalNumber) * 100}%` }}
                                                                                                    ></div>
                                                                                                </div>
                                                                                            </TableCell>
                                                                                            <TableCell>${room.basePrice.toFixed(2)}/night</TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                    {expandedHotelDetails?.rooms.length === 0 && (
                                                                                        <TableRow>
                                                                                            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                                                                                No rooms available for this hotel
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
                                                                                        <TableHead>Customer</TableHead>
                                                                                        <TableHead>Rating</TableHead>
                                                                                        <TableHead>Comment</TableHead>
                                                                                        <TableHead>Date</TableHead>
                                                                                    </TableRow>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                    {expandedHotelDetails?.reviews.map(review => (
                                                                                        <TableRow key={review.id}>
                                                                                            <TableCell>{review.customer}</TableCell>
                                                                                            <TableCell>
                                                                                                {renderStarRating(review.rating)}
                                                                                            </TableCell>
                                                                                            <TableCell>{review.comment}</TableCell>
                                                                                            <TableCell>{review.date}</TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                    {expandedHotelDetails?.reviews.length === 0 && (
                                                                                        <TableRow>
                                                                                            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                                                                                No reviews for this hotel
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
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Hotel Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="sm:max-w-[500px]" style={{ maxHeight: "90vh", overflowY: "auto" }}>
                    <DialogHeader>
                        <DialogTitle>Add New Hotel</DialogTitle>
                        <DialogDescription>
                            Enter the details of the new hotel. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <HotelForm formData={formData} handleChange={handleChange} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateHotel} disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Hotel"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Hotel Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-[500px]" style={{ maxHeight: "90vh", overflowY: "auto" }}>
                    <DialogHeader>
                        <DialogTitle>Edit Hotel</DialogTitle>
                        <DialogDescription>
                            Update the hotel details. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <HotelForm formData={formData} handleChange={handleChange} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditHotel} disabled={isLoading}>
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
                            This will permanently delete {currentHotel?.name}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={handleDeleteHotel}
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

// Hotel Form Component
const HotelForm = ({ formData, handleChange }) => {
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
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Hotel Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                        id="city"
                        name="city"
                        value={formData.city}
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
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                        id="longitude"
                        name="longitude"
                        type="number"
                        step="0.000001"
                        value={formData.longitude}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                        id="latitude"
                        name="latitude"
                        type="number"
                        step="0.000001"
                        value={formData.latitude}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>
        </>
    );
};

export default HotelManagement;