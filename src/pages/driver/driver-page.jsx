"use client"

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AcceptedTrips } from "./components/accepted-trips"
import { PendingRequests } from "./components/pending-requests"

export const Metadata = {
  title: "Driver Dashboard",
  description: "Driver dashboard for managing ride services",
}

const DriverPage = () => {
  // Sample driver data - in a real app, this would come from an API
  const driverData = {
    id: "d-123456",
    name: "John Smith",
    email: "driver@example.com",
    phone: "(555) 123-4567",
    avatar: "/placeholder.svg?height=40&width=40",
    vehicle: "Toyota Camry",
    licensePlate: "ABC-1234",
    rating: 4.8,
    totalTrips: 342,
    totalEarnings: 24680,
    availableBalance: 580.25,
    status: "online",
    notifications: 3,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Driver Dashboard</h2>
        </div>
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">Ride Requests</TabsTrigger>
            <TabsTrigger value="completed">Accepted Trips</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <PendingRequests />
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <AcceptedTrips />
          </TabsContent>
          
        </Tabs>
      </div>
    </div>
  )
}

export default DriverPage

