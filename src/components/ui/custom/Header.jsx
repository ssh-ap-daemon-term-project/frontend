import { BellIcon, HotelIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"
import { AuthContext } from "@/context/AuthContext"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { signout } from "../../../api/auth"

export default function DashboardHeader() {
  const { isAuthenticated, userType, contextSignout } = useContext(AuthContext);

  const handleSignout = async () => {
    try {
      await signout();
      contextSignout();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }
  const navigate = useNavigate();
  return (
    <header className="sticky shadow-sm px-3 top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <img src='/logo.svg'/>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/">Home</Link>
          {userType === 'admin' &&
            <Link to="/admin">Dashboard</Link>
          }
          {userType === 'hotel' &&
            <Link to="/hotel">Dashboard</Link>
          }
          {isAuthenticated && <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@hotel.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/hotel/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignout}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
          {!isAuthenticated && <Link to="/auth">Sign in</Link>}
        </div>
      </div>
    </header>
  )
}

