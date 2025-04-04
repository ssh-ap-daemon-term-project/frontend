import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "react-toastify"
import { CalendarIcon, CreditCardIcon, UserIcon, LockIcon, LogOutIcon } from "lucide-react"

// Mock user data
const mockUser = {
  id: 1,
  username: "johndoe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  name: "John Doe",
  dob: "1990-05-15",
  gender: "male",
  createdAt: "2022-01-15",
}

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser)
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    dob: user.dob,
    gender: user.gender,
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    // In a real app, you would call an API to update the profile
    setUser({
      ...user,
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      dob: profileForm.dob,
      gender: profileForm.gender,
    })

    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handlePasswordUpdate = (e) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would call an API to update the password

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-center justify-center md:flex-row md:items-start md:justify-start md:gap-8">
        <div className="mb-4 md:mb-0">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">Member since {new Date(user.createdAt).toLocaleDateString()}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
            <Button variant="outline" size="sm" className="gap-2">
              <UserIcon className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <LogOutIcon className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="dob"
                        type="date"
                        className="pl-9"
                        value={profileForm.dob}
                        onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={profileForm.gender}
                    onValueChange={(value) => setProfileForm({ ...profileForm, gender: value })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Update your password and security preferences</CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="currentPassword"
                      type="password"
                      className="pl-9"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type="password"
                      className="pl-9"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="pl-9"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Update Password</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-muted p-2">
                        <CreditCardIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-muted p-2">
                        <CreditCardIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Mastercard ending in 5555</p>
                        <p className="text-sm text-muted-foreground">Expires 08/24</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Make Default
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Add Payment Method</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

