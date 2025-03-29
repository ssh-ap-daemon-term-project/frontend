import { useState } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import ProfileCardHotel from "./profile-card";
import HotelAdminEditForm from "./profile-edit";

//mock data
let hotel = {
    name: "Hotel A",
    address: "123 Main St, City",
    rating: 4.5,
    location: "New York",
    phone: "123-456-7890",
    email: "pB0kS@example.com",
    username: "hoteluser",
    description: "A luxurious hotel located in the heart of New York City.",
}

export default function HotelProfile() {
//   const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch hotel data
//   const { data: hotel, isLoading, error } = useQuery<Hotel>({
//     queryKey: ['/api/hotel'],
//   });
  

  // Update hotel mutation
//   const updateHotelMutation = useMutation({
//     mutationFn: async (data: UpdateHotel) => {
//       const res = await apiRequest('PATCH', '/api/hotel/1', data);
//       return res.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['/api/hotel'] });
//       setIsEditing(false);
//       toast({
//         title: "Profile Updated",
//         description: "Your hotel profile has been updated successfully",
//         variant: "success",
//       });
//     },
//     onError: (error) => {
//       toast({
//         title: "Update Failed",
//         description: error.message || "There was a problem updating your profile",
//         variant: "destructive",
//       });
//     },
//   });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

//   const handleSave = (data: UpdateHotel) => {
//     updateHotelMutation.mutate(data);
//   };

//   if (isLoading) {
//     return (
//       <div className="container mx-auto p-4 sm:p-6 md:p-8">
//         <div className="mb-8 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//           <div className="animate-pulse">
//             <div className="h-8 bg-slate-200 rounded w-64 mb-2"></div>
//             <div className="h-4 bg-slate-200 rounded w-48"></div>
//           </div>
//           <div className="h-10 bg-slate-200 rounded w-32"></div>
//         </div>
//         <div className="animate-pulse space-y-6">
//           <div className="h-64 bg-slate-200 rounded"></div>
//           <div className="h-48 bg-slate-200 rounded"></div>
//           <div className="h-64 bg-slate-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !hotel) {
//     return (
//       <div className="container mx-auto p-4 sm:p-6 md:p-8">
//         <div className="bg-red-50 border border-red-200 rounded-md p-4">
//           <h3 className="text-lg font-medium text-red-800">Error loading profile</h3>
//           <p className="text-sm text-red-700 mt-1">
//             {error instanceof Error ? error.message : "Unable to load hotel profile data"}
//           </p>

//           {/* //Retry button */}
//           {/* <Button 
//             variant="outline" 
//             className="mt-4" 
//             onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/hotel'] })}
//           >
//             Retry
//           </Button> */}
//         </div>
//       </div>
//     );
//   }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-8 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Hotel Admin Profile</h1>
          <p className="text-sm text-slate-500">Manage your hotel information and account details</p>
        </div>
        <Button onClick={handleEditClick} className="h-10">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <ProfileCardHotel hotel = {hotel} />
      
      

      {/* <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[600px]">
          <HotelAdminEditForm
            hotelAdmin={hotel} 
            // onSave={handleSave} 
            // onCancel={handleCancel} 
            // isLoading={updateHotelMutation.isPending} 
          />
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
