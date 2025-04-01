import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RoomManagement from "./components/room-management"
import BookingManagement from "./components/booking-management"
import PriceManagement from "./components/price-management"
import DashboardOverview from "./components/dashboard-overview"
import ReviewsManagement from "./components/reviews-management"

export const Metadata = {
  title: "Hotel Admin Dashboard",
  description: "Admin dashboard for hotel room management",
}

export default function Hotelpage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <DashboardOverview />
          </TabsContent>
          <TabsContent value="rooms" className="space-y-4">
            <RoomManagement />
          </TabsContent>
          <TabsContent value="bookings" className="space-y-4">
            <BookingManagement />
          </TabsContent>
          <TabsContent value="pricing" className="space-y-4">
            <PriceManagement />
          </TabsContent>
          <TabsContent value="reviews" className="space-y-4">
            <ReviewsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

