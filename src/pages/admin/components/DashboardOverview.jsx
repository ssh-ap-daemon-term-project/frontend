"use client"

import { useState, useEffect } from "react"
import { Users, Hotel, Car, Calendar, CreditCard, TrendingUp, MapPin, Star, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend,
} from "recharts"

import { getDashboardData } from "@/api/admin"


const data = {
    totalUsers: 1245,
    totalHotels: 87,
    totalDrivers: 156,
    totalBookings: 3421,
    totalRevenue: 287650,
    userTypes: [
        { name: "Customers", value: 980 },
        { name: "Hotels", value: 87 },
        { name: "Drivers", value: 156 },
        { name: "Admins", value: 22 },
    ],
    recentBookings: [
        {
            id: 1,
            customer: "John Doe",
            hotel: "Grand Plaza",
            room: "Luxury",
            startDate: "2025-04-01",
            endDate: "2025-04-05",
            amount: 1250,
        },
        {
            id: 2,
            customer: "Jane Smith",
            hotel: "Seaside Resort",
            room: "Suite",
            startDate: "2025-04-02",
            endDate: "2025-04-07",
            amount: 2100,
        },
        {
            id: 3,
            customer: "Robert Johnson",
            hotel: "Mountain View",
            room: "Deluxe",
            startDate: "2025-04-03",
            endDate: "2025-04-06",
            amount: 1450,
        },
        {
            id: 4,
            customer: "Emily Davis",
            hotel: "City Center",
            room: "Basic",
            startDate: "2025-04-04",
            endDate: "2025-04-08",
            amount: 950,
        },
    ],
    recentUsers: [
        { id: 1, name: "Michael Brown", email: "michael@example.com", type: "customer", joined: "2025-04-01" },
        { id: 2, name: "Luxury Suites", email: "info@luxurysuites.com", type: "hotel", joined: "2025-04-02" },
        { id: 3, name: "David Wilson", email: "david@example.com", type: "driver", joined: "2025-04-03" },
        { id: 4, name: "Sarah Miller", email: "sarah@example.com", type: "customer", joined: "2025-04-04" },
    ],
    bookingsByMonth: [
        { name: "Jan", rooms: 240, rides: 120 },
        { name: "Feb", rooms: 300, rides: 150 },
        { name: "Mar", rooms: 280, rides: 180 },
        { name: "Apr", rooms: 320, rides: 200 },
        { name: "May", rooms: 380, rides: 250 },
        { name: "Jun", rooms: 420, rides: 280 },
    ],
    popularHotels: [
        { name: "Grand Plaza", bookings: 145, rating: 4.8 },
        { name: "Seaside Resort", bookings: 132, rating: 4.7 },
        { name: "Mountain View", bookings: 118, rating: 4.9 },
        { name: "City Center", bookings: 105, rating: 4.6 },
        { name: "Riverside Inn", bookings: 98, rating: 4.5 },
    ],
}

const DashboardOverview = () => {
    // In a real application, you would fetch this data from your API
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalHotels: 0,
        totalDrivers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        userTypes: [],
        recentBookings: [],
        recentUsers: [],
        bookingsByMonth: [],
        popularHotels: [],
    })

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchReviews() {
          setIsLoading(true);
          try {
            const response = await getDashboardData();
            
            if (response.status === 200) {
              setStats(response.data);
            } else {
              // Fallback to mock data in development
              console.error("Failed to load reviews from API");
              toast.error("Failed to load reviews");
            }
          } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error("Error loading reviews");
            // Keep using mock data on error
          } finally {
            setIsLoading(false);
          }
        }
      
        fetchReviews();
      }, []);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Welcome Leviathan!!</h1>
                <div className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsContent value="overview" className="space-y-4">
                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Hotels</CardTitle>
                                <Hotel className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalHotels.toLocaleString()}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Drivers</CardTitle>
                                <Car className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalDrivers.toLocaleString()}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Booking Overview</CardTitle>
                                <CardDescription>Room and ride bookings over the last 6 months</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={stats.bookingsByMonth}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="rooms" fill="#0088FE" name="Room Bookings" />
                                        <Bar dataKey="rides" fill="#00C49F" name="Ride Bookings" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>User Distribution</CardTitle>
                                <CardDescription>Breakdown of user types in the system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie
                                            data={stats.userTypes}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {stats.userTypes.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Bookings</CardTitle>
                                <CardDescription>Latest room bookings in the system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {stats.recentBookings.map((booking) => (
                                        <div className="flex items-center" key={booking.id}>
                                            <div className="flex items-center justify-center rounded-full bg-primary/10 p-2 mr-4">
                                                <Calendar className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="space-y-1 flex-1 min-w-0">
                                                <p className="text-sm font-medium leading-none truncate">
                                                    {booking.customer} - {booking.hotel}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {booking.room} • {booking.startDate} to {booking.endDate}
                                                </p>
                                            </div>
                                            <div className="font-medium">${booking.amount}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>New Users</CardTitle>
                                <CardDescription>Recently registered users</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {stats.recentUsers.map((user) => (
                                        <div className="flex items-center" key={user.id}>
                                            <div className="flex items-center justify-center rounded-full bg-primary/10 p-2 mr-4">
                                                {user.type === "customer" && <Users className="h-5 w-5 text-primary" />}
                                                {user.type === "hotel" && <Hotel className="h-5 w-5 text-primary" />}
                                                {user.type === "driver" && <Car className="h-5 w-5 text-primary" />}
                                                {user.type === "admin" && <Activity className="h-5 w-5 text-primary" />}
                                            </div>
                                            <div className="space-y-1 flex-1 min-w-0">
                                                <p className="text-sm font-medium leading-none truncate">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {user.email} • {user.type}
                                                </p>
                                            </div>
                                            <div className="text-sm text-muted-foreground">{user.joined}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default DashboardOverview

