"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "./overview-chart"
import { RecentBookings } from "./recent-bookings"
import { RoomTypeDistribution } from "./room-type-distribution"
import { useState, useEffect } from "react"
import { hotelRooms, hotelOccupancy, hotelRevenue, hotelActiveBookings } from "@/api/hotel"
import { toast } from "react-toastify"

export default function DashboardOverview() {

  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Write the function to fetch data for the API hotel.jsx
        const response = await hotelRooms();
        if (!response.ok) {
          setData(0);
        }
        else {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    }

    fetchData();
  }, []);


  const [occupancy, setOccupancy] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Write the function to fetch data for the API hotel.jsx
        const response = await hotelOccupancy();
        if (!response.ok) {
          setOccupancy(0);
        }
        else {
          setOccupancy(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    }

    fetchData();
  }, []);


  const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Write the function to fetch data for the API hotel.jsx
        const response = await hotelRevenue();
        if (!response.ok) {
          setRevenue(0);
        }
        else {
          setRevenue(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    }

    fetchData();
  }, []);

  const [activeBooking, setActiveBooking] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Write the function to fetch data for the API hotel.jsx
        const response = await hotelActiveBookings();
        if (!response.ok) {
          setActiveBooking(0);
        }
        else {
          setActiveBooking(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    }

    fetchData();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data ? data.occupancy_rate_upcoming_30_days : 0}</div>
          <p className="text-xs text-muted-foreground">{data ? data.occupancy_rate_difference : "+0"} from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{occupancy ? occupancy.occupancy_rate_upcoming_30_days : 0}%</div>
          <p className="text-xs text-muted-foreground">{occupancy ? occupancy.occupancy_rate_difference : "+0"}% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${revenue ? revenue.revenue_upcoming_30_days : 0}</div>
          <p className="text-xs text-muted-foreground">{revenue ? revenue.revenue_difference : 0}% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeBooking ? activeBooking.bookings_upcoming_30_days : 0}</div>
          <p className="text-xs text-muted-foreground">{activeBooking ? activeBooking.booking_count_difference : 0}from yesterday</p>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Occupancy Overview</CardTitle>
          <CardDescription>Room occupancy for the next 30 days</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <Overview />
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Room Type Distribution</CardTitle>
          <CardDescription>Current distribution of room types</CardDescription>
        </CardHeader>
        <CardContent>
          <RoomTypeDistribution />
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest booking activities</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentBookings />
        </CardContent>
      </Card>
    </div>
  )
}

