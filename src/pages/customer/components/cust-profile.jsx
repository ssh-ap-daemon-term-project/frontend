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
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomerProfile