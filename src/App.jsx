import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import Auth from './pages/auth/Auth';
import AdminDashboard from './pages/admin/dashboard/Dashboard';
import AdminCustomer from './pages/admin/customer/Customer';
import PWABadge from './PWABadge';

function App() {
  return (
    <>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/customer" element={<AdminCustomer />} />
        </Routes>
      </div>
      <ToastContainer />
      <PWABadge />
    </>
  );
}

export default App;