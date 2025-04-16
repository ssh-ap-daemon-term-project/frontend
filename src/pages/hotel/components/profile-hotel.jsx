"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "react-toastify"
import { Loader2, Building, Star, MapPin, Phone, Mail, Check, Edit } from "lucide-react"

// Import the necessary API functions
import { getHotelProfile, updateHotelProfile } from "@/api/hotel.jsx"

export function HotelProfile() {
  const { userId, userName, email } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [hotelProfile, setHotelProfile] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    description: "",
    amenities: ""
  })

  useEffect(() => {
    async function fetchHotelProfile() {
      if (!userId) return
      
      try {
        setLoading(true)
        const response = await getHotelProfile(userId)
        
        if (response.status === 200) {
          setHotelProfile(response.data)
          setFormData({
            name: response.data.name || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            address: response.data.address || "",
            city: response.data.city || "",
            description: response.data.description || "",
            amenities: response.data.amenities ? response.data.amenities.join(", ") : ""
          })
        }
      } catch (error) {
        console.error("Failed to fetch hotel profile:", error)
        toast.error("Failed to load hotel profile")
      } finally {
        setLoading(false)
      }
    }

    fetchHotelProfile()
  }, [userId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      
      // Convert comma-separated amenities to array
      const amenitiesArray = formData.amenities
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "")
      
      const updatedProfile = {
        ...formData,
        amenities: amenitiesArray
      }
      
      const response = await updateHotelProfile(userId, updatedProfile)
      
      if (response.status === 200) {
        setHotelProfile(response.data)
        setEditing(false)
        toast.success("Profile updated successfully")
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading hotel profile...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="relative pb-0">
          {editing ? (
            <div className="absolute right-4 top-4 space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                form="profile-form"
                disabled={saving}
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute right-4 top-4"
              onClick={() => setEditing(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
          
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg" alt={hotelProfile?.name} />
              <AvatarFallback>
                <Building className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center sm:text-left">
              {editing ? (
                <Input 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-2 text-xl font-bold"
                />
              ) : (
                <h2 className="text-2xl font-bold">{hotelProfile?.name}</h2>
              )}
              
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {editing ? (
                    <Input 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="h-8"
                    />
                  ) : (
                    <span>{hotelProfile?.city}</span>
                  )}
                </div>
                
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{hotelProfile?.rating || "No ratings yet"}</span>
                </div>
                
                <div className="flex items-center">
                  <Building className="mr-1 h-4 w-4" />
                  <span>{hotelProfile?.totalRooms || 0} Rooms</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs defaultValue="about" className="w-full">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="space-y-4">
              <form id="profile-form" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Hotel Description</h3>
                    {editing ? (
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your hotel..."
                        className="mt-2 h-32"
                      />
                    ) : (
                      <p className="mt-2 text-muted-foreground">
                        {hotelProfile?.description || "No description provided."}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Amenities</h3>
                    {editing ? (
                      <div className="mt-2">
                        <Label htmlFor="amenities">Enter amenities (comma separated)</Label>
                        <Textarea
                          id="amenities"
                          name="amenities"
                          value={formData.amenities}
                          onChange={handleInputChange}
                          placeholder="Free WiFi, Pool, Gym, etc."
                          className="mt-1"
                        />
                      </div>
                    ) : (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {hotelProfile?.amenities && hotelProfile.amenities.length > 0 ? (
                          hotelProfile.amenities.map((amenity, index) => (
                            <span key={index} className="rounded-full bg-muted px-3 py-1 text-xs">
                              {amenity}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No amenities listed.</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Address</h3>
                    {editing ? (
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Hotel address"
                        className="mt-2"
                      />
                    ) : (
                      <p className="mt-2 text-muted-foreground">
                        {hotelProfile?.address || "No address provided."}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="contact">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                      {editing ? (
                        <Input
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email address"
                        />
                      ) : (
                        <span>{hotelProfile?.email}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
                      {editing ? (
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Phone number"
                        />
                      ) : (
                        <span>{hotelProfile?.phone}</span>
                      )}
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                      <div>
                        {editing ? (
                          <div className="space-y-2">
                            <Input
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="Address"
                            />
                            <Input
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="City"
                            />
                          </div>
                        ) : (
                          <div>
                            <p>{hotelProfile?.address}</p>
                            <p>{hotelProfile?.city}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rooms">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Hotel Rooms</h3>
                  <Button size="sm">
                    Manage Rooms
                  </Button>
                </div>
                
                {hotelProfile?.rooms && hotelProfile.rooms.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {hotelProfile.rooms.map(room => (
                      <Card key={room.id}>
                        <CardContent className="p-4">
                          <div className="aspect-video overflow-hidden rounded-md bg-muted">
                            {room.image ? (
                              <img 
                                src={room.image} 
                                alt={room.type} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Building className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <h4 className="mt-2 font-medium">{room.type}</h4>
                          <div className="mt-2 flex justify-between text-sm">
                            <span>Capacity: {room.roomCapacity}</span>
                            <span className="font-medium">${room.basePrice}/night</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed p-8 text-center">
                    <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No rooms added yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Start adding rooms to your hotel profile.
                    </p>
                    <Button className="mt-4">Add Your First Room</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Customer Reviews</h3>
                
                {hotelProfile?.reviews && hotelProfile.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {hotelProfile.reviews.map(review => (
                      <div key={review.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.customerName}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed p-8 text-center">
                    <Star className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No reviews yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Reviews will appear here as customers leave feedback.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Hotel Performance</CardTitle>
          <CardDescription>View your hotel's booking statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h4 className="text-sm font-medium text-muted-foreground">Total Bookings</h4>
              <p className="mt-2 text-3xl font-bold">{hotelProfile?.stats?.totalBookings || 0}</p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="text-sm font-medium text-muted-foreground">Occupancy Rate</h4>
              <p className="mt-2 text-3xl font-bold">{hotelProfile?.stats?.occupancyRate || 0}%</p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="text-sm font-medium text-muted-foreground">Average Rating</h4>
              <p className="mt-2 text-3xl font-bold">{hotelProfile?.rating || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HotelProfile
