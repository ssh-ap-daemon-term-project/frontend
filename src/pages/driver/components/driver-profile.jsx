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
  Car, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Check, 
  Edit,
  Badge,
  Calendar,
  Clock,
  CreditCard
} from "lucide-react"
import { getDriverProfile } from "../../../api/driver"

export function DriverProfile() {
  const { userId, userName, email } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true)
        const response = await getDriverProfile()
        setProfile(response.data)
      } catch (error) {
        console.error("Failed to fetch driver profile:", error)
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
        <span className="ml-2">Loading driver profile...</span>
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
                  <Star className="mr-1 h-4 w-4 text-yellow-400" />
                  <span>{profile?.rating || "No ratings"}</span>
                </div>
                <div className="flex items-center ml-2">
                  <Badge className="mr-1 h-4 w-4" />
                  <span>{profile?.isVerified ? "Verified Driver" : "Verification Pending"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList>
              <TabsTrigger value="info">Driver Info</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
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
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>Status: {profile?.isVerified ? 
                        <span className="text-green-600">Verified</span> : 
                        <span className="text-amber-600">Pending Verification</span>}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md mt-6">
                <h3 className="text-lg font-medium mb-2">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Trips</p>
                    <p className="text-2xl font-bold">{profile?.totalTrips}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">{profile?.rating}</p>
                      <Star className="h-5 w-5 ml-1 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="vehicle" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                    <Car className="h-16 w-16 text-muted-foreground" />
                  </div>
                  
                  <h3 className="text-xl font-bold">
                    {profile?.vehicleModel || "Vehicle not registered"}
                  </h3>
                  
                  <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Year</p>
                        <p>{profile?.vehicleYear || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p>{profile?.vehicleType || "N/A"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">License Plate</p>
                      <p>{profile?.vehiclePlate || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">License Number</p>
                      <p>{profile?.licenseNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="p-4 border rounded-md mb-4">
                    <h4 className="font-medium mb-2">Status</h4>
                    <p className={profile?.isVerified ? "text-green-600" : "text-amber-600"}>
                      {profile?.isVerified ? "Vehicle verified" : "Verification pending"}
                    </p>
                  </div>
                  
                  <Button className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Update Vehicle Information
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default DriverProfile