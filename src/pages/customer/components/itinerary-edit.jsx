import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { CalendarIcon, MapPinIcon, ArrowLeftIcon, SaveIcon, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { getItineraryById, updateItinerary } from "@/api/itineraryApi"

export default function EditItineraryPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const itineraryId = id
  
  const [loading, setLoading] = useState(true)
  const [itinerary, setItinerary] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    numberOfPersons: 1
  })

  // Fetch itinerary data when component mounts
  useEffect(() => {
    async function fetchItinerary() {
      try {
        setLoading(true)
        const response = await getItineraryById(itineraryId)
        const itineraryData = response.data
        
        setItinerary(itineraryData)
        setFormData({
          name: itineraryData.name,
          numberOfPersons: itineraryData.numberOfPersons
        })
      } catch (error) {
        console.error("Failed to fetch itinerary:", error)
        toast.error("Failed to load itinerary details")
      } finally {
        setLoading(false)
      }
    }

    fetchItinerary()
  }, [itineraryId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Prepare data for API
      const updateData = {
        name: formData.name,
        numberOfPersons: Number(formData.numberOfPersons)
      }
      
      // Call API to update itinerary
      await updateItinerary(itineraryId, updateData)
      
      toast.success("Itinerary updated successfully")
      navigate(`/itineraries/${itineraryId}`)
    } catch (error) {
      console.error("Failed to update itinerary:", error)
      toast.error(error.response?.data?.detail || "Failed to update itinerary")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-lg">Loading itinerary details...</p>
        </div>
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-bold text-red-700">Itinerary Not Found</h2>
          <p className="mt-2">The itinerary you're looking for doesn't exist or you don't have access to it.</p>
          <Button className="mt-4" asChild>
            <Link to="/itineraries">Back to Itineraries</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" className="mb-2 gap-2" asChild>
          <Link to={`/itineraries/${itinerary.id}`}>
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
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" type="button" asChild>
                <Link to={`/itineraries/${itinerary.id}`}>Cancel</Link>
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
                    <p>{itinerary.destinations?.join(", ") || "No destinations added"}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Accommodations</h3>
                    {itinerary.roomItems && itinerary.roomItems.length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {itinerary.roomItems.map((room) => (
                          <li key={room.id} className="flex items-center gap-2 text-sm">
                            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {room.roomHotelName || room.room?.hotel?.name}, {room.room?.hotel?.city}
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
                    {itinerary.scheduleItems && itinerary.scheduleItems.length > 0 ? (
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