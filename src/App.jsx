import React, { useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // Add useNavigate
import { toast } from 'react-toastify';
import { signout } from './api/auth'; // Import your signout function
import { AuthContext } from './context/AuthContext'; // Import your auth context
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Canvas } from "@react-three/fiber";
import CustomCursor from "./components/models/Cursor";
import Navbar from './components/navbar/Navbar';
import Auth from './pages/auth/Auth';
import AdminDashboard from './pages/admin/Admin';
import PWABadge from './PWABadge';
import Hero from './components/ui/custom/Hero';
import Header from './components/ui/custom/Header';
import Home from './pages/Home';
import HotelDashboard from './pages/hotel/hotel-page';
import HotelProfile from './pages/hotel/components/profile-hotel';
import BookingsPage from './pages/customer/components/cust-bookings';
import HotelsPage from './pages/customer/components/hotel-page';
import HotelDetailPage from './pages/customer/components/hotel-detail';
import ItinerariesPage from './pages/customer/components/itinerary-main';
import ItineraryDetailPage from './pages/customer/components/itinerary-detail';
import { Edit } from 'lucide-react';
import EditItineraryPage from './pages/customer/components/itinerary-edit';
import CustomerProfile from './pages/customer/components/cust-profile';
import CustomerDashboard from './pages/customer/customer-page';
import DriverDashboard from './pages/driver/driver-page';
import ItineraryEditPage from './pages/customer/components/itinerary-edit'
import AdminChat from './pages/admin/components/admin-chat';
import DriverProfile from './pages/driver/components/driver-profile';
import AdminProfile from './pages/admin/components/admin-profile';

function App() {
  const navigate = useNavigate();
  const { contextSignout } = useContext(AuthContext); // Get logout function from context

  useEffect(() => {
    // Get token expiration from localStorage instead of cookies
    const exp = localStorage.getItem("token_exp");

    if (exp) {
      const delay = parseInt(exp) - Date.now();
      if (delay > 0) {
        const timer = setTimeout(async () => {
          try {
            await signout();
            contextSignout();
            // Clear localStorage on logout
            localStorage.removeItem("token_exp");
            toast.info("Your session has expired. Please log in again.");
            navigate("/");
          } catch (error) {
            console.error("Logout failed:", error);
          }
        }, delay);
        return () => clearTimeout(timer);
      } else {
        // Handle expired token case
        const handleExpiredToken = async () => {
          try {
            await signout();
            contextSignout();
            // Clear localStorage on logout
            localStorage.removeItem("token_exp");
            toast.info("Your session has expired. Please log in again.");
            navigate("/");
          } catch (error) {
            console.error("Logout failed:", error);
          }
        };
        handleExpiredToken();
      }
    }
  }, [navigate, contextSignout]);

  return (
    <>
      <Canvas
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none', // important! allows clicks to pass through
          zIndex: 99999, // higher than normal content
        }}
        camera={{ position: [0, 0, 5] }}
      >
        <ambientLight />
        <CustomCursor />
      </Canvas>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/hotel" element={<HotelDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/hotel/profile" element={<HotelProfile />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/driver/profile" element={<DriverProfile />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/itineraries/:id" element={<ItineraryDetailPage />} />
        <Route path="/itineraries/:id/edit" element={<EditItineraryPage />} />
        <Route path="/customer/hotels/:hotelId" element={<HotelDetailPage />} />
      </Routes>

      <ToastContainer />
      <PWABadge />
    </>
  );
}

export default App;