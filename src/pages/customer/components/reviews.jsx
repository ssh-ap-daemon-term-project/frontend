
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StarIcon, PencilIcon, HotelIcon, GlobeIcon, CarIcon } from "lucide-react"
import { toast } from "react-toastify"

// Mock data for reviews
const mockReviews = {
  hotels: [
    {
      id: 1,
      hotelId: 1,
      hotelName: "Grand Plaza Hotel",
      city: "New York",
      rating: 5,
      comment:
        "Excellent hotel with amazing service. The staff was very friendly and accommodating. The room was clean and comfortable. Would definitely stay here again!",
      date: "2023-12-15",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 2,
      hotelId: 3,
      hotelName: "Mountain View Lodge",
      city: "Denver",
      rating: 4,
      comment:
        "Great location and beautiful views. The room was spacious and comfortable. The only issue was that the WiFi was a bit slow at times.",
      date: "2023-10-05",
      image: "/placeholder.svg?height=300&width=500",
    },
  ],
  drivers: [
    {
      id: 3,
      driverName: "Michael Johnson",
      rating: 5,
      comment:
        "Michael was an excellent driver. Very professional, punctual, and knowledgeable about the area. Made our trip much more enjoyable.",
      date: "2023-11-20",
      tripDetails: "New York City Tour",
    },
  ],
  website: [
    {
      id: 4,
      rating: 4,
      comment:
        "The website is very user-friendly and makes booking hotels and planning itineraries a breeze. Would love to see more filter options for hotels.",
      date: "2023-09-10",
      category: "Usability",
    },
  ],
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews)
  const [selectedReview, setSelectedReview] = useState(null)
  const [selectedReviewType, setSelectedReviewType] = useState(null)
  const [editForm, setEditForm] = useState({
    rating: 0,
    comment: "",
  })

  const handleEditReview = (review, type) => {
    setSelectedReview(review)
    setSelectedReviewType(type)
    setEditForm({
      rating: review.rating,
      comment: review.comment,
    })
  }

  const handleSaveReview = () => {
    // In a real app, you would call an API to update the review
    const updatedReviews = { ...reviews }

    updatedReviews[selectedReviewType] = updatedReviews[selectedReviewType].map((review) =>
      review.id === selectedReview.id ? { ...review, rating: editForm.rating, comment: editForm.comment } : review,
    )

    setReviews(updatedReviews)
    setSelectedReview(null)
    setSelectedReviewType(null)

    toast({
      title: "Review Updated",
      description: "Your review has been updated successfully.",
    })
  }

  const handleDeleteReview = (reviewId, type) => {
    // In a real app, you would call an API to delete the review
    const updatedReviews = { ...reviews }
    updatedReviews[type] = updatedReviews[type].filter((review) => review.id !== reviewId)

    setReviews(updatedReviews)

    toast({
      title: "Review Deleted",
      description: "Your review has been deleted successfully.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">My Reviews</h1>

      <Tabs defaultValue="hotels" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="hotels" className="gap-2">
            <HotelIcon className="h-4 w-4" />
            Hotels
          </TabsTrigger>
          <TabsTrigger value="drivers" className="gap-2">
            <CarIcon className="h-4 w-4" />
            Drivers
          </TabsTrigger>
          <TabsTrigger value="website" className="gap-2">
            <GlobeIcon className="h-4 w-4" />
            Website
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hotels">
          {reviews.hotels.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {reviews.hotels.map((review) => (
                <Card key={review.id}>
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="h-full">
                      <img
                        src={review.image || "/placeholder.svg"}
                        alt={review.hotelName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="col-span-2 flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold">{review.hotelName}</h3>
                            <p className="text-sm text-muted-foreground">{review.city}</p>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-5 w-5 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 pb-2">
                        <p className="text-sm text-muted-foreground">
                          Reviewed on {new Date(review.date).toLocaleDateString()}
                        </p>
                        <p className="mt-2">{review.comment}</p>
                      </CardContent>

                      <CardFooter className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleEditReview(review, "hotels")}
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteReview(review.id, "hotels")}>
                          Delete
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<HotelIcon className="h-6 w-6 text-muted-foreground" />}
              title="No Hotel Reviews Yet"
              description="You haven't written any hotel reviews yet. After staying at a hotel, you can share your experience."
            />
          )}
        </TabsContent>

        <TabsContent value="drivers">
          {reviews.drivers.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {reviews.drivers.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{review.driverName}</h3>
                        <p className="text-sm text-muted-foreground">{review.tripDetails}</p>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Reviewed on {new Date(review.date).toLocaleDateString()}
                    </p>
                    <p className="mt-2">{review.comment}</p>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleEditReview(review, "drivers")}
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteReview(review.id, "drivers")}>
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CarIcon className="h-6 w-6 text-muted-foreground" />}
              title="No Driver Reviews Yet"
              description="You haven't written any driver reviews yet. After using our driver service, you can share your experience."
            />
          )}
        </TabsContent>

        <TabsContent value="website">
          {reviews.website.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {reviews.website.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">Website Feedback</h3>
                        <p className="text-sm text-muted-foreground">Category: {review.category}</p>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Submitted on {new Date(review.date).toLocaleDateString()}
                    </p>
                    <p className="mt-2">{review.comment}</p>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleEditReview(review, "website")}
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteReview(review.id, "website")}>
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<GlobeIcon className="h-6 w-6 text-muted-foreground" />}
              title="No Website Reviews Yet"
              description="You haven't provided any feedback about our website yet. Your input helps us improve!"
            />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>
              {selectedReviewType === "hotels" && `Update your review for ${selectedReview?.hotelName}`}
              {selectedReviewType === "drivers" && `Update your review for ${selectedReview?.driverName}`}
              {selectedReviewType === "website" && "Update your website feedback"}
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, rating: i + 1 })}
                      className="p-1"
                    >
                      <StarIcon
                        className={`h-6 w-6 ${
                          i < editForm.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Review</Label>
                <Textarea
                  id="comment"
                  rows={5}
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReview(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReview}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">{icon}</div>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="mb-6 text-muted-foreground">{description}</p>
    </div>
  )
}

