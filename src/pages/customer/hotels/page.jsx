"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarIcon, MapPinIcon, SearchIcon, FilterIcon } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

// Mock data for hotels
const mockHotels = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    city: "New York",
    address: "123 Broadway, New York, NY 10001",
    rating: 4.7,
    price: 199,
    image: "/placeholder.svg?height=300&width=500",
    amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Restaurant"],
  },
  {
    id: 2,
    name: "Seaside Resort",
    city: "Miami",
    address: "456 Ocean Drive, Miami, FL 33139",
    rating: 4.5,
    price: 249,
    image: "/placeholder.svg?height=300&width=500",
    amenities: ["Beach Access", "Pool", "Bar", "Free Breakfast", "Gym"],
  },
  {
    id: 3,
    name: "Mountain View Lodge",
    city: "Denver",
    address: "789 Mountain Road, Denver, CO 80202",
    rating: 4.3,
    price: 179,
    image: "/placeholder.svg?height=300&width=500",
    amenities: ["Hiking Trails", "Fireplace", "Restaurant", "Free Parking", "Pet Friendly"],
  },
  {
    id: 4,
    name: "City Center Suites",
    city: "Chicago",
    address: "101 Michigan Ave, Chicago, IL 60601",
    rating: 4.6,
    price: 229,
    image: "/placeholder.svg?height=300&width=500",
    amenities: ["Business Center", "Gym", "Room Service", "Free WiFi", "Concierge"],
  },
  {
    id: 5,
    name: "Harbor View Inn",
    city: "San Francisco",
    address: "202 Bay Street, San Francisco, CA 94133",
    rating: 4.4,
    price: 259,
    image: "/placeholder.svg?height=300&width=500",
    amenities: ["Bay Views", "Restaurant", "Bar", "Gym", "Valet Parking"],
  },
  {
    id: 6,
    name: "Desert Oasis Resort",
    city: "Phoenix",
    address: "303 Cactus Road, Phoenix, AZ 85001",
    rating: 4.2,
    price: 189,
    image: "/placeholder.svg?height=300&width=500",
    amenities: ["Pool", "Spa", "Golf Course", "Restaurant", "Bar"],
  },
]

export default function HotelsPage() {
  const searchParams = useSearchParams()
  const cityParam = searchParams.get("city")

  const [filters, setFilters] = useState({
    search: cityParam || "",
    priceRange: [0, 500],
    rating: "",
    amenities: [],
  })

  const [filteredHotels, setFilteredHotels] = useState(mockHotels)

  // Apply filters
  useEffect(() => {
    let results = mockHotels

    if (filters.search) {
      results = results.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          hotel.city.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    results = results.filter((hotel) => hotel.price >= filters.priceRange[0] && hotel.price <= filters.priceRange[1])

    if (filters.rating) {
      results = results.filter((hotel) => hotel.rating >= Number.parseFloat(filters.rating))
    }

    if (filters.amenities.length > 0) {
      results = results.filter((hotel) => filters.amenities.every((amenity) => hotel.amenities.includes(amenity)))
    }

    setFilteredHotels(results)
  }, [filters])

  const handleAmenityToggle = (amenity) => {
    setFilters((prev) => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
      return { ...prev, amenities }
    })
  }

  const allAmenities = [
    "Free WiFi",
    "Pool",
    "Spa",
    "Gym",
    "Restaurant",
    "Bar",
    "Free Breakfast",
    "Free Parking",
    "Pet Friendly",
    "Beach Access",
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hotels</h1>
          <p className="text-muted-foreground">
            {filteredHotels.length} hotels found {filters.search ? `in "${filters.search}"` : ""}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 md:w-80">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search hotels or cities"
              className="pl-9"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FilterIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Hotels</SheetTitle>
                <SheetDescription>Refine your search results</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[0, 500]}
                      max={500}
                      step={10}
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                    />
                    <div className="flex items-center justify-between">
                      <p>${filters.priceRange[0]}</p>
                      <p>${filters.priceRange[1]}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Rating</h3>
                  <Select value={filters.rating} onValueChange={(value) => setFilters({ ...filters, rating: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any rating</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {allAmenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={filters.amenities.includes(amenity)}
                          onCheckedChange={() => handleAmenityToggle(amenity)}
                        />
                        <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() =>
                    setFilters({
                      search: "",
                      priceRange: [0, 500],
                      rating: "",
                      amenities: [],
                    })
                  }
                >
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredHotels.map((hotel) => (
          <Link href={`/hotels/${hotel.id}`} key={hotel.id}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-md">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.image || "/placeholder.svg"}
                  alt={hotel.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <Badge className="absolute right-2 top-2">${hotel.price}/night</Badge>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold">{hotel.name}</h3>
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{hotel.city}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-1">
                  {hotel.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                  {hotel.amenities.length > 3 && <Badge variant="outline">+{hotel.amenities.length - 3} more</Badge>}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold">No hotels found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
          <Button
            className="mt-4"
            onClick={() =>
              setFilters({
                search: "",
                priceRange: [0, 500],
                rating: "",
                amenities: [],
              })
            }
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  )
}

