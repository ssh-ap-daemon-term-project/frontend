import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarIcon, MapPinIcon, SearchIcon, FilterIcon, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Link } from "react-router-dom"
import { useSearchParams } from "react-router-dom"
import { getHotels } from "@/api/customer"
import { toast } from "react-toastify"

export default function HotelsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const cityParam = searchParams.get("city")

  const [loading, setLoading] = useState(true)
  const [hotels, setHotels] = useState([])
  const [filters, setFilters] = useState({
    search: cityParam || "",
    priceRange: [0, 10000],
    rating: "",
  })

  // Fetch hotels from API
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true)
        const response = await getHotels(filters)
        setHotels(response.data)
      } catch (error) {
        console.error("Failed to fetch hotels:", error)
        toast.error("Failed to load hotels. Please try again later.")
        setHotels([])
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchHotels()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [filters])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setFilters(prev => ({ ...prev, search: value }))
  }

  const handlePriceChange = (value) => {
    setFilters(prev => ({ ...prev, priceRange: value }))
  }

  const handleRatingChange = (value) => {
    setFilters(prev => ({ ...prev, rating: value }))
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      priceRange: [0, 500],
      rating: "",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hotels</h1>
          <p className="text-muted-foreground">
            {hotels.length} hotels found {filters.search ? `in "${filters.search}"` : ""}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 md:w-80">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search hotels or cities"
              className="pl-9"
              value={filters.search}
              onChange={handleSearchChange}
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
                      onValueChange={handlePriceChange}
                    />
                    <div className="flex items-center justify-between">
                      <p>${filters.priceRange[0]}</p>
                      <p>${filters.priceRange[1]}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Rating</h3>
                  <Select value={filters.rating} onValueChange={handleRatingChange}>
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

                <Button
                  className="w-full"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-lg">Loading hotels...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <Link key={hotel.id} to={`/customer/hotels/${hotel.id}`}>
                <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hotel.imageUrl || "/placeholder.svg"}
                      alt={hotel.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    {hotel.basePrice && (
                      <Badge className="absolute right-2 top-2">${hotel.basePrice}/night</Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold">{hotel.name}</h3>
                      {hotel.rating && (
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{hotel.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{hotel.city}</span>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="secondary" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {hotels.length === 0 && !loading && (
            <div className="mt-12 text-center">
              <h3 className="text-xl font-bold">No hotels found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
              <Button className="mt-4" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}