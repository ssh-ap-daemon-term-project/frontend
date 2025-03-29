import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function HotelAdminEditForm({ hotelAdmin }) {
  const [showPassword, setShowPassword] = useState(false);
    // console.log(hotelAdmin);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: hotelAdmin.name || "",
      location: hotelAdmin.location || "",
      address: hotelAdmin.address || "",
      description: hotelAdmin.description || "",
      username: hotelAdmin.username || "",
      email: hotelAdmin.email || "",
      phone: hotelAdmin.phone || "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    const errors = {};
    if (!data.name) errors.name = "Hotel name is required";
    if (!data.location) errors.location = "Location is required";
    if (!data.address) errors.address = "Address is required";
    
    if (!data.description) errors.description = "Description is required";
    if (!data.username) errors.username = "Username is required";
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errors.email = "Please enter a valid email address";
    if (data.phone.length < 10) errors.phone = "Phone number must be at least 10 characters";

    if (Object.keys(errors).length > 0) {
      return; // Prevent form submission if there are validation errors
    }

    const updatedData = data.password ? data : { ...data, password: undefined };
    // onSave(updatedData);
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <Form>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl font-semibold mb-2">Edit Hotel Admin Profile</h2>

        {/* Hotel Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Hotel Information</h3>

          <FormItem>
            <FormLabel>Hotel Name</FormLabel>
            <FormControl>
              <Input {...register("name", { required: "Hotel name is required" })} />
            </FormControl>
            {errors.name && <FormMessage>{errors.name}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input {...register("location", { required: "Location is required" })} />
            </FormControl>
            {errors.location && <FormMessage>{errors.location}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input {...register("address", { required: "Address is required" })} />
            </FormControl>
            {errors.address && <FormMessage>{errors.address}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                className="min-h-[100px]"
                {...register("description", { required: "Description is required" })}
              />
            </FormControl>
            {errors.description && <FormMessage>{errors.description}</FormMessage>}
          </FormItem>
        </div>

        {/* Contact Information */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Contact Information</h3>

          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input {...register("username", { required: "Username is required" })} />
            </FormControl>
            {errors.username && <FormMessage>{errors.username}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
            </FormControl>
            {errors.email && <FormMessage>{errors.email}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  minLength: {
                    value: 10,
                    message: "Phone number must be at least 10 characters",
                  },
                })}
              />
            </FormControl>
            {errors.phone && <FormMessage>{errors.phone}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </FormControl>
            <p className="text-xs text-slate-500">Leave blank to keep the current password.</p>
          </FormItem>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end space-x-2 mt-6">
          <Button type="button" variant="outline" >
            Cancel
          </Button>
          {/* <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button> */}
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
