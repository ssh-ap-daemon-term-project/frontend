"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Textarea } from "../../../components/ui/textarea"
import { Label } from "../../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { toast } from "react-toastify"
import { 
  Loader2, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Check, 
  Edit,
  Briefcase,
  Calendar,
  Clock,
  CreditCard,
  Heart,
  Globe
} from "lucide-react"
import { getCustomerProfile } from "../../../api/customer"
import { Link } from "react-router-dom"
import { format } from "date-fns"

export function CustomerProfile() {
  const { userId, userName, email } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true)
        const response = await getCustomerProfile()
        setProfile(response.data)
      } catch (error) {
        console.error("Failed to fetch customer profile:", error)
        toast.error("Could not load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading customer profile...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg" alt={profile?.name} />
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <CardTitle className="text-2xl">{profile?.name}</CardTitle>
              <CardDescription className="text-lg">{profile?.email}</CardDescription>
              
              <div className="mt-2 flex flex-wrap gap-2">
                <div className="flex items-center">
                  <Briefcase className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{profile?.totalTrips || 0} trips</span>
                </div>
                <div className="flex items-center ml-2">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>Member since {profile?.createdAt ? format(new Date(profile.createdAt), 'MMMM yyyy') : "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList>
              <TabsTrigger value="info">Personal Info</TabsTrigger>
              <TabsTrigger value="trips">My Trips</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>{profile?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>{profile?.phoneNumber || "Not provided"}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-2 h-5 w-5 text-muted-foreground mt-1" />
                      <span>{profile?.address || "Not provided"}</span>
                    </div>
                  </div>
                  
                  <Button className="mt-4" variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Information
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Account Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>{profile?.activeItineraries || 0} Active Itineraries</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>{profile?.completedItineraries || 0} Completed Trips</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-md mt-4">
                    <h4 className="font-medium mb-2">Verification Status</h4>
                    <p className={profile?.isVerified ? "text-green-600" : "text-amber-600"}>
                      {profile?.isVerified ? "Verified Customer" : "Verification Pending"}
                    </p>
                    
                    {!profile?.isVerified && (
                      <Button className="mt-2" size="sm">Verify Account</Button>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="trips" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">My Itineraries</h3>
                <Button size="sm" asChild>
                  <Link to="/customer">View All</Link>
                </Button>
              </div>
              
              {profile?.totalTrips > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* This would normally map through actual itineraries */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Summer European Tour</h4>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>Jun 12 - Jun 26, 2025</span>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <Globe className="mr-1 h-4 w-4" />
                            <span>Paris, Rome, Barcelona</span>
                          </div>
                        </div>
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Upcoming
                        </div>
                      </div>
                      <Button size="sm" className="mt-4" variant="outline" asChild>
                        <Link to="/itineraries/1">View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Hawaii Vacation</h4>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>Jan 5 - Jan 15, 2025</span>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <Globe className="mr-1 h-4 w-4" />
                            <span>Honolulu, Maui</span>
                          </div>
                        </div>
                        <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          Completed
                        </div>
                      </div>
                      <Button size="sm" className="mt-4" variant="outline" asChild>
                        <Link to="/itineraries/2">View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center p-8 border border-dashed rounded-md">
                  <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No trips yet</h3>
                  <p className="mt-2 text-muted-foreground">Plan your first adventure today!</p>
                  <Button className="mt-4" asChild>
                    <Link to="/customer/new-itinerary">Plan a Trip</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Travel Preferences</h3>
                <Button size="sm" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Preferences
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Accommodation Preferences</h4>
                  <div className="space-y-2 p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <span>Preferred Hotel Type</span>
                      <span className="text-sm font-medium">Luxury</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Room Type</span>
                      <span className="text-sm font-medium">Suite</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Budget Range (per night)</span>
                      <span className="text-sm font-medium">$200 - $500</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Transportation Preferences</h4>
                  <div className="space-y-2 p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <span>Preferred Car Type</span>
                      <span className="text-sm font-medium">SUV</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Airport Transfer</span>
                      <span className="text-sm font-medium">Always</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Driver Service</span>
                      <span className="text-sm font-medium">Sometimes</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="font-medium mb-2">Favorite Destinations</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="py-1 px-3 bg-muted rounded-full text-sm">Paris</div>
                    <div className="py-1 px-3 bg-muted rounded-full text-sm">New York</div>
                    <div className="py-1 px-3 bg-muted rounded-full text-sm">Tokyo</div>
                    <div className="py-1 px-3 bg-muted rounded-full text-sm">Bali</div>
                    <div className="py-1 px-3 bg-muted rounded-full text-sm">Barcelona</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Payment Methods</h3>
                <Button size="sm">
                  Add Payment Method
                </Button>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-14 bg-blue-900 rounded-md flex items-center justify-center text-white font-bold mr-4">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 04/26</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Remove</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-14 bg-red-600 rounded-md flex items-center justify-center text-white font-bold mr-4">
                          MC
                        </div>
                        <div>
                          <p className="font-medium">Mastercard ending in 8888</p>
                          <p className="text-sm text-muted-foreground">Expires 09/25</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Remove</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="p-4 bg-muted rounded-md mt-4">
                <h4 className="font-medium mb-2">Billing Address</h4>
                <p>{profile?.address || "No billing address provided"}</p>
                <Button size="sm" variant="outline" className="mt-2">
                  Update Billing Address
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomerProfile