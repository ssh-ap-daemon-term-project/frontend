import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HotelManagement from "./components/HotelManagement"
import DashboardOverview from "./components/DashboardOverview"
import DriverManagement from "./components/DriverManagement"

export const Metadata = {
    title: "Admin Dashboard",
    description: "Admin dashboard for site management",
}

export default function Admin() {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="drivers">Driver</TabsTrigger>
                        <TabsTrigger value="hotels">Hotels</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        <DashboardOverview />
                    </TabsContent>
                    <TabsContent value="drivers" className="space-y-4">
                        <DriverManagement />
                    </TabsContent>
                    <TabsContent value="hotels" className="space-y-4">
                        <HotelManagement />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

