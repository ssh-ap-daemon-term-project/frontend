import React from 'react'
import HotelsPage from './components/hotel-page'
import BookingsPage from './components/cust-bookings'
import ItinerariesPage from './components/itinerary-main'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CustChat from './components/cust-chat'

export const Metadata = {
    title: " Customer Dashboard",
    description: "Customer dashboard for availaing travel, rental and hotel services",
}

const CustomerPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="hotels" className="space-y-4">
          <TabsList>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
            <TabsTrigger value="chat">Chat-box</TabsTrigger>
          </TabsList>

          <TabsContent value="hotels" className="space-y-4">
            <HotelsPage />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <BookingsPage />
          </TabsContent>

          <TabsContent value="itineraries" className="space-y-4">
            <ItinerariesPage />
          </TabsContent>
          <TabsContent value="chat" className="space-y-4">
            <CustChat  />
          </TabsContent>
          
        </Tabs>
      </div>
    </div>
  )
}

export default CustomerPage