import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import ProfilePage from './pages/customer/components/cust-profile';
import CustomerDashboard from './pages/customer/customer-page';
import AdminChat from './pages/admin/components/admin-chat';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/hotel" element={<HotelDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/hotel/profile" element={<HotelProfile />} />
        <Route path="/itineraries/:id" element={<ItineraryDetailPage />} />
      </Routes>

      <ToastContainer />
      <PWABadge />
    </>
  );
}

export default App;