import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  PlusIcon,
  SearchIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react"
import { toast } from "react-toastify"

// Mock data for itineraries
const mockItineraries = [
  {
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
      },
      {
        id: 102,
        hotelId: 2,
        hotelName: "Seaside Resort",
        city: "Miami",
        startDate: new Date(2023, 7, 19),
        endDate: new Date(2023, 7, 25),
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
  },
  {
    id: 2,
    name: "Business Trip",
    numberOfPersons: 1,
    createdAt: new Date(2023, 6, 5),
    status: "upcoming",
    startDate: new Date(2023, 8, 10),
    endDate: new Date(2023, 8, 15),
    destinations: ["Chicago"],
    hotelItems: [
      {
        id: 103,
        hotelId: 4,
        hotelName: "City Center Suites",
        city: "Chicago",
        startDate: new Date(2023, 8, 10),
        endDate: new Date(2023, 8, 15),
      },
    ],
    scheduleItems: [
      {
        id: 204,
        startTime: new Date(2023, 8, 11, 9, 0),
        endTime: new Date(2023, 8, 11, 17, 0),
        location: "Convention Center",
        description: "Annual Industry Conference",
      },
      {
        id: 205,
        startTime: new Date(2023, 8, 12, 12, 0),
        endTime: new Date(2023, 8, 12, 14, 0),
        location: "Downtown Restaurant",
        description: "Lunch meeting with clients",
      },
    ],
  },
  {
    id: 3,
    name: "Anniversary Trip",
    numberOfPersons: 2,
    createdAt: new Date(2023, 3, 15),
    status: "completed",
    startDate: new Date(2023, 4, 20),
    endDate: new Date(2023, 4, 27),
    destinations: ["San Francisco"],
    hotelItems: [
      {
        id: 104,
        hotelId: 5,
        hotelName: "Harbor View Inn",
        city: "San Francisco",
        startDate: new Date(2023, 4, 20),
        endDate: new Date(2023, 4, 27),
      },
    ],
    scheduleItems: [
      {
        id: 206,
        startTime: new Date(2023, 4, 21, 18, 0),
        endTime: new Date(2023, 4, 21, 21, 0),
        location: "Waterfront Restaurant",
        description: "Anniversary dinner",
      },
      {
        id: 207,
        startTime: new Date(2023, 4, 22, 10, 0),
        endTime: new Date(2023, 4, 22, 16, 0),
        location: "Wine Country",
        description: "Wine tasting tour",
      },
    ],
  },
]

export default function ItinerariesPage() {
  const [itineraries, setItineraries] = useState(mockItineraries)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedItinerary, setSelectedItinerary] = useState(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newItinerary, setNewItinerary] = useState({
    name: "",
    numberOfPersons: 1,
  })

  const upcomingItineraries = itineraries.filter((itinerary) => itinerary.status === "upcoming")
  const ongoingItineraries = itineraries.filter((itinerary) => itinerary.status === "ongoing")
  const completedItineraries = itineraries.filter((itinerary) => itinerary.status === "completed")

  const filteredItineraries = (list) => {
    if (!searchQuery) return list

    return list.filter(
      (itinerary) =>
        itinerary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        itinerary.destinations.some((dest) => dest.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  const handleDeleteItinerary = (itinerary) => {
    setSelectedItinerary(itinerary)
    setShowDeleteDialog(true)
  }

  const confirmDeleteItinerary = () => {
    // In a real app, you would call an API to delete the itinerary
    setItineraries(itineraries.filter((i) => i.id !== selectedItinerary.id))
    setShowDeleteDialog(false)

    toast({
      title: "Itinerary Deleted",
      description: `Your itinerary "${selectedItinerary.name}" has been deleted.`,
    })
  }

  const handleCreateItinerary = () => {
    // Validate form
    if (!newItinerary.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an itinerary name.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would call an API to create the itinerary
    const newId = Math.max(...itineraries.map((i) => i.id)) + 1

    const createdItinerary = {
      id: newId,
      name: newItinerary.name,
      numberOfPersons: newItinerary.numberOfPersons,
      createdAt: new Date(),
      status: "upcoming",
      startDate: null,
      endDate: null,
      destinations: [],
      hotelItems: [],
      scheduleItems: [],
    }

    setItineraries([createdItinerary, ...itineraries])
    setShowCreateDialog(false)
    setNewItinerary({ name: "", numberOfPersons: 1 })

    toast({
      title: "Itinerary Created",
      description: `Your itinerary "${createdItinerary.name}" has been created.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Itineraries</h1>
          <p className="text-muted-foreground">Plan and organize your trips</p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search itineraries"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <PlusIcon className="h-4 w-4" />
            <span>New Itinerary</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">
            Upcoming
            {upcomingItineraries.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {upcomingItineraries.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="ongoing">
            Ongoing
            {ongoingItineraries.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {ongoingItineraries.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            {completedItineraries.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {completedItineraries.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {filteredItineraries(upcomingItineraries).length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItineraries(upcomingItineraries).map((itinerary) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  onDelete={() => handleDeleteItinerary(itinerary)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={searchQuery ? "No matching itineraries" : "No upcoming itineraries"}
              description={
                searchQuery
                  ? "Try adjusting your search query"
                  : "You don't have any upcoming itineraries. Create one to get started."
              }
              actionText="Create Itinerary"
              onAction={() => setShowCreateDialog(true)}
            />
          )}
        </TabsContent>

        <TabsContent value="ongoing">
          {filteredItineraries(ongoingItineraries).length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItineraries(ongoingItineraries).map((itinerary) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  onDelete={() => handleDeleteItinerary(itinerary)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={searchQuery ? "No matching itineraries" : "No ongoing itineraries"}
              description={
                searchQuery
                  ? "Try adjusting your search query"
                  : "You don't have any ongoing itineraries at the moment."
              }
              actionText="View Upcoming"
              onAction={() => document.querySelector('[value="upcoming"]').click()}
            />
          )}
        </TabsContent>

        <TabsContent value="completed">
          {filteredItineraries(completedItineraries).length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItineraries(completedItineraries).map((itinerary) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  onDelete={() => handleDeleteItinerary(itinerary)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={searchQuery ? "No matching itineraries" : "No completed itineraries"}
              description={
                searchQuery ? "Try adjusting your search query" : "You don't have any completed itineraries yet."
              }
              actionText="View Upcoming"
              onAction={() => document.querySelector('[value="upcoming"]').click()}
            />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Itinerary</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this itinerary? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedItinerary && (
            <div className="mt-2 rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">{selectedItinerary.name}</p>
              <p className="text-muted-foreground">{selectedItinerary.destinations.join(", ")}</p>
              {selectedItinerary.startDate && selectedItinerary.endDate && (
                <p className="text-muted-foreground">
                  {format(selectedItinerary.startDate, "MMM d, yyyy")} -{" "}
                  {format(selectedItinerary.endDate, "MMM d, yyyy")}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteItinerary}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Itinerary</DialogTitle>
            <DialogDescription>Enter the details for your new travel itinerary.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Itinerary Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Summer Vacation 2023"
                value={newItinerary.name}
                onChange={(e) => setNewItinerary({ ...newItinerary, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="persons" className="text-sm font-medium">
                Number of Travelers
              </label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setNewItinerary({
                      ...newItinerary,
                      numberOfPersons: Math.max(1, newItinerary.numberOfPersons - 1),
                    })
                  }
                  disabled={newItinerary.numberOfPersons <= 1}
                >
                  -
                </Button>
                <Input
                  id="persons"
                  type="number"
                  min="1"
                  className="text-center"
                  value={newItinerary.numberOfPersons}
                  onChange={(e) =>
                    setNewItinerary({
                      ...newItinerary,
                      numberOfPersons: Number.parseInt(e.target.value) || 1,
                    })
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setNewItinerary({
                      ...newItinerary,
                      numberOfPersons: newItinerary.numberOfPersons + 1,
                    })
                  }
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateItinerary}>Create Itinerary</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ItineraryCard({ itinerary, onDelete }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">{itinerary.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <UsersIcon className="h-4 w-4" />
              <span>
                {itinerary.numberOfPersons} {itinerary.numberOfPersons === 1 ? "traveler" : "travelers"}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/itineraries/${itinerary.id}`} className="cursor-pointer">
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/itineraries/${itinerary.id}/edit`} className="cursor-pointer">
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-destructive">
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="mb-3 flex flex-wrap gap-1">
          {itinerary.destinations.map((destination) => (
            <Badge key={destination} variant="secondary">
              {destination}
            </Badge>
          ))}
        </div>

        {itinerary.startDate && itinerary.endDate && (
          <div className="mb-3 flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(itinerary.startDate, "MMM d, yyyy")} - {format(itinerary.endDate, "MMM d, yyyy")}
            </span>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">Accommodations:</p>
          {itinerary.hotelItems.length > 0 ? (
            <div className="space-y-1">
              {itinerary.hotelItems.map((hotel) => (
                <div key={hotel.id} className="flex items-center gap-2 text-sm">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {hotel.hotelName}, {hotel.city}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No accommodations added yet</p>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="secondary" className="w-full" asChild>
          <Link href={`/itineraries/${itinerary.id}`}>View Itinerary</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function EmptyState({ title, description, actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <CalendarIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="mb-6 text-muted-foreground">{description}</p>
      <Button onClick={onAction}>{actionText}</Button>
    </div>
  )
}

