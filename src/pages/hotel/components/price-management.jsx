"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PriceManagement() {
  const [selectedRoomType, setSelectedRoomType] = useState("Basic")
  const [date, setDate] = useState(new Date())
  const [prices, setPrices] = useState({
    Basic: Array(60).fill(100),
    Luxury: Array(60).fill(200),
    Suite: Array(60).fill(300),
  })

  const form = useForm({
    defaultValues: {
      price: "",
      date_range: "single",
    },
  })

  const onSubmit = (data) => {
    const newPrice = Number.parseInt(data.price)
    const newPrices = { ...prices }

    if (data.date_range === "single") {
      // Update price for a single day
      const dayIndex = Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      if (dayIndex >= 0 && dayIndex < 60) {
        newPrices[selectedRoomType][dayIndex] = newPrice
      }
    } else if (data.date_range === "week") {
      // Update price for a week
      const startDayIndex = Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      for (let i = 0; i < 7; i++) {
        if (startDayIndex + i >= 0 && startDayIndex + i < 60) {
          newPrices[selectedRoomType][startDayIndex + i] = newPrice
        }
      }
    } else if (data.date_range === "month") {
      // Update price for a month
      const startDayIndex = Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      for (let i = 0; i < 30; i++) {
        if (startDayIndex + i >= 0 && startDayIndex + i < 60) {
          newPrices[selectedRoomType][startDayIndex + i] = newPrice
        }
      }
    } else if (data.date_range === "all") {
      // Update price for all days
      newPrices[selectedRoomType] = Array(60).fill(newPrice)
    }

    setPrices(newPrices)
    form.reset()
  }

  const getCurrentPrice = () => {
    const dayIndex = Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (dayIndex >= 0 && dayIndex < 60) {
      return prices[selectedRoomType][dayIndex]
    }
    return "N/A"
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Price Management</CardTitle>
          <CardDescription>Set and update room prices for different dates</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="room_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <Select defaultValue={selectedRoomType} onValueChange={(value) => setSelectedRoomType(value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Luxury">Luxury</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className="flex flex-col">
                <FormLabel>Select Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !date && "text-muted-foreground")}
                      >
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormDescription>Current price: ${getCurrentPrice()}</FormDescription>
              </FormItem>

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormDescription>Enter the new price in USD</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apply To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Selected Day Only</SelectItem>
                        <SelectItem value="week">Week from Selected Day</SelectItem>
                        <SelectItem value="month">Month from Selected Day</SelectItem>
                        <SelectItem value="all">All Future Dates</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Update Price</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price Overview</CardTitle>
          <CardDescription>Current pricing for {selectedRoomType} rooms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Today</h3>
                <p className="text-2xl font-bold">${prices[selectedRoomType][0]}</p>
              </div>
              <div>
                <h3 className="font-medium">Tomorrow</h3>
                <p className="text-2xl font-bold">${prices[selectedRoomType][1]}</p>
              </div>
              <div>
                <h3 className="font-medium">Next Week</h3>
                <p className="text-2xl font-bold">${prices[selectedRoomType][7]}</p>
              </div>
              <div>
                <h3 className="font-medium">Next Month</h3>
                <p className="text-2xl font-bold">${prices[selectedRoomType][30]}</p>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-medium mb-2">Upcoming Price Changes</h3>
              <div className="space-y-2">
                {prices[selectedRoomType].some((price, i, arr) => i > 0 && price !== arr[i - 1]) ? (
                  prices[selectedRoomType].map((price, index, arr) => {
                    if (index > 0 && price !== arr[index - 1]) {
                      const date = new Date()
                      date.setDate(date.getDate() + index)
                      return (
                        <div key={index} className="flex justify-between items-center">
                          <span>{format(date, "MMM dd, yyyy")}</span>
                          <span className="font-medium">${price}</span>
                        </div>
                      )
                    }
                    return null
                  })
                ) : (
                  <p className="text-muted-foreground">No price changes scheduled</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

