"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { CalendarIcon, MapPinIcon, ArrowLeftIcon, SaveIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Mock data for a specific itinerary
const mockItinerary = {
  id: 1,
  name: "Summer Vacation",
  numberOfPersons: 3,
  createdAt: new Date(2023, 5, 10),
  status: "upcoming", // Custom status: upcoming, ongoing, completed
  startDate: new Date(2023, 7, 15),
  endDate: new Date(2023, 7, 25),
  destinations: ["New York", "Miami"],
  hotelItems: [
    {
      id: 101,
      hotelId: 1,
      hotelName: "Grand Plaza Hotel",
      city: "New York",
      startDate: new Date(2023, 7, 15),
      endDate: new Date(2023, 7, 18),
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 102,
      hotelId: 2,
      hotelName: "Seaside Resort",
      city: "Miami",
      startDate: new Date(2023, 7, 19),
      endDate: new Date(2023, 7, 25),
      image: "/placeholder.svg?height=300&width=500",
    },
  ],
  scheduleItems: [
    {
      id: 201,
      startTime: new Date(2023, 7, 16, 10, 0),
      endTime: new Date(2023, 7, 16, 13, 0),
      location: "Central Park",
      description: "Morning walk and picnic",
    },
    {
      id: 202,
      startTime: new Date(2023, 7, 17, 18, 0),
      endTime: new Date(2023, 7, 17, 21, 0),
      location: "Broadway",
      description: "Watch a musical",
    },
    {
      id: 203,
      startTime: new Date(2023, 7, 20, 9, 0),
      endTime: new Date(2023, 7, 20, 16, 0),
      location: "Miami Beach",
      description: "Beach day and water sports",
    },
  ],
}

export default function EditItineraryPage() {
  const params = useParams()
  const router = useRouter()
  const itineraryId = params.id

  // In a real app, you would fetch the itinerary data based on the ID
  const [itinerary, setItinerary] = useState(mockItinerary)
  const [formData, setFormData] = useState({
    name: itinerary.name,
    numberOfPersons: itinerary.numberOfPersons,
    startDate: itinerary.startDate ? format(itinerary.startDate, "yyyy-MM-dd") : "",
    endDate: itinerary.endDate ? format(itinerary.endDate, "yyyy-MM-dd") : "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // In a real app, you would call an API to update the itinerary

    const updatedItinerary = {
      ...itinerary,
      name: formData.name,
      numberOfPersons: Number.parseInt(formData.numberOfPersons),
      startDate: formData.startDate ? new Date(formData.startDate) : null,
      endDate: formData.endDate ? new Date(formData.endDate) : null,
    }

    setItinerary(updatedItinerary)

    toast({
      title: "Itinerary Updated",
      description: "Your itinerary has been updated successfully.",
    })

    // Redirect to itinerary detail page
    router.push(`/itineraries/${itinerary.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" className="mb-2 gap-2" asChild>
          <Link href={`/itineraries/${itinerary.id}`}>
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Itinerary
          </Link>
        </Button>

        <h1 className="text-3xl font-bold">Edit Itinerary</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Basic Information</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Itinerary Name
                    </label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="numberOfPersons" className="text-sm font-medium">
                      Number of Travelers
                    </label>
                    <Input
                      id="numberOfPersons"
                      name="numberOfPersons"
                      type="number"
                      min="1"
                      value={formData.numberOfPersons}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="startDate" className="text-sm font-medium">
                        Start Date
                      </label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="startDate"
                          name="startDate"
                          type="date"
                          className="pl-9"
                          value={formData.startDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="endDate" className="text-sm font-medium">
                        End Date
                      </label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="endDate"
                          name="endDate"
                          type="date"
                          className="pl-9"
                          value={formData.endDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" type="button" asChild>
                <Link href={`/itineraries/${itinerary.id}`}>Cancel</Link>
              </Button>
              <Button type="submit" className="gap-2">
                <SaveIcon className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Itinerary Summary</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Destinations</h3>
                    <p>{itinerary.destinations.join(", ") || "No destinations added"}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Accommodations</h3>
                    {itinerary.hotelItems.length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {itinerary.hotelItems.map((hotel) => (
                          <li key={hotel.id} className="flex items-center gap-2 text-sm">
                            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {hotel.hotelName}, {hotel.city}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No accommodations added</p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Activities</h3>
                    {itinerary.scheduleItems.length > 0 ? (
                      <p>{itinerary.scheduleItems.length} activities scheduled</p>
                    ) : (
                      <p>No activities scheduled</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

