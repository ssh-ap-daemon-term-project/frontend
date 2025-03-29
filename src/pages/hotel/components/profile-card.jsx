import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf } from "lucide-react";



export default function ProfileCardHotel({hotel}) {
  // Generate star rating display
  let rating = hotel.rating;
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-amber-400 text-amber-400" />);
    }
    
    return stars;
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Hotel Information</CardTitle>
            <Badge variant="success">Active</Badge>
          </div>
          <CardDescription>Basic details about your hotel property</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Hotel Name</p>
              <p className="text-sm font-semibold">{hotel.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Rating</p>
              <div className="flex items-center">
                <div className="flex">
                  {renderStars(hotel.rating)}
                </div>
                <span className="ml-2 text-sm font-semibold">{hotel.rating}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Location</p>
              <p className="text-sm font-semibold">{hotel.location}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Address</p>
              <p className="text-sm font-semibold">{hotel.address}</p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-sm font-medium text-slate-500">Description</p>
              <p className="text-sm font-normal">{hotel.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Your account and contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Username</p>
              <p className="text-sm font-semibold">{hotel.username}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Email</p>
              <p className="text-sm font-semibold">{hotel.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Phone</p>
              <p className="text-sm font-semibold">{hotel.phone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Password</p>
              <p className="text-sm font-semibold">••••••••</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
