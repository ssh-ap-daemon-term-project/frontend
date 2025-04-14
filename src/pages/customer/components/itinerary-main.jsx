import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
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
import { 
  createItinerary, 
  getCustomerItineraries, 
  deleteItinerary 
} from "@/api/itineraryApi"

export default function ItinerariesPage() {
  const navigate = useNavigate()
  const [itineraries, setItineraries] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedItinerary, setSelectedItinerary] = useState(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newItinerary, setNewItinerary] = useState({
    name: "",
    numberOfPersons: 1,
  })
  const [loading, setLoading] = useState(false)
  const [isLoadingItineraries, setIsLoadingItineraries] = useState(true)

  // Ensure itineraries is always an array before filtering
  const safeItineraries = Array.isArray(itineraries) ? itineraries : [];
  // Filter itineraries by date using the safe array
  const upcomingItineraries = safeItineraries.filter((itinerary) => {
    if (!itinerary?.startDate || !itinerary?.endDate) return false;
    
    const startDate = new Date(itinerary.startDate)
    const endDate = new Date(itinerary.endDate)
    const today = new Date()
    return startDate > today
  })
  
  const ongoingItineraries = safeItineraries.filter((itinerary) => {
    if (!itinerary?.startDate || !itinerary?.endDate) return false;
    
    const startDate = new Date(itinerary.startDate)
    const endDate = new Date(itinerary.endDate)
    const today = new Date()
    return startDate <= today && endDate > today
  })
  
  const completedItineraries = safeItineraries.filter((itinerary) => {
    if (!itinerary?.endDate) return false;
    
    const endDate = new Date(itinerary.endDate)
    const today = new Date()
    return endDate <= today
  })

  useEffect(() => {
    // Fetch itineraries from the API
    const fetchItineraries = async () => {
      setIsLoadingItineraries(true)
      try {
        const response = await getCustomerItineraries()
        // Ensure we always set an array, even if the API returns something unexpected
        const data = response?.data;
        setItineraries(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching itineraries:", err)
        toast.error("Failed to load itineraries. Please try again.")
        setItineraries([])
      } finally {
        setIsLoadingItineraries(false)
      }
    }

    fetchItineraries()
  }, [])

  const filteredItineraries = (list) => {
    // Ensure list is always an array
    const safeList = Array.isArray(list) ? list : [];
    
    if (!searchQuery) return safeList;

    return safeList.filter(
      (itinerary) =>
        (itinerary?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(itinerary?.destinations) && itinerary.destinations.some((dest) => 
          dest && dest.toLowerCase().includes(searchQuery.toLowerCase())
        )),
    )
  }

  const handleDeleteItinerary = (itinerary) => {
    if (!itinerary) return;
    
    setSelectedItinerary(itinerary)
    setShowDeleteDialog(true)
  }

  const confirmDeleteItinerary = async () => {
    if (!selectedItinerary?.id) {
      setShowDeleteDialog(false)
      return
    }
    
    try {
      await deleteItinerary(selectedItinerary.id)
      
      // Update local state after successful deletion
      setItineraries(safeItineraries.filter((i) => i.id !== selectedItinerary.id))
      
      toast.success(`Your itinerary "${selectedItinerary.name || 'Unnamed'}" has been deleted.`)
    } catch (err) {
      console.error("Error deleting itinerary:", err)
      toast.error("Failed to delete itinerary. Please try again.")
    } finally {
      setShowDeleteDialog(false)
      setSelectedItinerary(null)
    }
  }

  const handleCreateItinerary = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form data
      if (!newItinerary.name.trim()) {
        toast.error("Please provide an itinerary name")
        setLoading(false)
        return
      }
      
      // Call the API to create a new itinerary
      const response = await createItinerary(newItinerary);
      
      // Close dialog and reset form
      setShowCreateDialog(false)
      setNewItinerary({
        name: "",
        numberOfPersons: 1,
      })
      
      // Navigate to the newly created itinerary
      toast.success("Itinerary created successfully!")
      
      if (response?.id) {
        navigate(`/itineraries/${response.id}`)
      } else {
        // If no ID was returned, refresh the list instead
        const refreshResponse = await getCustomerItineraries()
        const refreshData = refreshResponse?.data;
        setItineraries(Array.isArray(refreshData) ? refreshData : [])
      }
    } catch (err) {
      console.error("Error creating itinerary:", err)
      toast.error(err.response?.data?.message || "Failed to create itinerary")
    } finally {
      setLoading(false)
    }
  };

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

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All
            {safeItineraries.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {safeItineraries.length}
              </Badge>
            )}
          </TabsTrigger>
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

        {isLoadingItineraries ? (
          <div className="flex justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            <TabsContent value="all">
              {filteredItineraries(safeItineraries).length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredItineraries(safeItineraries).map((itinerary) => (
                    <ItineraryCard
                      key={itinerary?.id || `all-${Math.random()}`}
                      itinerary={itinerary}
                      onDelete={() => handleDeleteItinerary(itinerary)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={searchQuery ? "No matching itineraries" : "No itineraries"}
                  description={
                    searchQuery
                      ? "Try adjusting your search query"
                      : "You don't have any itineraries. Create one to get started."
                  }
                  actionText="Create Itinerary"
                  onAction={() => setShowCreateDialog(true)}
                />
              )}
            </TabsContent>
            <TabsContent value="upcoming">
              {filteredItineraries(upcomingItineraries).length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredItineraries(upcomingItineraries).map((itinerary) => (
                    <ItineraryCard
                      key={itinerary?.id || `upcoming-${Math.random()}`}
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
                      key={itinerary?.id || `ongoing-${Math.random()}`}
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
                  onAction={() => {
                    const upcomingTab = document.querySelector('[value="upcoming"]');
                    if (upcomingTab) upcomingTab.click();
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="completed">
              {filteredItineraries(completedItineraries).length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredItineraries(completedItineraries).map((itinerary) => (
                    <ItineraryCard
                      key={itinerary?.id || `completed-${Math.random()}`}
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
                  onAction={() => {
                    const upcomingTab = document.querySelector('[value="upcoming"]');
                    if (upcomingTab) upcomingTab.click();
                  }}
                />
              )}
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Delete Confirmation Dialog */}
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
              <p className="font-medium">{selectedItinerary.name || 'Unnamed Itinerary'}</p>
              <p className="text-muted-foreground">
                {Array.isArray(selectedItinerary.destinations) 
                  ? selectedItinerary.destinations.join(", ")
                  : 'No destinations'}
              </p>
              {selectedItinerary.startDate && selectedItinerary.endDate && (
                <p className="text-muted-foreground">
                  {format(new Date(selectedItinerary.startDate), "MMM d, yyyy")} -{" "}
                  {format(new Date(selectedItinerary.endDate), "MMM d, yyyy")}
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

      {/* Create Itinerary Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (!open) {
          // Reset form when dialog is closed
          setNewItinerary({
            name: "",
            numberOfPersons: 1,
          });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Itinerary</DialogTitle>
            <DialogDescription>Enter the details for your new travel itinerary.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateItinerary}>
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
                  required
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
                        numberOfPersons: Math.max(1, Number.parseInt(e.target.value) || 1),
                      })
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setNewItinerary({
                        ...newItinerary,
                        numberOfPersons: (newItinerary.numberOfPersons || 1) + 1,
                      })
                    }
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Itinerary"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ItineraryCard({ itinerary, onDelete }) {
  // Safely handle null/undefined itinerary
  if (!itinerary) {
    return null;
  }

  // Helper function to extract destinations from room items
  const getDestinations = () => {
    if (Array.isArray(itinerary.destinations) && itinerary.destinations.length > 0) {
      return itinerary.destinations
    } else if (Array.isArray(itinerary.room_items) && itinerary.room_items.length > 0) {
      // Extract unique cities from room items
      const cities = itinerary.room_items
        .map(item => (item?.city || item?.hotel?.city || ""))
        .filter(Boolean)
      return [...new Set(cities)]
    }
    return []
  }
  
  const destinations = getDestinations();
  const id = itinerary.id;
  
  // If we don't have an id, we can't navigate
  if (!id) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="text-muted-foreground">Invalid itinerary data</div>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">{itinerary.name || 'Unnamed Itinerary'}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <UsersIcon className="h-4 w-4" />
              <span>
                {itinerary.numberOfPersons || 1} {(itinerary.numberOfPersons || 1) === 1 ? "traveler" : "travelers"}
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
                <Link to={`/itineraries/${id}`} className="cursor-pointer">
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/itineraries/${id}/edit`} className="cursor-pointer">
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(itinerary)} className="cursor-pointer text-destructive">
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="mb-3 flex flex-wrap gap-1">
          {destinations.length > 0 ? (
            destinations.map((destination, index) => (
              <Badge key={`${destination}-${index}`} variant="secondary">
                {destination}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No destinations added</span>
          )}
        </div>

        {itinerary.startDate && itinerary.endDate && (
          <div className="mb-3 flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(itinerary.startDate), "MMM d, yyyy")} - {format(new Date(itinerary.endDate), "MMM d, yyyy")}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button variant="secondary" className="w-full" asChild>
          <Link to={`/itineraries/${id}`}>View Itinerary</Link>
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
      <h3 className="mb-2 text-xl font-medium">{title || "No data available"}</h3>
      <p className="mb-6 text-muted-foreground">{description || "No information to display."}</p>
      {actionText && onAction && (
        <Button onClick={onAction}>{actionText}</Button>
      )}
    </div>
  )
}