import Hero from '@/components/ui/custom/Hero'
import React from 'react'
import Carousel_dest from '@/components/ui/custom/Carousel_dest'
import Footer from '@/components/ui/custom/Footer'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarIcon, MapPinIcon, SearchIcon, UsersIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { useState } from "react"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <><div className="container mx-auto px-4 py-8">

      <section className="relative mb-12 rounded-3xl bg-gradient-to-r from-primary/90 to-primary p-8 text-primary-foreground">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Find Your Perfect Stay</h1>
          <p className="mb-8 text-lg md:text-xl">Discover and book the best hotels at the best prices</p>
          <SearchForm />
        </div>
      </section>

      <Hero></Hero>

      <div>
      <Carousel_dest></Carousel_dest>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Popular Destinations</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {popularDestinations.map((destination) => (
            <Link
              href={`/customer/hotels?city=${destination.city}`}
              key={destination.city}
              className="group overflow-hidden rounded-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.city}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-bold text-white">{destination.city}</h3>
                  <p className="text-white/90">{destination.hotels} hotels</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Why Choose Us</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-lg border bg-card p-6 shadow-sm">
              <feature.icon className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer></Footer>
    </div>
    </>
    
  )
}

function SearchForm() {
  return (
    <div className="rounded-lg bg-background p-4 shadow-lg">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium text-primary-foreground">
            Location
          </label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="location" placeholder="Where are you going?" className="pl-9 text-foreground" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-primary-foreground">Check-in / Check-out</label>
          <DatePickerWithRange />
        </div>

        <div>
          <label htmlFor="guests" className="mb-1 block text-sm font-medium text-primary-foreground">
            Guests
          </label>
          <div className="relative">
            <UsersIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              id="guests"
              className="h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
              <option value="5">5+ Guests</option>
            </select>
          </div>
        </div>

        <div className="flex items-end">
          <Button className="w-full gap-2">
            <SearchIcon className="h-4 w-4" />
            Search Hotels
          </Button>
        </div>
      </div>
    </div>
  )
}



function DatePickerWithRange() {
  const [date, setDate] = useState({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  })

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="w-full justify-start border-input bg-background pl-9 text-left font-normal text-foreground"
          >
            <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "MMM d")} - {format(date.to, "MMM d, yyyy")}
                </>
              ) : (
                format(date.from, "MMM d, yyyy")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

const popularDestinations = [
  {
    city: "New York",
    hotels: 245,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    city: "Paris",
    hotels: 198,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    city: "Tokyo",
    hotels: 312,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    city: "London",
    hotels: 267,
    image: "/placeholder.svg?height=400&width=600",
  },
]

const features = [
  {
    title: "Best Price Guarantee",
    description: "We match any price you find elsewhere or refund the difference.",
    icon: ({ className }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "Free Cancellation",
    description: "Plans change. That's why most of our hotels offer free cancellation.",
    icon: ({ className }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "24/7 Customer Support",
    description: "Our support team is available around the clock to assist you.",
    icon: ({ className }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
]

export default Home