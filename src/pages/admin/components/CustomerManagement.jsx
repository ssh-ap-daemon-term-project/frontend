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
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { getAllCustomers, updateCustomer, deleteCustomer } from "@/api/admin";
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
                                        <TableHead>Name</TableHead>
                                        <TableHead>Contact Information</TableHead>
                                        <TableHead>Demographics</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCustomers.map((customer) => (
                                        <TableRow key={customer.id}>
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
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="text-destructive hover:bg-destructive/10"
                                                        onClick={() => openDeleteDialog(customer)}
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