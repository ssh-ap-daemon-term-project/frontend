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
    DialogTrigger,
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
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getAllHotels, createHotel, updateHotel, deleteHotel } from "@/api/admin";
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
            toast({
                variant: "destructive",
                title: "Error fetching hotels",
                description: error.message || "Could not load hotels. Please try again."
            });
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
            toast({
                title: "Hotel created",
                description: "The hotel has been created successfully."
            });
        } catch (error) {
            toast.error(error.response.data.detail || "Could not create hotel. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditHotel = async () => {
        try {
            setIsLoading(true);
            await updateHotel(currentHotel.id, formData);
            setShowEditDialog(false);
            fetchHotels();
            resetForm();
            toast({
                title: "Hotel updated",
                description: "The hotel has been updated successfully."
            });
        } catch (error) {
            toast.error(error.response.data.detail || "Could not update hotel. Please try again.");
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
            toast({
                title: "Hotel deleted",
                description: "The hotel has been deleted successfully."
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error deleting hotel",
                description: error.message || "Could not delete hotel. Please try again."
            });
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

    const filteredHotels = hotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                        <TableHead>Name</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>City</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredHotels.map((hotel) => (
                                        <TableRow key={hotel.id}>
                                            <TableCell className="font-medium">{hotel.name}</TableCell>
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