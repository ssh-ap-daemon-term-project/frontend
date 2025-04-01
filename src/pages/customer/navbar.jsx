"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BedDoubleIcon, MenuIcon, UserIcon, CalendarIcon, StarIcon, LogOutIcon, MapIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Mock authenticated user
  const user = {
    name: "John Doe",
    image: "/placeholder.svg?height=32&width=32",
  }

  const routes = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Hotels",
      path: "/hotels",
    },
    {
      name: "Bookings",
      path: "/bookings",
    },
    {
      name: "Itineraries",
      path: "/itineraries",
    },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <BedDoubleIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">HotelHub</span>
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-6">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.path ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {route.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex w-full cursor-pointer items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings" className="flex w-full cursor-pointer items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Bookings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/itineraries" className="flex w-full cursor-pointer items-center">
                      <MapIcon className="mr-2 h-4 w-4" />
                      <span>Itineraries</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/reviews" className="flex w-full cursor-pointer items-center">
                      <StarIcon className="mr-2 h-4 w-4" />
                      <span>Reviews</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex w-full cursor-pointer items-center">
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <MenuIcon className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <Link href="/" className="flex items-center gap-2">
                    <BedDoubleIcon className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">HotelHub</span>
                  </Link>

                  <nav className="mt-8 flex flex-col gap-4">
                    {routes.map((route) => (
                      <Link
                        key={route.path}
                        href={route.path}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-primary",
                          pathname === route.path ? "text-foreground" : "text-muted-foreground",
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {route.name}
                      </Link>
                    ))}
                    <Link
                      href="/profile"
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === "/profile" ? "text-foreground" : "text-muted-foreground",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/reviews"
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === "/reviews" ? "text-foreground" : "text-muted-foreground",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Reviews
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <MenuIcon className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <Link href="/" className="flex items-center gap-2">
                    <BedDoubleIcon className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">HotelHub</span>
                  </Link>

                  <nav className="mt-8 flex flex-col gap-4">
                    {routes.map((route) => (
                      <Link
                        key={route.path}
                        href={route.path}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-primary",
                          pathname === route.path ? "text-foreground" : "text-muted-foreground",
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {route.name}
                      </Link>
                    ))}
                    <Link
                      href="/sign-in"
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

