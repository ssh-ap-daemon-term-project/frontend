"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Search, MessageSquare, Flag, CheckCircle, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Mock data for reviews
const reviewsData = [
  {
    id: 1,
    customer_name: "John Doe",
    customer_initials: "JD",
    room_type: "Luxury",
    rating: 5,
    comment:
      "Excellent stay! The room was clean, spacious, and the staff was very friendly. Will definitely come back.",
    date: "2023-05-10",
    status: "published",
    response: "",
  },
  {
    id: 2,
    customer_name: "Jane Smith",
    customer_initials: "JS",
    room_type: "Basic",
    rating: 3,
    comment: "The room was okay, but the bathroom could have been cleaner. The location is great though.",
    date: "2023-05-12",
    status: "published",
    response:
      "Thank you for your feedback. We apologize for the bathroom cleanliness issue and have addressed it with our housekeeping team.",
  },
  {
    id: 3,
    customer_name: "Robert Johnson",
    customer_initials: "RJ",
    room_type: "Suite",
    rating: 4,
    comment: "Very comfortable suite with great amenities. The only issue was the noise from the street.",
    date: "2023-05-15",
    status: "published",
    response: "",
  },
  {
    id: 4,
    customer_name: "Emily Davis",
    customer_initials: "ED",
    room_type: "Luxury",
    rating: 2,
    comment: "Disappointing experience. The room didn't match the photos online, and the AC wasn't working properly.",
    date: "2023-05-18",
    status: "flagged",
    response: "",
  },
  {
    id: 5,
    customer_name: "Michael Wilson",
    customer_initials: "MW",
    room_type: "Basic",
    rating: 5,
    comment: "Perfect budget option! Clean, comfortable, and great value for money.",
    date: "2023-05-20",
    status: "published",
    response: "Thank you for your kind words! We're glad you enjoyed your stay with us.",
  },
]

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState(reviewsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReview, setSelectedReview] = useState(null)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleResponseSubmit = () => {
    const updatedReviews = reviews.map((review) => {
      if (review.id === selectedReview.id) {
        return { ...review, response: responseText }
      }
      return review
    })
    setReviews(updatedReviews)
    setIsResponseDialogOpen(false)
    setResponseText("")
  }

  const handleStatusChange = (reviewId, newStatus) => {
    const updatedReviews = reviews.map((review) => {
      if (review.id === reviewId) {
        return { ...review, status: newStatus }
      }
      return review
    })
    setReviews(updatedReviews)
  }

  const openResponseDialog = (review) => {
    setSelectedReview(review)
    setResponseText(review.response)
    setIsResponseDialogOpen(true)
  }

  const openViewDialog = (review) => {
    setSelectedReview(review)
    setIsViewDialogOpen(true)
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.room_type.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === "all") {
      return matchesSearch
    } else {
      return matchesSearch && review.status === statusFilter
    }
  })

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
      ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews Management</CardTitle>
        <CardDescription>Manage customer reviews and responses</CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Room Type</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="hidden md:table-cell">Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{review.customer_initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{review.customer_name}</span>
                  </div>
                </TableCell>
                <TableCell>{review.room_type}</TableCell>
                <TableCell>
                  <div className="flex">{renderStars(review.rating)}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-xs truncate">
                  {review.comment.length > 50 ? `${review.comment.substring(0, 50)}...` : review.comment}
                </TableCell>
                <TableCell>{review.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      review.status === "published"
                        ? "default"
                        : review.status === "flagged"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {review.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openViewDialog(review)}>
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openResponseDialog(review)}>
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only">Respond</span>
                    </Button>
                    {review.status !== "flagged" ? (
                      <Button variant="ghost" size="icon" onClick={() => handleStatusChange(review.id, "flagged")}>
                        <Flag className="h-4 w-4" />
                        <span className="sr-only">Flag</span>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => handleStatusChange(review.id, "published")}>
                        <CheckCircle className="h-4 w-4" />
                        <span className="sr-only">Publish</span>
                      </Button>
                    )}
                    {review.status !== "hidden" ? (
                      <Button variant="ghost" size="icon" onClick={() => handleStatusChange(review.id, "hidden")}>
                        <XCircle className="h-4 w-4" />
                        <span className="sr-only">Hide</span>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => handleStatusChange(review.id, "published")}>
                        <CheckCircle className="h-4 w-4" />
                        <span className="sr-only">Publish</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* View Review Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
            </DialogHeader>
            {selectedReview && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{selectedReview.customer_initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedReview.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedReview.date}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Room Type</p>
                  <p>{selectedReview.room_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Rating</p>
                  <div className="flex mt-1">{renderStars(selectedReview.rating)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium">Comment</p>
                  <p className="mt-1">{selectedReview.comment}</p>
                </div>
                {selectedReview.response && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium">Your Response</p>
                    <p className="mt-1">{selectedReview.response}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Status:</p>
                  <Badge
                    variant={
                      selectedReview.status === "published"
                        ? "default"
                        : selectedReview.status === "flagged"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {selectedReview.status}
                  </Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Response Dialog */}
        <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Respond to Review</DialogTitle>
              <DialogDescription>Your response will be visible to all customers</DialogDescription>
            </DialogHeader>
            {selectedReview && (
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm font-medium">{selectedReview.customer_name} wrote:</p>
                  <p className="mt-1">{selectedReview.comment}</p>
                  <div className="flex mt-1">{renderStars(selectedReview.rating)}</div>
                </div>
                <Textarea
                  placeholder="Type your response here..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                />
                <DialogFooter>
                  <Button onClick={handleResponseSubmit}>Submit Response</Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

