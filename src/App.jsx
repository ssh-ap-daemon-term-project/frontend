import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/navbar/Navbar';
import Auth from './pages/auth/Auth';
import AdminDashboard from './pages/admin/Admin';
import AdminCustomer from './pages/admin/customer/Customer';
import PWABadge from './PWABadge';
import Hero from './components/ui/custom/Hero';
import Header from './components/ui/custom/Header';
import Home from './pages/Home';
import HotelDashboard from './pages/hotel/hotel-page';
import HotelProfile from './pages/hotel/components/profile-hotel';
import BookingsPage from './pages/customer/components/cust-bookings';
import HotelsPage from './pages/customer/components/hotel-page';
import HotelDetailPage from './pages/customer/components/hotel-detail';
import ItinerariesPage from './pages/customer/components/itinery-main';
import ItineraryDetailPage from './pages/customer/components/itinery-detail';
import { Edit } from 'lucide-react';
import EditItineraryPage from './pages/customer/components/itinery-edit';
import ProfilePage from './pages/customer/components/cust-profile';
import CustomerPage from './pages/customer/customer-page';

function App() {
  return (
    <>
      {/* <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/hotel" element={<HotelDashboard />} />
        <Route path="/hotel/profile" element={<HotelProfile />} />
      </Routes> */}

      
      { /* hotels/id  */ }
      <CustomerPage />
      <Routes>
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/hotels/:id" element={<HotelDetailPage />} />
        <Route path="/itineraries" element={<ItinerariesPage />} />
        <Route path="/itineraries/:id" element={<ItineraryDetailPage />} />
        <Route path="/itineraries/edit/:id" element={<EditItineraryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/bookings" element={<BookingsPage />} />
      </Routes>
      {/* <BookingsPage /> */}
      <PWABadge />
    </>
  );
}

export default App;