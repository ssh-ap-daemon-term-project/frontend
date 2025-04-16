import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StarIcon, PencilIcon, HotelIcon, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { getCustomerReviews, updateReview, deleteReview } from "@/api/customer"

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState(null)
  const [editForm, setEditForm] = useState({
    rating: 0,
    comment: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deletingReviewId, setDeletingReviewId] = useState(null)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const response = await getCustomerReviews()
      setReviews(response.data)
    } catch (error) {
      console.error("Failed to load reviews:", error)
      toast.error("Failed to load reviews. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEditReview = (review) => {
    setSelectedReview(review)
    setEditForm({
      rating: review.rating,
      comment: review.comment,
    })
  }

  const handleSaveReview = async () => {
    if (editForm.rating === 0) {
      toast.error("Please select a rating")
      return
    }

    try {
      setSubmitting(true)
      await updateReview(selectedReview.id, {
        rating: editForm.rating,
        comment: editForm.comment
      })

      // Update the review in the local state
      const updatedReviews = reviews.map((review) =>
        review.id === selectedReview.id
          ? { ...review, rating: editForm.rating, comment: editForm.comment }
          : review
      )

      setReviews(updatedReviews)
      setSelectedReview(null)

      toast.success("Your review has been updated successfully.")
    } catch (error) {
      toast.error(error.response.data.detail || "Failed to update review. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      setDeletingReviewId(reviewId)
      setDeleting(true)
      await deleteReview(reviewId)

      // Remove the review from the local state
      const updatedReviews = reviews.filter((review) => review.id !== reviewId)
      setReviews(updatedReviews)

      toast.success("Your review has been deleted successfully.")
    } catch (error) {
      toast.error(error.response.data.detail || "Failed to delete review. Please try again.")
    } finally {
      setDeleting(false)
      setDeletingReviewId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading your reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">My Reviews</h1>
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <Card key={review.id}>
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="h-full">
                  {review.image ? (
                    <img
                      src={review.image}
                      alt={review.hotelName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <HotelIcon className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No image available</p>
                    </div>
                  )}
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
                            className={`h-5 w-5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
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
                      onClick={() => handleEditReview(review)}
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={deletingReviewId === review.id && deleting}
                    >
                      {deletingReviewId === review.id && deleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
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

      <Dialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>
              Update your review for {selectedReview?.hotelName}
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
                        className={`h-6 w-6 ${i < editForm.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
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
            <Button
              variant="outline"
              onClick={() => setSelectedReview(null)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveReview}
              disabled={editForm.rating === 0 || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
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