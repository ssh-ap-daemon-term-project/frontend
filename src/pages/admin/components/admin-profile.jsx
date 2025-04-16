"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Label } from "../../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { toast } from "react-toastify"
import { 
  Loader2, 
  User, 
  Phone, 
  Mail, 
  Edit,
  ShieldCheck,
  Clock,
  UserCheck,
  Car,
  Building,
  Briefcase,
  Settings,
  Activity,
  KeyRound,
  Users
} from "lucide-react"
import { getAdminProfile } from "../../../api/admin"
import { format } from "date-fns"
import { Badge } from "../../../components/ui/badge"

export function AdminProfile() {
  const { userId, userName, email } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true)
        const response = await getAdminProfile()
        setProfile(response.data)
      } catch (error) {
        console.error("Failed to fetch admin profile:", error)
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
        <span className="ml-2">Loading admin profile...</span>
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
                <Badge variant="outline" className="flex items-center">
                  <ShieldCheck className="mr-1 h-4 w-4 text-blue-600" />
                  <span>{profile?.position || "Administrator"}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center ml-2">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>Member since {profile?.createdAt ? format(new Date(profile.createdAt), 'MMMM yyyy') : "N/A"}</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList>
              <TabsTrigger value="info">Account Info</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="stats">System Stats</TabsTrigger>
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
                    <div className="flex items-center">
                      <Building className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>{profile?.department || "Operations"}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <ShieldCheck className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>Role: {profile?.position || "Administrator"}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>Account created: {profile?.createdAt ? format(new Date(profile.createdAt), 'PP') : "N/A"}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-md mt-4">
                    <h4 className="font-medium mb-2">Account Status</h4>
                    <p className="text-green-600 flex items-center">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="permissions" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Administrative Permissions</h3>
              </div>
              
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile?.permissions?.map((permission, index) => (
                      <div key={index} className="flex items-center p-3 border rounded-md">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {permission.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="p-4 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Access Level</h4>
                <p className="text-sm">
                  As an administrator, you have full access to manage the system,
                  including users, bookings, settings, and reports.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-4 pt-4">
              <h3 className="text-lg font-medium mb-3">System Statistics</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto text-blue-600" />
                      <h4 className="mt-2 font-medium text-muted-foreground">Customers</h4>
                      <p className="text-3xl font-bold mt-1">{profile?.totalCustomers || 0}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Car className="h-8 w-8 mx-auto text-green-600" />
                      <h4 className="mt-2 font-medium text-muted-foreground">Drivers</h4>
                      <p className="text-3xl font-bold mt-1">{profile?.totalDrivers || 0}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Building className="h-8 w-8 mx-auto text-purple-600" />
                      <h4 className="mt-2 font-medium text-muted-foreground">Hotels</h4>
                      <p className="text-3xl font-bold mt-1">{profile?.totalHotels || 0}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Briefcase className="h-8 w-8 mx-auto text-amber-600" />
                      <h4 className="mt-2 font-medium text-muted-foreground">Itineraries</h4>
                      <p className="text-3xl font-bold mt-1">{profile?.totalItineraries || 0}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminProfile